const { chromium } = require(process.env.APPDATA + '/npm/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  for (const f of ['a-film-strip', 'b-annotated', 'c-numbers', 'd-loupe']) {
    await p.goto('file:///E:/Haris%20portfolio%20website/mockups/up-close/' + f + '.html', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    await p.screenshot({ path: f + '.png' });
  }
  await b.close();
})();
