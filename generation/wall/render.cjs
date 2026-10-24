// Render panels-html/*.html to panels/*.png at 1600x1000.
// Usage: NODE_PATH=$(npm root -g) node render.cjs [name ...]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = __dirname, src = path.join(dir, 'panels-html'), out = path.join(dir, 'panels');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const only = process.argv.slice(2);
  const files = fs.readdirSync(src).filter(f => f.endsWith('.html') && (!only.length || only.includes(f.replace('.html', ''))));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  for (const f of files) {
    await p.goto('file://' + path.join(src, f), { waitUntil: 'networkidle', timeout: 60000 });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(out, f.replace('.html', '.png')) });
    console.log('rendered', f);
  }
  await b.close();
})();
