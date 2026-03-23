import { test, expect } from '@playwright/test';

test('Progress Bar Synchronization Test', async ({ page }) => {
  await page.goto('https://demoqa.com/progress-bar');

  const startStopBtn = page.locator('#startStopButton');
  const barFill = page.locator('.progress-bar[role="progressbar"]');

  await startStopBtn.click();

  async function getWidth() {
    const style = await barFill.getAttribute('style');
    const match = style?.match(/width:\s*(\d+)%/);
    return match ? Number(match[1]) : 0;
  }

  await expect.poll(async () => await getWidth(), {
    timeout: 8000,
    intervals: [100, 200, 300],
    message: 'Progress bar never started moving'
  }).toBeGreaterThan(0);


  await expect.poll(async () => await getWidth(), {
    timeout: 15000,
    intervals: [100, 200, 300],
    message: 'Progress bar never reached 40%'
  }).toBeGreaterThanOrEqual(40);


  await startStopBtn.click();

  const stoppedValue = await getWidth();


  await expect.poll(async () => await getWidth(), {
    timeout: 1500,
    intervals: [200, 300],
    message: 'Progress bar continued moving after STOP'
  }).toBe(stoppedValue);
});