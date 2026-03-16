import { test, expect } from '@playwright/test';

test('Dynamic Properties Test', async ({ page }) => {
  await page.goto('https://demoqa.com/dynamic-properties');

  const enableBtn = page.locator('#enableAfter');
  const colorBtn = page.locator('#colorChange');
  const visibleBtn = page.locator('#visibleAfter');

  // 1) "Will enable 5 seconds" pradžioje turi būti disabled
  await expect(enableBtn).toBeDisabled();

  // 2) Po ~5s taps enabled (protingas laukimas, ne sleep)
  await expect(enableBtn).toBeEnabled({ timeout: 12000 });

  // 3) Spalvos keitimo logika: laukiame konkretaus klasės atributo
  //    pagal tavo pastebėjimą: class="mt-4 text-danger btn btn-primary"
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

  // (Neprivaloma papildoma patikra: jei nori, gali patikrinti ir computed styles,
  // bet tai gali skirtis dėl Bootstrap/DOM kompozicijos, todėl paliekame klasių verifikaciją kaip pagrindinę.)

  // 4) "Visible After 5 Seconds" turi tapti matomas
  await expect(visibleBtn).toBeVisible({ timeout: 12000 });
});