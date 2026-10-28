"""Build one page per case study from the brief, word for word. Nothing is written by hand except the page frame."""
import fitz, re, os, sys, html
sys.stdout.reconfigure(encoding='utf-8')
doc = fitz.open(r'C:\Users\prash\Downloads\Muhammad Haris - AI GTM Engineer Brief.pdf')
FONTS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts_head.html'), encoding='utf-8').read().strip()
OUT = r'E:\Haris portfolio website\public\work'
os.makedirs(OUT, exist_ok=True)

# page index in the PDF, slug, client type (the case study header), revenue stage (the brief's case table)
CASES = [
	(11, 'signal-engine', 'Lead-generation company', 'Signal intelligence'),
	(12, 'research-cascade', 'Outbound campaign', 'Research and enrichment, outbound'),
	(14, 'uk-broadband', 'UK broadband provider', 'Inbound capture, retention'),
	(13, 'instant-quotes', 'Home-service brands', 'Inbound conversion'),
	(15, 'sell-side-buyers', 'Investment bank, sell-side M&A', 'Account intelligence, M&A outreach'),
	(10, 'growth-engine', 'Calendar marketing SaaS', 'Demand generation, signup qualification'),
]

def join(lines):
	# re-flow wrapped PDF lines; a line ending in a hyphen continues the same word
	out = ''
	for ln in lines:
		out += ln if out.endswith('-') or not out else ' ' + ln
	return out

def paras(lines):
	out, cur = [], []
	for ln in lines:
		cur.append(ln)
		if ln.endswith('.') and len(ln) < 80:
			out.append(join(cur)); cur = []
	if cur: out.append(join(cur))
	return out

VAL = re.compile(r'^(~?£?[\d,.]+[k+x]*(\s?sec)?|~£[\d,.]+k)$')

def parse(i):
	L = [l.strip() for l in doc[i].get_text().split('\n') if l.strip()]
	si = next(n for n in range(2, len(L)) if L[n].endswith('.'))
	title, sub = join(L[1:si]), L[si]
	k = L.index('THE SITUATION')
	stats, j = [], si + 1
	while j < k:
		if VAL.match(L[j]):
			stats.append([L[j], []])
		else:
			stats[-1][1].append(L[j])
		j += 1
	stats = [(v, join(l)) for v, l in stats]
	b, c = L.index('WHAT I BUILT'), L.index('WHAT CHANGED')
	h = next(n for n, l in enumerate(L) if l.startswith('Under the hood:'))
	under = join(L[h:]).replace('Under the hood:', '').strip()
	return dict(title=title, sub=sub, stats=stats, situation=paras(L[k + 1:b]), built=paras(L[b + 1:c]), changed=paras(L[c + 1:h]), under=under)

