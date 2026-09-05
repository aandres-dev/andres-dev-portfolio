// Covers the defects that actually shipped, one test each.

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// Opens the drawer, where the controls live below 1200px.
async function revealControls(page) {
  const toggle = page.locator('#nav-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.locator('#site-menu')).toHaveClass(/is-open/);
  }
}

test('the hero renders with its portrait', async ({ page }) => {
  await expect(page.locator('h1#hero-heading')).toBeVisible();

  const img = page.locator('.director-photo');
  await expect(img).toBeVisible();

  // Guards the 2.68MB JPEG and the wrong-ratio crops.
  const served = await img.evaluate((el) => el.currentSrc);
  expect(served).toMatch(/\.(avif|webp|jpg)$/);

  const box = await img.boundingBox();
  expect(box.width / box.height).toBeCloseTo(0.8, 2);
});

test('no horizontal overflow', async ({ page }) => {
  // Guards the grid item that clipped the manifesto at 320px.
  const { clientWidth, scrollWidth } = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

  const overflowing = await page.evaluate(() => {
    const limit = document.documentElement.clientWidth;
    return [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.right > limit + 1 && r.left > -1000 && r.width > 0;
      })
      .map((el) => el.tagName + '.' + el.className)
      .slice(0, 5);
  });
  expect(overflowing).toEqual([]);
});

test('the skip link stays hidden until focused', async ({ page }) => {
  const skip = page.locator('.skip-link');
  expect((await skip.boundingBox()).y).toBeLessThan(0);

  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  expect((await skip.boundingBox()).y).toBeGreaterThanOrEqual(0);
});

test('project cards share one hover behaviour', async ({ page }) => {
  // Guards the layer demotion and the stagger that killed the hover lift.
  const cards = page.locator('.project-card.spotlight-card');
  await expect(cards).toHaveCount(1);

  const state = await cards.evaluateAll((els) =>
    els.map((el) => {
      el.setAttribute('data-visible', 'true');
      const cs = getComputedStyle(el);
      return { delay: cs.transitionDelay, props: cs.transitionProperty };
    }),
  );

  for (const card of state) {
    expect(card.delay.replace(/\s/g, '')).toBe('0s,0s,0s');
    expect(card.props).toContain('transform');
  }
});

test('the mobile drawer opens over an opaque panel', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'drawer only exists below 1200px');

  // Guards the backdrop-filter that left the drawer with no background.
  const toggle = page.locator('#nav-toggle');
  const menu = page.locator('#site-menu');

  await toggle.click();
  await expect(menu).toHaveClass(/is-open/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  const box = await menu.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(300);
  expect(box.height).toBeGreaterThan(500);

  const opaque = await menu.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(opaque).not.toBe('rgba(0, 0, 0, 0)');

  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveClass(/is-open/);
});

test('the language switch navigates to a real Spanish URL', async ({ page }) => {
  // Guards Spanish having no URL of its own.
  await revealControls(page);
  await page.locator('[data-lang-btn="es"]').click();

  await expect(page).toHaveURL(/\/es\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('#manifesto-heading')).toHaveText(/Conceptos/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://andres-dev-portfolio.netlify.app/es/',
  );

  await revealControls(page);
  await page.locator('[data-lang-btn="en"]').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('both languages declare the same hreflang set', async ({ page }) => {
  for (const url of ['/', '/es/']) {
    await page.goto(url);
    const links = await page.locator('link[rel="alternate"]').evaluateAll((els) =>
      els.map((el) => `${el.hreflang}=${el.href}`).sort(),
    );
    expect(links).toEqual([
      'en=https://andres-dev-portfolio.netlify.app/',
      'es=https://andres-dev-portfolio.netlify.app/es/',
      'x-default=https://andres-dev-portfolio.netlify.app/',
    ]);
  }
});

test('the theme switch toggles and persists', async ({ page }) => {
  const html = page.locator('html');
  await expect(html).not.toHaveAttribute('data-theme', 'light');

  await revealControls(page);
  await page.locator('#theme-toggle').click();
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('the contact form posts to the live endpoint', async ({ page }) => {
  // Guards the empty endpoint that made every submission report failure.
  let posted = null;
  await page.route('https://formspree.io/**', async (route) => {
    posted = { url: route.request().url(), method: route.request().method() };
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.locator('#contact-name').fill('Playwright');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-message').fill('Automated critical path check.');
  await page.locator('#contact-form button[type="submit"]').click();

  await expect(page.locator('#contact-status')).toHaveText(/Message sent/);
  expect(posted).toEqual({ url: 'https://formspree.io/f/xeaqzrke', method: 'POST' });
});

test('invalid input never leaves the browser', async ({ page }) => {
  // Constraint validation blocks the submit, so form.js never runs and the
  // status stays empty. What matters is that nothing is sent.
  let requested = false;
  await page.route('https://formspree.io/**', async (route) => {
    requested = true;
    await route.abort();
  });

  await page.locator('#contact-name').fill('Playwright');
  await page.locator('#contact-email').fill('not-an-email');
  await page.locator('#contact-message').fill('Should never leave the browser.');
  await page.locator('#contact-form button[type="submit"]').click();

  await expect(page.locator('#contact-email')).toHaveJSProperty('validity.valid', false);
  await expect(page.locator('#contact-status')).toHaveText('');
  expect(requested).toBe(false);
});

test('in-page anchors respect prefers-reduced-motion', async ({ page }) => {
  // Guards the smooth scrollIntoView that ran unconditionally.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    window.__scrollBehaviors = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (opts) {
      window.__scrollBehaviors.push(opts && opts.behavior);
      return original.call(this, opts);
    };
  });
  await page.goto('/');

  await revealControls(page);
  await page.locator('a.nav-link[href="#manifesto"]').click();

  const behaviors = await page.evaluate(() => window.__scrollBehaviors);
  expect(behaviors).toContain('auto');
  expect(behaviors).not.toContain('smooth');
});

test('the mobile drawer unlocks scroll after crossing to desktop width', async ({ page }) => {
  // Guards body.style.overflow staying "hidden" once the drawer's own
  // media query stops rendering it as a full-screen panel.
  await page.setViewportSize({ width: 800, height: 900 });
  await page.locator('#nav-toggle').click();
  await expect(page.locator('#site-menu')).toHaveClass(/is-open/);
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('#site-menu')).not.toHaveClass(/is-open/);
  await expect(page.locator('#nav-toggle')).toHaveAttribute('aria-expanded', 'false');
});

test('the mobile nav toggle announces itself in Spanish on /es/', async ({ page }) => {
  // Guards the hardcoded "Open menu"/"Close menu" aria-label leaking into
  // a page declared lang="es" (WCAG 3.1.2 Language of Parts).
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto('/es/');
  const toggle = page.locator('#nav-toggle');
  await expect(toggle).toHaveAttribute('aria-label', 'Abrir menú');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-label', 'Cerrar menú');
});

test('github is a real link and linkedin is inert', async ({ page }) => {
  // Guards GitHub regressing to a button, and LinkedIn shipping early.
  await expect(page.locator('#github-link-btn')).toHaveAttribute(
    'href',
    'https://github.com/aandres-dev',
  );

  const linkedin = page.locator('#linkedin-link-btn');
  await expect(linkedin).toBeHidden();
  expect(await linkedin.evaluate((el) => el.hasAttribute('href'))).toBe(false);
});
