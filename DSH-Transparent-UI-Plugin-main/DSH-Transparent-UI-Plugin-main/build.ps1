# Build + deploy the Aqua plugin.
# The source lives in D:\Hermes Work\DSH; the build tooling (tsdown preset,
# pnpm, tsc) lives in the monorepo. This script copies the source into the
# monorepo build copy, bundles, and ships lib/client.js to both the DSH repo
# and the installed clone. Reload http://127.0.0.1:3080/ afterwards.

$ErrorActionPreference = 'Stop'

$repo  = 'D:\Hermes Work\DSH'
$mono  = 'D:\Hermes Work\deepseek-harness\packages\client\ui-aqua'
$clone = 'C:\Users\wuyuh\.dsh\plugins\@deepseek-ai\dsh-client-ui-aqua'

Write-Host '[1/3] Copying source into monorepo build copy...'
Copy-Item "$repo\src\client\*" "$mono\src\client\" -Force -Recurse
# Keep the build copy's config self-healing (an unrelated install can clobber
# the workspace scratch dir's package.json / tsdown config).
Copy-Item "$repo\package.json" "$mono\package.json" -Force
Copy-Item "$repo\tsdown.config.ts" "$mono\tsdown.config.ts" -Force
Copy-Item "$repo\tsconfig.json" "$mono\tsconfig.json" -Force

Write-Host '[2/3] Bundling...'
Push-Location 'D:\Hermes Work\deepseek-harness'
try {
    pnpm --filter @deepseek-ai/dsh-client-ui-aqua run bundle
    if ($LASTEXITCODE -ne 0) { throw "bundle failed (exit $LASTEXITCODE)" }
} finally {
    Pop-Location
}

Write-Host '[3/3] Deploying...'
Copy-Item "$mono\lib\client.js" "$repo\lib\client.js" -Force
Copy-Item "$mono\lib\client.js.map" "$repo\lib\client.js.map" -Force
Copy-Item "$mono\lib\client.js" "$clone\lib\client.js" -Force
Copy-Item "$mono\lib\client.js.map" "$clone\lib\client.js.map" -Force

Write-Host 'Done. Reload http://127.0.0.1:3080/ to see the new settings.'
