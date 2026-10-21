"""Builds the showreel composition for page 3 of the site (2560x1440, full colour).

The reel moves sideways like the site does: every scene pushes in from the right and the last one leaves to the
left. It opens on Haris (his studio clip in a portrait card, always shown whole, never cropped) beside his name;
the five projects follow full screen in their own colours, each with a clean title in its accent colour;
halfway through, Haris comes forward over a blurred project; it ends on a grid of all five projects
with Haris, which settles into an end card with his name. Run it, then render from composition/ with HyperFrames.
"""
import json

W, H = 2560, 1440
PUSH = 0.6  # how long a push between scenes takes
D = 25.0

# Haris's clip is 1920x2160: the card has the same shape, so he is always shown whole
CARD_H = 1120
CARD_W = round(CARD_H * 1920 / 2160)
CARD_X = W - 150 - CARD_W
CARD_Y = (H - CARD_H) // 2

SCENES = [
    # id, project clip, source second, start, end, index, tag, title, accent
    ('s1', 1, 2.4, 2.8, 5.8, '01', 'Mobile app', 'Two-Sided Marketplace App', '#8fd46f'),
    ('s2', 2, 6.2, 5.2, 10.8, '02', 'AI customer support', 'Support for a UK Fibre Broadband Provider', '#f2b84b'),
    ('s3', 3, 2.8, 10.2, 13.2, '03', 'Email automation', 'Multi-Inbox Email Automation', '#8fd8e6'),
    ('s4', 4, 0.6, 12.6, 15.6, '04', 'RAG, agents and evals', 'Multi-Tenant AI Compliance Platform', '#b9a4ff'),
    ('s5', 5, 8.8, 15.0, 18.0, '05', '790 tickets resolved', 'Autonomous AI Agent', '#ff7a59'),
    ('s6', 1, 8.95, 17.4, 20.4, None, None, None, '#8fd46f'),  # the clip says it: approved by Apple first time
]
INTER_AT = 7.9  # Haris comes forward over project 02
GRID_AT = 19.8
SETTLE_AT = 22.6
GRID = [(1, 3.0), (2, 6.4), (3, 6.4), (4, 4.4), (5, 6.0)]  # project, source second

js = []


def tw(kind, target, *objs, at):
    js.append(f'tl.{kind}({json.dumps(target)}, {", ".join(json.dumps(o) for o in objs)}, {at:.3f});')


def video(vid, src, start, dur, media_start):
    return (f'<video id="{vid}" class="clip" data-start="{start:.3f}" data-duration="{dur:.3f}" '
            f'data-media-start="{media_start:.3f}" src="{src}" muted playsinline></video>')


def lines(cls, texts):
    return ''.join(f'<span class="ln"><span class="{cls}">{t}</span></span>' for t in texts)


html_scenes, html_titles = [], []

# ---------------- intro: Haris and his name ----------------
html_scenes.append(f'''
      <div class="scene" id="intro">
        <div class="glow"></div>
        <div class="card" id="card-intro">{video('h-intro', 'assets/clips/haris.mp4', 0, 3.4, 0.2)}</div>
        <div class="intro-text">
          <p class="kicker" id="i-kick">Showreel · 2024 to 2026</p>
          <h1 class="big">{lines('il', ['Muhammad', 'Haris'])}</h1>
          <p class="intro-sub" id="i-sub">AI automation engineer in Karachi, building production AI for teams in the US, the UK and the Middle East.</p>
        </div>
        <div class="dim"></div>
      </div>''')
tw('fromTo', '#card-intro', {'y': 90, 'opacity': 0}, {'y': 0, 'opacity': 1, 'duration': 1.0, 'ease': 'power3.out'}, at=0.15)
tw('fromTo', '#intro .il', {'yPercent': 110}, {'yPercent': 0, 'duration': 0.8, 'ease': 'power4.out', 'stagger': 0.1}, at=0.35)
tw('fromTo', '#i-kick', {'opacity': 0, 'y': 20}, {'opacity': 1, 'y': 0, 'duration': 0.6, 'ease': 'power3.out'}, at=0.3)
tw('fromTo', '#i-sub', {'opacity': 0, 'y': 24}, {'opacity': 1, 'y': 0, 'duration': 0.7, 'ease': 'power3.out'}, at=0.75)
tw('to', '#intro', {'x': -900, 'duration': PUSH, 'ease': 'power3.inOut'}, at=2.8)
tw('to', '#intro .dim', {'opacity': 0.6, 'duration': PUSH, 'ease': 'power1.in'}, at=2.8)

