import { expect, test } from '@playwright/test';

test('blocks page', async ({ page }) => {
  // Test url
  await page.goto('.');
  await expect(page).toHaveURL(/[^?#]*\/\/[^/]+\/$/);
  await expect(page.getByRole('progressbar')).toHaveCount(0);

  // Test blocks url
  await page.getByRole('link', { name: 'Blocks' }).first().click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(/\/blocks/);

  // Test single block url
  await page.goto(`./blocks/1`);
  await expect(page).toHaveURL(/\/blocks\/1/);
});
