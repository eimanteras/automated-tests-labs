import { test, expect } from '@playwright/test';

test('Progress Bar Synchronization Test', async ({ page }) => {
  await page.goto('https://demoqa.com/progress-bar');

  const startStopBtn = page.locator('#startStopButton');
  const barFill = page.locator('.progress-bar[role="progressbar"]');

  // Step 1: Start
  await startStopBtn.click();

  // Helper to extract the CSS width percentage
  async function getWidth() {
    const style = await barFill.getAttribute('style');
    const match = style?.match(/width:\s*(\d+)%/);
    return match ? Number(match[1]) : 0;
  }

  // Step 2A: Wait until width starts increasing (>0)
  await expect.poll(async () => await getWidth(), {
    timeout: 8000,
    intervals: [100, 200, 300],
    message: 'Progress bar never started changing width'
  }).toBeGreaterThan(0);

  // Step 2B: Wait until width reaches ≥40%
  await expect.poll(async () => await getWidth(), {
    timeout: 15000,
    intervals: [100, 200, 300],
    message: 'Progress bar never reached 40%'
  }).toBeGreaterThanOrEqual(40);

  // Step 3: Stop
  await startStopBtn.click();

  const stoppedValue = await getWidth();

  // Step 4: Check width stays the same (STOP works)
  await expect.poll(async () => await getWidth(), {
    timeout: 1500,
    intervals: [200, 300],
    message: 'Progress bar continued moving after STOP'
  }).toBe(stoppedValue);
});