/**
 * Runtime Frame Performance Profiler (Internal Metric Guard)
 * Measures hardware compositor stability without injecting UI clutter.
 */
export function initPerformanceTelemetry() {
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;
  let rafId;

  const measureFps = (now) => {
    frameCount++;
    const delta = now - lastTime;

    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastTime = now;
    }

    rafId = requestAnimationFrame(measureFps);
  };

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rafId = requestAnimationFrame(measureFps);
  }

  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
  });
}
