import { test, expect } from '@playwright/test';

test('Automate Web Tables page', async ({ page }) => {
  // Open DemoQA
  await page.goto('https://demoqa.com/');
  await page.getByText('Elements').click();
  await page.getByText('Web Tables').click();

  // Add enough records to create a second page
  // Assuming page size is 10, add 20 to be safe
  for (let i = 0; i < 10; i++) {
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByPlaceholder('First Name').fill(`First${i}`);
    await page.getByPlaceholder('Last Name').fill(`Last${i}`);
    await page.getByPlaceholder('name@example.com').fill(`email${i}@example.com`);
    await page.getByPlaceholder('Age').fill(`${20 + i}`);
    await page.getByPlaceholder('Salary').fill(`${30000 + i * 1000}`);
    await page.getByPlaceholder('Department').fill(`Dept${i}`);
    await page.getByRole('button', { name: 'Submit' }).click();
  }

  // Wait for pagination to update
  await page.waitForTimeout(2000);

  // Verify pagination shows at least Page 1 of 2
  const pageInfoText = page.locator('text=/Page \\d+ of \\d+/');
  const currentPageInfo = await pageInfoText.innerText();
  expect(currentPageInfo).toMatch(/Page \d+ of [2-9]\d*/); // At least 2 pages

  // Click Next to go to second page
  await page.getByRole('button', { name: 'Next' }).click();

  // Verify on second page
  await expect(pageInfoText).toHaveText(/Page 2 of \d+/);

  // Delete the first record on the second page
  const deleteButtons = page.locator('span[title="Delete"]');
  await deleteButtons.first().click();

  // Wait for update
  await page.waitForTimeout(1000);

  // Verify pagination returns to first page and shows Page 1 of 1 or less pages
  await expect(pageInfoText).toHaveText('Page 1 of 1');
});