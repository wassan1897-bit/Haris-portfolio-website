"""Builds the projects area: public/projects/all.html, one page per category in public/projects/, and a page in
public/work/ for each project that had none. Run after changing index.html's top bar or footer, or the case pages.

Words come from the AI GTM Engineer brief and, for older projects, the AI Automation Portfolio PDF (word for word).
Each project is listed once; GTM categories come first."""
import html, os, re, shutil, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')
FONTS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts_head.html'), encoding='utf-8').read().strip()
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ARCH = os.path.abspath(os.path.join(ROOT, '..', 'Haris portfolio website - old site archive', 'public', 'landing'))
PROJ, WORK = os.path.join(ROOT, 'public', 'projects'), os.path.join(ROOT, 'public', 'work')
e = html.escape

CATS = [
	('signal-intelligence', '01', 'Signal intelligence', 'Know who is in market before your competitors do.'),
	('research-and-enrichment-agents', '02', 'Research and enrichment agents', 'Every account researched to the field, verified at the source, never guessed.'),
	('signal-triggered-outbound', '03', 'Signal-triggered outbound', 'Outreach that starts because something happened, not because a list was due.'),
	('inbound-conversion', '04', 'Inbound conversion', 'Speed to lead and speed to quote.'),
	('retention-and-expansion', '05', 'Retention and expansion', 'Agents that catch customers on the way out, make the right offer and hand warm conversations to the team.'),
	('product-and-platform-engineering', '+', 'Product and platform engineering', 'AI platforms with hybrid retrieval, evaluation pipelines and bank-grade security, not just connected SaaS tools.'),
]
CAT = {c[0]: c for c in CATS}

# project images: public/projects/img/p-<image>.webp, one per project, made from its video design
# (media-src/project-videos/stills.sh): the site's grounds and type, the project's own flow, words and numbers.
# diagrams for the project pages, from the old site archive
FIGS = {
	'household-architecture': os.path.join(ARCH, 'selected', 'media', 'case', '02-architecture.webp'),
	'marketplace-pipeline': os.path.join(ARCH, 'projects', 'media', '01-marketplace', 'pipeline.webp'),
	'marketplace-screens': os.path.join(ARCH, 'projects', 'media', '01-marketplace', 'app-screens.webp'),
	'email-pipeline': os.path.join(ARCH, 'projects', 'media', '03-email-automation', 'pipeline.webp'),
	'email-workflow': os.path.join(ARCH, 'projects', 'media', '03-email-automation', 'workflow.webp'),
	'grc-architecture': os.path.join(ARCH, 'projects', 'media', '04-compliance-platform', 'architecture.webp'),
	'tooling-architecture': os.path.join(ARCH, 'projects', 'media', '07-compliance-tooling', 'architecture.webp'),
}

