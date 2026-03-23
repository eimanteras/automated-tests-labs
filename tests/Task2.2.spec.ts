import { test, expect } from '@playwright/test';

test('Automate Web Tables page', async ({ page }) => {

  await page.goto('https://demoqa.com/');
  await page.getByText('Elements').click();
  await page.getByText('Web Tables').click();


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

  const pageInfoText = page.locator('text=/Page \\d+ of \\d+/');
  const currentPageInfo = await pageInfoText.innerText();
  expect(currentPageInfo).toMatch(/Page \d+ of [2-9]\d*/);

  await page.getByRole('button', { name: 'Next' }).click();

  await expect(pageInfoText).toHaveText(/Page 2 of \d+/);

  const deleteButtons = page.locator('span[title="Delete"]');
  await deleteButtons.first().click();

  await expect(pageInfoText).toHaveText('Page 1 of 1');
});