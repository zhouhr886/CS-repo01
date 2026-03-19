import { test, expect } from '@playwright/test';

test('xigao', async ({ page }) => {
  await page.goto('http://192.168.106.33:8000/');
  await page.getByRole('link', { name: 'xigao/' }).click();
  await page.getByRole('link', { name: '2026030901/' }).click();
  await page.locator('#sitemapHostBtn').getByTitle('Project Pages').click();
  await page.locator('div').filter({ hasText: '锡膏领用 PDA' }).nth(4).click();
  await page.locator('a').filter({ hasText: '锡膏领用 PDA' }).click();
});