# Detail pages for projects that had none. Sections: (heading, [blocks]); a block is ('p', text), ('ul', [items]),
# ('fig', figure key, caption) or ('flow', steps, branches).
DETAILS = {
	'household-investing': dict(
		label='Founding engineer', stack='Next.js / React monorepo · Postgres · Vercel', cover='household-investing',
		lead="Co-founding engineer on a consumer fintech product: portfolio tracking, investment research, retirement projection, rebalancing and a natural-language interface backed by a tool-using AI agent that reasons over a household's real financial position. Built as a monorepo of independently deployed apps sharing one design system and one typed database layer, with a confidentiality boundary enforced by the build itself.",
		sections=[
			('Architecture: trust boundary and agent layer', [('fig', 'household-architecture', 'The two databases are separate projects, and a lint rule makes it structurally impossible for the public app to import the private data client.')]),
			('Engineering highlights', [('ul', [
				'Hard confidentiality boundary enforced at the dependency-graph level rather than by convention, so a privacy mistake fails the build instead of reaching production',
				"A live tool-using agent that answers questions against a customer's real financial data and shows the evidence behind each answer",
				'Automated safety tooling in CI, including a pre-commit scanner that blocks confidential figures from ever reaching public-facing code',
				'Security and compliance groundwork ahead of a regulated open-banking data integration: consent architecture, access-control hardening, runtime monitoring'])]),
			('How it is built', [('ul', [
				'Engineered almost entirely through AI-native development workflows: every change reviewed by a fresh-context AI pass before merge, shipped through a sequential rebase-per-PR merge queue, and verified against a real running build rather than tests alone',
				'Two AI development agents now contribute to the same production codebase in parallel, which required explicit ownership and coordination protocols',
				'Hundreds of pull requests and database migrations shipped to a live system over several months of continuous iteration'])]),
			('Status', [('p', 'Live in production and onboarding its first outside beta customers, with real legal, security and compliance groundwork underway for regulated financial-data access.')]),
		]),
	'marketplace-app': dict(
		label='Live on both stores', stack='React / TypeScript · Capacitor native shell · Postgres backend · Cloud macOS CI', cover='marketplace-app',
		lead='Took an existing web marketplace app connecting homeowners with contractors to native mobile and published it to both app stores, working solo from a Windows machine with no Mac hardware anywhere in the pipeline.',
		sections=[
			('Build and release pipeline', [('fig', 'marketplace-pipeline', 'The compliance pass is drawn as a gate because it is what actually decides whether a build ships. Most rejections happen there, not in the code.'),
				('fig', 'marketplace-screens', 'Shipped build: the contractor home screen, a live session with photo exchange, and the ported AI feature turning a finished job into a written, SEO-tagged page.')]),
			('Engineering highlights', [('ul', [
				'Ported an AI content-generation feature from a sister product, where a voice note and job photos become a written write-up, social posts and a review request, and fixed real defects in its outbound integration contract along the way',
				'Diagnosed platform-specific failure modes invisible from the web codebase: a browser API call that works fine in a browser can silently terminate the native iOS process unless the native permission manifest is updated in parallel',
				'Built and owned the entire signed release pipeline, build signing, versioning, store metadata and review submission, with no local Apple hardware'])]),
			('Result', [('p', 'Approved by Apple on the first submission, in a case where an earlier app from the same publisher had been rejected three times. Live on both stores, with the first real business customer onboarded to the AI content feature and verified end to end after launch.')]),
		]),
	'compliance-ai-platform': dict(
		label='Bilingual EN/AR', stack='.NET backend · Angular frontend · Hybrid retrieval with reranking', cover='compliance-ai-platform',
		lead='Core AI engineering on a governance, risk and compliance platform for an enterprise client. I built the retrieval and reasoning layer behind a multi-persona AI consultant system used for regulatory guidance, where a wrong answer is not an inconvenience but a compliance exposure.',
		sections=[
			('Architecture: hybrid retrieval with permissions enforced at the retrieval layer', [('fig', 'grc-architecture', 'Filtering by permission before reranking rather than after means a user can never influence, or infer the existence of, a document they are not entitled to see.')]),
			('Engineering highlights', [('ul', [
				'Hybrid retrieval combining dense vector search with lexical search plus a cross-encoder reranking stage, rather than vector similarity alone',
				'Three-tier multi-tenant permission model enforced inside the retrieval path',
				'Structure-aware chunking with precedence and freshness rules for weighting conflicting source documents'])]),
			('Evaluation work', [('ul', ['Benchmarked 16 candidate local models across persona adherence, retrieval quality and hallucination risk before selecting a production model, which surfaced one high-scoring model that was also the most dangerous on hallucination'])]),
			('Result', [('p', 'Core retrieval architecture shipped into a production compliance platform, with a sanitized write-up published publicly under written client authorization.')]),
		]),
	'compliance-tooling': dict(
		label='Regulated nonprofit', stack='PowerShell CLI · Azure AD OAuth2 with PKCE · Next.js full-stack app', cover='compliance-tooling',
		lead='For a regulated youth-services organisation, I built both the automation and the tooling needed to manage it safely. The platform they were on could only be edited through a limited web designer, which meant no version control, no review and no diffing. So I built a command-line tool that talks to its management API directly.',
		sections=[
			('Operations tooling: turning a GUI-only platform into reviewable code', [('fig', 'tooling-architecture', "The point of the tool is the review step in the middle, which the vendor's own interface made impossible.")]),
			('What I built', [('ul', [
				"A separate full-stack compliance web application with role-based access control across seven distinct staff roles, built to meet the organisation's regulatory data-handling obligations",
				'Automated absence detection and multi-channel escalation layered on top of their existing case-management workflow'])]),
		]),
	'voice-agents': dict(
		label='Multiple independent client deployments', stack='Voice AI platform · Telephony · n8n', cover='voice-agents',
		lead="Inbound voice agents for small trades and home-services businesses: they answer, classify the caller's need, qualify it, and either transfer to the right human or close the loop by text. One deployment layers voice onto an existing vision-based pricing engine, so a caller receives a ballpark estimate by SMS minutes after hanging up.",
		sections=[
			('Architecture: qualify on the call, price after it', [('flow', ['Inbound call', 'Voice agent classifies need', 'Qualification checks'],
				[('no fit', ['Politely closed']), ('human', ['Warm transfer']), ('pricable', ['SMS asks for a photo', 'Vision pricing engine', 'Estimate by text'])])]),
			('What I built', [('ul', [
				'A reusable split between generic agent rules and business-specific rules, which let a proven agent design be cloned into a new vertical by editing only seven items, adding a fifth agent to an existing four-agent deployment with no redesign',
				'Deliberate guard rails on what the agent will not price, so ambiguous jobs route to a human instead of producing a number the business cannot honour'])]),
		]),
	'who-actually-buys': dict(
		label='Event venue client', stack='Prospecting platform · CRM booking-data analysis', cover='who-actually-buys',
		lead="I rebuilt an event venue's ideal customer profile from 344 inquiries and 106 booked events. Its most lucrative format closed less than 1 in 5, while happy hours closed 33 to 44%, so outreach now leads with the easy yes.",
		stats=[('344', 'Venue inquiries'), ('106', 'booked events behind the ICP'), ('Under 1 in 5', 'Close rate of the most lucrative format')],
		sections=[
			('What I built', [('p', 'Built a data-driven ideal-customer-profile model for an event venue by analysing 344 historical booking enquiries against 106 confirmed events, then translated it into concrete prospecting filters and lookalike seeds to produce ready-to-use outbound lists.'),
				('ul', ['Found that the lower-value event format closes at two to three times the rate of the highest-revenue format, and rebuilt outbound targeting priority around close rate rather than headline deal size'])]),
		]),
	'speed-to-quote': dict(
		label='', stack='n8n · Microsoft Graph, Outlook and OneDrive · GPT-5-class models', cover='speed-to-quote',
		lead='For a translation firm, every email and web form is classified, matched to the client record and turned into a drafted quote, with a hard check that stops a wrong number before it ever reaches a customer.',
		sections=[
			('What I built', [('p', 'A production system that handles the full first-response lifecycle for a company receiving a high volume of client document requests: it classifies inbound email and web-form enquiries, files attachments, updates a live CRM ledger, and writes ready-to-send replies for human review. Built as two coordinated workflows, a 224-node email pipeline and a 38-node web-intake pipeline, sharing one CRM, one document store and one set of business-rule documents.')]),
			('Architecture: eight reasoning paths behind a three-layer safety net', [('fig', 'email-pipeline', 'Each AI call is narrowly scoped and schema-constrained. The final gate is deliberately not a model, so a bad draft can be stopped by logic rather than by judgment.'),
				('fig', 'email-workflow', 'The live email workflow, zoomed out: 224 nodes across eight reasoning paths, fanning out from a single intake and converging on one drafting and compliance path. Node labels are illegible at this scale by design, the point is the shape.')]),
			('Design decisions', [('ul', [
				'Eight separate reasoning paths, each with its own tightly scoped model call, instead of one large catch-all prompt',
				'Business rules live in an editable reference document the AI layers read at runtime, so staff can change behaviour without a deployment',
				'Thread-aware state matching across mailbox and CRM, so a reply three weeks later still lands on the right record'])]),
			('Production engineering', [('ul', [
				'Root-caused and fixed an infinite-retry loop, a JSON-injection bug from unescaped input, and a lifecycle gap that could have billed a client twice',
				'Direct API-level integration work to guarantee correct message threading in cases the standard connector could not handle'])]),
			('Result', [('p', "Live in production on a real client inbox, with a phased rollout planned across the company's remaining mailboxes.")]),
		]),
}