CSS = '''
:root { --bg: #faf8f4; --surface: #fff; --ink: #0e1726; --mute: #5b6475; --line: rgb(14 23 38 / .09); --acc: #1e3a5f; --acc-soft: #f2ede3; }
* { box-sizing: border-box; margin: 0; }
body { background: var(--bg); color: var(--ink); font: 400 17px/1.6 "Geist", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
a:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; border-radius: 6px; }
.wrap { width: min(1240px, 100% - 48px); margin: 0 auto; }
.btn { display: inline-flex; align-items: center; gap: 10px; height: 52px; padding: 0 24px; border-radius: 999px; background: var(--ink); color: #fff; font-weight: 600; font-size: 16px; white-space: nowrap; transition: transform .16s ease-out; }
.btn:active { transform: scale(.97); }
.btn i { width: 26px; height: 26px; border-radius: 50%; background: var(--acc); display: grid; place-items: center; font-style: normal; font-size: 14px; }
.topbar { position: relative; z-index: 30; background: var(--surface); box-shadow: 0 1px 0 var(--line); }
nav.top { height: 80px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; }
.logo { line-height: 1.15; } .logo b { display: block; font-size: 18px; font-weight: 700; letter-spacing: -.02em; } .logo span { font-size: 13px; color: var(--mute); }
.links { display: flex; align-items: stretch; height: 100%; gap: 6px; margin: 0; padding: 0; list-style: none; }
.links > li { position: relative; display: flex; }
.links > li > a, .links > li > button { position: relative; display: flex; align-items: center; gap: 10px; padding: 0 16px; border: 0; background: none; font: 500 16.5px "Geist", sans-serif; color: var(--ink); cursor: pointer; transition: color .15s ease; }
.links svg { width: 10px; height: 6px; transition: transform .2s ease; }
.links > li > a::after, .links > li > button::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: #d4b483; transform: scaleX(0); transition: transform .2s ease; }
.links > li:hover > a, .links > li:hover > button, .links > li.open > button, .links > li.here > button { color: var(--acc); }
.links > li:hover > a::after, .links > li:hover > button::after, .links > li.open > button::after, .links > li.here > button::after { transform: scaleX(1); }
.links > li.open svg { transform: rotate(180deg); }
.links :focus-visible { outline: 2px solid var(--acc); outline-offset: -4px; border-radius: 6px; }
.drop { position: absolute; top: 100%; left: 0; min-width: 100%; width: max-content; padding: 10px 0; background: #f4f1eb; box-shadow: 0 18px 30px -18px rgb(14 23 38 / .3); opacity: 0; visibility: hidden; transform: translateY(-4px); transition: opacity .16s ease, transform .16s ease, visibility 0s .16s; }
.links > li:hover .drop, .links > li.open .drop { opacity: 1; visibility: visible; transform: none; transition: opacity .16s ease, transform .16s ease; }
.drop a { display: block; padding: 11px 22px; font-size: 16px; font-weight: 500; color: var(--ink); transition: color .15s ease, background-color .15s ease; }
.drop a:hover, .drop a:focus-visible { color: var(--acc); background: #f2ede3; outline: none; }
.drop a.cur { color: var(--acc); }
.top-right { display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
.icon-btn { width: 44px; height: 44px; border-radius: 10px; display: grid; place-items: center; background: #f4f1eb; color: var(--ink); transition: background-color .15s ease, color .15s ease; }
.icon-btn:hover { background: #f2ede3; color: var(--acc); }
.book { display: inline-flex; align-items: center; height: 44px; padding: 0 22px; border-radius: 10px; background: var(--acc); color: #fff; font-size: 15.5px; font-weight: 600; white-space: nowrap; box-shadow: inset 0 -2px 0 rgb(0 0 0 / .12); transition: transform .16s ease-out, background-color .15s ease; }
.book:hover { background: #172f4e; }
.book:active { transform: scale(.97); }
.top-right a:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; }
.back { display: inline-flex; gap: 8px; margin-top: 30px; font-size: 15px; font-weight: 600; color: var(--acc); }
.head { padding: 40px 0 56px; max-width: 900px; }
.tag { display: inline-block; padding: 5px 10px; border-radius: 999px; background: var(--acc-soft); font: 500 12px "Geist Mono", monospace; letter-spacing: .04em; color: var(--acc); }
.client { display: block; margin-top: 18px; font-size: 15px; color: var(--mute); }
h1 { margin-top: 8px; font-size: clamp(38px, 4.6vw, 64px); line-height: 1.04; letter-spacing: -.04em; font-weight: 600; }
.sub { margin-top: 18px; font-size: 21px; color: var(--mute); max-width: 34em; }
.stats { display: grid; grid-template-columns: repeat(var(--n), 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.stats div { padding: 34px 26px 34px 0; } .stats div + div { padding-left: 26px; border-left: 1px solid var(--line); }
.stats b { display: block; font-size: clamp(34px, 3.6vw, 52px); letter-spacing: -.045em; font-weight: 600; line-height: 1; color: var(--acc); }
.stats span { display: block; margin-top: 10px; font-size: 15px; color: var(--mute); }
.body { display: grid; grid-template-columns: 260px 1fr; gap: 20px 70px; padding: 80px 0 40px; }
.body h2 { font: 500 12px "Geist Mono", monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--acc); padding-top: 6px; }
.body .txt { max-width: 44em; padding-bottom: 50px; }
.body .txt p { font-size: 18.5px; line-height: 1.7; color: #2a3343; }
.body .txt p + p { margin-top: 18px; }
.under { background: var(--surface); border-radius: 14px; padding: 26px 30px; font-size: 16px; color: var(--mute); }
.shot { margin: 40px 0 0; aspect-ratio: 16 / 9; border-radius: 18px; overflow: hidden; background: #0e1726; }
.shot img { display: block; width: 100%; height: 100%; object-fit: cover; }
.under b { color: var(--ink); font-weight: 600; }
.cta { margin: 80px auto 100px; width: min(1240px, 100% - 48px); background: var(--ink); border-radius: 24px; padding: clamp(40px, 6vw, 80px); display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: end; color: #eef1f6; }
.cta h2 { font-size: clamp(30px, 3.6vw, 48px); line-height: 1.05; letter-spacing: -.04em; font-weight: 600; max-width: 14em; }
.cta .btn { background: var(--acc); } .cta .btn i { background: #fff; color: var(--acc); }
.more { display: flex; justify-content: space-between; gap: 20px; padding: 0 0 20px; }
.more a { flex: 1; padding: 22px 24px; border-radius: 14px; background: var(--surface); }
.more a small { display: block; font-size: 13px; color: var(--mute); } .more a b { display: block; margin-top: 4px; font-size: 17px; font-weight: 600; line-height: 1.3; }
.more a:last-child { text-align: right; }
footer { border-top: 1px solid var(--line); padding: 40px 0; }
footer .wrap { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; font-size: 15px; }
footer .c { display: flex; gap: 26px; flex-wrap: wrap; color: var(--mute); }
@media (max-width: 1000px) { .links { display: none; } nav.top { grid-template-columns: 1fr auto; height: 72px; } .body { grid-template-columns: 1fr; gap: 10px; } }
@media (max-width: 680px) { .stats { grid-template-columns: 1fr 1fr; } .stats div:nth-child(3) { border-left: 0; padding-left: 0; } .stats div { padding-right: 12px; } .stats div + div { padding-left: 12px; } .cta { grid-template-columns: 1fr; } .more { flex-direction: column; } .more a:last-child { text-align: left; } .logo span { display: none; } .logo b { white-space: nowrap; } .top-right .icon-btn { display: none; } }
'''