# ---------------- the projects ----------------
for k, (sid, clip, src, start, end, idx, tag, title, accent) in enumerate(SCENES):
    inter = ''
    if sid == 's2':
        inter = f'''
        <div class="inter" id="inter">
          <div class="glow glow--warm"></div>
          <div class="card" id="card-inter">{video('h-inter', 'assets/clips/haris.mp4', INTER_AT, end - INTER_AT, 4.3)}</div>
          <div class="inter-text">
            <p class="kicker" id="n-kick">The engineer</p>
            <p class="mid">{lines('nl', ['Every system here', 'was designed, built', 'and shipped by Haris.'])}</p>
          </div>
        </div>'''
    html_scenes.append(f'''
      <div class="scene" id="{sid}">
        <div class="vw" id="{sid}-vw">{video(f'v-{sid}', f'assets/clips/c0{clip}.mp4', start, end - start, src)}</div>{inter}
        <div class="dim"></div>
      </div>''')
    tw('fromTo', f'#{sid}', {'x': W}, {'x': 0, 'duration': PUSH, 'ease': 'power3.inOut'}, at=start)
    if sid != 's6':
        tw('to', f'#{sid}', {'x': -900, 'duration': PUSH, 'ease': 'power3.inOut'}, at=end - PUSH)
        tw('to', f'#{sid} .dim', {'opacity': 0.6, 'duration': PUSH, 'ease': 'power1.in'}, at=end - PUSH)

    if not title:
        continue
    # its title, in its colour; it leaves before the push (or before Haris comes forward)
    t_out = (INTER_AT - 0.25) if sid == 's2' else (end - PUSH - 0.2)
    idx_html = f'<p class="idx" style="color:{accent}">{idx}<span> / 05</span></p>' if idx else ''
    html_titles.append(f'''
      <div class="ttl" id="t-{sid}" style="--c:{accent}">
        <p class="tag"><i></i>{tag}</p>
        <p class="title">{title}</p>
      </div>
      <div class="corner" id="c-{sid}">{idx_html}</div>''')
    tw('fromTo', f'#t-{sid}', {'opacity': 0, 'y': 40}, {'opacity': 1, 'y': 0, 'duration': 0.55, 'ease': 'power3.out'}, at=start + PUSH - 0.05)
    tw('to', f'#t-{sid}', {'opacity': 0, 'y': -10, 'duration': 0.25, 'ease': 'power1.in'}, at=t_out)
    tw('fromTo', f'#c-{sid}', {'opacity': 0}, {'opacity': 1, 'duration': 0.4, 'ease': 'none'}, at=start + PUSH - 0.05)
    tw('to', f'#c-{sid}', {'opacity': 0, 'duration': 0.2, 'ease': 'none'}, at=t_out)

# Haris comes forward over project 02: it blurs and darkens, his card rises, the line reveals
# an explicit start: from 'none' GSAP would begin at brightness(0), a black flash
tw('fromTo', '#s2-vw', {'filter': 'blur(0px) brightness(1) saturate(1)', 'scale': 1}, {'filter': 'blur(26px) brightness(0.42) saturate(1.15)', 'scale': 1.06, 'duration': 0.7, 'ease': 'power2.inOut', 'immediateRender': False}, at=INTER_AT - 0.1)
tw('fromTo', '#card-inter', {'y': 120, 'opacity': 0}, {'y': 0, 'opacity': 1, 'duration': 0.9, 'ease': 'power3.out'}, at=INTER_AT)
tw('fromTo', '#n-kick', {'opacity': 0, 'y': 20}, {'opacity': 1, 'y': 0, 'duration': 0.5, 'ease': 'power3.out'}, at=INTER_AT + 0.2)
tw('fromTo', '#inter .nl', {'yPercent': 110}, {'yPercent': 0, 'duration': 0.75, 'ease': 'power4.out', 'stagger': 0.09}, at=INTER_AT + 0.25)
tw('fromTo', '#inter .glow', {'opacity': 0}, {'opacity': 1, 'duration': 0.8, 'ease': 'none'}, at=INTER_AT)