# Every project once, GTM categories first. (category, title, card text, label, figure, figure label, cover, page slug)
PROJECTS = [
	('signal-intelligence', 'Finding buyers at the exact moment they need help', '38,548 businesses watched. 51 qualified leads in the first four days.', 'Lead-generation company', '51', 'qualified leads in the first four days', 'signal-engine', 'signal-engine'),
	('signal-intelligence', 'Listening at scale', "I read 4.7 million community comments and pulled out 27,651 demand signals that shaped a fintech's launch positioning and what it built first.", '', '27,651', 'demand signals extracted', 'listening-at-scale', None),
	('research-and-enrichment-agents', 'Researching 80,000 leads without paying for 80,000 deep dives', 'The cheapest source that can answer always goes first.', 'Outbound campaign', '80,000+', 'leads per campaign', 'research-cascade', 'research-cascade'),
	('research-and-enrichment-agents', 'Turning a product into its own growth engine', 'Brands found my client in their own analytics, then reached out.', 'Calendar marketing SaaS', '20+', 'verified fields written back per signup', 'growth-engine', 'growth-engine'),
	('signal-triggered-outbound', 'Finding every credible buyer for a sell-side deal', 'A 530-acquirer universe, delivered the day of the brief.', 'Investment bank, sell-side M&A', '530', 'potential acquirers mapped', 'sell-side-buyers', 'sell-side-buyers'),
	('signal-triggered-outbound', 'Who actually buys', "I rebuilt an event venue's ideal customer profile from 344 inquiries and 106 booked events. Its most lucrative format closed less than 1 in 5, while happy hours closed 33 to 44%, so outreach now leads with the easy yes.", 'Event venue client', '344', 'Venue inquiries', 'who-actually-buys', 'who-actually-buys'),
	('signal-triggered-outbound', 'Social selling with guardrails', 'Profile research, engagement scoring and drafted outreach on LinkedIn for multiple teams, with nothing sent until a person approves it.', '', '', '', 'social-selling', None),
	('inbound-conversion', 'A priced quote in 45 seconds, for eight brands', 'The first company to give a price usually wins the job.', 'Home-service brands', '~45 sec', 'from photo to priced quote', 'instant-quotes', 'instant-quotes'),
	('inbound-conversion', 'Speed to quote', 'For a translation firm, every email and web form is classified, matched to the client record and turned into a drafted quote, with a hard check that stops a wrong number before it ever reaches a customer.', '', '', '', 'speed-to-quote', 'speed-to-quote'),
	('inbound-conversion', 'Voice AI Agents for Service Businesses', "Inbound voice agents for small trades and home-services businesses: they answer, classify the caller's need, qualify it, and either transfer to the right human or close the loop by text.", 'Multiple independent client deployments', '', '', 'voice-agents', 'voice-agents'),
	('retention-and-expansion', 'Revenue agents for a UK broadband provider', '731 new prospects captured, roughly £110k a year in pipeline.', 'UK broadband provider', '731', 'new prospects captured', 'uk-broadband', 'uk-broadband'),
	('product-and-platform-engineering', 'Financial Operating System for Household Investing', "Co-founding engineer on a consumer fintech product: portfolio tracking, investment research, retirement projection, rebalancing and a natural-language interface backed by a tool-using AI agent that reasons over a household's real financial position.", 'Founding engineer', '', '', 'household-investing', 'household-investing'),
	('product-and-platform-engineering', 'Two-Sided Marketplace App, Shipped to Both Stores', 'Took an existing web marketplace app connecting homeowners with contractors to native mobile and published it to both app stores, working solo from a Windows machine with no Mac hardware anywhere in the pipeline.', 'Live on both stores', '', '', 'marketplace-app', 'marketplace-app'),
	('product-and-platform-engineering', 'Enterprise GRC and Compliance AI Platform', 'Core AI engineering on a governance, risk and compliance platform for an enterprise client.', 'Bilingual EN/AR', '', '', 'compliance-ai-platform', 'compliance-ai-platform'),
	('product-and-platform-engineering', 'Compliance Operations Tooling and Full-Stack Platform', 'For a regulated youth-services organisation, I built both the automation and the tooling needed to manage it safely.', 'Regulated nonprofit', '', '', 'compliance-tooling', 'compliance-tooling'),
]
BY = {c[0]: [p for p in PROJECTS if p[0] == c[0]] for c in CATS}
LINKED = [p for p in PROJECTS if p[7]]


