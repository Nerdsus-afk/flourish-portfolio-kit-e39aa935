/**
 * Verifies the "Click any card to view details" hint label:
 *   1. is visible at common breakpoints,
 *   2. has readable color contrast (>= 4.5:1 against its background),
 *   3. doesn't break the click-to-open-modal behavior on the cards.
 *
 * Run after starting the dev server:
 *   bun run dev
 *   node scripts/check-hint-label.mjs
 *
 * Optional override:  URL=http://localhost:5173 node scripts/check-hint-label.mjs
 *
 * Requires playwright. Install once with:
 *   bun add -d playwright && bunx playwright install chromium
 */
import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:5173/";
const BREAKPOINTS = [
  { name: "mobile",      width: 390,  height: 844,  expectVisible: false },
  { name: "tablet",      width: 768,  height: 1024, expectVisible: true  }, // horizontal label
  { name: "narrow-lap",  width: 1024, height: 720,  expectVisible: true  }, // horizontal label
  { name: "desktop",     width: 1280, height: 800,  expectVisible: true  }, // vertical label
  { name: "wide",        width: 1920, height: 1080, expectVisible: true  }, // vertical label
];

// WCAG relative luminance + contrast ratio
const lum = ([r, g, b]) => {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [L1, L2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (L1 + 0.05) / (L2 + 0.05);
};
const parseRGB = (str) => {
  const m = str.match(/\d+(?:\.\d+)?/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
};

const browser = await chromium.launch();
let failed = false;

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForSelector('[aria-label^="View details for"]', { timeout: 5000 });

  // Find any hint label containing the canonical text
  const label = page.locator('text="Click any card to view details"').first();
  const isVisible = await label.isVisible().catch(() => false);

  let line = `[${bp.name.padEnd(11)} ${String(bp.width).padStart(4)}x${bp.height}]  visible=${isVisible}`;

  if (bp.expectVisible !== isVisible) {
    failed = true;
    line += `  ✗ expected visible=${bp.expectVisible}`;
  } else if (isVisible) {
    const colors = await label.evaluate((el) => {
      const cs = getComputedStyle(el);
      // walk up to find a non-transparent background
      let bg = cs.backgroundColor;
      let p = el.parentElement;
      while (p && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
        bg = getComputedStyle(p).backgroundColor;
        p = p.parentElement;
      }
      return { fg: cs.color, bg, fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    const ratio = contrast(parseRGB(colors.fg), parseRGB(colors.bg));
    const ok = ratio >= 4.5;
    if (!ok) failed = true;
    line += `  contrast=${ratio.toFixed(2)}:1 ${ok ? "✓" : "✗ (<4.5)"}  font=${colors.fontSize}/${colors.fontWeight}`;
  }

  // Verify card click still opens the details modal regardless of label state
  const card = page.locator('[aria-label^="View details for"]').first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  const modalOpened = await page
    .locator('[role="dialog"]')
    .first()
    .waitFor({ state: "visible", timeout: 1500 })
    .then(() => true)
    .catch(() => false);
  if (!modalOpened) {
    failed = true;
    line += `  ✗ card click did NOT open modal`;
  } else {
    line += `  click=ok`;
    await page.keyboard.press("Escape");
  }

  console.log(line);
  await ctx.close();
}

await browser.close();
console.log(failed ? "\nFAIL" : "\nOK — label is readable and cards stay clickable across breakpoints.");
process.exit(failed ? 1 : 0);
