import { test, expect, Page } from '@playwright/test';
import dataset from '../data/demowebshop.data.json' assert { type: 'json' };

// =======================
// Types
// =======================
type DataRow = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  registerIfMissing?: boolean;
  searchTerm: string;
  productName: string;
  quantity?: number;
};

// =======================
// Helper functions
// =======================

async function login(page: Page, email: string, password: string) {
  await page.goto('https://demowebshop.tricentis.com/login');
  await page.getByLabel('Email:').fill(email);
  await page.getByLabel('Password:').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
}

async function register(page: Page, data: DataRow) {
  await page.goto('https://demowebshop.tricentis.com/register');

  await page.getByLabel('First name:').fill(data.firstName);
  await page.getByLabel('Last name:').fill(data.lastName);
  await page.getByLabel('Email:').fill(data.email);
  await page.getByLabel('Password:').fill(data.password);
  await page.getByLabel('Confirm password:').fill(data.password);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('.result')).toHaveText(/registration completed/i);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
}

async function ensureLoggedIn(page: Page, data: DataRow) {
  await page.goto('https://demowebshop.tricentis.com/');

  // already logged in?
  if (await page.getByRole('link', { name: 'Log out' }).isVisible().catch(() => false)) {
    return;
  }

  try {
    await login(page, data.email, data.password);
  } catch {
    if (data.registerIfMissing) {
      await register(page, data);
      return;
    }
    throw new Error('User not logged in and registerIfMissing=false');
  }
}

async function emptyCart(page: Page) {
  await page.goto('https://demowebshop.tricentis.com/cart');

  if (await page.getByText(/Your Shopping Cart is empty!/i).isVisible().catch(() => false)) {
    return;
  }

  const removeCheckboxes = page.locator('input[name="removefromcart"]');
  const count = await removeCheckboxes.count();

  if (count > 0) {
    for (let i = 0; i < count; i++) {
      await removeCheckboxes.nth(i).check({ force: true });
    }
    await page.getByRole('button', { name: 'Update shopping cart' }).click();
    await expect(page.getByText(/Your Shopping Cart is empty!/i)).toBeVisible();
  }
}

async function logout(page: Page) {
  if (await page.getByRole('link', { name: 'Log out' }).isVisible().catch(() => false)) {
    await page.getByRole('link', { name: 'Log out' }).click();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  }
}

// =======================
// Test (data-driven)
// =======================

test.describe('Task 4.1 - Data-driven add to cart', () => {
  for (const row of dataset) {
    const title = `Add "${row.productName}" (qty ${row.quantity ?? 1}) for ${row.email}`;

    test(title, async ({ page }) => {
      // ------------------
      // Preconditions
      // ------------------
      await test.step('Ensure user logged in', async () => {
        await ensureLoggedIn(page, row);
      });

      await test.step('Ensure cart is empty', async () => {
        await emptyCart(page);
      });

      // ------------------
      // Test Actions
      // ------------------

      // Search
      await test.step(`Search for "${row.searchTerm}"`, async () => {
        await page.goto('https://demowebshop.tricentis.com/');
        await page.locator('#small-searchterms').fill(row.searchTerm);
        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page).toHaveURL(/search/);
      });

      // Open product
      await test.step(`Open product "${row.productName}"`, async () => {
        const link = page.getByRole('link', { name: row.productName, exact: true });
        await expect(link).toBeVisible({ timeout: 10000 });
        await link.click();
      });

      // Add to cart
      await test.step('Add product to cart', async () => {
        const qty = String(row.quantity ?? 1);
        const qtyInput = page.locator('input.qty-input');

        if (await qtyInput.count() > 0) {
          await qtyInput.fill(qty);
        }

        const addBtn = page.locator(
          'input.add-to-cart-button, button.add-to-cart-button, button[id^="add-to-cart-button-"]'
        );

        await expect(addBtn.first()).toBeVisible({ timeout: 8000 });
        await addBtn.first().click();

        const success = page.locator('.bar-notification.success');
        await expect(success).toContainText(/added to your shopping cart/i);

        const closeBtn = success.getByRole('button', { name: 'close' });
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click();
        }
      });

      // Verify in cart
      await test.step('Verify product is in cart', async () => {
        await page.getByRole('link', { name: /Shopping cart \(\d+\)/ }).click();
        await expect(page).toHaveURL(/\/cart$/);

        const rowLocator = page.locator('table.cart').locator('tr').filter({
          has: page.getByRole('link', { name: row.productName, exact: true })
        });

        await expect(rowLocator).toHaveCount(1);

        const qtyInput = rowLocator.locator('input.qty-input');
        const expectedQty = String(row.quantity ?? 1);

        if (await qtyInput.count()) {
          await expect(qtyInput).toHaveValue(expectedQty);
        } else {
          await expect(rowLocator.locator('td')).toContainText(expectedQty);
        }
      });

      // ------------------
      // Postconditions
      // ------------------
      await test.step('Empty cart', async () => {
        await emptyCart(page);
      });

      await test.step('Log out', async () => {
        await logout(page);
      });
    });
  }
});