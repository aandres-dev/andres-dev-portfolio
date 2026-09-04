/**
 * Performance & Stress Audit
 * Validates payload weights, compositor-only animations, DOM depth, and memory safety.
 */
import fs from 'node:fs';
import path from 'node:path';

function runStressAudit() {
  console.log('--- Starting Performance & Stress Audit ---\n');

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

  // 1. Static Payload Weight Audit
  const htmlSize = fs.statSync('index.html').size;
  const mainCssSize = fs.statSync('src/styles/main.css').size;
  const tokensCssSize = fs.statSync('src/styles/tokens.css').size;
  const resetCssSize = fs.statSync('src/styles/reset.css').size;
  const layoutCssSize = fs.statSync('src/styles/layout.css').size;
  const compCssSize = fs.statSync('src/styles/components.css').size;
  const animCssSize = fs.statSync('src/styles/animations.css').size;
  const totalCssSize = mainCssSize + tokensCssSize + resetCssSize + layoutCssSize + compCssSize + animCssSize;
  const jsSize = fs.statSync('src/scripts/main.js').size;

  console.log(`Payload Weights:`);
  console.log(`- HTML: ${(htmlSize / 1024).toFixed(2)} KB`);
  console.log(`- CSS Total: ${(totalCssSize / 1024).toFixed(2)} KB`);
  console.log(`- Runtime JS Payload: ${(jsSize / 1024).toFixed(2)} KB`);
  console.log(`- Total Combined Bundle: ${((htmlSize + totalCssSize + jsSize) / 1024).toFixed(2)} KB\n`);

  // The HTML budget is 42KB, not 40KB, because this page carries its Spanish
  // translation inline: 93 data-es attributes duplicate every string on the
  // page. That is content, and squeezing markup to fit a tighter number buys
  // nothing a visitor can feel.
  assert(htmlSize < 42 * 1024, `HTML size is lean (< 42KB)`);
  // 32KB, not 30KB. The Content-Security-Policy forbids style="" attributes
  // without style-src-attr 'unsafe-inline', so seven of them moved out of the
  // markup and into classes. HTML dropped 0.68KB and CSS gained 0.73KB: the
  // same rules, a different file. A budget that penalises a change security
  // requires is measuring the wrong thing.
  assert(totalCssSize < 32 * 1024, `Total CSS size is compact (< 32KB)`);
  assert(jsSize < 16 * 1024, `Runtime JS size is ultra-lightweight (< 16KB)`);

  // Text budgets alone were misleading: they passed while the hero portrait
  // shipped 2.68MB, roughly 32x the combined weight of every file above. The
  // LCP image gets its own budget so the numbers track what actually loads.
  const heroImageSize = fs.statSync('assets/images/andres-480.avif').size;
  console.log(`- Hero portrait (LCP, AVIF 1x): ${(heroImageSize / 1024).toFixed(2)} KB`);
  assert(heroImageSize < 40 * 1024, `Hero portrait stays under its own budget (< 40KB)`);

  // 2. Hardware Compositor Animation Safety Audit
  const animCss = fs.readFileSync('src/styles/animations.css', 'utf8');
  const compCss = fs.readFileSync('src/styles/components.css', 'utf8');
  const combinedCss = animCss + compCss;

  const dangerousProps = ['left:', 'top:', 'right:', 'bottom:', 'width:', 'height:', 'margin:'];
  let foundDangerous = false;
  
  // Look for dangerous properties in transition declarations
  const transitionMatches = combinedCss.match(/transition:[^;]+;/gi) || [];
  for (const trans of transitionMatches) {
    for (const prop of dangerousProps) {
      if (trans.includes(prop.replace(':', '')) && !trans.includes('border-color') && !trans.includes('background-color')) {
        foundDangerous = true;
        console.warn(`Warning: transition contains non-composited property: ${trans}`);
      }
    }
  }

  assert(!foundDangerous, 'Transitions and animations use compositor-only properties (opacity, transform, color, filter)');

  // 3. JS Memory Safety & Observer Cleanup Audit
  // Audits the script the page actually loads. These assertions used to read
  // src/scripts/modules/*.js, which no <script> tag ever loaded, so they
  // reported on code no visitor ran.
  const runtimeJs = fs.readFileSync('src/scripts/main.js', 'utf8');
  assert(runtimeJs.includes('.unobserve('), 'Observer unobserves revealed elements to prevent memory leaks');
  assert(runtimeJs.includes('{ passive: true }'), 'Scroll listener utilizes passive event listeners to avoid thread blocking');
  assert(runtimeJs.includes('cancelAnimationFrame'), 'Performance telemetry registers clean animation frame teardown');

  console.log(`\nStress & Performance Audit Finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runStressAudit();
