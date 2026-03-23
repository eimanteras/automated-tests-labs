param(
    [Parameter(Mandatory = $true)]
    [string]$ClientId,

    [Parameter(Mandatory = $true)]
    [string]$ClientSecret,

    [Parameter(Mandatory = $true)]
    [string]$RefreshToken,

    [string]$CollectionPath = "./postman/gmail.collection.json",
    [string]$EnvironmentPath = "./postman/gmail.environment.json",
    [string]$ReportDir = "./test-results/newman-gmail"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -Path $CollectionPath)) {
    throw "Collection file not found: $CollectionPath"
}

if (-not (Test-Path -Path $EnvironmentPath)) {
    Write-Host "Environment file not found. Continuing without it: $EnvironmentPath" -ForegroundColor Yellow
    $EnvironmentPath = $null
}

if (-not (Test-Path -Path $ReportDir)) {
    New-Item -Path $ReportDir -ItemType Directory | Out-Null
}

$tokenUri = "https://oauth2.googleapis.com/token"
$tokenBody = @{ 
    client_id = $ClientId
    client_secret = $ClientSecret
    refresh_token = $RefreshToken
    grant_type = "refresh_token"
}

Write-Host "Requesting fresh Google OAuth access token..." -ForegroundColor Cyan

try {
    $tokenResponse = Invoke-RestMethod -Method Post -Uri $tokenUri -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
}
catch {
    throw "Failed to refresh access token. Details: $($_.Exception.Message)"
}

if (-not $tokenResponse.access_token) {
    throw "Google OAuth response did not contain access_token."
}

$reportPath = Join-Path $ReportDir "report.html"

$newmanArgs = @(
    "newman",
    "run", $CollectionPath,
    "--env-var", "gmail_access_token=$($tokenResponse.access_token)",
    "--reporters", "cli,htmlextra",
    "--reporter-htmlextra-export", $reportPath
)

if ($EnvironmentPath) {
    $newmanArgs += @("-e", $EnvironmentPath)
}

Write-Host "Running Newman collection..." -ForegroundColor Cyan
& npx @newmanArgs

if ($LASTEXITCODE -ne 0) {
    throw "Newman run failed with exit code $LASTEXITCODE"
}

Write-Host "Success. Newman report generated at: $reportPath" -ForegroundColor Green