CARET = '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M0 0h10L5 6z" fill="currentColor"/></svg>'
LINKEDIN = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4v11H3v-11zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.6 4.77 6v5.45h-4v-4.83c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.55v4.92h-4v-11z"/></svg>'
STAGE_NAMES = ['Signal intelligence', 'Research and enrichment agents', 'Signal-triggered outbound', 'Inbound conversion', 'Retention and expansion']
# project categories (pages in public/projects/, built by media-src/projects/build.py) and each case's category
CATEGORIES = [('signal-intelligence', 'Signal intelligence'), ('research-and-enrichment-agents', 'Research and enrichment agents'), ('signal-triggered-outbound', 'Signal-triggered outbound'), ('inbound-conversion', 'Inbound conversion'), ('retention-and-expansion', 'Retention and expansion'), ('product-and-platform-engineering', 'Product and platform engineering')]
CASE_CATEGORY = {'signal-engine': 'signal-intelligence', 'research-cascade': 'research-and-enrichment-agents', 'growth-engine': 'research-and-enrichment-agents', 'sell-side-buyers': 'signal-triggered-outbound', 'instant-quotes': 'inbound-conversion', 'uk-broadband': 'retention-and-expansion'}

def nav(cur):
	# same top bar as the home page; this page's category is marked in the Selected work dropdown
	here = ' class="cur"'
	work = ''.join(f'<a href="/projects/{k}.html"{here if k == CASE_CATEGORY[cur] else ""}>{n}</a>' for k, n in CATEGORIES) + '<a href="/projects/all.html">All projects</a>'
	build = ''.join(f'<a href="/#what-i-build">{s}</a>' for s in STAGE_NAMES)
	return f"""<header class="topbar">
	<nav class="wrap top" aria-label="Main">
		<a class="logo" href="/"><b>Muhammad Haris</b><span>AI GTM Engineer</span></a>
		<ul class="links">
			<li class="has-drop here"><button type="button" aria-expanded="false" aria-controls="drop-work">Selected work {CARET}</button><div class="drop" id="drop-work">{work}</div></li>
			<li class="has-drop"><button type="button" aria-expanded="false" aria-controls="drop-build">What I build {CARET}</button><div class="drop" id="drop-build">{build}</div></li>
			<li><a href="/#how-i-work">How I work</a></li>
			<li><a href="/#who-i-am">Who I am</a></li>
		</ul>
		<div class="top-right">
			<a class="icon-btn" href="https://linkedin.com/in/muhammad-haris-wassan" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">{LINKEDIN}</a>
			<a class="book" href="/#book">Book a call</a>
		</div>
	</nav>
</header>"""

