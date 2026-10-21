// Render each concept: stills at chosen times, and an mp4 by seeking every CSS animation frame by frame.
const { chromium } = require(process.env.APPDATA + '/npm/node_modules/@playwright/cli/node_modules/playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const JOBS = [['a-credits', 14, [1.6, 2.4, 5.2, 9.5]], ['b-premiere', 8, [2.2, 6.2]], ['c-reel', 8, [3.5, 7.2]], ['d-box-office', 8, [1.4, 4.0]]];
const only = process.argv[2];
const video = process.argv.includes('--video');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  for (const [name, dur, stills] of JOBS) {
    if (only && only !== 'all' && only !== name) continue;
    await p.goto('file:///E:/Haris%20portfolio%20website/mockups/client-reviews-v2/' + name + '.html', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    const seek = (t) => p.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t * 1000; }), t);
    for (const t of stills) { await seek(t); await p.waitForTimeout(60); await p.screenshot({ path: `${name}-${t}.png` }); }
    if (!video) continue;
    const dir = `frames-${name}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
    const fps = 24;
    for (let i = 0; i < dur * fps; i++) { await seek(i / fps); await p.screenshot({ path: `${dir}/${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 88 }); }
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(fps), '-i', `${dir}/%04d.jpg`, '-vf', 'scale=1280:800:flags=lanczos', '-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${name}.mp4`]);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(name, 'video done');
  }
  await b.close();
})();
