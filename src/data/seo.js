// Text only search engines, AI assistants and link previews read: page titles, meta descriptions and image
// alt text. None of it is shown on the page. Descriptions stay within about 160 characters, titles within 60.

export const HOME_TITLE = 'Muhammad Haris | AI GTM Engineer for Revenue Teams'
export const HOME_DESCRIPTION = 'Muhammad Haris, AI GTM engineer. I build the AI systems behind every stage of the revenue engine, from signal to retention: pipeline, not a demo.'

export const PAGE_DESCRIPTIONS = {
  reviews: 'What clients say about working with Muhammad Haris, AI GTM engineer: responsive, reliable and willing to go above and beyond. Ten reviews in their own words.',
  privacy: 'What this website collects, why, who handles it and how to ask for it to be deleted. No cookies, no analytics, no ads and no tracking pixels.',
}

export const CATEGORY_DESCRIPTIONS = {
  'signal-intelligence': 'Know who is in market before your competitors do: signal-intelligence systems that watched 38,548 business listings and found 51 qualified leads in four days.',
  'research-and-enrichment-agents': 'Every account researched to the field, verified at the source, never guessed: AI research agents that took 80,000+ leads to 29 data points each.',
  'signal-triggered-outbound': 'Outreach that starts because something happened, not because a list was due: a 530-acquirer M&A buyer map and an ICP rebuilt from 344 inquiries.',
  'inbound-conversion': 'Speed to lead and speed to quote: a priced quote from a photo in about 45 seconds for eight brands, AI-drafted quotes and inbound voice agents.',
  'retention-and-expansion': 'Agents that catch customers on the way out and make the right offer: 8,700+ tickets handled by AI and about £110k a year in new pipeline.',
  'product-and-platform-engineering': 'AI platforms with hybrid retrieval, evaluation pipelines and bank-grade security: a fintech AI agent, a marketplace app on both stores and a compliance AI.',
}

