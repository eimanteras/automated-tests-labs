import { test, expect } from '@playwright/test';

const PRICE_THRESHOLD = 5; // Books category threshold

test('TC-001: Add items above price threshold to cart', async ({ page }) => {
  // Open home page
  await page.goto('/');
  await expect(page).toHaveTitle(/Demo Web Shop/);

  // Login
  await page.getByText('Log in').click();
  await page.getByLabel('Email:').fill('eimanteras+demo@gmail.com');
  await page.getByLabel('Password:').fill('Password123!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('eimanteras+demo@gmail.com')).toBeVisible();

// Ensure cart is empty
await page.getByRole('link', { name: /Shopping cart \(/ }).click();
const removeCheckboxes = page.locator('input[name="removefromcart"]');

if (await removeCheckboxes.count() > 0) {
  for (let i = 0; i < await removeCheckboxes.count(); i++) {
    await removeCheckboxes.nth(i).check();
  }
  await page.getByRole('button', { name: 'Update shopping cart' }).click();
}

await page.goto('/');


  // Navigate to Books category
  await page.locator('ul.top-menu a[href="/books"]').first().click();

  // Collect products with explicit price extraction to avoid false positives.
  const productItems = page.locator('.item-box');
  const count = await productItems.count();
  const selectedButtons: Array<ReturnType<typeof page.locator>> = [];

  for (let i = 0; i < count; i++) {
    const item = productItems.nth(i);

    const addToCart = item.locator('input[value="Add to cart"], button:has-text("Add to cart")').first();
    if (await addToCart.count() === 0) continue;

    const actualPrice = item.locator('.actual-price').first();
    if (await actualPrice.count() === 0) continue;

    const priceText = (await actualPrice.innerText()).trim().replace(',', '.');
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    if (!Number.isNaN(price) && price > PRICE_THRESHOLD) {
      selectedButtons.push(addToCart);
    }
  }

  expect(selectedButtons.length).toBeGreaterThanOrEqual(2);

  // Add at least two items
  for (let i = 0; i < 2; i++) {
    await selectedButtons[i].click();
    await expect(page.locator('.bar-notification.success')).toContainText(/added to your shopping cart/i);
  }

  // Go to cart
  await page.getByRole('link', { name: /Shopping cart \(/ }).click();

  const cartRows = page.locator('.cart-item-row');
  const rowCount = await cartRows.count();

  // Verification 1: At least one item was added to cart
  expect(rowCount).toBeGreaterThanOrEqual(1);

  // Verification 2–4: Price > threshold + arithmetic subtotal check
  let computedTotal = 0;

  for (let i = 0; i < rowCount; i++) {
    const row = cartRows.nth(i);

    const unitPriceText = await row.locator('.product-unit-price').innerText();
    const quantityValue = await row.locator('input.qty-input').inputValue();

    const unitPrice = parseFloat(unitPriceText.replace(/[^0-9.]/g, ''));
    const quantity = parseInt(quantityValue, 10);

    // Verification 2: price > threshold
    expect(unitPrice).toBeGreaterThan(PRICE_THRESHOLD);

    const lineTotalText = await row.locator('.product-subtotal').innerText();
    const lineTotal = parseFloat(lineTotalText.replace(/[^0-9.]/g, ''));

    // Verification 3: arithmetic check
    expect(lineTotal).toBeCloseTo(unitPrice * quantity, 2);

    computedTotal += lineTotal;
  }

// Verification 4: Subtotal matches computed total
const displayedSubtotalText = await page
  .locator('.cart-total .cart-total-left:has-text("Sub-Total")')
  .locator('..') // go to row
  .locator('.cart-total-right')
  .innerText();

const displayedSubtotal = parseFloat(displayedSubtotalText.replace(/[^0-9.]/g, ''));
expect(displayedSubtotal).toBeCloseTo(computedTotal, 2);


// Agree to terms
await page.locator('input[name="termsofservice"]').check();

// Proceed to checkout
await page.getByRole('button', { name: 'Checkout' }).click();

// Verification 5: checkout page loaded
await expect(page.getByText('Billing address')).toBeVisible();



  // Logout
  await page.getByText('Log out').click();
  await expect(page.getByText('Log in')).toBeVisible();
});