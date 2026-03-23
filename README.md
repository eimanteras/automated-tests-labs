# automated-tests-labs
Labs for Design and Development of Automated Tests (Playwright + TypeScript)

## Option B: Run Newman with Gmail OAuth Refresh Token

This project includes a local runner script at `scripts/run-newman-gmail.ps1`.

### Requirements

1. Node.js and npm installed
2. A Google OAuth `ClientId`
3. A Google OAuth `ClientSecret`
4. A valid Google OAuth `RefreshToken`

### Install dependencies

```powershell
npm install
```

### Run locally

```powershell
.\scripts\run-newman-gmail.ps1 `
	-ClientId "YOUR_CLIENT_ID" `
	-ClientSecret "YOUR_CLIENT_SECRET" `
	-RefreshToken "YOUR_REFRESH_TOKEN"
```

The script will:

1. Request a fresh `access_token` from Google
2. Run Newman collection `postman/gmail.collection.json`
3. Save HTML report to `test-results/newman-gmail/report.html`

### Collection and environment files

- Collection: `postman/gmail.collection.json`
- Environment: `postman/gmail.environment.json`

### Optional npm script usage

```powershell
npm run newman:gmail -- -ClientId "YOUR_CLIENT_ID" -ClientSecret "YOUR_CLIENT_SECRET" -RefreshToken "YOUR_REFRESH_TOKEN"
```

## Option A: Run Newman with Pre-generated Access Token

Use this when you already have a valid Gmail OAuth `access_token` (for example, generated in Postman).

### Run locally

```powershell
.\scripts\run-newman-gmail-option-a.ps1 -AccessToken "YOUR_ACCESS_TOKEN"
```

### Optional npm script usage

```powershell
npm run newman:gmail:option-a -- -AccessToken "YOUR_ACCESS_TOKEN"
```

The report is generated at `test-results/newman-gmail/report-option-a.html`.

## Run Gmail OAuth tests in GitHub Actions (non-local)

This repository includes a dedicated workflow for Gmail Newman Option B:

- `.github/workflows/gmail-newman.yml`

### Required GitHub repository secrets

1. `GMAIL_OAUTH_CLIENT_ID`
2. `GMAIL_OAUTH_CLIENT_SECRET`
3. `GMAIL_OAUTH_REFRESH_TOKEN`

### How to run

1. Open **GitHub -> Actions -> Gmail Newman Tests**
2. Click **Run workflow**
3. Select branch and run

After completion, download artifact **gmail-newman-report**.

### Schedule

`gmail-newman.yml` also runs on schedule:

- `15 6 * * *` (daily at 06:15 UTC)

## Exercise 2.1 Scenario Coverage (Postman Collection)

Collection `postman/gmail.collection.json` implements:

1. Preconditions: profile lookup + randomized test data generation
2. Send new email
3. Create new label
4. Add created label to sent email
5. List emails by created label
6. Postconditions cleanup:
	- remove label from message
	- delete created label
	- move sent message to trash

Notes:

1. Each request includes at least 2 test assertions.
2. Scripts use at least two variable scopes: `pm.variables` and `pm.environment`.

## Proof Pack For Defense

Show these artifacts to demonstrate full completion:

1. OAuth 2.0 configured in Postman request authorization (screenshot)
2. Successful local run command and output:
	- Option B: `npm run newman:gmail -- -ClientId ... -ClientSecret ... -RefreshToken ...`
3. Newman HTML report from local run:
	- `test-results/newman-gmail/report.html`
4. GitHub Actions run for `Gmail Newman Tests` workflow (manual trigger)
5. Scheduled run evidence in Actions history (cron-triggered run)
6. Downloaded artifact `gmail-newman-report` from workflow run