// title: a shorter page title where the headline plus the name runs past 60 characters (the headline on the page stays)
export const WORK_SEO = {
  'signal-engine': {
    title: 'Finding buyers the moment they need help',
    description: 'A signal engine for a lead-generation company: 38,548 business listings monitored and 51 qualified leads in the first four days, reached at the right moment.',
    alt: 'Grid of monitored business listings beside a counter: 38,548 business listings monitored',
  },
  'research-cascade': {
    title: 'Researching 80,000 leads, cheapest first',
    description: 'AI research agents for an 80,000-lead outbound campaign: 29 data points per lead across four tiers, where the cheapest source that can answer always goes first.',
    alt: 'Four-tier research cascade, from the cheapest source to a research agent with live web search, filling 28 of 29 fields and leaving one blank',
  },
  'growth-engine': {
    title: 'Turning a product into a growth engine',
    description: 'For a calendar marketing SaaS: 9 production pipelines sorting every signup into 14 industry groups and write back 20+ verified fields. Brands then reached out.',
    alt: 'Signup research flow: every new signup, personal email addresses set aside, industry, role and company size researched, then evidence and a confidence score',
  },
  'sell-side-buyers': {
    title: 'Every credible buyer for a sell-side deal',
    description: "For an investment bank's sell-side M&A process: 530 potential acquirers mapped into 16 buyer categories and 3 prioritized outreach waves, the day of the brief.",
    alt: 'Sixteen grids of dots, one per buyer category, covering 530 potential acquirers in three prioritized outreach waves',
  },
  'who-actually-buys': {
    description: "An event venue's ideal customer profile rebuilt from 344 inquiries and 106 booked events. Happy hours closed 33 to 44%, so outreach now leads with the easy yes.",
    alt: 'Close rates compared: the most lucrative event format closes less than 1 in 5, happy hours close 33 to 44%',
  },
  'instant-quotes': {
    title: 'A priced quote in 45 seconds for 8 brands',
    description: "AI quoting for eight home-service brands: from a customer's photo to a priced quote in about 45 seconds, on the web and by phone. The first price usually wins.",
    alt: 'A phone with a photo of a tree next to a branded quote sent by email and text in about 45 seconds',
  },
  'speed-to-quote': {
    description: 'For a translation firm: every email and web form is classified, matched to the client record and drafted into a quote, with a hard check against wrong numbers.',
    alt: 'Quote pipeline: email or web form, AI routing across 8 paths, draft writer, AI compliance pass, deterministic gate, then mailbox draft or human escalation',
  },
  'voice-agents': {
    description: "Inbound voice AI agents for trades and home-services businesses: they answer, qualify the caller and transfer to the right person or close the loop by text.",
    alt: 'Voice agent call flow: inbound call, need classified, qualification checks, then closed politely, a warm transfer, or an SMS photo request priced into an estimate',
  },
  'uk-broadband': {
    description: 'Revenue agents for a UK broadband provider: 8,700+ tickets handled by AI, 79,000+ agent minutes saved, 731 new prospects and about £110k a year in pipeline.',
    alt: 'Results: 8,700+ tickets handled by AI, 79,000+ agent minutes saved (estimated), 731 new prospects captured, about £110k annual pipeline created',
  },
  'household-investing': {
    title: 'Financial OS for Household Investing',
    description: 'Co-founding engineer on a household investing app: portfolio tracking, research, retirement projection and a tool-using AI agent over real financial data.',
    alt: 'Monorepo architecture: CI gates, an investing app and a content app, a private money and auth database, a public database with no personal data, and an AI agent',
  },
  'marketplace-app': {
    title: 'Marketplace App, Shipped to Both Stores',
    description: 'A homeowner-to-contractor marketplace taken from web to native mobile and shipped to both app stores, built solo from a Windows machine with no Mac hardware.',
    alt: 'Release pipeline from a Windows machine with no Mac: native shell, a signed bundle to Google Play, and a cloud macOS build signed and uploaded to the App Store',
  },
  'compliance-ai-platform': {
    description: 'AI engineering on an enterprise governance, risk and compliance platform: hybrid retrieval with permissions enforced before reranking, in English and Arabic.',
    alt: 'Retrieval flow: question, query planner, dense and keyword search over a chunked corpus, tenant and role filter, rerank, grounded answer with citations',
  },
  'compliance-tooling': {
    title: 'Compliance Operations Tooling and Platform',
    description: 'For a regulated youth-services nonprofit: compliance automation plus a command-line tool that put a GUI-only platform under version control and review.',
    alt: 'Tool flow: purpose-built CLI, OAuth2 PKCE sign-in, management API, pull flow as JSON, edit and review in git, push back, beside the live automation',
  },
}

// diagrams and screenshots inside the case studies
export const FIGURE_ALT = {
  '/work/img/email-pipeline.webp': 'Email pipeline: email or web form, AI routing across 8 paths, draft writer, AI compliance pass, deterministic gate, then mailbox draft or human escalation',
  '/work/img/email-workflow.webp': 'Zoomed-out view of the live email workflow: 224 nodes across eight reasoning paths',
  '/work/img/household-architecture.webp': 'Architecture: CI gates on every change; a lint rule keeps the content app away from the private money and auth database, apart from the public one',
  '/work/img/marketplace-pipeline.webp': 'Release pipeline: compliance pass, web codebase and native shell on Windows with no Mac, signed bundle to Google Play, cloud macOS build to the App Store',
  '/work/img/marketplace-screens.webp': 'Three app screens: the contractor home screen, a live session with photo exchange, and an AI-written page about a finished job',
  '/work/img/grc-architecture.webp': 'Multi-tenant compliance AI architecture: 16 consultant personas, tenant-safe hybrid retrieval with reranking, ingestion, graph memory and RAG evaluation',
  '/work/img/tooling-architecture.webp': 'Architecture: purpose-built CLI, OAuth2 PKCE flow, management API, pull flow as JSON, edit and review in git, push back, and live automation',
}