def img_size(path):
	out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True).stdout
	w, h = out.strip().split(',')[:2]
	return int(w), int(h)


def media():
	"""Sizes of the project images, and the diagrams copied as they are, for width/height attributes."""
	os.makedirs(os.path.join(PROJ, 'img'), exist_ok=True)
	os.makedirs(os.path.join(WORK, 'img'), exist_ok=True)
	sizes = {}
	for k in {p[6] for p in PROJECTS}:
		sizes['c:' + k] = img_size(os.path.join(PROJ, 'img', f'p-{k}.webp'))
	for k, src in FIGS.items():
		dst = os.path.join(WORK, 'img', k + '.webp')
		shutil.copyfile(src, dst)
		sizes['f:' + k] = img_size(dst)
	return sizes


def between(s, a, b, start=0):
	i = s.index(a, start)
	return s[i:s.index(b, i) + len(b)]


# ---------- category pages and All projects ----------
def listing_pages(sizes):
	src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
	main = src.index('/* Home page')  # the page's main style block (the font block comes first)
	css_all = src[main:src.index('</style>', main)]
	base_css = css_all[css_all.index(':root {'):css_all.index('/* header')]
	nav_css = css_all[css_all.index('/* top bar'):css_all.index('/* hero')]
	end_css = '\n'.join(l for l in css_all.split('\n') if l.startswith('.end'))
	header = between(src, '<header class="topbar">', '</header>')
	footer = between(src, '<footer class="end">', '</footer>')
	nav_js = src[src.index('// Top bar dropdowns'):src.index('// Selected work pages')].rstrip()
	for a in ['#what-i-build', '#how-i-work', '#who-i-am', '#book']:
		header = header.replace(f'href="{a}"', f'href="/{a}"')
		footer = footer.replace(f'href="{a}"', f'href="/{a}"')
	TEX = 'url("/images/pipeline-texture.svg") 0 0 / 360px 240px'
	css = base_css + nav_css + end_css + f'''
.links > li.here > button {{ color: var(--acc); }}
.links > li.here > button::after {{ transform: scaleX(1); }}
.drop a.cur {{ color: var(--acc); }}
.end li a.cur {{ color: #dcc196; }}
.ph {{ position: relative; isolation: isolate; overflow: hidden; background: #0e1726; color: #fff; padding: 60px 0 66px; }}
.ph::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; -webkit-mask-image: linear-gradient(90deg, rgb(0 0 0 / .25), #000 80%); mask-image: linear-gradient(90deg, rgb(0 0 0 / .25), #000 80%); }}
.crumb {{ font-size: 14.5px; color: #9aa5b8; }} .crumb a {{ color: #c3cbd8; }} .crumb a:hover {{ color: #fff; }} .crumb b {{ color: #fff; font-weight: 500; }}
.ph .row {{ margin-top: 24px; display: grid; grid-template-columns: auto 1fr auto; gap: 26px; align-items: center; }}
.ph .num {{ width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; background: #d4b483; color: #0e1726; font: 600 22px "Geist Mono", monospace; }}
.ph h1 {{ font-size: clamp(40px, 4.4vw, 64px); line-height: 1; letter-spacing: -.045em; font-weight: 700; }}
.ph p {{ margin-top: 12px; font-size: 19px; color: #c3cbd8; max-width: 34em; }}
.ph .cnt {{ text-align: right; font-size: 15px; color: #9aa5b8; }} .ph .cnt b {{ display: block; font-size: 44px; line-height: 1; letter-spacing: -.04em; color: #dcc196; }}
.chips {{ position: sticky; top: 0; z-index: 20; background: rgb(250 248 244 / .94); box-shadow: 0 1px 0 var(--line); }}
.chips .wrap {{ display: flex; gap: 8px; overflow-x: auto; padding: 14px 0; scrollbar-width: none; }}
.chips .wrap::-webkit-scrollbar {{ display: none; }}
.chips a {{ flex: none; display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; border-radius: 999px; font-size: 14.5px; font-weight: 500; background: #fff; box-shadow: inset 0 0 0 1px var(--line); transition: background-color .15s ease, color .15s ease; }}
.chips a:hover {{ color: var(--acc); }}
.chips a i {{ font: 500 12px "Geist Mono", monospace; font-style: normal; color: var(--mute); }}
.chips a[aria-current] {{ background: #0e1726; color: #fff; box-shadow: none; }} .chips a[aria-current] i {{ color: #dcc196; }}
.grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }}
.pc {{ display: flex; flex-direction: column; border-radius: 18px; overflow: hidden; background: #fff; box-shadow: 0 0 0 1px var(--line); transition: transform .2s ease, box-shadow .2s ease; }}
a.pc:hover {{ transform: translateY(-3px); box-shadow: 0 0 0 1px var(--line), 0 24px 40px -24px rgb(14 23 38 / .35); }}
a.pc:active {{ transform: scale(.99); }}
.cov {{ position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #0e1726; }}
.cov img {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }}
.cov .badge {{ position: absolute; z-index: 1; left: 14px; top: 14px; padding: 6px 11px; border-radius: 999px; background: #d4b483; color: #0e1726; font: 600 11.5px "Geist Mono", monospace; letter-spacing: .04em; text-transform: uppercase; }}
.cov.made {{ isolation: isolate; color: #fff; display: flex; flex-direction: column; justify-content: flex-end; padding: 22px; }}
.cov.made::before {{ content: ""; position: absolute; inset: 0; z-index: -1; background: {TEX}; opacity: .9; }}
.cov.made b {{ font-size: 52px; line-height: 1; letter-spacing: -.05em; font-weight: 700; color: #dcc196; }}
.cov.made span {{ margin-top: 8px; font-size: 15px; color: #c3cbd8; }}
.cov.made strong {{ font-size: 26px; line-height: 1.12; letter-spacing: -.03em; font-weight: 700; max-width: 12em; }}
.pc .bd {{ flex: 1; display: flex; flex-direction: column; padding: 20px 22px 18px; }}
.pc .meta {{ font: 500 12px "Geist Mono", monospace; letter-spacing: .04em; color: var(--acc); text-transform: uppercase; }}
.pc h3 {{ margin-top: 8px; font-size: 20px; line-height: 1.25; letter-spacing: -.02em; font-weight: 700; }}
.pc p {{ margin-top: 8px; font-size: 15px; line-height: 1.55; color: var(--mute); }}
a.pc p {{ display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }}
.pc .ft {{ margin-top: auto; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; gap: 14px; border-top: 1px solid var(--line); font-size: 14px; }}
.pc .bd > .ft {{ margin-top: auto; }} .pc p + .ft {{ margin-top: 18px; }}
.pc .ft small {{ color: var(--mute); }} .pc .ft small b {{ color: var(--ink); }}
.pc .ft em {{ font-style: normal; font-weight: 600; color: var(--acc); white-space: nowrap; }}
a.pc:focus-visible {{ outline: 2px solid var(--acc); outline-offset: 3px; }}
.body {{ padding: 44px 0 20px; }}
.sec {{ padding-top: 46px; }}
.sec h2 {{ display: flex; align-items: center; gap: 14px; font-size: 28px; letter-spacing: -.025em; font-weight: 700; margin-bottom: 6px; }}
.sec h2 i {{ flex: none; width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: #f2ede3; color: var(--acc); font: 600 13px "Geist Mono", monospace; font-style: normal; }}
.sec h2 a {{ margin-left: auto; font-size: 15px; font-weight: 600; color: var(--acc); white-space: nowrap; }}
.sec > p {{ margin: 0 0 22px 52px; color: var(--mute); }}
.next {{ margin: 46px 0 100px; display: flex; justify-content: space-between; gap: 20px; }}
.next a {{ flex: 1; padding: 22px 26px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--line); transition: box-shadow .2s ease; }}
.next a:hover {{ box-shadow: 0 0 0 1px var(--line), 0 18px 30px -20px rgb(14 23 38 / .3); }}
.next a small {{ display: block; font-size: 13px; color: var(--mute); }} .next a b {{ display: block; margin-top: 4px; font-size: 18px; }}
.next a:last-child {{ text-align: right; }}
@media (max-width: 1000px) {{
	.links {{ display: none; }}
	nav.top {{ grid-template-columns: 1fr auto; height: 72px; }}
	.grid {{ grid-template-columns: 1fr 1fr; }}
	.ph .row {{ grid-template-columns: auto 1fr; }} .ph .cnt {{ display: none; }}
	.end .end-cols {{ grid-template-columns: 1fr 1fr; }} .end .end-cols > div:first-child {{ grid-column: 1 / -1; }} .end .end-card {{ max-width: 440px; }}
}}
@media (max-width: 600px) {{
	.logo span {{ display: none; }} .logo b {{ white-space: nowrap; }} .top-right .icon-btn {{ display: none; }}
	.grid {{ grid-template-columns: 1fr; }}
	.ph {{ padding: 44px 0 50px; }} .ph .row {{ grid-template-columns: 1fr; gap: 18px; }} .ph .num {{ width: 60px; height: 60px; font-size: 18px; }}
	.ph p {{ font-size: 17px; }}
	.sec h2 {{ font-size: 22px; flex-wrap: wrap; }} .sec h2 a {{ margin-left: 52px; }} .sec > p {{ margin-left: 0; }}
	.next {{ flex-direction: column; }} .next a:last-child {{ text-align: left; }}
	.end .end-cols {{ grid-template-columns: 1fr; gap: 36px; }} .end .end-legal {{ flex-direction: column; }}
}}
'''

	def card(p):
		cat, t, s, label, fig, fl, cov, slug = p
		cname = CAT[cat][2]
		if cov:
			w, h = sizes['c:' + cov]
			top = f'<div class="cov"><img src="/projects/img/p-{cov}.webp" alt="" width="{w}" height="{h}" loading="lazy" decoding="async" /></div>'
		elif fig:
			top = f'<div class="cov made"><span class="badge">{e(cname)}</span><b>{e(fig)}</b><span>{e(fl)}</span></div>'
		else:
			top = f'<div class="cov made"><span class="badge">{e(cname)}</span><strong>{e(t)}</strong></div>'
		meta = f'<span class="meta">{e(label)}</span>' if label else ''
		if not slug:
			return f'<div class="pc">{top}<div class="bd">{meta}<h3>{e(t)}</h3><p>{e(s)}</p></div></div>'
		note = f'<small><b>{e(fig)}</b> {e(fl)}</small>' if (fig and cov) else '<small></small>'
		return f'<a class="pc" href="/work/{slug}.html">{top}<div class="bd">{meta}<h3>{e(t)}</h3><p>{e(s)}</p><div class="ft">{note}<em>View project &rarr;</em></div></div></a>'

	def chips(active):
		cur = ' aria-current="page"'
		return ('<nav class="chips" aria-label="Project categories"><div class="wrap">'
			+ f'<a href="/projects/all.html"{cur if active == "all" else ""}>All projects <i>{len(PROJECTS)}</i></a>'
			+ ''.join(f'<a href="/projects/{k}.html"{cur if active == k else ""}>{e(nm)} <i>{len(BY[k])}</i></a>' for k, n, nm, l in CATS)
			+ '</div></nav>')

	def page(title, desc, body, active):
		hd = header.replace('<li class="has-drop">', '<li class="has-drop here">', 1)
		if active != 'all':
			hd = hd.replace(f'<a href="/projects/{active}.html">', f'<a href="/projects/{active}.html" class="cur">', 1)
		ft = footer.replace(f'<a href="/projects/{active}.html">', f'<a href="/projects/{active}.html" class="cur" aria-current="page">', 1) if active != 'all' else footer.replace('<a class="all" href="/projects/all.html">', '<a class="all" href="/projects/all.html" aria-current="page">', 1)
		return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{e(title)} | Muhammad Haris, AI GTM Engineer</title>
