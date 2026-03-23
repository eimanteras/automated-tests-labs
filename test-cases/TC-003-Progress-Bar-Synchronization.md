# TC-003: Progress Bar Synchronization

- Test Case ID: TC-003
- Requirement Ref: Exercise 3 / Task 3.1
- Target Application: https://demoqa.com/progress-bar
- Module: Widgets / Progress Bar
- Priority: Medium
- Type: UI functional + synchronization
- Author: Student
- Version: 1.0
- Preconditions: Browser open, internet reachable, page accessible.
- Postconditions: Test session ends with progress bar state captured.
- Environment: Playwright + TypeScript, Chromium latest
- Test Data: Threshold value = 40%
- Wait Strategy: Conditional polling (`expect.poll`), no thread sleep

## Logical Steps
1. Navigate to `https://demoqa.com/progress-bar`.
2. Locate `Start/Stop` button.
3. Locate progress bar element.
4. Click `Start`.
5. Read progress bar width value from `style` attribute.
6. Poll until width is greater than `0`.
7. Continue polling until width is greater than or equal to `40`.
8. Click `Stop`.
9. Capture stopped width value.
10. Poll for short interval and verify width remains unchanged.

## Verifications
1. Progress width becomes `> 0` after start.
2. Progress width reaches `>= 40`.
3. After stop, progress width does not continue to change.

## Expected Result
Progress starts, reaches threshold, and stops reliably with no extra movement after `Stop` action.
