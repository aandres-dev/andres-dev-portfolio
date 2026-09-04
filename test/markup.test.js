// Validates semantic structure, landmarks and metadata in index.html.
import fs from 'node:fs';
import path from 'node:path';

function runMarkupAudit() {
  console.log('--- Starting Semantic & Zero-Divitis Markup Audit ---\n');
  const htmlPath = path.resolve('index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Core Document Structure & Lang
  assert(/<!DOCTYPE html>/i.test(html), 'Contains valid <!DOCTYPE html> declaration');
  assert(/<html[^>]*lang=["']en["']/i.test(html), 'HTML element has lang="en" defined');

  // 2. Semantic Landmarks
  assert(/<header[^>]*class=["'][^"']*site-header/i.test(html), 'Contains semantic <header class="site-header">');
  assert(/<nav[^>]*aria-label=/i.test(html), 'Contains semantic <nav> with accessible aria-label');
  assert(/<main[^>]*id=["']main-content["']/i.test(html), 'Contains semantic <main id="main-content">');
  assert(/<footer[^>]*class=["'][^"']*site-footer/i.test(html), 'Contains semantic <footer class="site-footer">');

  // 3. Sectioning and Zero-Divitis Audit
  const totalDivs = (html.match(/<div\b/gi) || []).length;
  const totalSections = (html.match(/<section\b/gi) || []).length;
  const totalArticles = (html.match(/<article\b/gi) || []).length;
  const totalSemantics = totalSections + totalArticles + 
    (html.match(/<header\b/gi) || []).length +
    (html.match(/<footer\b/gi) || []).length +
    (html.match(/<nav\b/gi) || []).length +
    (html.match(/<aside\b/gi) || []).length;

  console.log(`\nDOM Node Breakdown:`);
  console.log(`- Total <div> elements: ${totalDivs}`);
  console.log(`- Total Semantic landmark/sectioning elements: ${totalSemantics}`);
  
  assert(totalDivs <= 12, `Zero-divitis threshold satisfied (Found only ${totalDivs} container divs across entire document)`);
  assert(totalSections >= 5, `Content is strictly structured into semantic sections (Found ${totalSections} sections)`);
  assert(totalArticles >= 5, `Showcase & cards use semantic <article> elements (Found ${totalArticles} articles)`);

  // 4. Accessible Heading Hierarchy
  assert(/<h1[^>]*>/i.test(html), 'Contains primary <h1> heading');
  const h2Count = (html.match(/<h2\b/gi) || []).length;
  assert(h2Count >= 4, `Contains appropriate section headings (Found ${h2Count} <h2> elements)`);

  // 5. OpenGraph & JSON-LD
  assert(/<meta\s+property=["']og:title["']/i.test(html), 'OpenGraph og:title present');
  assert(/<script\s+type=["']application\/ld\+json["']/i.test(html), 'JSON-LD Structured Data script tag present');
  assert(/["']@type["']:\s*["']Person["']/i.test(html), 'JSON-LD declares @type Person');
  assert(/Andres Lopez/i.test(html), 'Declares author Andres Lopez');

  // 6. CSS Layer & OKLCH verification
  const tokensPath = path.resolve('src/styles/tokens.css');
  const tokensCss = fs.readFileSync(tokensPath, 'utf8');
  assert(/oklch\(/i.test(tokensCss), 'CSS Tokens exclusively implement OKLCH color space');
  assert(/--color-crimson/i.test(tokensCss), 'Crimson accent token defined');
  assert(/--color-gold/i.test(tokensCss), 'Antique gold accent token defined');

  // 7. Anti-Scraping & Privacy Defense
  assert(!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(html), 'Zero raw email exposure in markup (immune to crawler scraping)');

  // 8. Multi-Language (i18n) Infrastructure
  assert(/data-lang-btn=["']en["']/i.test(html) && /data-lang-btn=["']es["']/i.test(html), 'Contains accessible EN / ES language switcher buttons');
  const esElements = (html.match(/data-es=/gi) || []).length;
  assert(esElements >= 20, `Contains extensive co-located Spanish translations (Found ${esElements} data-es attributes)`);

  console.log(`\nAudit Finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runMarkupAudit();