<meta name="description" content="{e(desc)}" />
{FONTS}
<style>
/* Built by media-src/projects/build.py, do not edit by hand. */
{css}
</style>
</head>
<body>
{hd}
{body}
{ft}
<script>
{nav_js}

// Category strip: on narrow screens, start scrolled to the current category
;(function () {{
	const a = document.querySelector('.chips [aria-current]')
	if (a) a.parentElement.scrollLeft = a.offsetLeft - a.parentElement.offsetLeft
}})()
</script>
</body>
</html>
'''

	for i, (k, n, nm, line) in enumerate(CATS):
		prev_c, next_c = CATS[i - 1], CATS[(i + 1) % len(CATS)]
		count = len(BY[k])
		body = f'''<main>
<section class="ph"><div class="wrap">
	<div class="crumb"><a href="/projects/all.html">Selected work</a> / <b>{e(nm)}</b></div>
	<div class="row"><div class="num">{n}</div><div><h1>{e(nm)}</h1><p>{e(line)}</p></div><div class="cnt"><b>{count}</b>{'project' if count == 1 else 'projects'}</div></div>
</div></section>
{chips(k)}
<div class="wrap body">
	<div class="grid">{''.join(card(p) for p in BY[k])}</div>
	<nav class="next" aria-label="More categories"><a href="/projects/{prev_c[0]}.html"><small>&larr; {prev_c[1]}</small><b>{e(prev_c[2])}</b></a><a href="/projects/{next_c[0]}.html"><small>{next_c[1]} &rarr;</small><b>{e(next_c[2])}</b></a></nav>
