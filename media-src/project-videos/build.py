"""Writes one HyperFrames project per portfolio project into media-src/project-videos/<slug>/ (1920x1080, 12 s, silent loop).
Same family as the site (Geist, ink #0e1726, greens #1e3a5f / #d4b483, the pipeline texture), but each project has its own
ground and its own picture of what it does. Every caption and label is word for word from the AI GTM Engineer brief or,
for older projects, the AI Automation Portfolio PDF.  Usage: python build.py   (then render.sh)"""
import json, os, random, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
W, H, DUR = 1920, 1080, 12
J = json.dumps

THEMES = {
	# ground, ink, muted ink, node bg, node line, lit bg, lit line, accent number, badge bg, badge ink, edge, edge lit, texture
	'L': dict(bg='#f4f1eb', ink='#0e1726', mute='#5b6475', nbg='#ffffff', nline='#d8dce4', lbg='#f2ede3', lline='#1e3a5f', num='#1e3a5f', bbg='#d4b483', bink='#0e1726', edge='#cdd2db', elit='#1e3a5f', tex='pipeline-green.svg', soft='#f2ede3', card='#ffffff'),
	'D': dict(bg='#0e1726', ink='#ffffff', mute='#9aa5b8', nbg='rgba(255,255,255,0.05)', nline='rgba(255,255,255,0.16)', lbg='rgba(212,180,131,0.18)', lline='#d4b483', num='#dcc196', bbg='#d4b483', bink='#0e1726', edge='rgba(255,255,255,0.18)', elit='#d4b483', tex='pipeline.svg', soft='rgba(255,255,255,0.08)', card='#1a2433'),
	'G': dict(bg='#1e3a5f', ink='#ffffff', mute='#e8edf4', nbg='rgba(255,255,255,0.08)', nline='rgba(255,255,255,0.28)', lbg='rgba(255,255,255,0.22)', lline='#ffffff', num='#ffffff', bbg='#ffffff', bink='#1e3a5f', edge='rgba(255,255,255,0.3)', elit='#ffffff', tex='pipeline.svg', soft='rgba(255,255,255,0.12)', card='rgba(255,255,255,0.1)'),
}
ALERT = '#d4542f'


class V:
	"""One video: collects markup and timeline code."""
	def __init__(self, slug, theme, cat, client=''):
		self.slug, self.t, self.cat, self.client = slug, THEMES[theme], cat, client
		self.theme, self.html, self.js, self.n = theme, [], [], 0
		self.words = [cat] + ([client] if client else [])

	def id(self, p='e'):
		self.n += 1
		return f'{p}{self.n}'

	def scene(self, t0, t1, inner, captions):
		"""A scene fades in at t0 and out at t1; captions = [(text, a, b)] in absolute seconds."""
		sid = self.id('s')
		caps = ''
		for text, a, b in captions:
			cid = self.id('c')
			self.words.append(text)
			caps += f'<p class="cap" id="{cid}">' + ' '.join(f'<span class="w">{w}</span>' for w in esc(text).split(' ')) + '</p>'
			self.js.append(f'tl.fromTo("#{cid} .w", {{opacity:0, filter:"blur(6px)"}}, {{opacity:1, filter:"blur(0px)", duration:0.16, ease:"power4.out", stagger:0.05}}, {a});')
			self.js.append(f'tl.fromTo("#{cid} .w", {{opacity:1, filter:"blur(0px)"}}, {{opacity:0, filter:"blur(6px)", duration:0.2, ease:"power3.in", immediateRender:false}}, {b - 0.22});')
		self.html.append(f'<div class="sc" id="{sid}">{inner}{caps}</div>')
		self.js.insert(0, f'tl.fromTo("#{sid}", {{opacity:0}}, {{opacity:1, duration:0.3, ease:"power2.out"}}, {t0});')
		self.js.append(f'tl.fromTo("#{sid}", {{opacity:1, filter:"blur(0px)"}}, {{opacity:0, filter:"blur(8px)", duration:0.3, ease:"power3.in", immediateRender:false}}, {t1 - 0.3});')
		return sid

	def label(self, s):
		self.words.append(s)
		return esc(s)


def esc(s):
	return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


