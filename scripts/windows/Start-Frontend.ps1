$taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $taskNode) { throw 'Install Node.js 24 before running this script.' }
$taskRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$taskPreviousHosted = $env:VITE_HOSTED
$taskPreviousServerUrl = $env:VITE_SERVER_URL
Push-Location (Join-Path $taskRoot 'frontend')
try {
    $env:VITE_HOSTED = '1'
    $env:VITE_SERVER_URL = ''
    & $taskNode 'node_modules/vite/bin/vite.js' '--host' '127.0.0.1' '--port' '5173' '--strictPort'
} finally {
    $env:VITE_HOSTED = $taskPreviousHosted
    $env:VITE_SERVER_URL = $taskPreviousServerUrl
    Pop-Location
}