</div>
</main>'''
		open(os.path.join(PROJ, k + '.html'), 'w', encoding='utf-8').write(page(nm, line, body, k))

	lede = 'Most GTM help covers one piece. I build across all five, and I connect them so data flows from the first signal to the renewal.'
	body = f'''<main>
<section class="ph"><div class="wrap">
	<div class="crumb"><b>Selected work</b></div>
	<div class="row"><div class="num">{len(PROJECTS)}</div><div><h1>Selected work</h1><p>{e(lede)}</p></div><div></div></div>
</div></section>
{chips('all')}
<div class="wrap body">
	{''.join(f'<section class="sec" aria-labelledby="sec-{k}"><h2 id="sec-{k}"><i>{n}</i>{e(nm)}<a href="/projects/{k}.html">View all {len(BY[k])} &rarr;</a></h2><p>{e(l)}</p><div class="grid">{"".join(card(p) for p in BY[k])}</div></section>' for k, n, nm, l in CATS)}
	<div class="next"></div>
</div>
</main>'''
	open(os.path.join(PROJ, 'all.html'), 'w', encoding='utf-8').write(page('Selected work', lede, body, 'all'))


# ---------- project pages, in the same frame as the case pages ----------
def detail_pages(sizes):
	ref = open(os.path.join(WORK, 'signal-engine.html'), encoding='utf-8').read()
	main = ref.rindex('<style>')  # the case page's own styles (the font block comes first)
	css = ref[main + 7:ref.index('</style>', main)]
	header = between(ref, '<header class="topbar">', '</header>').replace(' class="cur"', '')
	tail = ref[ref.index('<section class="cta">'):ref.index('</html>')]
	css += '''
