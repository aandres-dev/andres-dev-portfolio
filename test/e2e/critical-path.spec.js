// Every test here covers a defect that actually shipped, not generic coverage.
// The comment above each one names the regression it would have caught.

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// Below 1200px the language and theme controls live inside the drawer, so they
// are not reachable until it is open. Desktop needs no such step.
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

  // The portrait is the LCP element. It shipped as a 2.68MB JPEG rendered into
  // a 360px box, and later as square variants against a 4:5 CSS box.
  const served = await img.evaluate((el) => el.currentSrc);
  expect(served).toMatch(/\.(avif|webp|jpg)$/);

  const box = await img.boundingBox();
  expect(box.width / box.height).toBeCloseTo(0.8, 2);
});

test('no horizontal overflow', async ({ page }) => {
  // At 320px a grid item with min-width:auto rendered 379px wide inside a
  // 280px track and clipped the manifesto text. WCAG 1.4.10.
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
  // Wrapping components.css in @layer demoted it below utilities, which pinned
  // transform:translateY(0) on revealed cards and killed the hover lift. The
  // stagger then delayed the hover by 80-160ms on the cards that carried it,
  // so RondApp felt right and the other two did not.
  const cards = page.locator('.project-card.spotlight-card');
  await expect(cards).toHaveCount(3);

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

  // backdrop-filter on the header made it the containing block AND the backdrop
  // root for its position:fixed child, so the drawer painted no background and
  // the hero text read straight through it.
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
  // Spanish used to be a client-side text swap, so it had no URL: Google saw
  // English only and hreflang pointed at a page that did not exist.
  await revealControls(page);
  await page.locator('[data-lang-btn="es"]').click();

  await expect(page).toHaveURL(/\/es\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('#manifesto-heading')).toHaveText(/Conceptos/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://andres.dev/es/',
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
      'en=https://andres.dev/',
      'es=https://andres.dev/es/',
      'x-default=https://andres.dev/',
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
  // The endpoint shipped empty, so every submission fell into the failure
  // branch and told the visitor the message could not be sent.
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
  // The form has no novalidate, so the browser's own constraint validation
  // refuses the submit and shows its native bubble. The submit event never
  // fires, which means form.js never runs and #contact-status stays empty.
  // What matters is the guarantee, not who enforces it: nothing is sent.
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

test('github is a real link and linkedin is inert', async ({ page }) => {
  // GitHub was a <button> calling window.open: no middle-click, no crawlable
  // outbound link. LinkedIn is kept in the markup but deliberately unshipped.
  await expect(page.locator('#github-link-btn')).toHaveAttribute(
    'href',
    'https://github.com/aandres-dev',
  );

  const linkedin = page.locator('#linkedin-link-btn');
  await expect(linkedin).toBeHidden();
  expect(await linkedin.evaluate((el) => el.hasAttribute('href'))).toBe(false);
});
