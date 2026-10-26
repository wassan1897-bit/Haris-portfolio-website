"""Resume concept: the resume drawn as the revenue engine. Writes mockups/resume/resume-engine.html.
Words from the AI GTM Engineer brief (and the site's stage cards); top bar and footer copied from index.html."""
import html, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import util
spec = util.spec_from_file_location('rm', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'resume-mock.py'))
rm = util.module_from_spec(spec); spec.loader.exec_module(rm)
e = html.escape

STAGES = [
	('Signal intelligence', 'Know who is in market before your competitors do.', '51', 'qualified leads in the first four days'),
	('Research and enrichment agents', 'Every account researched to the field, verified at the source, never guessed.', '29', 'data points researched per lead'),
	('Signal-triggered outbound', 'Outreach that starts because something happened, not because a list was due.', '530', 'potential acquirers mapped'),
	('Inbound conversion', 'Speed to lead and speed to quote.', '~45 sec', 'from photo to priced quote'),
	('Retention and expansion', 'Agents that catch customers on the way out, make the right offer and hand warm conversations to the team.', '731', 'new prospects captured'),
]
# each role tagged with the constraint from the brief's own experience intro
ROLES = [
	('AI GTM Engineer', 'Working directly with companies in the US, UK and Middle East', ['Signal engines, research agents, inbound conversion and retention agents, built directly with founders and revenue leaders.'], ['revenue']),
	('Founding AI Engineer', 'RevAll AI (Pyle Ventures)', ['Founding AI engineer on an early-stage fintech building a read-only investing platform.', 'Read-only by design. It never moves money.'], ['money']),
	('AI Automation Lead', 'Solidrange', ['Led AI on a multi-tenant compliance platform for a Riyadh-based company, in English and Arabic.'], ['regulation', 'multiple tenants']),
]
LINE = 'One person, both languages, the whole system.'
TEX = rm.TEX

# hero diagram: five stage nodes on a stepped pipeline ending in "Pipeline out."
PATH = 'M60 76 H300 V206 H60 V336 H372'
NODES = [(60, 76), (300, 76), (300, 206), (60, 206), (60, 336)]
svg_nodes = ''.join(
	f'<g class="nd" style="--d:{i * 0.75}s"><circle class="halo" cx="{x}" cy="{y}" r="17"/><circle cx="{x}" cy="{y}" r="17" class="core"/>'
	f'<text x="{x}" y="{y + 4}" class="num">0{i + 1}</text><text x="{x - 14}" y="{y - 28}" class="lbl">{e(STAGES[i][0])}</text></g>'
	for i, (x, y) in enumerate(NODES))
pulses = ''.join(f'<circle r="4.5" class="pulse"><animateMotion dur="3.8s" begin="{b}s" repeatCount="indefinite" path="{PATH}" /></circle>' for b in (0, -1.27, -2.53))
DIAGRAM = f'''<svg class="dia" viewBox="0 0 520 400" role="img" aria-label="Five stages of the revenue engine">
	<path d="{PATH}" class="rail-bg"/><path d="{PATH}" class="rail"/>
	{pulses}{svg_nodes}
	<g class="out"><circle cx="404" cy="336" r="34" class="halo2"/><circle cx="404" cy="336" r="32"/><text x="404" y="331" class="o1">Pipeline</text><text x="404" y="348" class="o2">out.</text></g>
</svg>'''