.shot { margin: 0 0 10px; aspect-ratio: 16 / 9; border-radius: 18px; overflow: hidden; background: #0e1726; }
.shot img { display: block; width: 100%; height: 100%; object-fit: cover; }
.body .txt ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 14px; }
.body .txt ul li { position: relative; padding-left: 22px; font-size: 17.5px; line-height: 1.65; color: #2a3343; }
.body .txt ul li::before { content: ""; position: absolute; left: 0; top: .62em; width: 8px; height: 8px; background: #d4b483; }
.body .txt p + ul, .body .txt ul + p, .body .txt figure + figure { margin-top: 22px; }
.fig { margin: 0; }
.fig img { display: block; width: 100%; height: auto; border-radius: 14px; background: #fff; box-shadow: 0 0 0 1px var(--line); }
.fig figcaption { margin-top: 12px; font-size: 15.5px; line-height: 1.6; color: var(--mute); }
.flow { display: grid; gap: 14px; }
.flow ol { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.flow li { display: inline-flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; }
.flow li span { padding: 10px 14px; border-radius: 10px; background: #fff; box-shadow: 0 0 0 1px var(--line); }
.flow li + li::before { content: "\\2192"; color: var(--acc); font-weight: 600; }
.flow .br { display: grid; grid-template-columns: 110px 1fr; gap: 12px; align-items: center; padding-left: 18px; border-left: 2px solid #d4b483; }
.flow .br b { font: 500 12.5px "Geist Mono", monospace; color: var(--acc); }
.flow .main li:last-child span { background: #0e1726; color: #fff; box-shadow: none; }
@media (max-width: 680px) { .flow .br { grid-template-columns: 1fr; } }
'''

	def block(b):
		if b[0] == 'p':
			return f'<p>{e(b[1])}</p>'
		if b[0] == 'ul':
			return '<ul>' + ''.join(f'<li>{e(x)}</li>' for x in b[1]) + '</ul>'
		if b[0] == 'fig':
			w, h = sizes['f:' + b[1]]
			return f'<figure class="fig"><img src="/work/img/{b[1]}.webp" alt="" width="{w}" height="{h}" loading="lazy" decoding="async" /><figcaption>{e(b[2])}</figcaption></figure>'
		if b[0] == 'flow':
			steps = lambda xs: '<ol>' + ''.join(f'<li><span>{e(x)}</span></li>' for x in xs) + '</ol>'
			return '<div class="flow"><div class="main">' + steps(b[1]) + '</div>' + ''.join(f'<div class="br"><b>{e(k)}</b>{steps(xs)}</div>' for k, xs in b[2]) + '</div>'

	for p in LINKED:
		cat, t, s, label, fig, fl, cov, slug = p
		if slug not in DETAILS:
			continue
		d = DETAILS[slug]
		cname = CAT[cat][2]
		i = LINKED.index(p)
		prev_p, next_p = LINKED[i - 1], LINKED[(i + 1) % len(LINKED)]
		hd = header.replace(f'<a href="/projects/{cat}.html">', f'<a href="/projects/{cat}.html" class="cur">', 1)
		stats = ''
		if d.get('stats'):
			stats = f'<section class="stats" style="--n:{len(d["stats"])}" aria-label="Results">' + ''.join(f'<div><b>{e(v)}</b><span>{e(l)}</span></div>' for v, l in d['stats']) + '</section>'
		shot = ''
		if d.get('cover'):
			w, h = sizes['c:' + d['cover']]
			shot = f'<figure class="shot"><img src="/projects/img/p-{d["cover"]}.webp" alt="" width="{w}" height="{h}" /></figure>'
		sections = ''.join(f'<h2>{e(hname)}</h2><div class="txt">{"".join(block(b) for b in blocks)}</div>' for hname, blocks in d['sections'])
		client = f'\n\t\t<span class="client">{e(d["label"])}</span>' if d['label'] else ''
		page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{e(t)} | Muhammad Haris, AI GTM Engineer</title>
<meta name="description" content="{e(s)}" />
{FONTS}
<style>
/* Built by media-src/projects/build.py, do not edit by hand. */
{css}</style>
</head>
<body>
{hd}
<div class="wrap">
	<a class="back" href="/projects/{cat}.html">&larr; {e(cname)}</a>
	<header class="head">
		<span class="tag">{e(cname)}</span>{client}
		<h1>{e(t)}</h1>
		<p class="sub">{e(d['lead'])}</p>
	</header>
	{stats}{shot}
	<section class="body">
		{sections}
		<h2>Under the hood</h2><div class="txt"><p class="under">{e(d['stack'])}</p></div>
	</section>
	<div class="more">
		<a href="/work/{prev_p[7]}.html"><small>&larr; Selected work</small><b>{e(prev_p[1])}</b></a>
		<a href="/work/{next_p[7]}.html"><small>Selected work &rarr;</small><b>{e(next_p[1])}</b></a>
	</div>
</div>
{tail}</html>
'''
		open(os.path.join(WORK, slug + '.html'), 'w', encoding='utf-8').write(page)


def words():
	"""Every visible string the build adds, for the word-for-word check."""
	out = [c[2] for c in CATS] + [c[3] for c in CATS]
	for p in PROJECTS:
		out += [x for x in (p[1], p[2], p[3], p[5]) if x]
	for d in DETAILS.values():
		out += [d['lead']] + ([d['label']] if d['label'] else []) + [l for v, l in d.get('stats', [])]
		for hname, blocks in d['sections']:
			out.append(hname)
			for b in blocks:
				if b[0] == 'p': out.append(b[1])
				if b[0] == 'ul': out += b[1]
				if b[0] == 'fig': out.append(b[2])
				if b[0] == 'flow': out += b[1] + [k for k, xs in b[2]] + [x for k, xs in b[2] for x in xs]
		out += [x.strip() for x in d['stack'].split('·')]
	return out


if __name__ == '__main__':
	os.makedirs(PROJ, exist_ok=True)
	sizes = media()
	listing_pages(sizes)
	detail_pages(sizes)
	open(os.path.join(os.path.dirname(__file__), 'words.txt'), 'w', encoding='utf-8').write('\n'.join(words()))
	print('built', len(CATS), 'category pages, all.html,', len(DETAILS), 'project pages;', len(PROJECTS), 'projects')