NAV_JS = """<script>
// Top bar dropdowns: open on hover (CSS) and on click or keyboard; Escape or a click outside closes them
;(function () {
	const items = [...document.querySelectorAll('.links .has-drop')]
	const close = (except) => items.forEach((li) => { if (li !== except) { li.classList.remove('open'); li.querySelector('button').setAttribute('aria-expanded', 'false') } })
	items.forEach((li) => {
		const btn = li.querySelector('button')
		btn.addEventListener('click', () => {
			const open = !li.classList.contains('open')
			close(li)
			li.classList.toggle('open', open)
			btn.setAttribute('aria-expanded', String(open))
			if (open) li.querySelector('.drop a').focus({ preventScroll: true })
		})
		li.addEventListener('mouseleave', () => { if (!li.contains(document.activeElement)) close() })
		li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) close() })
	})
	document.addEventListener('click', (e) => { if (!e.target.closest('.has-drop')) close() })
	document.addEventListener('keydown', (e) => {
		if (e.key !== 'Escape') return
		const li = items.find((x) => x.classList.contains('open'))
		close()
		if (li) li.querySelector('button').focus()
	})
})()
</script>"""

def page(c, prev, nxt):
	e = html.escape
	stats = ''.join(f'<div><b>{e(v)}</b><span>{e(l)}</span></div>' for v, l in c['stats'])
	sect = lambda name, ps: f'<h2>{name}</h2><div class="txt">' + ''.join(f'<p>{e(p)}</p>' for p in ps) + '</div>'
	return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{e(c['title'])} | Muhammad Haris, AI GTM Engineer</title>
<meta name="description" content="{e(c['sub'])}" />
{FONTS}
<style>{CSS}</style>
</head>
<body>
{nav(c['slug'])}
<div class="wrap">
	<a class="back" href="/projects/{CASE_CATEGORY[c['slug']]}.html">&larr; {dict(CATEGORIES)[CASE_CATEGORY[c['slug']]]}</a>
	<header class="head">
		<span class="tag">{e(c['stage'])}</span>
		<span class="client">{e(c['client'])}</span>
		<h1>{e(c['title'])}</h1>
		<p class="sub">{e(c['sub'])}</p>
	</header>
	<section class="stats" style="--n:{len(c['stats'])}" aria-label="Results">{stats}</section>
	<figure class="shot"><img src="/projects/img/p-{c['slug']}.webp" alt="" width="1600" height="900" /></figure>
	<section class="body">
		{sect('The situation', c['situation'])}
		{sect('What I built', c['built'])}
		{sect('What changed', c['changed'])}
		<h2>Under the hood</h2><div class="txt"><p class="under">{e(c['under'])}</p></div>
	</section>
	<div class="more">
		<a href="/work/{prev['slug']}.html"><small>&larr; Selected work</small><b>{e(prev['title'])}</b></a>
		<a href="/work/{nxt['slug']}.html"><small>Selected work &rarr;</small><b>{e(nxt['title'])}</b></a>
	</div>
</div>
<section class="cta">
	<h2>If you're serious about building a revenue engine, let's talk.</h2>
	<a class="btn" href="mailto:hariswassan001@gmail.com?subject=Book%20a%20call">Book a call <i aria-hidden="true">&rarr;</i></a>
</section>
<footer><div class="wrap">
	<a class="logo" href="/"><b>Muhammad Haris</b><span>AI GTM Engineer</span></a>
	<div class="c"><a href="mailto:hariswassan001@gmail.com">hariswassan001@gmail.com</a><a href="https://linkedin.com/in/muhammad-haris-wassan" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/Haris001-bit" target="_blank" rel="noopener noreferrer">GitHub</a></div>
</div></footer>
{NAV_JS}
</body>
</html>
'''

data = []
for idx, slug, client, stage in CASES:
	c = parse(idx); c.update(slug=slug, client=client, stage=stage); data.append(c)
for n, c in enumerate(data):
	open(os.path.join(OUT, c['slug'] + '.html'), 'w', encoding='utf-8').write(page(c, data[n - 1], data[(n + 1) % len(data)]))
	print(c['slug'], '|', c['title'], '| stats', [v for v, _ in c['stats']], '| paras', len(c['situation']), len(c['built']), len(c['changed']))