# ---------- reusable pictures ----------
def flow(v, nodes, edges, steps, t0, t1, groups=(), lead=0.45):
	"""Boxes joined by lines that light up in order. nodes: id -> (label lines '|', x, y, w, h, kind[, sub]).
	edges: (a, b, opts) opts: label, dashed, blocked, pts. steps: lists of node ids lit in turn."""
	ids = {k: v.id('n') for k in nodes}
	out = []
	for g, x, y, w, h in groups:
		out.append(f'<div class="grp" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px"><span>{v.label(g)}</span></div>')
	svg, edge_ids = [], {}
	for a, b, *o in edges:
		o = o[0] if o else {}
		ax, ay, aw, ah = nodes[a][1:5]
		bx, by, bw, bh = nodes[b][1:5]
		if 'pts' in o:
			pts = o['pts']
		elif o.get('down'):
			pts = [(ax + aw / 2, ay + ah), (bx + bw / 2, by)]
		elif abs((ay + ah / 2) - (by + bh / 2)) < 2:
			pts = [(ax + aw, ay + ah / 2), (bx, by + bh / 2)]
		else:
			mx = (ax + aw + bx) / 2
			pts = [(ax + aw, ay + ah / 2), (mx, ay + ah / 2), (mx, by + bh / 2), (bx, by + bh / 2)]
		d = 'M' + ' L'.join(f'{x:.0f} {y:.0f}' for x, y in pts)
		eid = v.id('p')
		edge_ids.setdefault(b, []).append(eid)
		dash = ' stroke-dasharray="7 9"' if (o.get('dashed') or o.get('blocked')) else ''
		col = ALERT if o.get('blocked') else 'var(--elit)'
		svg.append(f'<path d="{d}" class="eb"{dash}/>')
		if not (o.get('dashed') or o.get('blocked')):
			svg.append(f'<path id="{eid}" d="{d}" class="el" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>')
		mx, my = pts[len(pts) // 2 - (0 if len(pts) % 2 else 1)]
		mx2, my2 = pts[len(pts) // 2]
		cx, cy = (mx + mx2) / 2, (my + my2) / 2
		if o.get('blocked'):
			out.append(f'<span class="x" style="left:{cx - 16:.0f}px;top:{cy - 16:.0f}px">&times;</span>')
		if o.get('label'):
			if o.get('blocked'):
				lx, ly = cx + 26, cy - 14
			elif len(pts) == 4:
				lx, ly = pts[2][0] + 12, pts[2][1] - 34
			else:
				lx, ly = cx - 30, cy - 36
			out.append(f'<span class="elab" style="left:{lx:.0f}px;top:{ly:.0f}px">{v.label(o["label"])}</span>')
	out.insert(0, f'<svg class="edges" viewBox="0 0 {W} {H}" width="{W}" height="{H}">' + ''.join(svg) + '</svg>')
	for k, (lab, x, y, w, h, kind, *sub) in nodes.items():
		lines = ''.join(f'<b>{v.label(l)}</b>' for l in lab.split('|'))
		s = f'<small>{v.label(sub[0])}</small>' if sub else ''
		out.append(f'<div class="nd k-{kind}" id="{ids[k]}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">{lines}{s}</div>')
	start, end = t0 + lead, t1 - 0.9
	gap = (end - start) / max(1, len(steps))
	for i, group in enumerate(steps):
		at = start + i * gap
		for k in group:
			for eid in edge_ids.get(k, []):
				v.js.append(f'tl.fromTo("#{eid}", {{attr:{{"stroke-dashoffset":1}}}}, {{attr:{{"stroke-dashoffset":0}}, duration:{min(0.45, gap * 0.6):.2f}, ease:"power2.inOut", immediateRender:false}}, {at - 0.05:.2f});')
			lit = 'k-out' if nodes[k][5] == 'out' else 'x'
			v.js.append(f'tl.fromTo("#{ids[k]}", {{opacity:0.38, scale:0.97}}, {{opacity:1, scale:1, duration:0.3, ease:"expo.out", immediateRender:false}}, {at + 0.25:.2f});')
			v.js.append(f'tl.fromTo("#{ids[k]}", {{borderColor:"var(--nline)"}}, {{borderColor:"var(--lline)", duration:0.2, ease:"power2.out", immediateRender:false}}, {at + 0.25:.2f});')
			if nodes[k][5] == 'out':
				v.js.append(f'tl.fromTo("#{ids[k]}", {{backgroundColor:"rgba(0,0,0,0)"}}, {{backgroundColor:"var(--outbg)", duration:0.25, ease:"power2.out", immediateRender:false}}, {at + 0.25:.2f});')
	v.js.insert(0, ''.join(f'tl.set("#{i}", {{opacity:0.38}}, 0);' for i in ids.values()))
	return ''.join(out)


def count_js(el, val, at, dur=1.3):
	m = re.match(r'^(~?£?)([\d,]*\.?\d+)(.*)$', val)
	if not m:
		return f'tl.fromTo("#{el}", {{opacity:0, filter:"blur(8px)"}}, {{opacity:1, filter:"blur(0px)", duration:0.25, ease:"power4.out"}}, {at});'
	pre, num, suf = m.groups()
	dec = len(num.split('.')[1]) if '.' in num else 0
	comma = ',' in num
	n = float(num.replace(',', ''))
	fmt = f'(o.v).toFixed({dec})' if not comma else 'Math.round(o.v).toLocaleString("en-GB")'
	return (f'(function(){{const o={{v:0}}, el=document.getElementById("{el}"); tl.fromTo(o, {{v:0}}, {{v:{n}, duration:{dur}, ease:"power2.out", '
		f'onUpdate:()=>{{el.textContent={J(pre)}+{fmt}+{J(suf)};}}}}, {at});}})();'
		+ f'tl.fromTo("#{el}", {{opacity:0}}, {{opacity:1, duration:0.2, ease:"power2.out"}}, {at});')


def counters(v, items, t0, y=300):
	"""Big numbers counting up, side by side."""
	n = len(items)
	colw = 1728 / n
	base = 200 if n <= 2 else 150 if n == 3 else 118
	size = int(min(base, (colw - 70) / (0.6 * max(len(val) for val, _ in items))))
	out = ''
	for i, (val, lab) in enumerate(items):
		nid, lid = v.id('k'), v.id('l')
		v.words.append(lab)
		out += f'<div class="cnt" style="left:{96 + i * colw:.0f}px;top:{y}px;width:{colw - 40:.0f}px"><b id="{nid}" style="font-size:{size}px">{esc(val)}</b><span id="{lid}">{esc(lab)}</span></div>'
		at = t0 + 0.15 + i * 0.3
		v.js.append(count_js(nid, val, at))
		v.js.append(f'tl.fromTo("#{lid}", {{opacity:0, y:12}}, {{opacity:1, y:0, duration:0.35, ease:"expo.out"}}, {at + 0.3});')
	return out


def rng(seed):
	return random.Random(seed)


# ---------- the fifteen videos ----------
def v_signal_engine():
	v = V('signal-engine', 'L', 'Signal intelligence', 'Lead-generation company')
	r = rng(3)
	cards = ''
	for i in range(4):
		for j in range(3):
			x, y = 96 + i * 300, 220 + j * 190
			cards += (f'<div class="lc" style="left:{x}px;top:{y}px"><i class="th"></i><i class="nm"></i><i class="sb"></i>'
				f'<span class="st" data-layout-ignore>{"&#9733;" * 5}</span><i class="dot" id="d{i}{j}"></i></div>')
	scan = '<div class="scan" id="scan"></div>'
	v.js.append('tl.fromTo("#scan", {x:0}, {x:1200, duration:3.2, ease:"none"}, 0.5);')
	for i in range(4):
		for j in range(3):
			v.js.append(f'tl.fromTo("#d{i}{j}", {{scale:0}}, {{scale:1, duration:0.25, ease:"expo.out"}}, {0.5 + (i * 300 + 150) / 1200 * 3.2:.2f});')
	side = ('<div class="panel" style="left:1360px;top:220px;width:464px;height:550px">'
		f'<span class="eyb">{v.label("Business listings monitored")}</span><b class="big" id="lm">38,548</b></div>')
	v.js.append(count_js('lm', '38,548', 0.6, 2.6))
	v.scene(0.2, 4.2, cards + scan + side, [('38,548 businesses watched.', 0.4, 4.0)])
	nodes = {'a': ('spots the trigger', 96, 380, 330, 110, 'n'), 'b': ('holds the lead', 516, 380, 330, 110, 'n'),
		'c': ('checks again independently', 936, 380, 400, 110, 'n'), 'd': ('hands it to sales', 1426, 380, 330, 110, 'out')}
	v.scene(4.2, 8.2, flow(v, nodes, [('a', 'b'), ('b', 'c'), ('c', 'd')], [['a'], ['b'], ['c'], ['d']], 4.2, 8.2),
		[("Nothing reaches a rep that hasn't been confirmed twice.", 4.4, 8.0)])
	v.scene(8.2, 11.8, counters(v, [('51', 'qualified leads in the first four days'), ('4.5x', 'higher trigger rate in the highest-risk tenth')], 8.2),
		[('the whole system runs unattended.', 8.6, 11.6)])
	return v


def v_listening():
	v = V('listening-at-scale', 'D', 'Signal intelligence')
	r = rng(9)
	cols = ''
	for c in range(6):
		items = ''
		for k in range(14):
			hot = r.random() < 0.18
			w = r.choice([70, 80, 90, 100])
			items += f'<div class="bub{" hot" if hot else ""}"><i style="width:{w}%"></i><i style="width:{w - 30}%"></i></div>'
		cols += f'<div class="col" id="col{c}" style="left:{96 + c * 215}px">{items}{items}</div>'
		v.js.append(f'tl.fromTo("#col{c}", {{y:0}}, {{y:{-1120 if c % 2 else -980}, duration:8, ease:"none"}}, 0.2);')
	v.js.append('tl.fromTo(".bub.hot", {backgroundColor:"rgba(255,255,255,0.06)", borderColor:"rgba(255,255,255,0.1)"}, {backgroundColor:"rgba(212,180,131,0.22)", borderColor:"#d4b483", duration:0.6, ease:"power2.out", stagger:0.02}, 4.3);')
	side = ('<div class="panel" style="left:1440px;top:230px;width:384px;height:520px">'
		f'<b class="big" id="ds" style="font-size:96px">0</b><span class="pl">{v.label("demand signals extracted")}</span></div>')
	v.js.append(count_js('ds', '27,651', 4.4, 2.8))
	v.scene(0.2, 8.2, f'<div class="clip-area" style="left:96px;top:200px;width:1300px;height:600px">{cols}</div>' + side,
		[('I read 4.7 million community comments', 0.4, 4.1), ('and pulled out 27,651 demand signals', 4.3, 8.0)])
	bins = ''
	for i, lab in enumerate(['launch positioning', 'what it built first']):
		chips = ''.join(f'<i class="chipx" style="--d:{k}"></i>' for k in range(9))
		bins += f'<div class="bin" id="bin{i}" style="left:{180 + i * 800}px;top:260px"><span class="pl">{v.label(lab)}</span><div class="chips">{chips}</div></div>'
		v.js.append(f'tl.fromTo("#bin{i} .chipx", {{opacity:0, y:-40}}, {{opacity:1, y:0, duration:0.4, ease:"expo.out", stagger:0.08}}, {8.6 + i * 0.3});')
	v.scene(8.2, 11.8, bins, [("that shaped a fintech's launch positioning and what it built first.", 8.4, 11.6)])
	return v


def v_research():
	v = V('research-cascade', 'L', 'Research and enrichment agents', 'Outbound campaign')
	slots = ''
	order = rng(4).sample(range(29), 29)
	fill = {k: (0 if i < 12 else 1 if i < 21 else 2 if i < 26 else 3 if i < 28 else 4) for i, k in enumerate(order)}
	for k in range(29):
		slots += f'<i class="slot t{fill[k]}" style="left:{40 + (k % 6) * 92}px;top:{170 + (k // 6) * 62}px"></i>'
	card = (f'<div class="rec" style="left:96px;top:210px"><div class="rk"><span>{v.label("Name")}</span><em>known</em></div>'
		f'<div class="rk" style="top:96px"><span>{v.label("Website")}</span><em>known</em></div>{slots}'
		f'<span class="rc" id="rc">0 / 29</span></div>')
	v.words.append('known')
	tiers = ['The cheapest source', 'a waterfall of data providers', "an agent that reads the organization's own website", 'a research agent with live web search']
	rows = ''.join(f'<div class="tier" id="tr{i}" style="top:{220 + i * 132}px"><i>{i + 1}</i><b>{v.label(t)}</b></div>' for i, t in enumerate(tiers))
	counts = [12, 21, 26, 28]
	for i in range(4):
		at = 0.7 + i * 1.75
		v.js.append(f'tl.fromTo("#tr{i}", {{opacity:0.35, borderColor:"var(--nline)"}}, {{opacity:1, borderColor:"var(--lline)", duration:0.25, ease:"power2.out"}}, {at});')
		v.js.append(f'tl.fromTo(".slot.t{i}", {{backgroundColor:"rgba(0,0,0,0)", borderColor:"#cdd2db"}}, {{backgroundColor:"#d4b483", borderColor:"#d4b483", duration:0.2, stagger:0.04, ease:"power2.out"}}, {at + 0.3});')
		if i < 3:
			v.js.append(f'tl.to("#tr{i}", {{opacity:0.55, duration:0.3}}, {at + 1.5});')
		v.js.append(f'tl.set("#rc", {{textContent:"{counts[i]} / 29"}}, {at + 0.9});')
	v.js.append('tl.fromTo(".slot.t4", {borderColor:"#cdd2db"}, {borderColor:"#d4542f", duration:0.3}, 7.6);')
	blank = f'<span class="blank" id="bl" style="left:136px;top:722px">{v.label("leave a field blank")}</span>'
	v.js.append('tl.fromTo("#bl", {opacity:0, x:-10}, {opacity:1, x:0, duration:0.3, ease:"expo.out"}, 7.6);')
	v.scene(0.2, 9.0, card + f'<div style="position:absolute;left:820px;top:0;width:1000px;height:1080px">{rows}</div>' + blank,
		[('The cheapest source that can answer always goes first.', 0.4, 4.6), ('built to leave a field blank rather than invent an answer.', 4.8, 8.8)])
	v.scene(9.0, 11.8, counters(v, [('80,000+', 'leads per campaign'), ('29', 'data points researched per lead'), ('4', 'tiers, each used only when needed')], 9.0, 340), [])
	return v


def v_growth():
	v = V('growth-engine', 'G', 'Research and enrichment agents', 'Calendar marketing SaaS')
	n1 = {'a': ('finds brands that run events', 96, 380, 360, 110, 'n'), 'b': ('reads their websites|and social pages', 516, 380, 360, 110, 'n'),
		'c': ('builds each brand a ready-made|public calendar', 936, 380, 400, 110, 'n'), 'd': ('a person approves each event', 1396, 380, 400, 110, 'out')}
	v.scene(0.2, 4.4, flow(v, n1, [('a', 'b'), ('b', 'c'), ('c', 'd')], [['a'], ['b'], ['c'], ['d']], 0.2, 4.4),
		[('Brands found my client in their own analytics, then reached out.', 0.4, 4.2)])
	n2 = {'a': ('every new signup', 96, 380, 300, 110, 'n'), 'b': ('sets personal email|addresses aside', 456, 380, 340, 110, 'n'),
		'c': ("the company's industry", 856, 290, 380, 96, 'n'), 'd': ('the role and company size', 856, 470, 380, 96, 'n'),
		'e': ('evidence and a|confidence score', 1296, 380, 380, 110, 'out')}
	v.scene(4.4, 8.6, flow(v, n2, [('a', 'b'), ('b', 'c'), ('b', 'd'), ('c', 'e'), ('d', 'e')], [['a'], ['b'], ['c', 'd'], ['e']], 4.4, 8.6),
		[('The second engine reads every new signup the moment it lands.', 4.6, 8.4)])
	v.scene(8.6, 11.8, counters(v, [('9', 'production pipelines, one connected system'), ('14', 'industry groups classified on every signup'), ('20+', 'verified fields written back per signup')], 8.6, 300),
		[('started working a ranked pipeline.', 9.0, 11.6)])
	return v


def v_sellside():
	v = V('sell-side-buyers', 'D', 'Signal-triggered outbound', 'Investment bank, sell-side M&A')
	r = rng(11)
	clusters = ''
	waves = [1] * 5 + [2] * 6 + [3] * 5
	r.shuffle(waves)
	per = [33] * 16
	for k in range(530 - 33 * 16):
		per[k] += 1
	for c in range(16):
		cx, cy = 140 + (c % 8) * 205, 250 + (c // 8) * 250
		dots = ''
		for k in range(per[c]):
			fx, fy = (k % 6) * 22, (k // 6) * 22
			sx, sy = r.uniform(80, 1700) - (cx + fx), r.uniform(200, 760) - (cy + fy)
			dots += f'<i style="left:{fx}px;top:{fy}px;--sx:{sx:.0f};--sy:{sy:.0f}"></i>'
		clusters += f'<div class="cl w{waves[c]}" style="left:{cx}px;top:{cy}px"><span>{c + 1:02d}</span>{dots}</div>'
	v.js.append('tl.fromTo(".uni i", {opacity:0}, {opacity:1, duration:0.6, stagger:0.002, ease:"power2.out"}, 0.3);')
	v.js.append('tl.fromTo(".uni", {"--k":1}, {"--k":0, duration:1.6, ease:"power3.inOut"}, 4.4);')
	v.js.append('tl.fromTo(".uni .cl span", {opacity:0}, {opacity:1, duration:0.3, stagger:0.04}, 5.6);')
	for w in (1, 2, 3):
		v.js.append(f'tl.fromTo(".uni .w{w} i", {{backgroundColor:"rgba(255,255,255,0.35)"}}, {{backgroundColor:"{["#dcc196", "#d4b483", "#c8b28b"][w - 1]}", duration:0.4, ease:"power2.out"}}, {8.4 + (w - 1) * 0.8});')
	stat = lambda i, val, lab, at: (f'<div class="stat" id="st{i}" data-layout-allow-overlap style="top:56px;left:1180px"><b>{val}</b><span>{v.label(lab)}</span></div>',
		f'tl.fromTo("#st{i}", {{opacity:0, y:14}}, {{opacity:1, y:0, duration:0.35, ease:"expo.out"}}, {at});tl.to("#st{i}", {{opacity:0, duration:0.2}}, {at + 3.6});')
	stats = [stat(0, '530', 'potential acquirers mapped', 0.6), stat(1, '16', 'buyer categories', 4.6), stat(2, '3', 'prioritized outreach waves', 8.4)]
	for _, j in stats:
		v.js.append(j)
	v.scene(0.2, 11.8, f'<div class="uni">{clusters}</div>' + ''.join(h for h, _ in stats),
		[('A 530-acquirer universe, delivered the day of the brief.', 0.4, 4.2), ('across 16 categories, ranked into three outreach waves', 4.5, 8.2), ('with the exact roles to contact at each one', 8.5, 11.6)])
	return v


def v_who_buys():
	v = V('who-actually-buys', 'L', 'Signal-triggered outbound', 'Event venue client')
	r = rng(5)
	booked = set(r.sample(range(344), 106))
	sq = ''.join(f'<i class="{"bk" if k in booked else ""}" style="left:{(k % 29) * 34}px;top:{(k // 29) * 34}px"></i>' for k in range(344))
	v.js.append('tl.fromTo(".inq i", {opacity:0, scale:0.4}, {opacity:1, scale:1, duration:0.3, stagger:0.004, ease:"expo.out"}, 0.4);')
	v.js.append('tl.fromTo(".inq i.bk", {backgroundColor:"#d8dce4"}, {backgroundColor:"#1e3a5f", duration:0.3, stagger:0.006, ease:"power2.out"}, 2.4);')
	legend = (f'<div class="leg" style="left:1150px;top:250px"><b id="q1">344</b><span>{v.label("Venue inquiries")}</span></div>'
		f'<div class="leg g" style="left:1150px;top:470px"><b id="q2">106</b><span>{v.label("booked events behind the ICP")}</span></div>')
	v.js.append(count_js('q1', '344', 0.5, 1.6))
	v.js.append(count_js('q2', '106', 2.4, 1.4))
	v.scene(0.2, 5.4, f'<div class="inq" style="left:96px;top:250px">{sq}</div>' + legend,
		[("I rebuilt an event venue's ideal customer profile", 0.4, 5.2)])
	bars = (f'<div class="bar" style="top:300px"><span class="bl">{v.label("Its most lucrative format")}</span><div class="tr"><i id="b1" style="width:19%"></i></div><b>{v.label("less than 1 in 5")}</b></div>'
		f'<div class="bar" style="top:500px"><span class="bl">{v.label("happy hours")}</span><div class="tr"><i id="b2" style="width:33%"></i><i class="rg" id="b3" style="left:33%;width:11%"></i></div><b>{v.label("33 to 44%")}</b></div>')
	v.js.append('tl.fromTo("#b1, #b2", {scaleX:0}, {scaleX:1, duration:0.9, ease:"expo.out", stagger:0.3, transformOrigin:"0 50%"}, 5.9);')
	v.js.append('tl.fromTo("#b3", {opacity:0}, {opacity:1, duration:0.4}, 7.0);')
	v.scene(5.4, 11.8, bars, [('so outreach now leads with the easy yes.', 7.4, 11.6)])
	return v


def v_social():
	v = V('social-selling', 'G', 'Signal-triggered outbound')
	cards = (f'<div class="sc3" id="p1" style="left:96px"><span class="eyb">{v.label("Profile research")}</span><i class="av"></i><i class="ln" style="width:70%"></i><i class="ln" style="width:52%"></i><i class="ln" style="width:62%"></i></div>'
		f'<div class="sc3" id="p2" style="left:676px"><span class="eyb">{v.label("engagement scoring")}</span><div class="meter"><i id="mt"></i></div><i class="ln" style="width:44%"></i></div>'
		f'<div class="sc3" id="p3" style="left:1256px"><span class="eyb">{v.label("drafted outreach")}</span>' + ''.join(f'<i class="ln ty" style="width:{w}%"></i>' for w in (88, 74, 81, 40)) + '</div>')
	v.js.append('tl.fromTo("#p1, #p2, #p3", {opacity:0, y:30}, {opacity:1, y:0, duration:0.5, ease:"expo.out", stagger:1.2}, 0.5);')
	v.js.append('tl.fromTo("#mt", {scaleX:0}, {scaleX:0.82, duration:1, ease:"power2.out", transformOrigin:"0 50%"}, 1.9);')
	v.js.append('tl.fromTo("#p3 .ty", {scaleX:0}, {scaleX:1, duration:0.4, stagger:0.25, ease:"none", transformOrigin:"0 50%"}, 3.2);')
	v.scene(0.2, 6.4, cards, [('Profile research, engagement scoring and drafted outreach on LinkedIn', 0.4, 6.2)])
	gate = (f'<div class="draft" id="dr">' + ''.join(f'<i class="ln" style="width:{w}%"></i>' for w in (88, 74, 81, 40)) + '</div>'
		f'<div class="gate" id="gt"><i class="av"></i><b>{v.label("a person approves it")}</b><span class="ok" id="ok">&check;</span></div>')
	v.js.append('tl.fromTo("#dr", {x:-220, opacity:0}, {x:0, opacity:1, duration:0.7, ease:"expo.out"}, 6.6);')
	v.js.append('tl.fromTo("#gt", {opacity:0}, {opacity:1, duration:0.4}, 6.9);')
	v.js.append('tl.fromTo("#ok", {scale:0}, {scale:1, duration:0.4, ease:"expo.out"}, 8.6);')
	v.js.append('tl.fromTo("#dr", {borderColor:"rgba(255,255,255,0.28)"}, {borderColor:"#ffffff", duration:0.3}, 8.6);')
	v.scene(6.4, 11.8, gate, [('with nothing sent until a person approves it.', 6.8, 11.6)])
	return v


def v_instant():
	v = V('instant-quotes', 'L', 'Inbound conversion', 'Home-service brands')
	phone = ('<div class="phone" style="left:300px;top:150px"><div class="scr"><div class="pic"><i class="sun"></i><i class="trunk"></i><i class="crown c1"></i><i class="crown c2"></i><i class="crown c3"></i><i class="ground"></i></div>'
		'<div class="up"><i id="upb"></i></div></div></div>')
	v.js.append('tl.fromTo(".pic", {opacity:0, y:40}, {opacity:1, y:0, duration:0.6, ease:"expo.out"}, 0.5);')
	v.js.append('tl.fromTo("#upb", {scaleX:0}, {scaleX:1, duration:1.6, ease:"power2.inOut", transformOrigin:"0 50%"}, 1.2);')
	quote = (f'<div class="quote" id="qt" style="left:900px;top:300px"><span class="eyb">{v.label("a branded quote")}</span><i class="ln" style="width:80%"></i><i class="ln" style="width:58%"></i>'
		f'<div class="via"><span>{v.label("email")}</span><span>{v.label("text")}</span></div></div>'
		f'<div class="timer" style="left:900px;top:620px"><b id="tm">0 sec</b></div>')
	v.js.append('(function(){const o={v:0}, el=document.getElementById("tm"); tl.fromTo(o, {v:0}, {v:45, duration:3.2, ease:"none", onUpdate:()=>{el.textContent="~"+Math.round(o.v)+" sec";}}, 2.8);})();')
	v.js.append('tl.fromTo("#qt", {opacity:0, x:40}, {opacity:1, x:0, duration:0.6, ease:"expo.out"}, 6.0);')
	v.scene(0.2, 7.6, phone + quote, [('A homeowner uploads a picture on the website', 0.4, 3.6), ('and gets a branded quote by email and text in about 45 seconds', 3.8, 7.4)])
	v.scene(7.6, 11.8, counters(v, [('~45 sec', 'from photo to priced quote'), ('8', 'brands on one estimator'), ('2', 'channels: web and phone')], 7.6, 300),
		[('The first company to give a price usually wins the job.', 8.0, 11.6)])
	return v


def v_speed_quote():
	v = V('speed-to-quote', 'D', 'Inbound conversion')
	nodes = {'in': ('Email or|web form', 96, 330, 230, 110, 'n'), 'ai': ('AI classify|and route', 396, 330, 250, 110, 'ai', '8 paths'),
		'dw': ('Draft|writer', 716, 330, 210, 110, 'ai'), 'cp': ('AI compliance|pass', 996, 330, 250, 110, 'ai'),
		'gt': ('Deterministic|gate', 1316, 330, 240, 110, 'gate'), 'ok': ('Draft in|mailbox', 1626, 200, 210, 128, 'out', 'clears'),
		'hu': ('Human|escalation', 1626, 450, 210, 128, 'n', 'held'), 'rd': ('Living|rules doc', 560, 570, 230, 100, 'db')}
	edges = [('in', 'ai'), ('ai', 'dw'), ('dw', 'cp'), ('cp', 'gt'), ('gt', 'ok'), ('gt', 'hu'),
		('rd', 'ai', {'dashed': True, 'pts': [(600, 570), (600, 440)]}), ('rd', 'cp', {'dashed': True, 'pts': [(790, 620), (1100, 620), (1100, 440)]})]
	v.scene(0.2, 7.4, flow(v, nodes, edges, [['in'], ['rd', 'ai'], ['dw'], ['cp'], ['gt'], ['ok', 'hu']], 0.2, 7.4),
		[('every email and web form is classified', 0.4, 3.6), ('and turned into a drafted quote', 3.8, 7.2)])
	card = (f'<div class="qcard" style="left:220px;top:250px"><span class="eyb">{v.label("Draft")}</span><i class="ln" style="width:78%"></i><i class="ln" style="width:60%"></i>'
		'<div class="amt" id="amt"><i class="ln" style="width:40%"></i><em id="flag">!</em></div></div>'
		f'<div class="nd k-gate" id="g2" style="left:860px;top:380px;width:280px;height:110px"><b>{v.label("Deterministic")}</b><b>{v.label("gate")}</b></div>'
		f'<div class="nd" id="h2" style="left:1300px;top:380px;width:320px;height:110px"><b>{v.label("Human escalation")}</b></div>'
		f'<span class="elab" style="left:1180px;top:350px">{v.label("held")}</span>'
		'<svg class="edges" viewBox="0 0 1920 1080" width="1920" height="1080"><path d="M740 435 L860 435" class="eb"/><path d="M1140 435 L1300 435" class="eb"/></svg>')
	v.js.append('tl.fromTo("#amt", {borderColor:"rgba(255,255,255,0.16)"}, {borderColor:"#d4542f", duration:0.3}, 8.2);')
	v.js.append('tl.fromTo("#flag", {scale:0}, {scale:1, duration:0.35, ease:"expo.out"}, 8.2);')
	v.js.append('tl.fromTo("#g2", {borderColor:"rgba(255,255,255,0.16)"}, {borderColor:"#d4542f", duration:0.3}, 8.8);')
	v.js.append('tl.fromTo("#h2", {borderColor:"rgba(255,255,255,0.16)"}, {borderColor:"#d4b483", duration:0.3}, 9.4);')
	v.scene(7.4, 11.8, card, [('a hard check that stops a wrong number before it ever reaches a customer.', 7.6, 11.6)])
	return v


def v_voice():
	v = V('voice-agents', 'G', 'Inbound conversion', 'Multiple independent client deployments')
	nodes = {'c': ('Inbound|call', 96, 380, 200, 110, 'n'), 'v': ('Voice agent|classifies need', 356, 380, 280, 110, 'ai'),
		'q': ('Qualification|checks', 696, 380, 260, 110, 'n'), 'p': ('Politely|closed', 1040, 170, 220, 128, 'n', 'no fit'),
		'h': ('Warm|transfer', 1040, 371, 220, 128, 'n', 'human'), 's': ('SMS asks|for a photo', 1040, 590, 220, 128, 'n', 'pricable'),
		'e': ('Vision pricing|engine', 1320, 590, 240, 128, 'ai'), 't': ('Estimate|by text', 1620, 590, 200, 128, 'out')}
	edges = [('c', 'v'), ('v', 'q'), ('q', 'p'), ('q', 'h'), ('q', 's'), ('s', 'e'), ('e', 't')]
	v.scene(0.2, 8.2, flow(v, nodes, edges, [['c'], ['v'], ['q'], ['p', 'h'], ['s'], ['e'], ['t']], 0.2, 8.2),
		[("they answer, classify the caller's need, qualify it,", 0.4, 4.1), ('and either transfer to the right human or close the loop by text.', 4.3, 8.0)])
	sms = ('<div class="phone sm" style="left:760px;top:170px"><div class="scr dark"><div class="bub in" id="m1"><i class="ln" style="width:70%"></i><i class="ln" style="width:44%"></i></div>'
		'<div class="bub out" id="m2"><i class="ln" style="width:56%"></i></div><div class="bub in" id="m3"><i class="ln" style="width:80%"></i><i class="ln" style="width:62%"></i></div></div></div>')
	v.js.append('tl.fromTo("#m1, #m2, #m3", {opacity:0, y:20}, {opacity:1, y:0, duration:0.4, ease:"expo.out", stagger:0.7}, 8.6);')
	v.scene(8.2, 11.8, sms, [('a caller receives a ballpark estimate by SMS minutes after hanging up.', 8.4, 11.6)])
	return v


def v_broadband():
	v = V('uk-broadband', 'D', 'Retention and expansion', 'UK broadband provider')
	lanes = ''.join(f'<div class="lane" id="ln{i}" style="top:{210 + i * 82}px"><span>{i + 1:02d}</span></div>' for i in range(7))
	router = (f'<div class="chat" style="left:96px;top:330px"><i class="ln" style="width:70%"></i><i class="ln" style="width:48%"></i></div>'
		f'<div class="agent" style="left:500px;top:300px"><b>{v.label("The AI agent")}</b><span>{v.label("the customer’s account".replace("’", "'"))}</span><span>{v.label("any live outages")}</span></div>'
		f'<div style="position:absolute;left:1080px;top:0">{lanes}</div>'
		'<svg class="edges" viewBox="0 0 1920 1080" width="1920" height="1080"><path d="M400 400 L500 400" class="eb"/>'
		+ ''.join(f'<path d="M900 400 L990 400 L990 {250 + i * 82} L1080 {250 + i * 82}" class="eb"/>' for i in range(7)) + '<path id="hot" d="M900 400 L990 400 L990 496 L1080 496" class="el" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>')
	v.js.append('tl.fromTo(".agent span", {opacity:0.3}, {opacity:1, duration:0.3, stagger:0.5}, 1.0);')
	v.js.append('tl.fromTo("#hot", {attr:{"stroke-dashoffset":1}}, {attr:{"stroke-dashoffset":0}, duration:0.5, ease:"power2.inOut"}, 2.4);')
	v.js.append('tl.fromTo("#ln3", {borderColor:"rgba(255,255,255,0.16)", backgroundColor:"rgba(255,255,255,0.05)"}, {borderColor:"#d4b483", backgroundColor:"rgba(212,180,131,0.2)", duration:0.3}, 2.9);')
	v.scene(0.2, 4.4, router, [('routes the issue to the right one of seven departments', 0.4, 4.2)])
	n2 = {'a': ('a customer asks|to switch away', 96, 380, 300, 110, 'n'), 'b': ('checks consent', 456, 380, 260, 110, 'n'),
		'c': ('a personalized offer', 776, 380, 300, 110, 'ai'), 'd': ('reaches the customer|on WhatsApp', 1136, 380, 320, 110, 'n'), 'e': ('the retention team', 1516, 380, 300, 110, 'out')}
	v.scene(4.4, 8.4, flow(v, n2, [('a', 'b'), ('b', 'c'), ('c', 'd'), ('d', 'e')], [['a'], ['b'], ['c'], ['d'], ['e']], 4.4, 8.4),
		[('the company knows why its customers leave.', 4.6, 8.2)])
	v.scene(8.4, 11.8, counters(v, [('8,700+', 'tickets handled by AI'), ('79,000+', 'agent minutes saved (estimated)'), ('731', 'new prospects captured'), ('~£110k', 'annual pipeline created')], 8.4, 320), [])
	return v


def v_household():
	v = V('household-investing', 'D', 'Product and platform engineering', 'Founding engineer')
	nodes = {'ci': ('CI gates|on every|change', 96, 300, 200, 150, 'gate'), 'ia': ('Investing|app', 420, 250, 220, 100, 'n'),
		'ca': ('Content|app', 420, 470, 220, 100, 'n'), 'pr': ('PRIVATE DB', 820, 250, 250, 110, 'db', 'money + auth'),
		'pu': ('PUBLIC DB', 820, 560, 250, 110, 'db', 'no PII'), 'ag': ('Tool-using|AI agent', 1200, 255, 240, 100, 'ai'),
		'ev': ('Ask, with|evidence', 1550, 255, 230, 100, 'out')}
	edges = [('ci', 'ia', {'pts': [(296, 375), (360, 375), (360, 300), (420, 300)]}), ('ia', 'pr'), ('ca', 'pu', {'pts': [(640, 520), (730, 520), (730, 615), (820, 615)]}),
		('ca', 'pr', {'blocked': True, 'label': 'blocked by lint rule', 'pts': [(640, 500), (760, 500), (760, 340), (820, 340)]}), ('pr', 'ag'), ('ag', 'ev')]
	v.scene(0.2, 7.4, flow(v, nodes, edges, [['ci'], ['ia', 'ca'], ['pr', 'pu'], ['ag'], ['ev']], 0.2, 7.4, groups=[('Monorepo', 380, 200, 300, 420)]),
		[('a confidentiality boundary enforced by the build itself.', 0.4, 3.7), ('so a privacy mistake fails the build instead of reaching production', 3.9, 7.2)])
	ans = (f'<div class="qcard" style="left:240px;top:240px;width:640px"><span class="eyb">{v.label("Ask, with evidence")}</span><i class="ln" style="width:72%"></i><i class="ln" style="width:50%"></i></div>'
		'<div class="qcard ans" id="an" style="left:960px;top:300px;width:720px"><i class="ln" style="width:86%"></i><i class="ln" style="width:70%"></i><div class="ev"><i></i><i></i><i></i></div></div>')
	v.js.append('tl.fromTo("#an", {opacity:0, y:30}, {opacity:1, y:0, duration:0.5, ease:"expo.out"}, 8.0);')
	v.js.append('tl.fromTo("#an .ev i", {opacity:0, scale:0.6}, {opacity:1, scale:1, duration:0.3, stagger:0.15, ease:"expo.out"}, 8.6);')
	v.scene(7.4, 11.8, ans, [("A live tool-using agent that answers questions against a customer's real financial data", 7.6, 11.6)])
	return v


def v_marketplace():
	v = V('marketplace-app', 'L', 'Product and platform engineering', 'Live on both stores')
	nodes = {'cp': ('Compliance|pass', 96, 470, 220, 100, 'gate'), 'wc': ('Web|codebase', 420, 250, 220, 100, 'n'),
		'ns': ('Native|shell', 700, 400, 220, 100, 'n'), 'sb': ('Signed|bundle', 1010, 250, 220, 100, 'n'),
		'gp': ('Google Play', 1320, 255, 230, 90, 'out'), 'ci': ('Cloud macOS|CI build', 1010, 520, 220, 100, 'n'),
		'au': ('Auto signing|+ upload', 1290, 520, 230, 100, 'n'), 'as': ('App Store|1st-pass pass', 1580, 520, 240, 100, 'out')}
	edges = [('cp', 'ns', {'pts': [(316, 520), (660, 520), (660, 470), (700, 470)]}), ('wc', 'ns', {'pts': [(640, 300), (670, 300), (670, 430), (700, 430)]}),
		('ns', 'sb'), ('sb', 'gp'), ('ns', 'ci'), ('ci', 'au'), ('au', 'as')]
	v.scene(0.2, 7.6, flow(v, nodes, edges, [['wc', 'cp'], ['ns'], ['sb', 'ci'], ['gp', 'au'], ['as']], 0.2, 7.6, groups=[('Windows box, no Mac', 380, 200, 580, 340)]),
		[('working solo from a Windows machine with no Mac hardware anywhere in the pipeline.', 0.4, 5.2), ('published it to both app stores', 5.4, 7.4)])
	phones = ''.join(f'<div class="phone mini" id="ph{i}" style="left:{560 + i * 470}px;top:200px"><div class="scr"><i class="tg"></i><i class="ln" style="width:70%"></i><i class="ln" style="width:52%"></i><i class="ln" style="width:64%"></i></div><span class="ok">&check;</span></div>' for i in range(2))
	v.js.append('tl.fromTo("#ph0, #ph1", {opacity:0, y:40}, {opacity:1, y:0, duration:0.6, ease:"expo.out", stagger:0.25}, 7.9);')
	v.js.append('tl.fromTo(".phone.mini .ok", {scale:0}, {scale:1, duration:0.35, ease:"expo.out", stagger:0.25}, 8.8);')
	v.scene(7.6, 11.8, phones, [('Approved by Apple on the first submission', 7.9, 11.6)])
	return v


def v_grc():
	v = V('compliance-ai-platform', 'D', 'Product and platform engineering', 'Bilingual EN/AR')
	nodes = {'q': ('Question', 96, 380, 200, 100, 'n'), 'p': ('Query|planner', 356, 380, 210, 100, 'ai'),
		'd': ('Dense|vector', 640, 260, 210, 100, 'n'), 'l': ('Lexical|keyword', 640, 500, 210, 100, 'n'),
		'c': ('Chunked|corpus', 925, 640, 210, 100, 'db'), 'f': ('Tenant and|role filter', 925, 380, 230, 100, 'gate'),
		'r': ('Cross-encoder|rerank', 1230, 380, 240, 100, 'ai'), 'a': ('Grounded answer|with citations', 1540, 380, 280, 100, 'out')}
	edges = [('q', 'p'), ('p', 'd'), ('p', 'l'), ('d', 'f'), ('l', 'f'), ('c', 'f', {'dashed': True, 'down': False, 'pts': [(1040, 640), (1040, 480)]}), ('f', 'r'), ('r', 'a')]
	v.scene(0.2, 7.6, flow(v, nodes, edges, [['q'], ['p'], ['d', 'l'], ['c', 'f'], ['r'], ['a']], 0.2, 7.6),
		[('Filtering by permission before reranking rather than after', 0.4, 3.9), ('where a wrong answer is not an inconvenience but a compliance exposure.', 4.1, 7.4)])
	r = rng(2)
	tiles = ''
	scores = [r.uniform(0.35, 0.8) for _ in range(16)]
	scores[9] = 0.92
	for k in range(16):
		bad = k == 9
		tiles += f'<div class="mt{" bad" if bad else ""}" style="left:{96 + (k % 8) * 216}px;top:{230 + (k // 8) * 250}px"><span>{k + 1:02d}</span><div class="sbar"><i style="width:{scores[k] * 100:.0f}%"></i></div></div>'
	flag = f'<span class="badchip" id="bc" style="left:{96 + 1 * 216}px;top:{230 + 250 + 190}px">{v.label("the most dangerous on hallucination")}</span>'
	v.js.append('tl.fromTo(".mt", {opacity:0, y:20}, {opacity:1, y:0, duration:0.35, stagger:0.04, ease:"expo.out"}, 7.8);')
	v.js.append('tl.fromTo(".mt .sbar i", {scaleX:0}, {scaleX:1, duration:0.6, stagger:0.03, ease:"expo.out", transformOrigin:"0 50%"}, 8.3);')
	v.js.append('tl.fromTo(".mt.bad", {borderColor:"rgba(255,255,255,0.16)"}, {borderColor:"#d4542f", duration:0.3}, 9.6);')
	v.js.append('tl.fromTo("#bc", {opacity:0, y:10}, {opacity:1, y:0, duration:0.3, ease:"expo.out"}, 9.7);')
	v.scene(7.6, 11.8, tiles + flag, [('Benchmarked 16 candidate local models', 7.9, 11.6)])
	return v


def v_tooling():
	v = V('compliance-tooling', 'L', 'Product and platform engineering', 'Regulated nonprofit')
	nodes = {'a': ('Purpose-built|CLI', 96, 380, 220, 100, 'n'), 'b': ('OAuth2|PKCE flow', 376, 380, 220, 100, 'gate'),
		'c': ('Management|API', 656, 380, 220, 100, 'n'), 'd': ('Pull flow|as JSON', 936, 230, 220, 100, 'n'),
		'e': ('Edit and|review in git', 1216, 230, 240, 100, 'out'), 'f': ('Push back', 1516, 240, 200, 80, 'n'),
		'g': ('Live|automation', 936, 560, 220, 100, 'db')}
	edges = [('a', 'b'), ('b', 'c'), ('c', 'd'), ('d', 'e'), ('e', 'f'), ('c', 'g', {'pts': [(876, 430), (906, 430), (906, 610), (936, 610)]})]
	v.scene(0.2, 7.6, flow(v, nodes, edges, [['a'], ['b'], ['c', 'g'], ['d'], ['e'], ['f']], 0.2, 7.6),
		[('turning a GUI-only platform into reviewable code', 0.4, 3.9), ('The point of the tool is the review step in the middle', 4.1, 7.4)])
	roles = ''.join(f'<div class="role" id="ro{i}" style="left:{200 + i * 220}px;top:560px"><i class="av"></i><span class="lk">&#128274;</span></div>' for i in range(7))
	app = ('<div class="win" style="left:560px;top:190px"><i class="bar3"></i><i class="ln" style="width:60%"></i><i class="ln" style="width:80%"></i><i class="ln" style="width:44%"></i></div>'
		'<svg class="edges" id="rl" viewBox="0 0 1920 1080" width="1920" height="1080">' + ''.join(f'<path d="M{260 + i * 220} 560 L{960} 440" class="eb"/>' for i in range(7)) + '</svg>')
	v.js.append('tl.fromTo("#rl", {opacity:0}, {opacity:1, duration:0.5, ease:"power2.out"}, 8.4);')
	v.js.append('tl.fromTo(".role", {opacity:0, y:20}, {opacity:1, y:0, duration:0.35, stagger:0.1, ease:"expo.out"}, 7.9);')
	v.scene(7.6, 11.8, app + roles, [('role-based access control across seven distinct staff roles', 7.9, 11.6)])
	return v


VIDEOS = [v_signal_engine, v_listening, v_research, v_growth, v_sellside, v_who_buys, v_social, v_instant, v_speed_quote, v_voice, v_broadband, v_household, v_marketplace, v_grc, v_tooling]

CSS = r'''
@font-face { font-family: "Geist"; font-weight: 100 900; src: url("assets/fonts/geist.woff2") format("woff2"); }
@font-face { font-family: "Geist Mono"; font-weight: 100 900; src: url("assets/fonts/geist-mono.woff2") format("woff2"); }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1920px; height: 1080px; overflow: hidden; background: var(--bg); }
#root { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Geist", sans-serif; color: var(--ink); }
#ground { position: absolute; inset: 0; background: var(--bg); }
#tex { position: absolute; inset: 0; background: var(--tex) 0 0 / 360px 240px; opacity: .9; }
.hdr { position: absolute; left: 96px; top: 72px; display: flex; align-items: center; gap: 18px; z-index: 5; }
.badge { padding: 12px 22px; border-radius: 999px; background: var(--bbg); color: var(--bink); font: 600 26px "Geist Mono", monospace; letter-spacing: .04em; text-transform: uppercase; }
.client { font: 500 26px "Geist Mono", monospace; letter-spacing: .04em; color: var(--mute); text-transform: uppercase; }
.sc { position: absolute; inset: 0; opacity: 0; }
.cap { position: absolute; left: 96px; top: 850px; width: 1700px; font: 700 62px/1.1 "Geist", sans-serif; letter-spacing: -.025em; color: var(--ink); }
.cap .w { display: inline-block; }
.edges { position: absolute; left: 0; top: 0; overflow: visible; }
.eb { fill: none; stroke: var(--edge); stroke-width: 3; }
.el { fill: none; stroke: var(--elit); stroke-width: 3.5; }
.nd { position: absolute; display: flex; flex-direction: column; justify-content: center; padding: 0 18px; border-radius: 16px; background: var(--nbg); border: 2.5px solid var(--nline); }
.nd b { display: block; font-size: 30px; line-height: 1.15; font-weight: 600; letter-spacing: -.01em; }
.nd small { display: block; margin-top: 6px; font: 500 22px "Geist Mono", monospace; color: var(--mute); }
.nd.k-ai { border-style: dashed; }
.nd.k-gate { background: var(--ink); color: var(--bg); }
.nd.k-gate small { color: var(--bg); opacity: .7; }
.nd.k-db { border-radius: 26px / 50%; }
.nd.k-out { --outbg: var(--lbg); }
.grp { position: absolute; border: 2px dashed var(--nline); border-radius: 22px; }
.grp span { position: absolute; left: 18px; top: -17px; padding: 0 10px; background: var(--bg); font: 500 22px "Geist Mono", monospace; color: var(--mute); }
.elab { position: absolute; font: 500 22px "Geist Mono", monospace; color: var(--mute); white-space: nowrap; }
.x { position: absolute; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: #d4542f; color: #fff; font-size: 26px; line-height: 1; }
.cnt { position: absolute; }
.cnt b { display: block; line-height: .95; letter-spacing: -.05em; font-weight: 700; color: var(--num); font-variant-numeric: tabular-nums; white-space: nowrap; }
.cnt span { display: block; margin-top: 18px; font-size: 32px; line-height: 1.3; font-weight: 500; color: var(--ink); max-width: 15em; }
.panel { position: absolute; padding: 36px; border-radius: 22px; background: var(--card); border: 2px solid var(--nline); display: flex; flex-direction: column; justify-content: flex-end; }
.eyb { display: block; font: 500 24px "Geist Mono", monospace; letter-spacing: .06em; text-transform: uppercase; color: var(--num); }
.big { display: block; margin-top: 14px; font-size: 104px; line-height: 1; letter-spacing: -.05em; font-weight: 700; color: var(--num); font-variant-numeric: tabular-nums; }
.pl { display: block; margin-top: 14px; font-size: 28px; font-weight: 600; line-height: 1.25; }
.ln { display: block; height: 14px; margin-top: 16px; border-radius: 7px; background: var(--soft); }
/* listings */
.lc { position: absolute; width: 270px; height: 160px; border-radius: 16px; background: var(--card); border: 2px solid var(--nline); }
.lc i { position: absolute; display: block; border-radius: 6px; }
.lc .th { left: 20px; top: 20px; width: 48px; height: 48px; border-radius: 12px; background: #ede6d8; }
.lc .nm { left: 82px; top: 24px; width: 140px; height: 14px; background: #cbd0d9; }
.lc .sb { left: 82px; top: 48px; width: 96px; height: 12px; background: #e4e7ec; }
.lc .st { position: absolute; left: 20px; top: 92px; font-size: 24px; color: #e8b23a; letter-spacing: 2px; }
.lc .dot { right: 16px; top: 16px; width: 18px; height: 18px; border-radius: 50%; background: #d4b483; }
.scan { position: absolute; left: 80px; top: 200px; width: 4px; height: 600px; background: var(--elit); box-shadow: -60px 0 60px -10px rgba(30,58,95,.18); }
/* listening */
.clip-area { position: absolute; overflow: hidden; -webkit-mask-image: linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent); mask-image: linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent); }
.col { position: absolute; top: 0; width: 195px; }
.bub { height: 66px; margin-bottom: 14px; padding: 12px 14px; border-radius: 14px; background: rgba(255,255,255,0.06); border: 2px solid rgba(255,255,255,0.1); }
.bub i { display: block; height: 10px; border-radius: 5px; background: rgba(255,255,255,0.2); } .bub i + i { margin-top: 10px; }
.bin { position: absolute; width: 760px; height: 420px; padding: 36px; border-radius: 24px; background: rgba(255,255,255,0.05); border: 2px solid rgba(212,180,131,0.5); }
.bin .pl { margin: 0; font-size: 34px; }
.chips { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 14px; }
.chipx { display: block; width: 200px; height: 52px; border-radius: 12px; background: rgba(212,180,131,0.22); border: 2px solid #d4b483; }
/* research */
.rec { position: absolute; width: 640px; height: 560px; border-radius: 22px; background: #fff; border: 2px solid var(--nline); }
.rk { position: absolute; left: 40px; top: 40px; width: 560px; height: 44px; display: flex; justify-content: space-between; align-items: center; padding: 0 18px; border-radius: 10px; background: #0e1726; color: #fff; font-size: 22px; font-weight: 600; }
.rk em { font: 500 18px "Geist Mono", monospace; font-style: normal; color: #dcc196; }
.slot { position: absolute; width: 80px; height: 48px; border-radius: 9px; border: 2.5px solid #cdd2db; }
.slot.t4 { border-style: dashed; }
.rc { position: absolute; right: 40px; bottom: 26px; font: 600 26px "Geist Mono", monospace; color: var(--num); }
.tier { position: absolute; left: 0; width: 1000px; height: 104px; display: flex; align-items: center; gap: 22px; padding: 0 26px; border-radius: 16px; background: #fff; border: 2.5px solid var(--nline); }
.tier i { width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; background: #f2ede3; color: #1e3a5f; font: 600 22px "Geist Mono", monospace; font-style: normal; flex: none; }
.tier b { font-size: 27px; font-weight: 600; }
.blank { position: absolute; font: 600 26px "Geist Mono", monospace; color: #d4542f; }
/* sell-side */
.uni { position: absolute; inset: 0; --k: 1; }
.cl { position: absolute; width: 140px; height: 130px; }
.cl span { position: absolute; left: 0; top: -36px; font: 500 18px "Geist Mono", monospace; color: var(--mute); }
.cl i { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,0.35); translate: calc(var(--sx) * var(--k) * 1px) calc(var(--sy) * var(--k) * 1px); }
.stat { position: absolute; display: flex; align-items: baseline; gap: 16px; opacity: 0; }
.stat b { font-size: 72px; letter-spacing: -.04em; color: var(--num); }
.stat span { font-size: 26px; font-weight: 500; }
/* who buys */
.inq { position: absolute; width: 990px; height: 420px; }
.inq i { position: absolute; width: 26px; height: 26px; border-radius: 6px; background: #d8dce4; }
.leg { position: absolute; }
.leg b { display: block; font-size: 120px; line-height: 1; letter-spacing: -.05em; color: #5b6475; }
.leg.g b { color: #1e3a5f; }
.leg span { display: block; margin-top: 10px; font-size: 27px; font-weight: 500; max-width: 15em; }
.bar { position: absolute; left: 96px; width: 1728px; display: grid; grid-template-columns: 440px 1fr 380px; gap: 30px; align-items: center; }
.bar .bl { font-size: 32px; font-weight: 600; }
.bar .tr { position: relative; height: 64px; border-radius: 14px; background: #e4e7ec; overflow: hidden; }
.bar .tr i { position: absolute; left: 0; top: 0; bottom: 0; background: #1e3a5f; border-radius: 14px; }
.bar .tr i.rg { background: repeating-linear-gradient(135deg, #d4b483 0 12px, #c8b28b 12px 24px); border-radius: 0 14px 14px 0; }
.bar b { font-size: 44px; white-space: nowrap; letter-spacing: -.03em; color: #1e3a5f; }
/* social */
.sc3 { position: absolute; top: 230px; width: 560px; height: 520px; padding: 40px; border-radius: 24px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.28); }
.sc3 .ln, .draft .ln, .qcard .ln, .win .ln, .phone .ln { background: rgba(255,255,255,0.3); }
.av { display: block; width: 96px; height: 96px; margin: 26px 0 10px; border-radius: 50%; background: rgba(255,255,255,0.35); }
.meter { margin-top: 34px; height: 40px; border-radius: 20px; background: rgba(255,255,255,0.15); overflow: hidden; }
.meter i { display: block; height: 100%; background: #fff; border-radius: 20px; }
.draft { position: absolute; left: 300px; top: 300px; width: 640px; height: 340px; padding: 44px; border-radius: 24px; background: rgba(255,255,255,0.1); border: 3px solid rgba(255,255,255,0.28); }
.gate { position: absolute; left: 1100px; top: 300px; width: 520px; height: 340px; padding: 40px; border-radius: 24px; background: #0e1726; color: #fff; }
.gate .av { margin-top: 0; }
.gate b { display: block; margin-top: 20px; font-size: 34px; }
.ok { position: absolute; right: 30px; top: 30px; width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: #d4b483; color: #0e1726; font-size: 38px; font-weight: 700; }
/* instant quotes */
.phone { position: absolute; width: 420px; height: 680px; padding: 16px; border-radius: 52px; background: #0e1726; }
.scr { position: relative; width: 100%; height: 100%; border-radius: 38px; background: #f4f1eb; overflow: hidden; }
.scr.dark { background: #1a3354; padding: 60px 26px; }
.pic { position: absolute; left: 24px; right: 24px; top: 70px; height: 380px; border-radius: 22px; background: linear-gradient(#cfe8f5, #eaf5fb); overflow: hidden; }
.pic i { position: absolute; display: block; }
.pic .sun { right: 40px; top: 30px; width: 60px; height: 60px; border-radius: 50%; background: #f6d77a; }
.pic .trunk { left: 170px; top: 210px; width: 30px; height: 140px; background: #7a5434; border-radius: 6px; }
.pic .crown { border-radius: 50%; background: #2f8a55; }
.pic .c1 { left: 100px; top: 90px; width: 170px; height: 150px; } .pic .c2 { left: 70px; top: 150px; width: 130px; height: 110px; background: #27794a; } .pic .c3 { left: 180px; top: 140px; width: 130px; height: 120px; background: #3a9a62; }
.pic .ground { left: 0; right: 0; bottom: 0; height: 40px; background: #8cc49a; }
.up { position: absolute; left: 24px; right: 24px; top: 490px; height: 16px; border-radius: 8px; background: #d8dce4; overflow: hidden; }
.up i { display: block; height: 100%; background: #1e3a5f; }
.quote { position: absolute; width: 700px; height: 280px; padding: 40px; border-radius: 24px; background: #fff; border: 2.5px solid #1e3a5f; }
.quote .ln { background: #e4e7ec; }
.via { margin-top: 30px; display: flex; gap: 14px; }
.via span { padding: 8px 18px; border-radius: 999px; background: #f2ede3; color: #1e3a5f; font: 500 20px "Geist Mono", monospace; }
.timer { position: absolute; }
.timer b { font-size: 120px; letter-spacing: -.05em; color: #1e3a5f; font-variant-numeric: tabular-nums; }
/* speed to quote */
.qcard { position: absolute; width: 560px; padding: 40px; border-radius: 22px; background: rgba(255,255,255,0.06); border: 2px solid rgba(255,255,255,0.16); color: #fff; }
.amt { position: relative; margin-top: 28px; padding: 14px 18px; border-radius: 12px; border: 2.5px solid rgba(255,255,255,0.16); }
.amt .ln { margin: 0; }
.amt em { position: absolute; right: -18px; top: -18px; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: #d4542f; color: #fff; font-style: normal; font-weight: 700; font-size: 24px; }
.ans { border-color: #d4b483; }
.ev { margin-top: 26px; display: flex; gap: 14px; }
.ev i { display: block; width: 140px; height: 40px; border-radius: 10px; background: rgba(212,180,131,0.25); border: 2px solid #d4b483; }
/* voice */
.phone.sm { width: 400px; height: 640px; background: #0e1726; }
.bub { position: relative; }
.scr.dark .bub { width: 82%; height: auto; padding: 18px; margin-bottom: 22px; border-radius: 20px; background: rgba(255,255,255,0.14); border: 0; }
.scr.dark .bub.out { margin-left: auto; background: #fff; } .scr.dark .bub.out .ln { background: #e7dece; }
.scr.dark .bub .ln { margin: 8px 0; }
/* broadband */
.chat { position: absolute; width: 300px; padding: 26px; border-radius: 20px 20px 20px 4px; background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.16); }
.chat .ln { background: rgba(255,255,255,0.3); margin: 8px 0; }
.agent { position: absolute; width: 400px; padding: 30px; border-radius: 22px; background: rgba(212,180,131,0.16); border: 2.5px solid #d4b483; }
.agent b { display: block; font-size: 30px; }
.agent span { display: block; margin-top: 12px; padding: 8px 14px; border-radius: 10px; background: rgba(255,255,255,0.08); font: 500 19px "Geist Mono", monospace; color: #c3cbd8; }
.lane { position: absolute; left: 0; width: 300px; height: 64px; display: flex; align-items: center; padding: 0 20px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.16); }
.lane span { font: 500 20px "Geist Mono", monospace; color: var(--mute); }
/* marketplace */
.phone.mini { width: 340px; height: 560px; }
.phone.mini .scr { padding: 40px 26px; } .phone.mini .ln { background: #d8dce4; }
.tg { display: block; width: 100%; height: 90px; border-radius: 18px; background: #f2ede3; border: 2px solid #d4b483; }
.phone.mini .ok { right: -22px; top: -22px; width: 72px; height: 72px; font-size: 40px; }
/* grc */
.mt { position: absolute; width: 190px; height: 180px; padding: 22px; border-radius: 18px; background: rgba(255,255,255,0.05); border: 2.5px solid rgba(255,255,255,0.16); }
.mt span { font: 500 20px "Geist Mono", monospace; color: var(--mute); }
.sbar { margin-top: 70px; height: 16px; border-radius: 8px; background: rgba(255,255,255,0.1); overflow: hidden; }
.sbar i { display: block; height: 100%; background: #d4b483; }
.mt.bad .sbar i { background: #d4542f; }
.badchip { position: absolute; padding: 10px 16px; border-radius: 10px; background: #d4542f; color: #fff; font: 500 20px "Geist Mono", monospace; white-space: nowrap; }
/* tooling */
.win { position: absolute; width: 800px; height: 250px; padding: 30px; border-radius: 22px; background: #fff; border: 2.5px solid #1e3a5f; }
.win .ln { background: #e4e7ec; }
.bar3 { display: block; width: 120px; height: 16px; border-radius: 8px; background: #d4b483; }
.role { position: absolute; width: 120px; height: 140px; display: grid; justify-items: center; }
.role .av { margin: 0; width: 96px; height: 96px; background: #ede6d8; border: 3px solid #1e3a5f; }
.role .lk { margin-top: 6px; font-size: 34px; }
'''


def write(v):
	t = v.t
	d = os.path.join(HERE, v.slug)
	os.makedirs(os.path.join(d, 'assets', 'fonts'), exist_ok=True)
	shutil.copyfile(os.path.join(ROOT, 'public', 'fonts', 'geist-latin-wght-normal.woff2'), os.path.join(d, 'assets', 'fonts', 'geist.woff2'))
	shutil.copyfile(os.path.join(ROOT, 'public', 'fonts', 'geist-mono-latin-wght-normal.woff2'), os.path.join(d, 'assets', 'fonts', 'geist-mono.woff2'))
	svg = open(os.path.join(ROOT, 'public', 'images', 'pipeline-texture.svg'), encoding='utf-8').read()
	open(os.path.join(d, 'assets', 'pipeline.svg'), 'w', encoding='utf-8').write(svg)
	open(os.path.join(d, 'assets', 'pipeline-green.svg'), 'w', encoding='utf-8').write(svg.replace('#fff"', '#1e3a5f"').replace('#e6d3b0', '#d4b483'))
	for f in ('hyperframes.json',):
		shutil.copyfile(os.path.join(ROOT, 'media-src', 'signal-engine', f), os.path.join(d, f))
	json.dump({'id': v.slug, 'name': v.slug}, open(os.path.join(d, 'meta.json'), 'w'))
	vars_ = ''.join(f'--{k}:{val};' for k, val in t.items() if k != 'tex') + f'--tex:url("assets/{t["tex"]}");'
	hdr = f'<div class="hdr"><span class="badge">{esc(v.cat)}</span>' + (f'<span class="client">{esc(v.client)}</span>' if v.client else '') + '</div>'
	page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
:root {{ {vars_} }}
{CSS}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="{W}" data-height="{H}">
<div id="ground"></div><div id="tex"></div>
{hdr}
{''.join(v.html)}
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{chr(10).join(v.js)}
tl.set({{}}, {{}}, {DUR});
window.__timelines["main"] = tl;
</script>
</body>
</html>
'''
	open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(page)
	return v.words


if __name__ == '__main__':
	import sys
	only = sys.argv[1:]
	allw = []
	for f in VIDEOS:
		v = f()
		if only and v.slug not in only:
			continue
		allw += write(v)
		print('wrote', v.slug)
	open(os.path.join(HERE, 'words.txt'), 'w', encoding='utf-8').write('\n'.join(dict.fromkeys(allw)))
