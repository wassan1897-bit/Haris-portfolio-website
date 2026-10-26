"""Three resume page concepts (A rail + timeline, B printable sheet, C bento), written to mockups/resume/.
Words come from the AI GTM Engineer brief; the top bar and footer are copied from the live index.html."""
import html, re, os
FONTS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts_head.html'), encoding='utf-8').read().strip()
ROOT = r'E:\Haris portfolio website'
OUT = os.path.join(ROOT, 'mockups', 'resume')
os.makedirs(OUT, exist_ok=True)
src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
main = src.index('/* Home page')  # the page's main style block (the font block comes first)
css_all = src[main:src.index('</style>', main)]
base_css = css_all[css_all.index(':root {'):css_all.index('/* header')]
nav_css = css_all[css_all.index('/* top bar'):css_all.index('.top-right a:focus-visible')]
end_css = '\n'.join(l for l in css_all.split('\n') if l.startswith('.end'))
header = src[src.index('<header class="topbar">'):src.index('</header>') + 9]
footer = src[src.index('<footer class="end">'):src.index('</footer>', src.index('<footer class="end">')) + 9]
e = html.escape

ONE = "I'm Muhammad Haris, an AI GTM engineer. I build the AI systems that find your buyers, research them, reach them at the right moment and keep them."
HEAD = 'I build revenue systems that run without me.'
EXP_INTRO = 'Two roles where I built AI products under the hardest constraints there are: money, regulation and multiple tenants. They are why companies trust me with agents near their revenue.'
WHERE = 'I work with companies in the US, UK and Middle East.'
ROLES = [
	('AI GTM Engineer', 'Working directly with companies in the US, UK and Middle East', ['Signal engines, research agents, inbound conversion and retention agents, built directly with founders and revenue leaders.']),
	('Founding AI Engineer', 'RevAll AI (Pyle Ventures)', ['Founding AI engineer on an early-stage fintech building a read-only investing platform.', 'Read-only by design. It never moves money.']),
	('AI Automation Lead', 'Solidrange', ['Led AI on a multi-tenant compliance platform for a Riyadh-based company, in English and Arabic.']),
]
RESULTS = [
	('~£110k', 'annual pipeline created', 'UK broadband provider'),
	('731', 'new prospects captured', 'UK broadband provider'),
	('51', 'qualified leads in the first four days', 'Lead-generation company'),
	('79,000+', 'agent minutes saved (estimated)', 'UK broadband provider'),
	('80,000+', 'leads per campaign', 'Outbound campaign'),
	('530', 'potential acquirers mapped', 'Investment bank, sell-side M&A'),
]
BRING = [
	('I speak revenue and code.', 'I can sit in a pipeline review in the morning and ship the fix in the afternoon. Nobody has to translate between the business and the build.'),
	('I learn the job before I automate it.', 'I sit with the people doing the manual work and map how a lead really moves, not how the playbook says it does.'),
	('I build the whole system.', 'Signal, research, outreach, conversion, retention and the data underneath, wired together so every stage hands clean data to the next.'),
	('Agents where judgment helps. Plain code where mistakes cost money.', 'AI reads, researches and decides what deserves attention. Deterministic logic handles prices, sends and customer records.'),
	('Production or nothing.', 'Real data from the first week, evaluations, guardrails, monitoring, and a person in the loop wherever a mistake would reach a customer.'),
]
TOOLS = [
	('AI and agents', ['Claude and OpenAI APIs', 'Gemini', 'DeepSeek', 'Perplexity']),
	('Signal, research and outbound', ['Apollo', 'Clay', 'Firecrawl', 'Apify', 'Browserless', 'Serper', 'NeverBounce', 'Instantly']),
	('Product and platform engineering', ['Python and FastAPI', 'TypeScript, Next.js and React', '.NET', 'Supabase and Postgres with row-level security']),
	('Revenue systems and data', ['HubSpot', 'Jobber', 'GoHighLevel', 'Airtable', 'ClickUp', 'Webflow CMS', 'Google Sheets and Apps Script']),
	('Voice and messaging', ['Retell', 'Vapi', 'ElevenLabs', 'Voiceflow', 'WhatsApp Cloud API', 'Twilio']),
	('Orchestration', ['n8n', 'Zapier', 'Make', 'Power Automate']),
	('Engineering practice', ['Claude Code', 'GitHub Actions and CI security gates', 'Sentry monitoring', 'secret scanning']),
]
EDU = ('Management Sciences', 'Lahore University of Management Sciences (LUMS)')
QUOTE = 'Working with Muhammad was a great experience. He takes the time to thoroughly understand the project before diving in, communicates clearly, and consistently shows strong attention to detail.'
CLOSE = "If you're serious about building a revenue engine, let's talk."
MAIL, LI, GH = 'hariswassan001@gmail.com', 'linkedin.com/in/muhammad-haris-wassan', 'github.com/Haris001-bit'