CSS = f'''
/* hero: who, the one line, and the engine running on the right */
.rh {{ position: relative; isolation: isolate; overflow: hidden; background: #111a17; color: #fff; padding: 76px 0 84px; }}
.rh::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; -webkit-mask-image: linear-gradient(90deg, rgb(0 0 0 / .25), rgb(0 0 0 / .5) 50%, #000); mask-image: linear-gradient(90deg, rgb(0 0 0 / .25), rgb(0 0 0 / .5) 50%, #000); }}
.rh .wrap {{ display: grid; grid-template-columns: 1fr 560px; gap: 60px; align-items: center; }}
.rh .who {{ display: flex; align-items: center; gap: 18px; }}
.rh .who img {{ width: 64px; height: 64px; border-radius: 50%; object-fit: cover; object-position: 50% 16%; box-shadow: 0 0 0 3px #111a17, 0 0 0 5px #38c97a; }}
.rh .who b {{ display: block; font-size: 20px; font-weight: 700; letter-spacing: -.02em; }}
.rh .who span {{ font-size: 15px; font-weight: 600; color: #4fd68c; }}
.rh .eb {{ color: #8fd4b1; margin-top: 40px; }}
.rh h1 {{ margin-top: 14px; font-size: clamp(48px, 5vw, 76px); line-height: 1; letter-spacing: -.05em; font-weight: 700; max-width: 9.5em; }}
.rh h1 em {{ font-style: normal; color: #4fd68c; }}
.rh .where {{ margin-top: 22px; color: #9fb3aa; font-size: 16px; }}
.rh .acts {{ margin-top: 30px; display: flex; gap: 12px; flex-wrap: wrap; }}
.rh .acts a {{ display: inline-flex; align-items: center; gap: 10px; height: 52px; padding: 0 24px; border-radius: 12px; font-weight: 600; box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / .35); }}
.rh .acts a.pri {{ background: #38c97a; color: #0b1d16; box-shadow: none; }}
.rh .ct {{ margin-top: 26px; display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 14.5px; color: #c9d6d0; }}
.rh .ct a {{ display: inline-flex; gap: 8px; align-items: center; }} .rh .ct svg {{ color: #4fd68c; }}
.dia {{ width: 100%; height: auto; overflow: visible; }}
.dia .rail-bg {{ fill: none; stroke: rgb(255 255 255 / .1); stroke-width: 3; }}
.dia .rail {{ fill: none; stroke: url(#g); stroke: #38c97a; stroke-width: 3; stroke-dasharray: 6 10; opacity: .55; animation: flow 1.2s linear infinite; }}
@keyframes flow {{ to {{ stroke-dashoffset: -16; }} }}
.dia .pulse {{ fill: #d9ffea; filter: drop-shadow(0 0 6px #4fd68c); }}
.dia .core {{ fill: #111a17; stroke: #38c97a; stroke-width: 2.5; }}
.dia .halo {{ fill: rgb(56 201 122 / .25); transform-box: fill-box; transform-origin: center; animation: ping 3.8s ease-out infinite; animation-delay: var(--d); }}
@keyframes ping {{ 0% {{ transform: scale(1); opacity: .9; }} 30% {{ transform: scale(1.9); opacity: 0; }} 100% {{ opacity: 0; }} }}
.dia .num {{ font: 600 11px "Geist Mono", monospace; fill: #8fd4b1; text-anchor: middle; }}
.dia .lbl {{ font: 600 15px "Geist", sans-serif; fill: #eef3f1; }}
.dia .out circle:nth-child(2) {{ fill: #38c97a; }}
.dia .out .halo2 {{ fill: rgb(56 201 122 / .3); transform-box: fill-box; transform-origin: center; animation: ping 3.8s ease-out infinite 3.2s; }}
.dia .o1, .dia .o2 {{ font: 700 12.5px "Geist", sans-serif; fill: #0b1d16; text-anchor: middle; }}
@media (prefers-reduced-motion: reduce) {{ .dia .rail, .dia .halo, .dia .halo2 {{ animation: none; }} .dia .pulse {{ display: none; }} }}

/* the engine, stage by stage, each with its proof */
.eng {{ padding: 110px 0 40px; }}
.eng .eb {{ margin-bottom: 14px; }}
.eng h2, .exp h2, .tk h2 {{ font-size: 44px; line-height: 1.08; letter-spacing: -.04em; font-weight: 700; max-width: 16em; }}
.stg {{ position: relative; margin-top: 56px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; }}
.stg::before {{ content: ""; position: absolute; left: 20px; right: 20px; top: 20px; height: 3px; background: var(--line); }}
.stg::after {{ content: ""; position: absolute; left: 20px; top: 20px; height: 3px; width: calc((100% - 40px) * var(--p, 1)); background: linear-gradient(90deg, #0e7a55, #38c97a); }}
.stg > div {{ position: relative; z-index: 1; }}
.stg i {{ display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: var(--bg); box-shadow: inset 0 0 0 3px #38c97a; font: 600 13px "Geist Mono", monospace; font-style: normal; color: var(--acc); }}
.stg > div:first-child i {{ background: #38c97a; color: #0b1d16; box-shadow: 0 0 0 7px rgb(56 201 122 / .18); }}
.stg h3 {{ margin-top: 22px; font-size: 19px; line-height: 1.25; letter-spacing: -.02em; font-weight: 700; min-height: 2.5em; }}
.stg p {{ margin-top: 8px; font-size: 15px; line-height: 1.5; color: var(--mute); min-height: 6em; }}
.stg .pr {{ margin-top: 18px; padding-top: 16px; border-top: 1px dashed rgb(14 122 85 / .35); }}
.stg .pr b {{ display: block; font-size: 40px; line-height: 1; letter-spacing: -.05em; font-weight: 700; color: var(--acc); }}
.stg .pr span {{ display: block; margin-top: 8px; font-size: 14px; font-weight: 500; }}
.infra {{ margin-top: 34px; display: grid; grid-template-columns: 42px 1fr auto; gap: 18px; align-items: center; padding: 22px 26px; border-radius: 18px; background: #111a17; color: #eef3f1; }}
.infra i {{ display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: #38c97a; color: #0b1d16; font-style: normal; font-weight: 700; font-size: 20px; }}
.infra b {{ display: block; font-size: 18px; font-weight: 700; }}
.infra span {{ color: #9fb3aa; font-size: 15px; }}
.infra em {{ font-style: normal; font-weight: 600; color: #4fd68c; }}

/* experience: big rows, each tagged with the constraint it was built under */
.exp {{ padding: 110px 0 60px; display: grid; grid-template-columns: 380px 1fr; gap: 80px; align-items: start; }}
.exp .head {{ position: sticky; top: 40px; }}
.exp .head p {{ margin-top: 18px; color: var(--mute); font-size: 17px; }}
.exp article {{ display: grid; grid-template-columns: 1fr auto; gap: 8px 30px; padding: 34px 0; border-top: 1px solid var(--line); }}
.exp article:last-child {{ border-bottom: 1px solid var(--line); }}
.exp h3 {{ font-size: 34px; line-height: 1.05; letter-spacing: -.04em; font-weight: 700; }}
.exp .org {{ grid-column: 1; font-weight: 600; color: var(--acc); font-size: 17px; }}
.exp .txt {{ grid-column: 1; }}
.exp .txt p {{ margin-top: 8px; color: #2b3631; max-width: 38em; }}
.exp .tags {{ grid-column: 2; grid-row: 1 / span 3; display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }}
.exp .tags span {{ padding: 7px 14px; border-radius: 999px; background: var(--acc-soft); color: #0b5c40; font: 500 13px "Geist Mono", monospace; }}

/* toolkit as system modules on a charcoal band */
.tk {{ position: relative; isolation: isolate; background: #111a17; color: #eef3f1; padding: 100px 0 110px; margin-top: 50px; }}
.tk::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; -webkit-mask-image: linear-gradient(180deg, #000, rgb(0 0 0 / .35)); mask-image: linear-gradient(180deg, #000, rgb(0 0 0 / .35)); }}
.tk .eb {{ color: #8fd4b1; margin-bottom: 14px; }}
.mods {{ margin-top: 44px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }}
.mods div {{ padding: 22px; border-radius: 16px; background: rgb(255 255 255 / .045); box-shadow: inset 0 0 0 1px rgb(255 255 255 / .09); }}
.mods h4 {{ display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; }}
.mods h4::before {{ content: ""; width: 8px; height: 8px; border-radius: 50%; background: #38c97a; box-shadow: 0 0 0 4px rgb(56 201 122 / .18); }}
.mods ul {{ margin-top: 14px; list-style: none; padding: 0; display: grid; gap: 7px; font: 400 13.5px "Geist Mono", monospace; color: #c9d6d0; }}
.mods .edu {{ background: #0e7a55; box-shadow: none; }}
.mods .edu h4::before {{ background: #fff; box-shadow: 0 0 0 4px rgb(255 255 255 / .25); }}
.mods .edu b {{ display: block; margin-top: 14px; font-size: 17px; }}
.mods .edu span {{ display: block; margin-top: 4px; color: #d5efe1; font-size: 14.5px; }}

/* close: a client's words and the invitation */
.cl {{ padding: 100px 0 110px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }}
.cl .q {{ padding: 40px; border-radius: 22px; background: #fff; box-shadow: 0 0 0 1px var(--line); }}
.cl .q p {{ font-size: 21px; line-height: 1.5; font-weight: 500; letter-spacing: -.01em; }}
.cl .q p::before {{ content: "\\201C"; display: block; height: 44px; font-size: 72px; line-height: 1; color: #38c97a; font-weight: 700; }}
.cl .q small {{ display: block; margin-top: 18px; font: 500 12px "Geist Mono", monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--mute); }}
.cl .go {{ position: relative; isolation: isolate; overflow: hidden; padding: 40px; border-radius: 22px; background: #0e7a55; color: #fff; display: flex; flex-direction: column; justify-content: space-between; gap: 30px; }}
.cl .go::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; }}
.cl .go h3 {{ font-size: 34px; line-height: 1.1; letter-spacing: -.035em; font-weight: 700; max-width: 12em; }}
.cl .go .acts {{ display: flex; gap: 12px; flex-wrap: wrap; }}
.cl .go a {{ display: inline-flex; align-items: center; gap: 10px; height: 52px; padding: 0 24px; border-radius: 12px; font-weight: 600; background: #111a17; color: #fff; }}
.cl .go a + a {{ background: transparent; box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / .7); }}
'''

