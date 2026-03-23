# Assignment Coverage and Evidence

Date: 2026-03-23
Project: `automated-tests-labs`

## Group: Design and Development of Automated Tests

### Exercise 1 (0.4)
- Task 1.1 (formal test case with 20+ steps and attributes):
  - Evidence: `test-cases/TC-001-Ecommerce-Workflow.md`
  - Includes: 10+ attributes, 21 logical UI steps, dynamic add-to-cart requirement.
- Task 1.2 (tool setup and opening target app):
  - Evidence: `tests/home-page.spec.ts`
  - Execution evidence: `test-results/LOCAL-TEST-RESULTS-2026-03-23.md`

### Exercise 2 (0.4)
- Task 2.1 (automate 1.1 with dynamic selection, 5+ verifications, arithmetic check):
  - Evidence: `tests/Task2.1.spec.ts`
  - Additional stable variant: `tests/ecommerce.spec.ts`
- Task 2.2 (Web Tables pagination + delete + return to first page):
  - Evidence: `tests/Task2.2.spec.ts`
  - Uses assertions-based waits (no fixed sleep).

### Exercise 3 (0.4)
- Task 3.1 (Progress Bar test case + automation, 2+ verifications):
  - Test case: `test-cases/TC-003-Progress-Bar-Synchronization.md`
  - Automation: `tests/Task3.1.spec.ts`
- Task 3.2 (Dynamic Properties test case + automation, 2+ verifications):
  - Test case: `test-cases/TC-004-Dynamic-Properties.md`
  - Automation: `tests/Task3.2.spec.ts`

### Exercise 4 (0.4)
- Task 4.1 (data-driven test with external file, pre/postconditions):
  - Automation: `tests/Task4.1.spec.ts`
  - External data: `data/demowebshop.data.json`
  - Preconditions/postconditions implemented via helper functions.
- Task 4.2 (scheduled execution + proof):
  - Scheduler workflow: `.github/workflows/scheduled-tests.yml`
  - Local execution proof: `test-results/LOCAL-TEST-RESULTS-2026-03-23.md`

## Group: Development of Web Service Tests

### Exercise 1 (0.4)
- OAuth 2.0 + send email via Gmail API (Postman artifacts):
  - Collection: `postman/gmail-automation.postman_collection.json`
  - Environment template: `postman/gmail-automation.postman_environment.json`
  - Includes request tests with 2+ assertions per request.

### Exercise 2 (0.4)
- Automated scenario (send email, create label, label message, list by label, cleanup):
  - Collection requests 1-5 in `postman/gmail-automation.postman_collection.json`
  - Preconditions: generated run ID/subject/label in pre-request script.
  - Postconditions: delete created label request.
  - Variable scopes used: local (`pm.variables`) and environment (`pm.environment`).
- Scheduled execution with Newman:
  - CI workflow: `.github/workflows/scheduled-newman-gmail.yml`
  - Local run script: `scripts/run-newman-gmail.ps1`

## Run Results Snapshot
- Latest UI suite status: 8 passed, 0 failed.
- Evidence: `test-results/LOCAL-TEST-RESULTS-2026-03-23.md`

## Notes
- Gmail API execution requires valid OAuth token and Gmail account secrets.
- Configure repo secrets before enabling scheduled Newman workflow:
  - `GMAIL_OAUTH_TOKEN`
  - `GMAIL_MAIL_FROM`
  - `GMAIL_MAIL_TO`
