# Publish the Aqua plugin to npm as the unscoped distribution package
# `dsh-client-ui-aqua` (the repo keeps its scoped dev name for the git-based
# install). Staging rewrites the manifest, adds the profile patch layer
# (dsh.bundle.patch), and ships the pre-built lib/ bundle.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\publish.ps1          # publish
#   powershell -ExecutionPolicy Bypass -File .\publish.ps1 -DryRun  # inspect only

param(
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$stage = Join-Path $root '.npm-stage'

# ---------- 1. stage ----------
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stage | Out-Null

Copy-Item (Join-Path $root 'lib') -Destination $stage -Recurse
Copy-Item (Join-Path $root 'cordis.patch.yml') -Destination $stage
foreach ($name in 'README.md', 'README.zh.md', 'LICENSE') {
    $src = Join-Path $root $name
    if (Test-Path $src) { Copy-Item $src -Destination $stage }
}

# ---------- 2. manifest ----------
$json = Get-Content (Join-Path $root 'package.json') -Raw
$json = $json -replace '"name":\s*"@deepseek-ai/dsh-client-ui-aqua"', '"name": "dsh-client-ui-aqua"'
$json = $json -replace '"description":\s*"[^"]*"', '"description": "Aqua: a highly customizable glassmorphism theme for the DSH Web UI - blur, frost, fluid or video wallpaper, unified glass, and motion. Install with: dsh plugin --profile web add dsh-client-ui-aqua"'
$json = $json -replace '"url":\s*"git\+https://github\.com/WYH66666666/DSH\.git"', '"url": "git+https://github.com/WYH66666666/DSH-Transparent-UI-Plugin.git"'
# The profile patch layer that activates this package as a plugin bundle.
$json = $json -replace '"dsh":\s*\{\s*"client"', ('"dsh": {' + "`n" + '    "bundle": { "patch": "./cordis.patch.yml" },' + "`n" + '    "client"')
# devDependencies are workspace links - never ship them.
$json = $json -replace '(?s),\s*"devDependencies":\s*\{.*?\}\s*\}$', "`n}"
# Ship the patch layer with the tarball.
$json = $json -replace '"lib/types/\*\*/\*\.d\.ts"(\s*)\]', '"lib/types/**/*.d.ts",$1  "cordis.patch.yml"$1]'
[System.IO.File]::WriteAllText((Join-Path $stage 'package.json'), $json, [System.Text.UTF8Encoding]::new($false))

$name = ([regex]::Match($json, '"name":\s*"([^"]+)"')).Groups[1].Value
$version = ([regex]::Match($json, '"version":\s*"([^"]+)"')).Groups[1].Value
Write-Host "staged: $stage"
Write-Host "name: $name @ $version"

# ---------- 3. publish ----------
if ($DryRun) {
    Push-Location $stage
    try { npm publish --dry-run } finally { Pop-Location }
    return
}
Push-Location $stage
try {
    npm publish
    if ($LASTEXITCODE -ne 0) { throw 'npm publish failed' }
} finally {
    Pop-Location
}
Write-Host ''
Write-Host 'Done. Install anywhere with:' -ForegroundColor Green
Write-Host "  dsh plugin --profile web add dsh-client-ui-aqua" -ForegroundColor Cyan
