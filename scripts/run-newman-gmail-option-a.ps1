param(
    [Parameter(Mandatory = $true)]
    [string]$AccessToken,

    [string]$CollectionPath = "./postman/gmail.collection.json",
    [string]$EnvironmentPath = "./postman/gmail.environment.json",
    [string]$ReportPath = "./test-results/newman-gmail/report-option-a.html"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -Path $CollectionPath)) {
    throw "Collection file not found: $CollectionPath"
}

if (-not (Test-Path -Path $EnvironmentPath)) {
    Write-Host "Environment file not found. Continuing without it: $EnvironmentPath" -ForegroundColor Yellow
    $EnvironmentPath = $null
}

$reportDir = Split-Path -Path $ReportPath -Parent
if ($reportDir -and -not (Test-Path -Path $reportDir)) {
    New-Item -Path $reportDir -ItemType Directory | Out-Null
}

$newmanArgs = @(
    "newman",
    "run", $CollectionPath,
    "--env-var", "gmail_access_token=$AccessToken",
    "--reporters", "cli,htmlextra",
    "--reporter-htmlextra-export", $ReportPath
)

if ($EnvironmentPath) {
    $newmanArgs += @("-e", $EnvironmentPath)
}

Write-Host "Running Newman collection (Option A)..." -ForegroundColor Cyan
& npx @newmanArgs

if ($LASTEXITCODE -ne 0) {
    throw "Newman run failed with exit code $LASTEXITCODE"
}

Write-Host "Success. Newman report generated at: $ReportPath" -ForegroundColor Green
