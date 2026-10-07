// Shared data for the card page concepts. Same projects, photos and logos as the live room.
export const REF = '/landing/workspace/ref/'
export const LOGO = '/landing/assets/img/tools/'
export const PROJECTS = [
	{
		card: 'Inbox', sub: 'Email triage, n8n', img: 'ref-1031.jpg', logo: 'n8n.png',
		tag: 'Case study, n8n', name: 'Multi-inbox email triage',
		copy: 'Classifies every inbound enquiry, files the attachments, updates the CRM and drafts a threaded reply for human review. A deterministic gate, not a model, has the final say.',
		figs: [['224', 'workflow nodes'], ['8', 'reasoning paths'], ['0', 'touches until review']],
		stack: ['n8n', 'Microsoft Graph', 'GPT-5', 'Google Sheets CRM'],
	},
	{
		card: 'Support', sub: 'Support agent, n8n', img: 'ref-1005.jpg', logo: 'openai.svg',
		tag: 'Case study, AI support', name: 'AI customer support',
		copy: 'A chat agent answers customers of a UK fibre broadband provider and calls six single-purpose workflows for account lookups, outage checks and ticketing.',
		figs: [['6,700+', 'conversations automated'], ['2,400+', 'tickets automated'], ['21,000+', 'agent minutes saved']],
		stack: ['n8n', 'OpenAI', 'Airtable', 'Microsoft Teams'],
	},
	{
		card: 'Compliance', sub: 'FERPA platform, GHL', img: 'ref-1018.jpg', logo: 'ghl.png',
		tag: 'Case study, compliance', name: 'FERPA staff compliance',
		copy: 'Tracks staff credentials like CPR and background checks with live expiry dates, then escalates by email and SMS at 60, 30 and 14 days, with an audit trail and FERPA-safe logging.',
		figs: [['7', 'staff roles'], ['3', 'escalation stages']],
		stack: ['Next.js', 'PostgreSQL', 'GoHighLevel', 'Power Automate'],
	},
	{
		card: 'Ten Zaps', sub: 'Event pipeline, Zapier', img: 'ref-1016.jpg', logo: 'zapier.png',
		tag: 'Case study, Zapier', name: '10-Zap AI suite',
		copy: 'One pipeline scrapes company sites, enriches event copy with GPT-4o and publishes to AddEvent and Webflow after a human approves it. The other classifies new B2B signups by industry, fit and size.',
		figs: [['10', 'Zaps in production'], ['2', 'pipelines']],
		stack: ['Zapier', 'GPT-4o', 'Firecrawl', 'Webflow'],
	},
	{
		card: 'Voices', sub: 'RAG chatbots, n8n', img: 'ref-1027.jpg', logo: 'n8n.png',
		tag: 'Case study, RAG', name: 'Multimodal RAG chatbots',
		copy: 'Voice and text chatbots for two cybersecurity platforms. They answer from a large knowledge base in Arabic or English, with speech in, speech out and encrypted access control.',
		figs: [['2', 'languages'], ['2', 'platforms']],
		stack: ['n8n', 'RAG', 'Speech to text', 'Text to speech'],
	},
	{
		card: 'Caller', sub: 'Voice agent, Retell AI', img: 'ref-26.jpg', logo: 'retell.png',
		tag: 'Case study, voice AI', name: 'Insurance voice agent',
		copy: 'Calls new insurance leads, holds the qualifying conversation, scores each lead and books the appointment straight into the GoHighLevel calendar.',
		figs: [['300%', 'more leads processed'], ['70%', 'lower cost']],
		stack: ['Retell AI', 'n8n', 'GoHighLevel'],
	},
	{
		card: 'WhatsApp', sub: 'WhatsApp agent, n8n', img: 'ref-1015.jpg', logo: 'twilio.svg',
		tag: 'Case study, WhatsApp', name: 'Timezone-aware WhatsApp bot',
		copy: 'Works out each customer’s time zone from their number and only messages them between noon and 8pm local time, with scheduling, retries and full logging.',
		figs: [['200+', 'global customers'], ['90%', 'less manual work'], ['40%', 'better response rate']],
		stack: ['n8n', 'Twilio', 'WhatsApp Business', 'Google Sheets'],
	},
	{
		card: 'Grocery', sub: 'Vision pipeline, Make', img: 'ref-1060.jpg', logo: 'make.png',
		tag: 'Case study, vision AI', name: 'Grocery flyer data system',
		copy: 'Reads PDF grocery flyers with a vision model, matches every product to a master list and turns names, prices and brands into clean rows in Google Sheets.',
		figs: [['5 min', 'per flyer, down from 2 hrs'], ['95%+', 'extraction accuracy']],
		stack: ['Make.com', 'OpenAI Vision', 'Google Drive', 'Google Sheets'],
	},
	{
		card: 'Studio', sub: 'Content pipeline, n8n', img: 'ref-1050.jpg', logo: 'n8n.png',
		tag: 'Case study, AI content', name: 'Monday.com content pipeline',
		copy: 'Routes creative requests from Monday.com to VEO 3 for video or an image model for stills, keeps the files tidy on a Synology NAS and posts the results back to the board.',
		figs: [],
		stack: ['n8n', 'Monday.com', 'VEO 3', 'Synology'],
	},
	{
		card: 'Scout', sub: 'Lead qualifier, n8n', img: 'ref-1044.jpg', logo: 'ghl.png',
		tag: 'Case study, lead generation', name: 'YouTube creator lead qualifier',
		copy: 'Finds YouTube channels by keyword, pulls their numbers, summarises each one with Gemini, checks for contact details and pushes qualified leads into GoHighLevel.',
		figs: [],
		stack: ['n8n', 'Apify', 'Gemini', 'GoHighLevel'],
	},
	{
		card: 'Icebreaker', sub: 'AI outreach, n8n', img: 'ref-1036.jpg', logo: 'n8n.png',
		tag: 'Case study, outreach', name: 'AI icebreaker generator',
		copy: 'Researches each prospect from LinkedIn and their website, then writes a personal opening line for the cold email, the way a careful SDR would.',
		figs: [],
		stack: ['n8n', 'OpenAI', 'Gemini', 'Google Sheets'],
	},
	{
		card: 'Screener', sub: 'Resume AI, n8n', img: 'ref-201.jpg', logo: 'n8n.png',
		tag: 'Case study, HR automation', name: 'AI resume screener',
		copy: 'Reads each uploaded CV, compares it with the live role criteria, scores the candidate from 1 to 10 and logs an HR-style summary.',
		figs: [['20 to 30', 'hours saved a week']],
		stack: ['n8n', 'OpenAI', 'Google Sheets'],
	},
]

// which project each concept shows as hovered / opened
export const params = new URLSearchParams(location.search)
export const VIEW = params.get('view') || 'browse'
export const PICK = +(params.get('pick') ?? 1)
export const pad = (n) => String(n + 1).padStart(2, '0')
export const platform = (p) => p.sub.split(', ')[1]
// mockup only: draw the pointer at x, y
export function cursor(x, y, dark = false) {
	const el = document.createElement('div')
	el.className = 'cursor'
	el.style.left = x + 'px'
	el.style.top = y + 'px'
	el.innerHTML = `<svg viewBox="0 0 22 22"><path d="M3 2l15 8.2-6.4 1.6L8.4 18z" fill="${dark ? '#111' : '#fff'}" stroke="${dark ? '#fff' : '#111'}" stroke-width="1.4" stroke-linejoin="round"/></svg>`
	document.body.appendChild(el)
}
// fonts and images loaded, so the screenshot is the finished frame
export async function ready() {
	await document.fonts.ready
	await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))))
	window.__ready = true
}
