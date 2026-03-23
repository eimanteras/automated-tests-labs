# Gmail Real OAuth Setup (No OAuth Playground)

This guide creates a real OAuth 2.0 client in Google Cloud and the secrets needed for CI and Newman.

## 1. Create Google Cloud project and enable Gmail API
1. Open Google Cloud Console.
2. Create/select a project.
3. Go to `APIs & Services -> Library`.
4. Enable `Gmail API`.

## 2. Configure OAuth consent screen
1. Go to `APIs & Services -> OAuth consent screen`.
2. Choose `External` (or `Internal` if your organization allows).
3. Fill app name, support email, and developer contact.
4. Add scopes:
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.labels`
- `https://www.googleapis.com/auth/gmail.readonly`
5. Add your Gmail account in `Test users`.
6. Save and publish to testing mode.

## 3. Create OAuth client credentials
1. Go to `APIs & Services -> Credentials`.
2. Click `Create Credentials -> OAuth client ID`.
3. Application type: `Web application`.
4. Authorized redirect URI: `https://oauth.pstmn.io/v1/callback`
5. Save and copy:
- `Client ID`
- `Client Secret`

## 4. Get refresh token in Postman (real OAuth flow)
1. In Postman request, open `Authorization` tab.
2. Type: `OAuth 2.0`.
3. Click `Get New Access Token` and configure:
- Grant Type: `Authorization Code`
- Callback URL: `https://oauth.pstmn.io/v1/callback`
- Auth URL: `https://accounts.google.com/o/oauth2/v2/auth`
- Access Token URL: `https://oauth2.googleapis.com/token`
- Client ID: your real Client ID
- Client Secret: your real Client Secret
- Scope: `https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.readonly`
- Client Authentication: `Send client credentials in body`
4. In `Advanced Options` add:
- `access_type=offline`
- `prompt=consent`
5. Authorize with your Gmail test user.
6. Open Postman Console and find token exchange response.
7. Copy the `refresh_token` value.

Note: Google returns `refresh_token` only on first consent or when `prompt=consent` forces new consent.

## 5. Save GitHub Actions secrets
In GitHub repo -> `Settings -> Secrets and variables -> Actions`, add:
- `GMAIL_OAUTH_CLIENT_ID`
- `GMAIL_OAUTH_CLIENT_SECRET`
- `GMAIL_OAUTH_REFRESH_TOKEN`
- `GMAIL_MAIL_FROM`
- `GMAIL_MAIL_TO`

Use same Gmail for `MAIL_FROM` and `MAIL_TO` if needed for testing.

## 6. Local run options
Option A (direct access token):
```powershell
.\scripts\run-newman-gmail.ps1 -OAuthToken "ya29..."
```

Option B (recommended, real OAuth refresh flow):
```powershell
.\scripts\run-newman-gmail.ps1 -ClientId "..." -ClientSecret "..." -RefreshToken "..."
```

## 7. Security notes
- Never commit tokens to git.
- Rotate refresh token/client secret if leaked.
- Use dedicated test Gmail account when possible.
