$taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $taskNode) { throw 'Install Node.js 24 before running this script.' }
$taskRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Push-Location $taskRoot
try { & $taskNode 'scripts/manage.mjs' 'test'; $taskTestExit = $LASTEXITCODE } finally { Pop-Location }
Write-Host 'Report: backend/qa/artifacts/html/index.html. See docs/testing/README.md.'
exit $taskTestExit
