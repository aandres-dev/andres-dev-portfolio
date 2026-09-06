// Scans every theme and language for WCAG 2.2 AA violations.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const RULES = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

function report(violations) {
  return violations
    .map((v) => `${v.id} (${v.impact}) — ${v.help}\n    ${v.nodes.map((n) => n.target).join('\n    ')}`)
    .join('\n\n');
}

// Opens the drawer, where the controls live below 1200px.
async function revealControls(page) {
  const toggle = page.locator('#nav-toggle');
  if (await toggle.isVisible()) await toggle.click();
}

async function scan(page, options = {}) {
  await page.waitForTimeout(500);
  const builder = new AxeBuilder({ page }).withTags(RULES);
  return (options.build ? options.build(builder) : builder).analyze();
}

test('dark theme has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  if ((await page.locator('html').getAttribute('data-theme')) === 'light') {
    await revealControls(page);
    await page.locator('#theme-toggle').click();
  }
  const { violations } = await scan(page);
  expect(report(violations), report(violations)).toBe('');
});

test('light theme has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  if ((await page.locator('html').getAttribute('data-theme')) !== 'light') {
    await revealControls(page);
    await page.locator('#theme-toggle').click();
  }
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  const { violations } = await scan(page);
  expect(report(violations), report(violations)).toBe('');
});

test('spanish translation has no accessibility violations', async ({ page }) => {
  // Translations swap text through data-es, so length and contrast change.
  await page.goto('/');
  await revealControls(page);
  await page.locator('[data-lang-btn="es"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');

  const { violations } = await scan(page);
  expect(report(violations), report(violations)).toBe('');
});

test('the open mobile drawer has no accessibility violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'drawer only exists below 1200px');

  await page.goto('/');
  await page.locator('#nav-toggle').click();
  await expect(page.locator('#site-menu')).toHaveClass(/is-open/);

  const { violations } = await scan(page);
  expect(report(violations), report(violations)).toBe('');
});

test('the 404 page has no accessibility violations', async ({ page }) => {
  await page.goto('/404.html');
  const { violations } = await scan(page);
  expect(report(violations), report(violations)).toBe('');
});
