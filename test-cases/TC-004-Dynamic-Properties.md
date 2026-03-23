# TC-004: Dynamic Properties

- Test Case ID: TC-004
- Requirement Ref: Exercise 3 / Task 3.2
- Target Application: https://demoqa.com/dynamic-properties
- Module: Elements / Dynamic Properties
- Priority: Medium
- Type: UI dynamic DOM validation
- Author: Student
- Version: 1.0
- Preconditions: Browser open, internet reachable, page accessible.
- Postconditions: Test session ends with dynamic state assertions completed.
- Environment: Playwright + TypeScript, Chromium latest
- Test Data: Expected class = `mt-4 text-danger btn btn-primary`
- Wait Strategy: Conditional waits and polling, no thread sleep

## Logical Steps
1. Navigate to `https://demoqa.com/dynamic-properties`.
2. Locate `Will enable 5 seconds` button.
3. Locate `Color Change` button.
4. Locate `Visible After 5 Seconds` button.
5. Verify `Will enable 5 seconds` is disabled at start.
6. Wait until `Will enable 5 seconds` becomes enabled.
7. Poll `Color Change` button `class` attribute.
8. Verify class becomes `mt-4 text-danger btn btn-primary`.
9. Wait for `Visible After 5 Seconds` button to appear.
10. Verify delayed visible button is visible.

## Verifications
1. Delayed-enable button is initially disabled and later enabled.
2. Color-change button class transitions to expected value.
3. Delayed-visible button becomes visible within timeout.

## Expected Result
All dynamic DOM state transitions complete within timeout and assertions pass without fixed sleeps.
