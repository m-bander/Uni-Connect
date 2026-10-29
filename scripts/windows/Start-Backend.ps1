$taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $taskNode) { throw 'Install Node.js 24 before running this script.' }
$taskRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Push-Location (Join-Path $taskRoot 'backend')
try { & $taskNode '--import' 'tsx' 'app/start.ts' } finally { Pop-Location }
