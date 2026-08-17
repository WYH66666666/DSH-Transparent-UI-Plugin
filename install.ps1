# Aqua installer (Windows) - BACKUP method. The recommended install is the
# npm one-liner (no account, no git, no manual steps, all platforms):
#
#   dsh plugin --profile web add dsh-client-ui-aqua
#
# This script is the GitHub fallback: no npm, no git required.
#
# One command (from any directory):
#   powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest 'https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/raw/main/install.ps1' -OutFile install.ps1; .\install.ps1"
#
# It does three things:
#   1. get the repo (git clone, or plain zip download when git is missing)
#   2. create a junction in the profile's node_modules
#   3. register ui-aqua in cordis.patch.yml (idempotent - safe to re-run)
#
# Version: defaults to 'latest' (the newest GitHub Release, resolved via the
# API). Pin a version with -Version 'v1.0.1', or track the dev branch with
# -Version 'main'. Reload the Web UI afterwards. DSH home defaults to
# %USERPROFILE%\.dsh, override with -DshHome. Repo defaults to the official
# one; pass a URL or local path to install another clone.

param(
    [string]$Source = 'https://github.com/WYH66666666/DSH-Transparent-UI-Plugin',
    [string]$Version = 'latest',
    [string]$DshHome = $env:DSH_HOME,
    [string]$Profile = 'web'
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

if (-not $DshHome) { $DshHome = Join-Path $env:USERPROFILE '.dsh' }
if (-not (Test-Path $DshHome)) { throw "DSH home not found: $DshHome (override with -DshHome)" }

$plugin      = '@deepseek-ai/dsh-client-ui-aqua'
$nodeModules = Join-Path $DshHome 'profiles\node_modules'
$linkPath    = Join-Path $nodeModules $plugin
$patchFile   = Join-Path $DshHome "profiles\$Profile\cordis.patch.yml"
# Persistent plugin location: %TEMP% can be wiped on reboot / disk cleanup,
# which would leave the junction dangling and break the next boot.
$pluginsDir  = Join-Path $DshHome 'plugins'
$cloneDir    = Join-Path $pluginsDir $plugin

# ---------- 1. source ----------
Write-Host '[1/3] Getting plugin source...' -ForegroundColor Cyan
$isRemote = $Source -match '^(https?://|git@|ssh://|github:)'
if ($isRemote) {
    $repoUrl = $Source.TrimEnd('/').TrimEnd('.git')

    # Resolve the ref: 'latest' -> the newest release tag via the GitHub API;
    # a version-looking string (v1.2.3) is a tag; anything else is a branch.
    $ref = $Version
    $isTag = $ref -match '^v\d+\.\d+'
    if ($ref -eq 'latest' -and $repoUrl -match '^https?://github\.com/([^/]+/[^/]+)') {
        $slug = $Matches[1]
        try {
            $latest = Invoke-RestMethod -Uri "https://api.github.com/repos/$slug/releases/latest" -Headers @{ 'User-Agent' = 'dsh-aqua-installer' } -TimeoutSec 15
            if ($latest.tag_name) {
                $ref = $latest.tag_name
                $isTag = $true
                Write-Host "  最新版本: $ref" -ForegroundColor Cyan
            }
        } catch {
            Write-Host '  (查询最新版本失败，回退到 main 分支)' -ForegroundColor Yellow
            $ref = 'main'
            $isTag = $false
        }
    }

    # Zip first: plain HTTP is faster and more reliable than the git protocol
    # (the latter often stalls on flaky connections). git is only a fallback.
    $refKind  = if ($isTag) { 'tags' } else { 'heads' }
    $zipUrl   = "$repoUrl/archive/refs/$refKind/$ref.zip"
    $zipFile  = Join-Path $pluginsDir 'aqua-plugin.zip'
    $extractDir = Join-Path $pluginsDir 'aqua-plugin-extract'
    New-Item -ItemType Directory -Force -Path $pluginsDir | Out-Null

    $gotSource = $false
    try {
        Write-Host "  downloading $zipUrl"
        Invoke-WebRequest $zipUrl -OutFile $zipFile -UseBasicParsing
        if (Test-Path $extractDir) { Remove-Item $extractDir -Recurse -Force }
        Expand-Archive $zipFile -DestinationPath $extractDir -Force
        $inner = Get-ChildItem $extractDir -Directory | Select-Object -First 1
        if (-not $inner) { throw "zip contains no package directory: $zipUrl" }
        if (Test-Path $cloneDir) { Remove-Item $cloneDir -Recurse -Force }
        # The plugin name is scoped (@deepseek-ai/...), so create the parent
        # level too - Move-Item cannot create multi-level destination paths.
        New-Item -ItemType Directory -Force -Path (Split-Path $cloneDir -Parent) | Out-Null
        Move-Item $inner.FullName $cloneDir
        Remove-Item $zipFile -Force
        $gotSource = $true
    } catch {
        Write-Host '  zip download failed, trying git clone...' -ForegroundColor Yellow
    }

    if (-not $gotSource) {
        $useGit = $null -ne (Get-Command git -ErrorAction SilentlyContinue)
        if (-not $useGit) { throw 'download failed (zip and git both unavailable)' }
        if (Test-Path $cloneDir) { Remove-Item $cloneDir -Recurse -Force }
        git clone --depth 1 --branch $ref $repoUrl $cloneDir | Out-Host
        if ($LASTEXITCODE -ne 0) { throw "git clone failed for $repoUrl ($ref)" }
    }
    $src = $cloneDir
} else {
    $src = (Resolve-Path $Source).Path
}
if (-not (Test-Path (Join-Path $src 'lib\client.js'))) {
    throw "lib\client.js not found - the repo must include the pre-built bundle. dir: $src"
}

# ---------- 2. junction ----------
Write-Host "[2/3] Linking -> $linkPath" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $nodeModules | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $linkPath -Parent) | Out-Null
if (Test-Path $linkPath) {
    $item = Get-Item $linkPath -Force
    if ($item.LinkType) {
        # Delete the junction itself, never its target (-Recurse would follow it).
        [System.IO.Directory]::Delete($linkPath)
    } else {
        Remove-Item $linkPath -Force -Recurse
    }
}
New-Item -ItemType Junction -Path $linkPath -Target $src | Out-Null
if (-not (Test-Path $linkPath)) { throw 'junction creation failed' }

# ---------- 3. register ----------
Write-Host "[3/3] Registering in $patchFile" -ForegroundColor Cyan
$entryText = @'
- insert:
    - id: ui-aqua
      name: '@deepseek-ai/dsh-client-ui-aqua'
'@
if (-not (Test-Path $patchFile)) {
    Set-Content -Path $patchFile -Value ($entryText + "`n") -Encoding UTF8
} else {
    $content = Get-Content $patchFile -Raw
    # Match the real list entry only, not the "duplicate loader entry id: ui-aqua" comment.
    if ($content -match '(?m)^\s*-\s+id:\s*ui-aqua\s*$') {
        Write-Host '  already registered, skip.' -ForegroundColor DarkGray
    } else {
        $base = ($content -replace '(?s)\[\s*\]\s*$', '').TrimEnd()
        if ($base -eq '') { $new = $entryText + "`n" } else { $new = $base + "`n`n" + $entryText + "`n" }
        Set-Content -Path $patchFile -Value $new -Encoding UTF8
    }
}

Write-Host ''
Write-Host 'Done. Reload the Web UI (Aqua is on by default; Settings -> Plugins -> Aqua to toggle).' -ForegroundColor Green
Write-Host 'If the plugin does not appear after reload, restart the dsh web process.' -ForegroundColor Yellow
