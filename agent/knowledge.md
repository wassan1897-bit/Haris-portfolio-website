# Muhammad Haris: everything the website assistant knows

All facts come from the website (home page, resume and every project page).
Page links are paths on the website, for example /work/signal-engine.html.

---

## 1. Who Haris is

- Name: Muhammad Haris. Title: AI GTM Engineer.
- Tagline: "Signals in. Pipeline out."
- The engineer revenue leaders bring in when they want AI that produces pipeline, not a demo, built well enough to keep running after he has left.
- "One person, both languages, the whole system." He speaks revenue and code.
- Works directly with companies: B2B SaaS and technology companies (usually growth stage) that want pipeline without simply hiring more SDRs; revenue leaders (founders, CROs, heads of growth, sales and marketing leaders, RevOps); and firms with a high-value sales motion (investment banks and M&A advisors, lead-generation businesses, companies with heavy inbound demand).
- Builds AI systems that find buyers, research them, reach them at the right moment and keep them.
- Not an agency. Doesn't hand work to juniors. The person you talk to is the person who builds it and who answers when it needs attention.

### Contact
- Email: hariswassan001@gmail.com
- LinkedIn: linkedin.com/in/muhammad-haris-wassan
- GitHub: github.com/Haris001-bit
- Book a meeting: the "Book a meeting" section at the bottom of the home page (/#book)
- Resume: /resume.html

### Experience
- AI GTM Engineer (current): works directly with founders and revenue leaders on signal engines, research agents, inbound conversion and retention agents.
- Founding AI Engineer, RevAll AI (Pyle Ventures): early-stage fintech building a read-only investing platform. Built the AI layer (a research agent with guardrails and a streaming safety filter, an MCP server with hashed, revocable access tokens so a user's own AI assistant can query their data) and the security programme for bank-data access (two-step sign-in enforced in the database, versioned consent records, rate limits, row-level security, monitoring, a CI security gate). Read-only by design: it never moves money.
- AI Automation Lead, Solidrange: led AI on a multi-tenant compliance platform for a Riyadh-based company, in English and Arabic. Hybrid retrieval with reranking, per-tenant access control at the retrieval layer, 16 specialised AI personas, graph memory, browser automation, and an evaluation pipeline with RAGAS and Arize Phoenix. Full-stack in .NET and React with a Python retrieval service.
- These roles involved building AI under the hardest constraints: money, regulation and multiple tenants. That's why companies trust him with agents near their revenue.

### Education
- Management Sciences, Lahore University of Management Sciences (LUMS).

---

## 2. What makes him different

- Systems, not workflows. Every engagement is end to end: the data, the agents, the CRM and the reporting. Nothing is handed over half-connected.
- Agents where judgment helps, plain code where mistakes cost money. AI reads, researches and decides what deserves attention. Deterministic logic handles anything that touches a price, a send or a customer record.
- A production standard most GTM work never reaches: evaluations, guardrails, strict output formats on every AI step, human approval before anything sensitive reaches a customer, monitoring once live.
- Revenue first, tools last. Starts from where pipeline leaks and works back to the build.
- Builds real software: AI platforms with hybrid retrieval, evaluation pipelines and bank-grade security, not just connected SaaS tools.
- Has built where the stakes are highest: bank data, regulated compliance, multi-tenant platforms.

### What he brings to every engagement
- Speaks revenue and code: can sit in a pipeline review in the morning and ship the fix in the afternoon.
- Builds the whole system: signal, research, outreach, conversion, retention and the data underneath, wired together.
- Production or nothing: real data from the first week, evaluations, guardrails, monitoring, and a person in the loop wherever a mistake would reach a customer.

### Point of view
- Cheap sources first. Expensive ones only when they earn it.
- No agent talks to a prospect without a guardrail.
- The best outbound looks like value arriving before the pitch.
- Pipeline is pipeline. Revenue is revenue. Never confused in a report.
- If it can't run unattended, it isn't finished.

---

## 3. How he works

1. Sits with the people doing the work: sales, marketing, support, ops. Learns how a lead really moves through the company.
2. Finds where revenue leaks: the handoff that drops leads, research nobody has time for, the quote that takes a day, the customer who leaves without anyone asking why.
3. Rebuilds the process as a system: agents for judgment, plain code for money, a person in the loop wherever a mistake would reach a customer.
4. Ships into production, not a demo: real data, real customers from the first week, then monitoring, evaluation and fixes.
5. Hands it over so the team owns it: documented, explained and understood. Stays close until it runs without him.

---

## 4. What he builds: five stages of the revenue engine

Most GTM help covers one piece. Haris builds across all five and connects them so data flows from the first signal to the renewal.

| Stage | What it means | Headline result | Page |
|---|---|---|---|
| 01 Signal intelligence | Know who is in market before your competitors do | 51 qualified leads in the first four days | /projects/signal-intelligence.html |
| 02 Research and enrichment agents | Every account researched to the field, verified at the source, never guessed | 29 data points researched per lead | /projects/research-and-enrichment-agents.html |
| 03 Signal-triggered outbound | Outreach that starts because something happened, not because a list was due | 530 potential acquirers mapped | /projects/signal-triggered-outbound.html |
| 04 Inbound conversion | Speed to lead and speed to quote | ~45 sec from photo to priced quote | /projects/inbound-conversion.html |
| 05 Retention and expansion | Agents that catch customers on the way out, make the right offer and hand warm conversations to the team | 731 new prospects captured | /projects/retention-and-expansion.html |
| + Product and platform engineering | AI platforms with hybrid retrieval, evaluation pipelines and bank-grade security | 9 production pipelines, one connected system | /projects/product-and-platform-engineering.html |

All 15 projects: /projects/all.html

---

## 5. All projects in detail

### Signal intelligence

**Finding buyers at the exact moment they need help** (lead-generation company). Page: /work/signal-engine.html
- Situation: the client sells to local businesses right after something goes wrong with their public listing. A day late and a competitor wins; a false alarm burns the lead.
- Built: a monitor watching 38,548 business listings around the clock. When it spots the trigger it holds the lead, checks again independently, and only then hands it to sales. Nothing reaches a rep without being confirmed twice. A weekly risk model predicts which businesses will hit the trigger next. When a business signs, its record flows into the CRM in about two seconds.
- Results: 51 qualified leads in the first four days, every lead confirmed twice. The highest-risk tenth triggered 4.5x more often than average. Runs unattended.
- Tools: Postgres, headless browser verification, Python, statistical risk scoring, n8n.

**Listening at scale** (fintech). No separate page.
- Read 4.7 million community comments and pulled out 27,651 demand signals that shaped a fintech's launch positioning and what it built first.

### Research and enrichment agents

**Researching 80,000 leads without paying for 80,000 deep dives** (outbound campaign). Page: /work/research-cascade.html
- Situation: 80,000+ leads needed 29 data points each, starting from just a name and website. No single provider had all 29 fields, and running everything through expensive tools would cost more than the campaign was worth.
- Built: a cascade. Every lead starts at the cheapest source. Only missing fields move down to the next, more powerful source: data-provider waterfall, then an agent reading the organization's website and public filings, then a research agent with live web search. The last agent leaves a field blank rather than invent an answer. Finished records go straight into sequencing, and spending stops the moment someone replies or bounces.
- Results: decision-maker-level data at campaign scale, cost tied to how hard each lead is, never making a field up. 4 tiers, each used only when needed.
- Tools: Apollo, Clay, Firecrawl, Claude research agents, Instantly, n8n.

**Turning a product into its own growth engine** (calendar marketing SaaS). Page: /work/growth-engine.html
- Situation: the platform wanted more of the right companies using it without an outbound team, and sales couldn't tell which daily signups were worth a call.
- Built: two engines. The first finds brands that run events, reads their websites and socials, and builds each a ready-made public calendar on the platform, with AI-written event descriptions that rank in search and AI answers, each linking back to the brand's site with attribution tagging. A person approves each event before it goes live. The second engine reads every new signup instantly, sets personal emails aside, and research agents establish industry, which of three products fits, role and company size, each with evidence and a confidence score.
- Results: brands saw traffic from the client in their own analytics and reached out ("outbound in reverse"). Sales now works a ranked pipeline. 9 production pipelines, 14 industry groups classified per signup, 20+ verified fields written back per signup.
- Tools: AI research agents, GPT-4o, Firecrawl, Webflow CMS, attribution tagging, Zapier, Apps Script.

### Signal-triggered outbound

**Finding every credible buyer for a sell-side deal** (investment bank, sell-side M&A). Page: /work/sell-side-buyers.html
- Situation: the bank needed every realistic buyer for its client, who decides inside each, and in what order to approach them, fast and to a banker's standard.
- Built: research agents on comparable deals to learn what buyers paid for and why; a universe of 530 potential acquirers across 16 categories, ranked into 3 outreach waves, with exact roles to contact and a spec for the bank's enrichment tools. Plus a signal agent reading acquisition press releases to find active buyers and their decision makers, with two different AI models checking every match.
- Results: delivered the day of the brief; the bank could start working it the same day.
- Tools: Claude research agents, Perplexity, DeepSeek, Clay.

**Who actually buys** (event venue). Page: /work/who-actually-buys.html
- Built a data-driven ideal customer profile from 344 booking inquiries and 106 confirmed events, then turned it into prospecting filters and lookalike seeds for outbound lists.
- Finding: the most lucrative format closed under 1 in 5, while happy hours closed 33 to 44% (2 to 3x the rate). Outreach now leads with the easy yes, prioritizing close rate over headline deal size.
- Tools: prospecting platform, CRM booking-data analysis.

**Social selling with guardrails**. No separate page.
- Profile research, engagement scoring and drafted outreach on LinkedIn for multiple teams, with nothing sent until a person approves it.

### Inbound conversion

**A priced quote in 45 seconds, for eight brands** (home-service brands). Page: /work/instant-quotes.html
- Situation: in home services the first company to give a price usually wins, but pricing a tree job normally means a site visit.
- Built: an AI estimator that prices a job from a single photo, deployed across eight tree-service brands under their own names. A homeowner uploads a photo and gets a branded quote by email and text in about 45 seconds, while the lead drops into the CRM. A voice agent handles callers, asks them to text a photo and replies with a price. A feedback loop compares AI quotes with what each job actually sold for, so pricing learns per company.
- Results: instant quotes on web and phone, no lead left without an answer. 8 brands, 2 channels.
- Tools: GPT-5 vision, voice agents, Twilio, CRM integration, Supabase, n8n.

**Speed to quote** (translation firm). Page: /work/speed-to-quote.html
- Built: a production system for the full first-response lifecycle: classifies inbound emails and web forms, files attachments, updates a live CRM ledger, and writes ready-to-send replies for human review. Two workflows: a 224-node email pipeline and a 38-node web-intake pipeline.
- Design: eight separate tightly scoped reasoning paths instead of one big prompt; a three-layer safety net whose final gate is logic, not a model, so a wrong number never reaches a customer; business rules in an editable document staff can change without a deployment; thread-aware matching so a reply weeks later lands on the right record.
- Fixed: an infinite-retry loop, a JSON-injection bug, and a lifecycle gap that could have billed a client twice.
- Results: live in production on a real client inbox, with rollout planned across remaining mailboxes.
- Tools: n8n, Microsoft Graph, Outlook, OneDrive, GPT-5-class models.

**Voice AI agents for service businesses** (multiple client deployments). Page: /work/voice-agents.html
- Inbound voice agents for small trades and home-services businesses: they answer, classify the caller's need, qualify it, and either warm-transfer to the right human or close the loop by text.
- One deployment layers voice onto a vision pricing engine, so a caller gets a ballpark estimate by SMS minutes after hanging up.
- A reusable split between generic and business-specific rules means a proven agent can be cloned into a new vertical by editing only seven items (a fifth agent was added to a four-agent deployment with no redesign).
- Guardrails on what the agent won't price: ambiguous jobs go to a human instead of a number the business can't honour.
- Tools: voice AI platform, telephony, n8n.

### Retention and expansion

**Revenue agents for a UK broadband provider**. Page: /work/uk-broadband.html
- Situation: support was so busy that sales opportunities slipped through, and customers who asked to leave were processed out with nobody learning why.
- Built: an AI agent handling customer conversations. Mid-chat it checks the account and live outages, routes to the right one of seven departments, and for new enquiries checks the address and creates a sales prospect. A second agent handles customers asking to switch away: checks consent, picks a personalized offer from the real price list, reaches them on WhatsApp, and hands interested customers to the retention team with context.
- Results: 8,700+ tickets handled by AI, an estimated 79,000+ agent minutes saved, 731 new prospects captured, roughly £110k a year in pipeline. For the first time the company knows why customers leave.
- Tools: Voiceflow, n8n, WhatsApp Cloud API, CRM integration, Airtable analytics.

### Product and platform engineering

**Financial operating system for household investing** (founding engineer). Page: /work/household-investing.html
- Co-founding engineer on a consumer fintech product: portfolio tracking, investment research, retirement projection, rebalancing, and a natural-language interface backed by a tool-using AI agent that reasons over a household's real financial position and shows evidence for each answer.
- Hard confidentiality boundary enforced by the build itself, so a privacy mistake fails the build instead of reaching production. Pre-commit scanner blocks confidential figures. Security and consent groundwork for regulated open-banking data access.
- Built with AI-native workflows: every change reviewed by a fresh AI pass, hundreds of pull requests and migrations shipped over several months.
- Status: live in production and onboarding its first outside beta customers.
- Tools: Next.js / React monorepo, Postgres, Vercel.

**Two-sided marketplace app, shipped to both stores**. Page: /work/marketplace-app.html
- Took a web marketplace connecting homeowners with contractors to native mobile and published it to both app stores, solo, from a Windows machine with no Mac hardware.
- Ported an AI content feature (voice note and job photos become a write-up, social posts and a review request); owned the full signed release pipeline.
- Result: approved by Apple on the first submission, where an earlier app from the same publisher was rejected three times. Live on both stores with the first business customer onboarded.
- Tools: React / TypeScript, Capacitor, Postgres, cloud macOS CI.

**Enterprise GRC and compliance AI platform** (bilingual English/Arabic). Page: /work/compliance-ai-platform.html
- Core AI engineering on a governance, risk and compliance platform: the retrieval and reasoning layer behind a multi-persona AI consultant for regulatory guidance, where a wrong answer is a compliance exposure.
- Hybrid retrieval (dense vector plus lexical search plus cross-encoder reranking), a three-tier multi-tenant permission model enforced inside retrieval, structure-aware chunking with precedence and freshness rules.
- Benchmarked 16 local models on persona adherence, retrieval quality and hallucination risk before choosing one for production.
- Result: shipped into a production compliance platform.
- Tools: .NET backend, Angular frontend, hybrid retrieval with reranking.

**Compliance operations tooling and full-stack platform** (regulated youth-services nonprofit). Page: /work/compliance-tooling.html
- Built a command-line tool that talks to the platform's management API directly, turning a GUI-only platform into reviewable, version-controlled code.
- Built a separate full-stack compliance web app with role-based access across seven staff roles, plus automated absence detection and multi-channel escalation on the existing case-management workflow.
- Tools: PowerShell CLI, Azure AD OAuth2 with PKCE, Next.js.

---

## 6. What clients say

- "Haris is one of the best developers [I] have worked with, incredibly responsive and managed to help guide me to the most efficient workflows and techniques to deliver my project. I would recommend him to any other mid-market or enterprise companies as he has been very reliable and effective."
- "Working with Muhammad was a great experience. He takes the time to thoroughly understand the project before diving in, communicates clearly, and consistently shows strong attention to detail."
- "Muhammad was a pleasure to work with. He communicates clearly, works efficiently, and consistently delivers high-quality results. He is responsive, proactive, and easy to collaborate with."

---

## 7. Toolkit

- AI and agents: Claude and OpenAI APIs, Perplexity.
- AI GTM tools (signal, research and outbound): Apollo, Clay, HeyReach, LinkedIn Sales Navigator, La Growth Machine, GoHighLevel (GHL), Firecrawl, Apify, Browserless, Serper, NeverBounce, Instantly.
- Product and platform engineering: Python and FastAPI; TypeScript, Next.js and React; .NET; Supabase and Postgres with row-level security; Docker.
- Revenue systems and data: HubSpot, Jobber, GoHighLevel, Webflow CMS.
- Voice agents: Vapi, ElevenLabs, Voiceflow.
- Orchestration: n8n, Zapier, Make, Power Automate.
- Engineering practice: Claude Code, Cursor, Antigravity, CI security gates, Sentry monitoring, secret scanning.

---

## 8. Things the assistant does not know

Pricing, rates, contract terms, availability, start dates and client names are not on the website.
For any of these, offer to book a meeting with Haris or give his email: hariswassan001@gmail.com.
