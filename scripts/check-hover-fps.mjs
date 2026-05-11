/**
 * Lightweight hover-animation FPS check.
 *
 * Drives a Chromium instance over the running preview, hovers each placement
 * offer card at 4 viewport widths, samples requestAnimationFrame deltas while
 * the hover/focus animation is running, and prints median + p95 FPS per card
 * per breakpoint.
 *
 * Usage:
 *   1. Start the dev server:           bun run dev
 *   2. In another terminal:            node scripts/check-hover-fps.mjs
 *   3. Optional override:              URL=http://localhost:5173 node scripts/check-hover-fps.mjs
 *
 * Requires playwright (devDependency). Install with: bun add -d playwright
 *   then: bunx playwright install chromium
 *
 * Exits non-zero if median FPS drops below 50 on any breakpoint.
 */
import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:5173/";
const BREAKPOINTS = [
  { name: "mobile",  width: 390,  height: 844  },
  { name: "tablet",  width: 768,  height: 1024 },
  { name: "laptop",  width: 1280, height: 720  },
  { name: "desktop", width: 1920, height: 1080 },
];
const SAMPLE_MS = 800;
const MIN_MEDIAN_FPS = 50;

const browser = await chromium.launch();
let failed = false;

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  // wait for skeleton to swap to real cards
  await page.waitForSelector('[aria-label^="View details for"]', { timeout: 5000 });

  const cards = await page.$$('[aria-label^="View details for"]');
  console.log(`\n=== ${bp.name} (${bp.width}x${bp.height}) — ${cards.length} cards ===`);

  for (const card of cards) {
    const label = await card.getAttribute("aria-label");
    await card.scrollIntoViewIfNeeded();
    await card.hover();

    const fps = await page.evaluate(async (ms) => {
      const frames = [];
      let last = performance.now();
      await new Promise((resolve) => {
        const start = last;
        const tick = (now) => {
          frames.push(1000 / (now - last));
          last = now;
          if (now - start < ms) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
      frames.sort((a, b) => a - b);
      const median = frames[Math.floor(frames.length / 2)];
      const p95 = frames[Math.floor(frames.length * 0.05)]; // worst 5%
      return { median: +median.toFixed(1), p95Worst: +p95.toFixed(1), samples: frames.length };
    }, SAMPLE_MS);

    const ok = fps.median >= MIN_MEDIAN_FPS;
    if (!ok) failed = true;
    console.log(
      `  ${ok ? "✓" : "✗"} ${label?.replace("View details for ", "").replace(" placement offer", "").padEnd(20)} ` +
      `median=${fps.median}fps  worst5%=${fps.p95Worst}fps  (${fps.samples} samples)`
    );

    // move mouse off-card to reset hover state before next iteration
    await page.mouse.move(0, 0);
  }
  await ctx.close();
}

await browser.close();
console.log(failed ? `\nFAIL: median FPS dropped below ${MIN_MEDIAN_FPS} on at least one card.` : `\nOK: all cards held ≥${MIN_MEDIAN_FPS}fps median.`);
process.exit(failed ? 1 : 0);
