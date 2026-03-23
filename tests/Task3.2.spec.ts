import { test, expect } from '@playwright/test';

test('Dynamic Properties Test', async ({ page }) => {
  await page.goto('https://demoqa.com/dynamic-properties');

  const enableBtn = page.locator('#enableAfter');
  const colorBtn = page.locator('#colorChange');
  const visibleBtn = page.locator('#visibleAfter');

  await expect(enableBtn).toBeDisabled();

  await expect(enableBtn).toBeEnabled({ timeout: 12000 });

  const expectedClass = 'mt-4 text-danger btn btn-primary';

  await expect
    .poll(
      async () => await colorBtn.getAttribute('class'),
      {
        timeout: 12000,
        intervals: [150, 250, 350],
        message: `Color-change button class did not become "${expectedClass}"`,
      }
    )
    .toBe(expectedClass);
    
  await expect(visibleBtn).toBeVisible({ timeout: 12000 });
});