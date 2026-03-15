import { test, expect } from '@playwright/test';

const PRICE_THRESHOLD = 5;

test('TC-001: Add items above price threshold to cart', async ({ page }) => {

  // 1. Navigate to home page
  await page.goto('/');
  await expect(page).toHaveTitle(/Demo Web Shop/);

  // 2. Click “Log in”
  await page.getByText('Log in').click();
  await expect(page.getByLabel('Email:')).toBeVisible();

  // 3. Enter email
  await page.getByLabel('Email:').fill('eimanteras+demo@gmail.com');
  await expect(page.getByLabel('Email:')).toHaveValue('eimanteras+demo@gmail.com');

  // 4. Enter password
  await page.getByLabel('Password:').fill('Password123!');
  await expect(page.getByLabel('Password:')).toBeVisible(); // valid check

  // 5. Click “Log in” button
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('eimanteras+demo@gmail.com')).toBeVisible();

  // 6. Open shopping cart
  await page.getByRole('link', { name: /Shopping cart \(/ }).click();
  await expect(page).toHaveURL(/cart/);

  // 7. Select all “Remove” checkboxes
  const removeCheckboxes = page.locator('input[name="removefromcart"]');
  const removeCount = await removeCheckboxes.count();

  if (removeCount > 0) {
    for (let i = 0; i < removeCount; i++) {
      await removeCheckboxes.nth(i).check();
      await expect(removeCheckboxes.nth(i)).toBeChecked();
    }
  }

  // 8. Click “Update shopping cart”
  if (removeCount > 0) {
    await page.getByRole('button', { name: 'Update shopping cart' }).click();
  }
  await expect(page.getByText(/empty/i)).toBeVisible();

  // 9. Return to homepage
  await page.goto('/');
  await expect(page).toHaveURL('/');

  // 10. Open “Books” category
  await page.locator('ul.top-menu a[href="/books"]').first().click();
  await expect(page).toHaveURL(/books/);

  // 11. Click on a book with “Add to cart”
  const productItems = page.locator('.item-box');
  const count = await productItems.count();
  const selectedIndexes: number[] = [];

  for (let i = 0; i < count; i++) {
    const item = productItems.nth(i);
    const hasAdd = await item.getByRole('button', { name: 'Add to cart' }).count();
    if (!hasAdd) continue;

    const priceText = await item.locator('.prices').innerText();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    if (price > PRICE_THRESHOLD) {
      selectedIndexes.push(i);
    }
  }

  await expect(selectedIndexes.length).toBeGreaterThanOrEqual(2);

  // 12. Click “Add to cart” (first book)
  await productItems.nth(selectedIndexes[0]).getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByText('The product has been added')).toBeVisible();

  // 13. Return to Books category
  await page.goto('/books');
  await expect(page).toHaveURL(/books/);

  // 14. Click on another book with “Add to cart”
  await productItems.nth(selectedIndexes[1]).getByRole('button', { name: 'Add to cart' }).click();

  // 15. Click “Add to cart”
  await expect(page.getByText('The product has been added')).toBeVisible();

  // 16. Open shopping cart again
  await page.getByRole('link', { name: /Shopping cart \(/ }).click();
  await expect(page).toHaveURL(/cart/);

  const cartRows = page.locator('.cart-item-row');
  const rowCount = await cartRows.count();

  // 17. Change quantity of first book
  expect(rowCount).toBeGreaterThanOrEqual(1);
  const qtyInput = cartRows.nth(0).locator('input.qty-input');
  await qtyInput.fill('2');

  // 18. Click “Update shopping cart”
  await page.getByRole('button', { name: 'Update shopping cart' }).click();
  await expect(qtyInput).toHaveValue('2');

  // Price + subtotal checks
  let computedTotal = 0;

  for (let i = 0; i < rowCount; i++) {
    const row = cartRows.nth(i);

    const unitPriceText = await row.locator('.product-unit-price').innerText();
    const quantityValue = await row.locator('input.qty-input').inputValue();

    const unitPrice = parseFloat(unitPriceText.replace(/[^0-9.]/g, ''));
    const quantity = parseInt(quantityValue, 10);

    expect(unitPrice).toBeGreaterThan(PRICE_THRESHOLD);

    const lineTotalText = await row.locator('.product-subtotal').innerText();
    const lineTotal = parseFloat(lineTotalText.replace(/[^0-9.]/g, ''));

    expect(lineTotal).toBeCloseTo(unitPrice * quantity, 2);

    computedTotal += lineTotal;
  }

  const displayedSubtotalText = await page
    .locator('.cart-total .cart-total-left:has-text("Sub-Total")')
    .locator('..')
    .locator('.cart-total-right')
    .innerText();

  const displayedSubtotal = parseFloat(displayedSubtotalText.replace(/[^0-9.]/g, ''));
  expect(displayedSubtotal).toBeCloseTo(computedTotal, 2);

  // 19. Check terms of service
  await page.locator('input[name="termsofservice"]').check();
  await expect(page.locator('input[name="termsofservice"]')).toBeChecked();

  // 20. Click “Checkout”
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByText('Billing address')).toBeVisible();

  // 21. Click “Log out”
  await page.getByText('Log out').click();
  await expect(page.getByText('Log in')).toBeVisible();
});