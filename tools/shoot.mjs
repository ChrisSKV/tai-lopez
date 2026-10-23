// Usage: node tools/shoot.mjs <path/to/index.html> <outDir>
// Captures desktop (1440) + mobile (390) full-page screenshots, logs console errors
// and checks for horizontal overflow on mobile.
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(path.join(process.execPath, '../../lib/node_modules/playwright')); }
const [,, file, outDir] = process.argv;
if (!file || !outDir) { console.error('usage: shoot.mjs <html> <outDir>'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const url = 'file://' + path.resolve(file);
const browser = await pw.chromium.launch();
const shots = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 },
];
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.viewport, isMobile: !!s.isMobile, deviceScaleFactor: s.deviceScaleFactor || 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => errors.push('goto: ' + e.message));
  await page.waitForTimeout(1200);
  // force any reveal-on-scroll elements visible for the capture
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: path.join(outDir, `${s.name}.png`), fullPage: true });
  await page.screenshot({ path: path.join(outDir, `${s.name}-fold.png`), fullPage: false });
  console.log(JSON.stringify({ shot: s.name, pageHeight: h, horizontalOverflowPx: overflow, consoleErrors: errors }));
  await ctx.close();
}
await browser.close();