I_DL = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
I_MAIL = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M3.5 6.5h17v11h-17zM3.8 7l8.2 6.2L20.2 7"/></svg>'
I_LI = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4v11H3v-11zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.6 4.77 6v5.45h-4v-4.83c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.55v4.92h-4v-11z"/></svg>'
I_GH = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z"/></svg>'
I_CAP = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'

TEX = 'url("/images/pipeline-texture.svg") 0 0 / 360px 240px'


def page(name, css, body):
	return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Resume | Muhammad Haris, AI GTM Engineer</title>
{FONTS}
<style>
{base_css}
{nav_css}
{end_css}
.eb {{ display: block; font: 500 12px "Geist Mono", monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--acc); }}
.chip {{ display: inline-block; padding: 6px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; }}
{css}
</style>
</head>
<body>
{header}
{body}
{footer}
</body>
</html>'''


# ---------- A: dark profile rail on the left, signal timeline on the right ----------
A_CSS = f'''
.ra {{ display: grid; grid-template-columns: 360px 1fr; gap: 72px; padding: 64px 0 110px; align-items: start; }}
.rail {{ position: sticky; top: 24px; isolation: isolate; overflow: hidden; border-radius: 26px; background: #111a17; color: #eef3f1; padding: 22px 22px 26px; }}
.rail::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; -webkit-mask-image: linear-gradient(180deg, transparent 30%, #000); mask-image: linear-gradient(180deg, transparent 30%, #000); }}
.rail img {{ display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; object-position: 50% 16%; border-radius: 18px; }}
.rail h1 {{ margin-top: 22px; font-size: 28px; letter-spacing: -.03em; font-weight: 700; line-height: 1.1; }}
.rail .t {{ display: block; margin-top: 6px; font-weight: 600; color: #4fd68c; }}
.rail .w {{ margin-top: 10px; font-size: 14.5px; color: #9fb3aa; }}
.rail .acts {{ display: grid; gap: 10px; margin-top: 22px; }}
.rail .acts a {{ display: flex; align-items: center; justify-content: center; gap: 10px; height: 50px; border-radius: 12px; font-weight: 600; }}
.rail .acts a:first-child {{ background: #38c97a; color: #0b1d16; }}
.rail .acts a:last-child {{ box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / .35); }}
.rail .ct {{ margin-top: 22px; padding-top: 18px; border-top: 1px solid rgb(255 255 255 / .1); display: grid; gap: 12px; font-size: 14.5px; }}
.rail .ct a {{ display: flex; align-items: center; gap: 10px; color: #c9d6d0; overflow-wrap: anywhere; }}
.rail .ct svg {{ color: #4fd68c; flex: none; }}
.main h2.big {{ margin-top: 14px; font-size: 46px; line-height: 1.08; letter-spacing: -.04em; font-weight: 700; max-width: 14em; }}
.main .one {{ margin-top: 20px; font-size: 20px; line-height: 1.55; color: #2b3631; max-width: 34em; }}
.sec {{ margin-top: 72px; }}
.sec > h3 {{ font-size: 26px; letter-spacing: -.025em; font-weight: 700; }}
.sec > p.in {{ margin-top: 10px; color: var(--mute); max-width: 40em; }}
.res {{ margin-top: 26px; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); }}
.res div {{ padding: 24px 22px 24px 0; border-bottom: 1px solid var(--line); }}
.res div:not(:nth-child(3n+1)) {{ padding-left: 22px; border-left: 1px solid var(--line); }}
.res b {{ display: block; font-size: 40px; line-height: 1; letter-spacing: -.045em; font-weight: 700; color: var(--acc); }}
.res span {{ display: block; margin-top: 10px; font-size: 15px; font-weight: 500; }}
.res small {{ display: block; margin-top: 4px; font-size: 13px; color: var(--mute); }}
.tl {{ position: relative; margin-top: 30px; padding-left: 44px; }}
.tl::before {{ content: ""; position: absolute; left: 11px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(#0e7a55, #38c97a 60%, rgb(56 201 122 / .2)); }}
.tl article {{ position: relative; padding: 0 0 34px; }}
.tl article::before {{ content: ""; position: absolute; left: -44px; top: 4px; width: 24px; height: 24px; border-radius: 50%; background: var(--bg); box-shadow: inset 0 0 0 3px #38c97a; }}
.tl article:first-child::before {{ background: #38c97a; box-shadow: 0 0 0 6px rgb(56 201 122 / .2); }}
.tl h4 {{ font-size: 21px; letter-spacing: -.02em; font-weight: 700; }}
.tl .org {{ display: block; margin-top: 4px; font-weight: 600; color: var(--acc); }}
.tl p {{ margin-top: 10px; color: #2b3631; max-width: 40em; }}
.br {{ margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }}
.br div {{ padding: 22px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--line); }}
.br div:last-child {{ grid-column: 1 / -1; }}
.br b {{ display: block; font-size: 17px; font-weight: 700; color: var(--acc); }}
.br p {{ margin-top: 6px; font-size: 15.5px; color: var(--mute); }}
.tk {{ margin-top: 22px; border-top: 1px solid var(--line); }}
.tk div {{ display: grid; grid-template-columns: 240px 1fr; gap: 20px; padding: 16px 0; border-bottom: 1px solid var(--line); align-items: start; }}
.tk h5 {{ font-size: 15.5px; font-weight: 600; padding-top: 5px; }}
.tk .chips {{ display: flex; flex-wrap: wrap; gap: 8px; }}
.tk .chip {{ background: var(--acc-soft); color: #0b5c40; }}
.edu {{ margin-top: 22px; display: flex; gap: 16px; align-items: center; padding: 20px 22px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--line); }}
.edu i {{ width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; background: var(--acc-soft); color: var(--acc); }}
.edu b {{ display: block; font-size: 17px; }} .edu span {{ color: var(--mute); }}
'''
A_BODY = f'''<main class="wrap ra">
	<aside class="rail">
		<img src="/images/haris.webp" alt="Muhammad Haris" />
		<h1>Muhammad Haris</h1><span class="t">AI GTM Engineer</span>
		<p class="w">{e(WHERE)}</p>
		<div class="acts"><a href="#">{I_DL} Download resume</a><a href="#">Book a call</a></div>
		<div class="ct"><a href="#">{I_MAIL} {MAIL}</a><a href="#">{I_LI} {LI}</a><a href="#">{I_GH} {GH}</a></div>
	</aside>
	<div class="main">
		<span class="eb">Resume</span>
		<h2 class="big">{e(HEAD)}</h2>
		<p class="one">{e(ONE)}</p>
		<section class="sec"><h3>Selected work</h3><div class="res">{''.join(f'<div><b>{n}</b><span>{l}</span><small>{e(c)}</small></div>' for n, l, c in RESULTS)}</div></section>
		<section class="sec"><h3>Experience</h3><p class="in">{e(EXP_INTRO)}</p><div class="tl">{''.join(f'<article><h4>{t}</h4><span class="org">{e(o)}</span>{"".join(f"<p>{e(x)}</p>" for x in ps)}</article>' for t, o, ps in ROLES)}</div></section>
		<section class="sec"><h3>What I bring to every engagement</h3><div class="br">{''.join(f'<div><b>{t}</b><p>{e(d)}</p></div>' for t, d in BRING)}</div></section>
		<section class="sec"><h3>Toolkit</h3><div class="tk">{''.join(f'<div><h5>{e(g)}</h5><div class="chips">{"".join(f"<span class=chip>{e(x)}</span>" for x in xs)}</div></div>' for g, xs in TOOLS)}</div></section>
		<section class="sec"><h3>Education</h3><div class="edu"><i>{I_CAP}</i><div><b>{EDU[0]}</b><span>{e(EDU[1])}</span></div></div></section>
	</div>
</main>'''

# ---------- B: a printable sheet on a dark desk, toolbar above it ----------
B_CSS = f'''
.desk {{ position: relative; isolation: isolate; background: #111a17; padding: 40px 0 110px; }}
.desk::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; -webkit-mask-image: linear-gradient(180deg, #000, rgb(0 0 0 / .4) 60%, #000); mask-image: linear-gradient(180deg, #000, rgb(0 0 0 / .4) 60%, #000); }}
.tool {{ width: min(1000px, 100% - 48px); margin: 0 auto 22px; display: flex; justify-content: space-between; align-items: center; color: #eef3f1; }}
.tool .eb {{ color: #8fd4b1; }}
.tool b {{ display: block; margin-top: 4px; font-size: 22px; letter-spacing: -.02em; }}
.tool .acts {{ display: flex; gap: 10px; }}
.tool .acts a {{ display: inline-flex; align-items: center; gap: 9px; height: 46px; padding: 0 18px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / .3); }}
.tool .acts a.pri {{ background: #38c97a; color: #0b1d16; box-shadow: none; }}
.sheet {{ width: min(1000px, 100% - 48px); margin: 0 auto; background: #fff; border-radius: 6px; padding: 64px 68px 56px; box-shadow: 0 40px 80px -30px rgb(0 0 0 / .7); }}
.sh-head {{ display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: center; padding-bottom: 28px; border-bottom: 3px solid #0e7a55; }}
.sh-head img {{ width: 104px; height: 104px; border-radius: 50%; object-fit: cover; object-position: 50% 16%; }}
.sh-head h1 {{ font-size: 44px; line-height: 1; letter-spacing: -.045em; font-weight: 700; }}
.sh-head .t {{ display: block; margin-top: 8px; font-size: 19px; font-weight: 600; color: var(--acc); }}
.sh-head .ct {{ margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px 22px; font-size: 14px; color: var(--mute); }}
.sh-head .ct span {{ display: inline-flex; gap: 7px; align-items: center; }}
.sh-head .ct svg {{ color: var(--acc); }}
.sh-body {{ display: grid; grid-template-columns: 1.55fr 1fr; gap: 48px; padding-top: 32px; }}
.sh-body h3 {{ font: 600 12px "Geist Mono", monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--acc); margin: 30px 0 12px; }}
.sh-body > div > h3:first-child {{ margin-top: 0; }}
.sh-body .one {{ font-size: 16.5px; line-height: 1.6; color: #2b3631; }}
.sh-body article {{ padding: 14px 0; border-top: 1px solid var(--line); }}
.sh-body article:first-of-type {{ border-top: 0; padding-top: 0; }}
.sh-body h4 {{ font-size: 17.5px; font-weight: 700; letter-spacing: -.015em; }}
.sh-body .org {{ display: block; font-size: 14.5px; font-weight: 600; color: var(--acc); }}
.sh-body article p {{ margin-top: 6px; font-size: 15px; line-height: 1.55; color: #2b3631; }}
.sh-body .res {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }}
.sh-body .res div {{ display: grid; grid-template-columns: 78px 1fr; gap: 10px; align-items: baseline; font-size: 14px; color: #2b3631; }}
.sh-body .res b {{ font-size: 19px; letter-spacing: -.03em; color: var(--acc); }}
.side {{ padding-left: 36px; border-left: 1px solid var(--line); }}
.side ul {{ list-style: none; padding: 0; display: grid; gap: 9px; }}
.side li {{ position: relative; padding-left: 18px; font-size: 14.5px; font-weight: 600; line-height: 1.4; }}
.side li::before {{ content: ""; position: absolute; left: 0; top: .45em; width: 7px; height: 7px; background: #38c97a; }}
.side .tk p {{ font-size: 13.5px; line-height: 1.5; color: #2b3631; margin-bottom: 10px; }}
.side .tk p b {{ display: block; font-size: 13.5px; color: var(--ink); }}
.side .edu b {{ display: block; font-size: 15px; }} .side .edu span {{ font-size: 14px; color: var(--mute); }}
.sh-foot {{ margin-top: 34px; padding-top: 16px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; font-size: 13px; color: var(--mute); }}
'''
B_BODY = f'''<main class="desk">
	<div class="tool"><div><span class="eb">Resume</span><b>Muhammad Haris</b></div><div class="acts"><a class="pri" href="#">{I_DL} Download resume</a><a href="#">Book a call</a></div></div>
	<article class="sheet">
		<header class="sh-head"><img src="/images/haris.webp" alt="" /><div><h1>Muhammad Haris</h1><span class="t">AI GTM Engineer</span>
			<div class="ct"><span>{I_MAIL} {MAIL}</span><span>{I_LI} {LI}</span><span>{I_GH} {GH}</span></div></div></header>
		<div class="sh-body">
			<div>
				<p class="one">{e(ONE)}</p>
				<h3>Experience</h3>
				{''.join(f'<article><h4>{t}</h4><span class="org">{e(o)}</span>{"".join(f"<p>{e(x)}</p>" for x in ps)}</article>' for t, o, ps in ROLES)}
				<h3>Selected work</h3>
				<div class="res">{''.join(f'<div><b>{n}</b><span>{l}</span></div>' for n, l, c in RESULTS)}</div>
			</div>
			<div class="side">
				<h3>What I bring to every engagement</h3><ul>{''.join(f'<li>{t}</li>' for t, d in BRING)}</ul>
				<h3>Toolkit</h3><div class="tk">{''.join(f'<p><b>{e(g)}</b>{e(", ".join(xs))}</p>' for g, xs in TOOLS[:6])}</div>
				<h3>Education</h3><div class="edu"><b>{EDU[0]}</b><span>{e(EDU[1])}</span></div>
			</div>
		</div>
		<div class="sh-foot"><span>Muhammad Haris, AI GTM Engineer</span><span>{e(WHERE)}</span></div>
	</article>
</main>'''

# ---------- C: charcoal band header, numbers overlapping it, bento grid ----------
C_CSS = f'''
.ch {{ position: relative; isolation: isolate; background: #111a17; color: #fff; padding: 64px 0 120px; }}
.ch::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; -webkit-mask-image: linear-gradient(90deg, rgb(0 0 0 / .3), #000 80%); mask-image: linear-gradient(90deg, rgb(0 0 0 / .3), #000 80%); }}
.ch .wrap {{ display: grid; grid-template-columns: auto 1fr auto; gap: 34px; align-items: center; }}
.ch img {{ width: 148px; height: 148px; border-radius: 50%; object-fit: cover; object-position: 50% 16%; box-shadow: 0 0 0 4px #111a17, 0 0 0 6px #38c97a; }}
.ch .eb {{ color: #8fd4b1; }}
.ch h1 {{ margin-top: 8px; font-size: 64px; line-height: 1; letter-spacing: -.05em; font-weight: 700; }}
.ch .t {{ display: block; margin-top: 10px; font-size: 21px; font-weight: 600; color: #4fd68c; }}
.ch .acts {{ display: grid; gap: 10px; }}
.ch .acts a {{ display: flex; align-items: center; justify-content: center; gap: 10px; height: 50px; padding: 0 24px; border-radius: 12px; font-weight: 600; box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / .35); }}
.ch .acts a.pri {{ background: #38c97a; color: #0b1d16; box-shadow: none; }}
.nums {{ position: relative; margin-top: -64px; display: grid; grid-template-columns: repeat(4, 1fr); background: #fff; border-radius: 20px; box-shadow: 0 30px 60px -30px rgb(17 26 23 / .35), 0 0 0 1px var(--line); }}
.nums div {{ padding: 26px 28px; }} .nums div + div {{ border-left: 1px solid var(--line); }}
.nums b {{ display: block; font-size: 38px; line-height: 1; letter-spacing: -.045em; font-weight: 700; color: var(--acc); }}
.nums span {{ display: block; margin-top: 10px; font-size: 14.5px; color: var(--mute); }}
.bento {{ margin: 22px auto 110px; display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; }}
.tile {{ border-radius: 22px; background: #fff; padding: 30px; box-shadow: 0 0 0 1px var(--line); }}
.tile h3 {{ font-size: 22px; letter-spacing: -.02em; font-weight: 700; margin-bottom: 18px; }}
.t-one {{ grid-column: span 12; display: grid; grid-template-columns: 1fr 1.3fr; gap: 50px; align-items: center; }}
.t-one h2 {{ font-size: 36px; line-height: 1.12; letter-spacing: -.035em; font-weight: 700; }}
.t-one p {{ font-size: 19px; line-height: 1.6; color: #2b3631; }}
.t-exp {{ grid-column: span 7; grid-row: span 2; }}
.t-exp article {{ padding: 20px 22px; border-radius: 16px; background: var(--bg); border-left: 4px solid #38c97a; }}
.t-exp article + article {{ margin-top: 12px; }}
.t-exp h4 {{ font-size: 19px; font-weight: 700; letter-spacing: -.015em; }}
.t-exp .org {{ display: block; margin-top: 2px; font-weight: 600; color: var(--acc); font-size: 15px; }}
.t-exp p {{ margin-top: 8px; font-size: 15.5px; color: #2b3631; }}
.t-br {{ grid-column: span 5; }}
.t-br ul {{ list-style: none; padding: 0; display: grid; gap: 12px; }}
.t-br li {{ display: flex; gap: 12px; align-items: flex-start; font-weight: 600; line-height: 1.4; }}
.t-br li i {{ flex: none; width: 24px; height: 24px; border-radius: 50%; background: var(--acc-soft); color: var(--acc); display: grid; place-items: center; font-style: normal; font-size: 13px; margin-top: 1px; }}
.t-q {{ grid-column: span 5; background: #0e7a55; color: #fff; position: relative; isolation: isolate; overflow: hidden; box-shadow: none; }}
.t-q::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; }}
.t-q p {{ font-size: 19px; line-height: 1.5; font-weight: 500; }}
.t-q p::before {{ content: "\\201C"; display: block; height: 40px; font-size: 64px; line-height: 1; color: rgb(255 255 255 / .4); }}
.t-q small {{ display: block; margin-top: 16px; font: 500 12px "Geist Mono", monospace; letter-spacing: .12em; text-transform: uppercase; color: #c8f0da; }}
.t-tk {{ grid-column: span 12; }}
.t-tk .g {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px 26px; }}
.t-tk h5 {{ font-size: 15px; font-weight: 600; margin-bottom: 10px; }}
.t-tk .chips {{ display: flex; flex-wrap: wrap; gap: 6px; }}
.t-tk .chip {{ background: var(--bg); box-shadow: inset 0 0 0 1px var(--line); font-size: 13.5px; }}
.t-edu {{ grid-column: span 4; display: flex; gap: 16px; align-items: flex-start; }}
.t-edu i {{ flex: none; width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center; background: var(--acc-soft); color: var(--acc); }}
.t-edu h3 {{ margin-bottom: 6px; }} .t-edu b {{ display: block; }} .t-edu span {{ color: var(--mute); font-size: 15px; }}
.t-cta {{ grid-column: span 8; background: #111a17; color: #fff; display: flex; justify-content: space-between; align-items: center; gap: 30px; box-shadow: none; }}
.t-cta h3 {{ font-size: 28px; line-height: 1.15; margin: 0; max-width: 14em; }}
.t-cta a {{ display: inline-flex; align-items: center; gap: 10px; height: 52px; padding: 0 24px; border-radius: 12px; background: #38c97a; color: #0b1d16; font-weight: 600; white-space: nowrap; }}
'''
C_BODY = f'''<main>
	<section class="ch"><div class="wrap">
		<img src="/images/haris.webp" alt="Muhammad Haris" />
		<div><span class="eb">Resume</span><h1>Muhammad Haris</h1><span class="t">AI GTM Engineer</span></div>
		<div class="acts"><a class="pri" href="#">{I_DL} Download resume</a><a href="#">{I_LI} LinkedIn</a></div>
	</div></section>
	<div class="wrap">
		<div class="nums">{''.join(f'<div><b>{n}</b><span>{l}</span></div>' for n, l, c in RESULTS[:4])}</div>
		<div class="bento">
			<div class="tile t-one"><h2>{e(HEAD)}</h2><p>{e(ONE)}</p></div>
			<div class="tile t-exp"><h3>Experience</h3>{''.join(f'<article><h4>{t}</h4><span class="org">{e(o)}</span>{"".join(f"<p>{e(x)}</p>" for x in ps)}</article>' for t, o, ps in ROLES)}</div>
			<div class="tile t-br"><h3>What I bring to every engagement</h3><ul>{''.join(f'<li><i>&check;</i>{t}</li>' for t, d in BRING)}</ul></div>
			<div class="tile t-q"><p>{e(QUOTE)}</p><small>Client</small></div>
			<div class="tile t-tk"><h3>Toolkit</h3><div class="g">{''.join(f'<div><h5>{e(g)}</h5><div class="chips">{"".join(f"<span class=chip>{e(x)}</span>" for x in xs)}</div></div>' for g, xs in TOOLS)}</div></div>
			<div class="tile t-edu"><i>{I_CAP}</i><div><h3>Education</h3><b>{EDU[0]}</b><span>{e(EDU[1])}</span></div></div>
			<div class="tile t-cta"><h3>{e(CLOSE)}</h3><a href="#">Book a call &rarr;</a></div>
		</div>
	</div>
</main>'''

for name, css, body in [('a', A_CSS, A_BODY), ('b', B_CSS, B_BODY), ('c', C_CSS, C_BODY)]:
	open(os.path.join(OUT, f'resume-{name}.html'), 'w', encoding='utf-8').write(page(name, css, body))
# every content line for the word check
lines = [ONE, HEAD, EXP_INTRO, WHERE, QUOTE, CLOSE, *EDU] + [x for t, o, ps in ROLES for x in [t, o, *ps]] + [x for n, l, c in RESULTS for x in (l, c)] + [x for t, d in BRING for x in (t, d)] + [g for g, xs in TOOLS] + [x for g, xs in TOOLS for x in xs]
open(os.path.join(OUT, 'words.txt'), 'w', encoding='utf-8').write('\n'.join(lines))
print('written', len(lines), 'lines')
