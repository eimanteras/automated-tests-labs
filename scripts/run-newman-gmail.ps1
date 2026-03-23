param(
    [Parameter(Mandatory = $false)]
    [string]$OAuthToken,

    [Parameter(Mandatory = $false)]
    [string]$ClientId,

    [Parameter(Mandatory = $false)]
    [string]$ClientSecret,

    [Parameter(Mandatory = $false)]
    [string]$RefreshToken
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$collection = Join-Path $repoRoot 'postman\gmail-automation.postman_collection.json'
$environment = Join-Path $repoRoot 'postman\gmail-automation.postman_environment.json'
$reportDir = Join-Path $repoRoot 'test-results\newman'

if (!(Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
}

if ([string]::IsNullOrWhiteSpace($OAuthToken)) {
    if (
        [string]::IsNullOrWhiteSpace($ClientId) -or
        [string]::IsNullOrWhiteSpace($ClientSecret) -or
        [string]::IsNullOrWhiteSpace($RefreshToken)
    ) {
        throw 'Provide -OAuthToken OR (-ClientId -ClientSecret -RefreshToken).'
    }

    $tokenResponse = Invoke-RestMethod -Method Post -Uri 'https://oauth2.googleapis.com/token' -ContentType 'application/x-www-form-urlencoded' -Body @{
        client_id     = $ClientId
        client_secret = $ClientSecret
        refresh_token = $RefreshToken
        grant_type    = 'refresh_token'
    }

    if (-not $tokenResponse.access_token) {
        throw 'Failed to obtain access_token from refresh token.'
    }

    $OAuthToken = $tokenResponse.access_token
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