# the chrome over the projects
tw('fromTo', '.chrome', {'opacity': 0}, {'opacity': 1, 'duration': 0.5, 'ease': 'none'}, at=3.2)
tw('to', '.chrome', {'opacity': 0, 'duration': 0.4, 'ease': 'none'}, at=GRID_AT)

# ---------------- the finale: everything at once, then Haris and his name ----------------
TILE_GAP = 34
GX = 150
TX = GX + CARD_W + 90
TW = (W - 150 - TX - TILE_GAP) // 2
TH = round(TW * 9 / 16)
TY = CARD_Y + (CARD_H - (3 * TH + 2 * TILE_GAP)) // 2
tiles = []
for i in range(6):
    r, c = divmod(i, 2)
    x, y = TX + c * (TW + TILE_GAP), TY + r * (TH + TILE_GAP)
    if i < 5:
        clip, src = GRID[i]
        inner = video(f'g{i}', f'assets/clips/c0{clip}.mp4', GRID_AT, D - GRID_AT, src)
    else:
        inner = '<div class="next"><p>06</p><b>Your project,<br />next.</b></div>'
    tiles.append(f'<div class="tile" id="tile{i}" style="left:{x}px;top:{y}px;width:{TW}px;height:{TH}px">{inner}</div>')
    tw('fromTo', f'#tile{i}', {'opacity': 0, 'scale': 0.92}, {'opacity': 1, 'scale': 1, 'duration': 0.6, 'ease': 'power3.out'}, at=GRID_AT + 0.35 + i * 0.07)
    tw('to', f'#tile{i}', {'opacity': 0, 'scale': 0.96, 'duration': 0.45, 'ease': 'power2.in'}, at=SETTLE_AT + i * 0.04)

html_scenes.append(f'''
      <div class="scene" id="grid">
        <div class="glow glow--grid"></div>
        <p class="grid-label" id="g-label">Selected work · 2024 to 2026</p>
        <div class="card card--grid" id="card-end" style="left:{GX}px">{video('h-end', 'assets/clips/haris.mp4', GRID_AT, D - GRID_AT, 4.6)}</div>
        {''.join(tiles)}
        <div class="end-text" id="end-text">
          <h2 class="end-big">{lines('el', ['Muhammad', 'Haris'])}</h2>
          <p class="end-sub" id="e-sub">AI automation engineer</p>
          <p class="end-mail" id="e-mail">hello@autoany.io</p>
        </div>
      </div>''')
tw('fromTo', '#grid', {'x': W}, {'x': 0, 'duration': PUSH, 'ease': 'power3.inOut'}, at=GRID_AT)
tw('fromTo', '#g-label', {'opacity': 0}, {'opacity': 1, 'duration': 0.5, 'ease': 'none'}, at=GRID_AT + 0.4)
tw('to', '#g-label', {'opacity': 0, 'duration': 0.3, 'ease': 'none'}, at=SETTLE_AT)
tw('to', '#card-end', {'x': 170, 'duration': 1.0, 'ease': 'power3.inOut'}, at=SETTLE_AT + 0.15)
tw('fromTo', '#end-text .el', {'yPercent': 110}, {'yPercent': 0, 'duration': 0.8, 'ease': 'power4.out', 'stagger': 0.1}, at=SETTLE_AT + 0.55)
tw('fromTo', '#e-sub', {'opacity': 0, 'y': 20}, {'opacity': 1, 'y': 0, 'duration': 0.6, 'ease': 'power3.out'}, at=SETTLE_AT + 0.85)
tw('fromTo', '#e-mail', {'opacity': 0, 'y': 20}, {'opacity': 1, 'y': 0, 'duration': 0.6, 'ease': 'power3.out'}, at=SETTLE_AT + 0.95)

html = open('template.html', encoding='utf-8').read()
for key, val in {
    '{{D}}': str(D), '{{W}}': str(W), '{{H}}': str(H),
    '{{CARD_W}}': str(CARD_W), '{{CARD_H}}': str(CARD_H), '{{CARD_X}}': str(CARD_X), '{{CARD_Y}}': str(CARD_Y),
    '{{SCENES}}': ''.join(html_scenes), '{{TITLES}}': ''.join(html_titles),
    '{{JS}}': '\n      '.join(js),
}.items():
    html = html.replace(key, val)
open('composition/index.html', 'w', encoding='utf-8').write(html)
print('duration', D, 'card', CARD_W, 'x', CARD_H, 'tiles', TW, 'x', TH)
