param(
    [Parameter(Mandatory = $true)]
    [string]$OAuthToken
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$collection = Join-Path $repoRoot 'postman\gmail-automation.postman_collection.json'
$environment = Join-Path $repoRoot 'postman\gmail-automation.postman_environment.json'
$reportDir = Join-Path $repoRoot 'test-results\newman'

if (!(Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
}

$newmanArgs = @(
    'run', $collection,
    '-e', $environment,
    '--env-var', "oauthToken=$OAuthToken",
    '--reporters', 'cli,htmlextra,json',
    '--reporter-json-export', (Join-Path $reportDir 'newman-report.json'),
    '--reporter-htmlextra-export', (Join-Path $reportDir 'newman-report.html')
)

npx newman @newmanArgs