BODY = f'''<main>
<section class="rh"><div class="wrap">
	<div>
		<div class="who"><img src="/images/haris.webp" alt="Muhammad Haris" /><div><b>Muhammad Haris</b><span>AI GTM Engineer</span></div></div>
		<span class="eb">Resume</span>
		<h1>One person, both languages, <em>the whole system.</em></h1>
		<p class="where">{e(rm.WHERE)}</p>
		<div class="acts"><a class="pri" href="#">{rm.I_DL} Download resume</a><a href="#">Book a call</a></div>
		<div class="ct"><a href="#">{rm.I_MAIL} {rm.MAIL}</a><a href="#">{rm.I_LI} {rm.LI}</a><a href="#">{rm.I_GH} {rm.GH}</a></div>
	</div>
	{DIAGRAM}
</div></section>

<section class="wrap eng">
	<span class="eb">What I build</span>
	<h2>Five stages of the revenue engine.</h2>
	<div class="stg">{''.join(f'<div><i>0{i + 1}</i><h3>{e(n)}</h3><p>{e(l)}</p><div class="pr"><b>{v}</b><span>{e(c)}</span></div></div>' for i, (n, l, v, c) in enumerate(STAGES))}</div>
	<div class="infra"><i>+</i><div><b>The infrastructure underneath</b><span>CRM, enrichment, sequencing and reporting wired together as one system.</span></div><em>9 production pipelines, one connected system</em></div>
</section>

<section class="wrap exp">
	<div class="head"><span class="eb">Who I am</span><h2>Experience.</h2><p>{e(rm.EXP_INTRO)}</p></div>
	<div>{''.join(f'<article><h3>{t}</h3><span class="org">{e(o)}</span><div class="txt">{"".join(f"<p>{e(x)}</p>" for x in ps)}</div><div class="tags">{"".join(f"<span>{g}</span>" for g in tags)}</div></article>' for t, o, ps, tags in ROLES)}</div>
</section>

<section class="tk"><div class="wrap">
	<span class="eb">Under the hood</span>
	<h2>Toolkit.</h2>
	<div class="mods">{''.join(f'<div><h4>{e(g)}</h4><ul>{"".join(f"<li>{e(x)}</li>" for x in xs)}</ul></div>' for g, xs in rm.TOOLS)}<div class="edu"><h4>Education</h4><b>{rm.EDU[0]}</b><span>{e(rm.EDU[1])}</span></div></div>
</div></section>

<section class="wrap cl">
	<div class="q"><p>{e(rm.QUOTE)}</p><small>Client</small></div>
	<div class="go"><h3>{e(rm.CLOSE)}</h3><div class="acts"><a href="#">Book a call &rarr;</a><a href="#">{rm.I_DL} Download resume</a></div></div>
</section>
</main>'''

open(os.path.join(rm.OUT, 'resume-engine.html'), 'w', encoding='utf-8').write(rm.page('engine', CSS, BODY))
words = [LINE, 'Five stages of the revenue engine.', 'The infrastructure underneath', 'CRM, enrichment, sequencing and reporting wired together as one system.', 'Under the hood', 'Pipeline out.', 'money, regulation and multiple tenants', 'revenue']
words += [x for s in STAGES for x in s] + [x for t, o, ps, g in ROLES for x in [t, o, *ps]]
open(os.path.join(rm.OUT, 'words-engine.txt'), 'w', encoding='utf-8').write('\n'.join(words))
print('written')
