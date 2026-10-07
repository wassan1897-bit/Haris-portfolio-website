const sliderData = [
	{
		title: 'AI Email Triage — n8n',
		img: './selected-works/img/email-triage-workflow.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · AI Automation',
		name: 'Autonomous AI Email Triage System',
		context: 'Inbound email classification, CRM updates, and drafted replies — zero touch until review.',
		role: 'AI Automation Engineer (n8n / LLM Pipeline Architecture)',
		copy:
			'Built a production AI system running a translation company\'s full client-enquiry lifecycle — zero human touch until final review. A 222-node n8n workflow classifies inbound email/form leads, extracts language pair and document details from noisy threads, files attachments, updates a Google Sheets CRM, and drafts a threaded reply via Microsoft Graph API. GPT-5.5 handles classification and drafting; deterministic JS gates and a compliance pass block bad drafts before they reach a client.',
		skills: [
			'n8n',
			'Microsoft Outlook Development',
			'API Integration',
			'Python',
			'System Automation',
		],
		meta: 'Published Aug 12, 2026',
	},
	{
		title: 'FERPA Compliance — GHL',
		img: './selected-works/img/ferpa-compliance.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · Compliance',
		name: 'FERPA-Compliant Staff Automation Platform',
		context: 'Staff credential tracking, expiry alerts, and FERPA-safe escalation across 7 roles.',
		role: 'Full-Stack Developer & Workflow Automation Engineer (Next.js / Supabase)',
		copy:
			'Automated compliance tracking and escalation for 7 staff roles. Credential tracking for CPR, background checks, and licenses with live expiry, role rules, and an audit trail. 60/30/14-day escalation via cron sends email + SMS per staff through GoHighLevel v2 with supervisor escalation. Defense-in-depth security uses isolated Supabase clients, RLS, and triple auth layers. Excel import/export, feature flags, Power Automate sync, and FERPA-safe logging.',
		skills: [
			'Next.js',
			'PostgreSQL',
			'API Integration',
			'HighLevel',
			'Microsoft Power Automate',
		],
		meta: 'Published Jul 27, 2026',
	},
	{
		title: '10-Zap AI Suite — Zapier',
		img: './selected-works/img/10zap-suite.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · Zapier / AI',
		name: '10-Zap AI Suite: Event Publishing & B2B Signup Enrichment',
		context: 'Event publishing + B2B signup enrichment across a 10-Zap production suite.',
		role: 'AI Automation Developer & Zapier Integration Specialist',
		copy:
			'Architected a 10-Zap AI automation suite running two production pipelines end to end. An event intelligence system scrapes company sites with a Firecrawl agent, deduplicates via custom JavaScript, enriches copy with GPT-4o, and publishes to AddEvent and Webflow behind a human approval gate. A GTM enrichment pipeline classifies new B2B signups by industry, product fit, company size, and job title. Google Apps Script replaces polling with instant webhook triggers.',
		skills: [
			'AI Agent Development',
			'API Integration',
			'CMS Development',
			'Webflow',
			'Zapier',
		],
		meta: 'Published Jul 21, 2026',
	},
	{
		title: 'Multimodal RAG — Voice & Text',
		img: './selected-works/img/rag-chatbots.png',
		url: '#',
		fit: 'full',
		video: './selected-works/video/rag-chatbots.mp4',
		eyebrow: 'Case study · RAG / Multimodal',
		name: 'Multimodal RAG Chatbots: Voice & Text AI Product Intelligence',
		context: 'Bilingual voice + text RAG chatbots for cybersecurity product intelligence.',
		role: 'AI Automation Engineer (RAG / Multimodal Chatbots)',
		copy:
			'Architected secure, multimodal RAG chatbots with voice and text capabilities for two cybersecurity platforms. Features speech-to-text input and text-to-speech output in bilingual (Arabic/English) conversations. Built with Lovable, Cursor, and custom backend. Delivers instant, contextually accurate responses from extensive knowledge bases with encrypted access control, enabling hands-free product intelligence.',
		skills: [
			'n8n',
			'AI Chatbot',
			'Cybersecurity Tool',
			'LLM Prompt Engineering',
			'Model Training Prompt Engineering',
		],
		meta: 'Published Dec 15, 2025',
	},
	{
		title: 'Autonomous AI Agent — Support',
		img: './selected-works/img/ai-agent-overview.png',
		imgs: [
			'./selected-works/img/ai-agent-overview.png',
			'./selected-works/img/ai-agent-orchestration.png',
		],
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · Autonomous Support',
		name: 'Autonomous AI Agent: 7,000+ Mins Saved & 790 Tickets Resolved',
		context: 'Level-1 support agent — CRM triage, outage checks, and ticket handoffs.',
		role: 'AI Automation Engineer (n8n / Voiceflow / Support Ops)',
		copy:
			'I built and deployed a fully autonomous Level 1 Support Agent for a broadband provider to reduce support overhead. The system has saved 7,101 minutes of support time, resolved 790+ tickets end-to-end, and handles out-of-hours queries with zero human involvement. It performs live CRM triage (customer vs prospect), runs real-time network and outage checks via APIs, and creates structured tickets with smart handoffs to the right teams.',
		skills: [
			'AI Chatbot',
			'n8n',
			'Airtable',
			'OpenAI API',
			'CRM Automation',
		],
		meta: 'Published Dec 15, 2025',
	},
	{
		title: 'Insurance Voice Agent — Retell',
		img: './selected-works/img/insurance-voice-agent.png',
		url: '#',
		fit: 'full',
		video: './selected-works/video/insurance-voice-agent.mp4',
		eyebrow: 'Case study · Voice AI',
		name: 'n8n + GoHighLevel + Retell AI Voice Agent: Insurance Lead Automation',
		context: 'Outbound voice agent that qualifies insurance leads and books appointments.',
		role: 'Automation Developer & Systems Integrator',
		copy:
			'Built an intelligent outbound voice agent that automatically calls insurance leads, conducts qualification conversations, and books appointments without human intervention. System integrates n8n workflows + GoHighLevel CRM + Retell AI for complete automation: AI calls leads with natural conversations, real-time qualification and scoring, auto-schedules appointments in GHL calendar, smart retry logic and analytics, and 24/7 operation with timezone handling. Results: 300% increase in lead processing, 70% cost reduction, eliminated all manual calling tasks.',
		skills: [
			'n8n',
			'HighLevel',
			'AI Agent Development',
			'Automated Workflow',
			'CRM Automation',
		],
		meta: 'Published Aug 18, 2025',
	},
	{
		title: 'WhatsApp Chatbot — n8n',
		img: './selected-works/img/whatsapp-timezone.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · WhatsApp Automation',
		name: 'Timezone-Aware n8n WhatsApp Chatbot: 200+ Global Customers',
		context: 'Timezone-aware WhatsApp messaging for 200+ global customers.',
		role: 'Automation Developer & WhatsApp Integration Specialist',
		copy:
			'Developed a scalable WhatsApp messaging automation using n8n and Twilio API for a business with 200+ global customers. The system detects user timezones based on phone numbers and ensures messages are sent only during 12 PM–8 PM local time. It handles message scheduling, retries, and status updates, with full logging in Google Sheets. The automation supports approved templates, complies with WhatsApp Business rules, and reduced manual work by 90%, saving over $40k+/year and boosting response rates by 40%.',
		skills: [
			'n8n',
			'Twilio API',
			'Chatbot Development',
			'Business Process Automation',
			'AI Implementation',
		],
		meta: 'Published Aug 7, 2025',
	},
	{
		title: 'Grocery Vision — Make.com',
		img: './selected-works/img/grocery-vision.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · AI Automation',
		name: 'AI-Powered Grocery Data System (OpenAI Vision, Make.com)',
		context: 'PDF grocery flyers → structured Sheets data via OpenAI Vision.',
		role: 'Automation Developer & AI Integration Specialist',
		copy:
			'Built an AI-powered automation system that transforms grocery flyers from PDF to structured data in Google Sheets. The workflow monitors Google Drive, converts PDFs to images, uses OpenAI GPT-5 vision to extract product details (names, prices, brands), matches items to a master database, and outputs organized spreadsheets—all automatically. Slashed data entry from 2+ hours to 5 minutes per flyer (95% time savings), 95%+ extraction accuracy with intelligent filtering, parallel category processing, and zero manual intervention.',
		skills: [
			'Make.com',
			'AI Agent Development',
			'OpenAI API',
			'Task Automation',
			'Automation Anywhere',
		],
		meta: 'Published Nov 10, 2025',
	},
	{
		title: 'Monday + VEO 3 — n8n',
		img: './selected-works/img/monday-veo-pipeline.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · AI Content',
		name: 'n8n + Monday.com AI Content Generation Pipeline: VEO 3 & Nano Banana',
		context: 'Monday.com content pipeline routing requests to VEO 3 and image models.',
		role: 'Automation Developer & AI Integration Specialist',
		copy:
			'Designed a robust automation system connecting Monday.com, n8n, and Synology NAS for enterprise-grade content production. The workflow routes creative requests to the right AI model — VEO 3 for videos or Nano Banana for images — while managing assets, version control, and cleanup directly on Synology NAS folders. Prompts are refined with GPT for optimal results, outputs are staged on web-accessible paths, and final files are uploaded back to Monday.com. This end-to-end system eliminated manual handling, accelerated delivery, and gave creative teams seamless AI generated content within seconds.',
		skills: [
			'n8n',
			'AI Video Generation',
			'AI Image Generation',
			'AI Text-to-Image',
			'Automation',
		],
		meta: 'Published Sep 26, 2025',
	},
	{
		title: 'YouTube Scraper — n8n',
		img: './selected-works/img/youtube-scraper.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · Lead Gen',
		name: 'YouTube Influencer Scraper & Lead Qualifier',
		context: 'YouTube influencer scraping, enrichment, and lead qualification.',
		role: 'Automation Developer & Lead Systems Engineer (n8n / Apify / HighLevel)',
		copy:
			'Developed a powerful YouTube scraping and enrichment system using n8n, Apify, and Google Sheets. The automation accepts keyword input, scrapes channel and video metrics (subscribers, views, likes, comments), checks for email availability, detects if a course is being promoted, and summarizes channel content using Gemini AI. It also tags missing data (like Instagram/email), filters duplicates, and pushes enriched leads into LeadConnector (GHL) and Google Sheets. Fully automated, scalable, and built for lead generation workflows.',
		skills: [
			'n8n',
			'Batch Processing Framework',
			'HighLevel',
			'JSON',
			'Automation',
		],
		meta: 'Published Aug 7, 2025',
	},
	{
		title: 'AI Icebreakers — n8n',
		img: './selected-works/img/icebreaker-n8n.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · AI Outreach',
		name: 'AI-Powered Icebreaker Generation with LinkedIn & Website Enrichment',
		context: 'Personalized cold-email icebreakers from LinkedIn + website enrichment.',
		role: 'Automation Developer & Prompt Engineer',
		copy:
			'Built a fully automated AI outreach workflow in n8n that scrapes LinkedIn profiles and business websites, enriches the data, and generates hyper-personalized cold email icebreakers using OpenAI and Gemini. The system combines structured profile data, abstracted website content, and custom prompt engineering to mimic deep manual research. Each message is formatted in JSON and pushed to Google Sheets. Ideal for SDRs and lead gen teams needing scale without losing personalization.',
		skills: [
			'n8n',
			'Email Automation',
			'Business Process Automation',
			'Prompt Engineering',
			'Web Scraping',
		],
		meta: 'Published Aug 7, 2025',
	},
	{
		title: 'Resume Screener — n8n',
		img: './selected-works/img/resume-screener.png',
		url: '#',
		fit: 'full',
		eyebrow: 'Case study · HR Automation',
		name: 'AI-Powered Resume Screener n8n Hiring Assistant',
		context: 'CV upload → scored applicants and HR summaries logged to Sheets.',
		role: 'Automation Developer & AI Workflow Engineer',
		copy:
			'This automation turns a basic CV upload form into a full-blown AI hiring assistant. As soon as a candidate uploads their PDF, the system extracts key details (skills, education, experience, city, contact info), compares them against live role criteria in Google Sheets, and instantly scores the applicant 1–10 with a clean HR-style summary. All results are logged automatically — no reading CVs, no missed talent, no wasted hours. Saves 20–30 hrs/week, works 24/7, and scales across departments with zero extra effort.',
		skills: [
			'System Automation',
			'HR System Management',
			'n8n',
			'AI Implementation',
			'Automated Workflow',
		],
		meta: 'Published Jul 21, 2025',
	},
]

const config = {
	SCROLL_SPEED: 1.75,
	LERP_FACTOR: 0.05,
	MAX_VELOCITY: 150,
}

const totalSlideCount = sliderData.length

const state = {
	currentX: 0,
	targetX: 0,
	slideWidth: 390,
	slides: [],
	isDragging: false,
	startX: 0,
	lastX: 0,
	lastMouseX: 0,
	lastScrollTime: Date.now(),
	isMoving: false,
	velocity: 0,
	lastCurrentX: 0,
	dragDistance: 0,
	hasActuallyDragged: false,
	isMobile: false,
	upIntent: 0,
	viewerOpen: false,
	viewerBusy: false,
	originSlide: null,
	originImg: null,
	worksIntroPlayed: false,
	worksIntroTl: null,
	sliderLive: true,
	skipParallax: true,
	rafId: 0,
	cycleIo: null,
}

const viewer = {
	root: null,
	img: null,
	imgB: null,
	video: null,
	videoUi: null,
	details: null,
	eyebrow: null,
	title: null,
	role: null,
	copy: null,
	skills: null,
	meta: null,
	closeBtn: null,
	media: null,
	cycleTimer: null,
}

const IMAGE_CYCLE_MS = 3400
const VIDEO_SEEK_STEP = 5

const MUTE_ICON = `
	<svg class="media-ctrl__icon media-ctrl__icon--muted" viewBox="0 0 24 24" aria-hidden="true">
		<path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63Zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.4 8.4 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a9.8 9.8 0 0 0 3.69-1.81L19.73 21 21 19.73 4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
	</svg>
	<svg class="media-ctrl__icon media-ctrl__icon--unmuted" viewBox="0 0 24 24" aria-hidden="true" hidden>
		<path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8.1v7.8a4.48 4.48 0 0 0 2.5-3.9ZM14 3.23v2.06a6.5 6.5 0 0 1 0 13.42v2.06c3.89-.91 6.8-4.4 6.8-8.77s-2.91-7.86-6.8-8.77Z"/>
	</svg>
`

const CONTACT_LINKS_HTML = `
	<a class="about-magnetic__item" href="https://www.upwork.com/" target="_blank" rel="noopener noreferrer" aria-label="Upwork" data-popup="upwork">
		<img class="about-magnetic__icon" src="./assets/img/tools/upwork.png" alt="" width="40" height="40" />
		<span class="about-magnetic__popup" aria-hidden="true">
			<img src="./assets/img/connect/upwork-profile.png" alt="Upwork profile — Muhammad H." width="1024" height="296" />
		</span>
	</a>
	<a class="about-magnetic__item" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-popup="linkedin">
		<svg class="about-magnetic__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
		</svg>
		<span class="about-magnetic__popup" aria-hidden="true">
			<img src="./assets/img/connect/linkedin-profile.png" alt="LinkedIn profile — Muhammad Haris" width="799" height="499" />
		</span>
	</a>
	<a class="about-magnetic__item" href="https://autoany.io" target="_blank" rel="noopener noreferrer" aria-label="Contact">
		<svg class="about-magnetic__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
		</svg>
	</a>
	<a class="about-magnetic__item" href="mailto:hello@autoany.io" aria-label="Email">
		<svg class="about-magnetic__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
		</svg>
	</a>
`

const slideMagneticBound = new WeakSet()
let slideContactPopup = null
let slideContactOwner = null

function placeSlideContactPopup(item) {
	const popup = item?._dockPopup || item?.querySelector('.about-magnetic__popup')
	if (!popup || !item) return
	if (!item._dockPopup) {
		document.body.appendChild(popup)
		item._dockPopup = popup
	}

	const gap = 14
	const pad = 12
	const rect = item.getBoundingClientRect()
	const pw = popup.offsetWidth || Math.min(352, window.innerWidth - pad * 2)
	const ph = popup.offsetHeight || 206

	let left = rect.left + rect.width / 2 - pw / 2
	left = Math.max(pad, Math.min(left, window.innerWidth - pw - pad))

	let top = rect.top - ph - gap
	if (top < pad) {
		top = Math.min(rect.bottom + gap, window.innerHeight - ph - pad)
	}

	const caretX = rect.left + rect.width / 2 - left
	popup.style.left = `${Math.round(left)}px`
	popup.style.top = `${Math.round(top)}px`
	popup.style.setProperty('--popup-caret-x', `${Math.round(caretX)}px`)
}

function hideSlideContactPopup() {
	if (slideContactPopup) {
		slideContactPopup.classList.remove('is-open')
		slideContactPopup = null
		slideContactOwner = null
	}
}

function bindSlideContactMagnetic(item) {
	if (!item || slideMagneticBound.has(item)) return
	slideMagneticBound.add(item)

	const canMagnetic =
		typeof gsap !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches

	if (canMagnetic) {
		const xTo = gsap.quickTo(item, 'x', {
			duration: 1,
			ease: 'elastic.out(1, 0.3)',
		})
		const yTo = gsap.quickTo(item, 'y', {
			duration: 1,
			ease: 'elastic.out(1, 0.3)',
		})

		item.addEventListener('mousemove', (e) => {
			const { height, width, left, top } = item.getBoundingClientRect()
			xTo(e.clientX - (left + width / 2))
			yTo(e.clientY - (top + height / 2))
			if (slideContactOwner === item) placeSlideContactPopup(item)
		})
		item.addEventListener('mouseleave', () => {
			xTo(0)
			yTo(0)
		})
	}

	item.addEventListener('mouseenter', () => {
		if (!item.hasAttribute('data-popup')) {
			hideSlideContactPopup()
			return
		}
		const popup =
			item._dockPopup || item.querySelector('.about-magnetic__popup')
		if (!popup) return
		if (!item._dockPopup) {
			document.body.appendChild(popup)
			item._dockPopup = popup
		}
		if (slideContactPopup && slideContactPopup !== popup) {
			slideContactPopup.classList.remove('is-open')
		}
		slideContactPopup = popup
		slideContactOwner = item
		placeSlideContactPopup(item)
		popup.classList.add('is-open')
	})
	item.addEventListener('mouseleave', () => {
		if (item.hasAttribute('data-popup')) hideSlideContactPopup()
	})
	item.addEventListener('click', (e) => e.stopPropagation())
}

function createSlideContacts() {
	const wrap = document.createElement('div')
	wrap.className = 'slide-contacts about-magnetic'
	wrap.setAttribute('aria-label', 'Contact')
	wrap.innerHTML = CONTACT_LINKS_HTML
	wrap.querySelectorAll('.about-magnetic__item').forEach(bindSlideContactMagnetic)
	wrap.addEventListener('click', (e) => e.stopPropagation())
	return wrap
}


function checkMobile() {
	state.isMobile = window.innerWidth < 1000
}

function projectImages(data) {
	if (Array.isArray(data.imgs) && data.imgs.length > 0) return data.imgs
	return data.img ? [data.img] : []
}

function stopImageCycle(timer) {
	if (timer) clearInterval(timer)
	return null
}

function startImageCycle(imgs) {
	if (!imgs || imgs.length < 2) return null
	let index = imgs.findIndex((el) => el.classList.contains('is-active'))
	if (index < 0) index = 0
	imgs.forEach((el, i) => el.classList.toggle('is-active', i === index))
	return setInterval(() => {
		imgs[index].classList.remove('is-active')
		index = (index + 1) % imgs.length
		imgs[index].classList.add('is-active')
	}, IMAGE_CYCLE_MS)
}

function syncMuteButton(btn, muted) {
	if (!btn) return
	btn.classList.toggle('is-unmuted', !muted)
	btn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute')
	const mutedIcon = btn.querySelector('.media-ctrl__icon--muted')
	const unmutedIcon = btn.querySelector('.media-ctrl__icon--unmuted')
	if (mutedIcon) mutedIcon.hidden = !muted
	if (unmutedIcon) unmutedIcon.hidden = muted
}

function seekVideo(video, delta) {
	if (!video) return
	if (!Number.isFinite(video.duration)) {
		video.currentTime = Math.max(0, (video.currentTime || 0) + delta)
		return
	}
	video.currentTime = Math.min(
		video.duration,
		Math.max(0, video.currentTime + delta),
	)
}

function setVideoPlaying(container, video, playBtn) {
	if (!video) return
	video.muted = true
	video.hidden = false
	video.style.visibility = 'visible'
	video.style.opacity = '1'
	video.style.display = 'block'
	if (typeof gsap !== 'undefined') gsap.set(video, { opacity: 1, visibility: 'visible' })

	const poster =
		container?.id === 'works-viewer-media'
			? viewer.img
			: container?.querySelector('img.is-active, img')
	if (poster) {
		poster.style.opacity = '0'
		if (typeof gsap !== 'undefined') gsap.set(poster, { opacity: 0 })
	}

	if (container) {
		container.classList.add('is-playing')
		container.classList.remove('is-paused')
	}
	if (playBtn) playBtn.hidden = true

	const src = video.dataset.src
	if (src && !video.getAttribute('src')) {
		video.src = src
	}

	const play = video.play()
	if (play && typeof play.catch === 'function') {
		play.catch(() => setVideoPaused(container, video, playBtn))
	}
}

function setVideoPaused(container, video, playBtn) {
	if (!video) return
	video.pause()
	video.muted = true
	video.hidden = true
	video.style.opacity = '0'
	video.style.visibility = 'hidden'
	if (typeof gsap !== 'undefined') {
		gsap.set(video, { opacity: 0, visibility: 'hidden' })
	}

	const poster =
		container?.id === 'works-viewer-media'
			? viewer.img
			: container?.querySelector('img.is-active, img')
	if (poster) {
		poster.style.opacity = '1'
		poster.style.visibility = 'visible'
		if (typeof gsap !== 'undefined') {
			gsap.set(poster, { opacity: 1, visibility: 'visible' })
		}
	}

	if (container) {
		container.classList.add('is-paused')
		container.classList.remove('is-playing')
	}
	if (playBtn) playBtn.hidden = false
}

function bindVideoUi(ui, video, options = {}) {
	if (!ui || !video || ui.dataset.bound === '1') return
	ui.dataset.bound = '1'
	const container = options.container || ui.parentElement
	const playBtn = options.playBtn || container?.querySelector('.media-play-btn')
	const seek = ui.querySelector('.media-seek')
	const fill = seek?.querySelector('.media-seek__fill')
	const thumb = seek?.querySelector('.media-seek__thumb')
	let scrubbing = false

	const setSeekUi = (pct) => {
		const clamped = Math.min(1, Math.max(0, pct))
		if (fill) fill.style.width = `${clamped * 100}%`
		if (thumb) thumb.style.left = `${clamped * 100}%`
		if (seek) seek.setAttribute('aria-valuenow', String(Math.round(clamped * 100)))
	}

	const syncSeek = () => {
		if (!seek || scrubbing || !Number.isFinite(video.duration) || video.duration <= 0) return
		setSeekUi(video.currentTime / video.duration)
	}

	const seekToEvent = (e) => {
		if (!seek || !Number.isFinite(video.duration) || video.duration <= 0) return
		const rect = seek.getBoundingClientRect()
		const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
		video.currentTime = pct * video.duration
		setSeekUi(pct)
	}

	if (playBtn) {
		playBtn.addEventListener('click', (e) => {
			e.preventDefault()
			e.stopPropagation()
			setVideoPlaying(container, video, playBtn)
			syncMuteButton(ui.querySelector('[data-mute-toggle]'), true)
			syncSeek()
		})
	}

	if (seek) {
		seek.addEventListener('pointerdown', (e) => {
			e.preventDefault()
			e.stopPropagation()
			scrubbing = true
			seek.classList.add('is-dragging')
			seek.setPointerCapture(e.pointerId)
			seekToEvent(e)
			if (container?.classList.contains('is-paused')) {
				setVideoPlaying(container, video, playBtn)
				syncMuteButton(ui.querySelector('[data-mute-toggle]'), true)
			}
		})
		seek.addEventListener('pointermove', (e) => {
			if (!scrubbing) return
			e.preventDefault()
			e.stopPropagation()
			seekToEvent(e)
		})
		const endScrub = (e) => {
			if (!scrubbing) return
			e.preventDefault()
			e.stopPropagation()
			scrubbing = false
			seek.classList.remove('is-dragging')
			try {
				seek.releasePointerCapture(e.pointerId)
			} catch (_) {
				/* already released */
			}
		}
		seek.addEventListener('pointerup', endScrub)
		seek.addEventListener('pointercancel', endScrub)
		seek.addEventListener('click', (e) => {
			e.preventDefault()
			e.stopPropagation()
		})
	}

	ui.addEventListener('pointerdown', (e) => e.stopPropagation())
	ui.addEventListener('click', (e) => {
		e.preventDefault()
		e.stopPropagation()
		const btn = e.target.closest('.media-ctrl')
		if (!btn) return
		if (btn.hasAttribute('data-mute-toggle')) {
			video.muted = !video.muted
			syncMuteButton(btn, video.muted)
			return
		}
		if (btn.hasAttribute('data-pause')) {
			setVideoPaused(container, video, playBtn)
			syncMuteButton(ui.querySelector('[data-mute-toggle]'), true)
		}
	})

	video.addEventListener('timeupdate', syncSeek)
	video.addEventListener('loadedmetadata', syncSeek)
	video.addEventListener('ended', () => {
		setVideoPaused(container, video, playBtn)
		syncMuteButton(ui.querySelector('[data-mute-toggle]'), true)
		setSeekUi(0)
	})
}

function createSlideVideoUi() {
	const ui = document.createElement('div')
	ui.className = 'media-video-ui'
	ui.innerHTML = `
		<div class="media-seek" role="slider" tabindex="0" aria-label="Seek video" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
			<div class="media-seek__track"></div>
			<div class="media-seek__fill"></div>
			<div class="media-seek__thumb"></div>
		</div>
		<div class="media-video-ui__row">
			<button type="button" class="media-ctrl media-ctrl--pause" data-pause aria-label="Pause">
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/></svg>
			</button>
			<button type="button" class="media-ctrl media-ctrl--mute" data-mute-toggle aria-label="Unmute">
				${MUTE_ICON}
			</button>
		</div>
	`
	return ui
}

function createPlayButton() {
	const btn = document.createElement('button')
	btn.type = 'button'
	btn.className = 'media-play-btn'
	btn.setAttribute('aria-label', 'Play video')
	btn.innerHTML = `
		<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5z"/></svg>
	`
	return btn
}

function cacheViewer() {
	viewer.root = document.getElementById('works-viewer')
	viewer.img = document.getElementById('works-viewer-img')
	viewer.imgB = document.getElementById('works-viewer-img-b')
	viewer.video = document.getElementById('works-viewer-video')
	viewer.videoUi = document.getElementById('works-viewer-video-ui')
	viewer.details = document.getElementById('works-viewer-details')
	viewer.eyebrow = document.getElementById('works-viewer-eyebrow')
	viewer.title = document.getElementById('works-viewer-title')
	viewer.role = document.getElementById('works-viewer-role')
	viewer.copy = document.getElementById('works-viewer-copy')
	viewer.skills = document.getElementById('works-viewer-skills')
	viewer.meta = document.getElementById('works-viewer-meta')
	viewer.closeBtn = document.getElementById('works-viewer-close')
	viewer.media = document.getElementById('works-viewer-media')
		|| viewer.root?.querySelector('.works-viewer__media')
		|| null
	if (viewer.video && viewer.videoUi) {
		bindVideoUi(viewer.videoUi, viewer.video, {
			container: viewer.media,
			playBtn: document.getElementById('works-viewer-play'),
		})
	}
}

function stopViewerVideo() {
	if (!viewer.video) return
	viewer.video.pause()
	viewer.video.muted = true
	viewer.video.removeAttribute('src')
	viewer.video.removeAttribute('poster')
	delete viewer.video.dataset.src
	viewer.video.load()
	viewer.video.hidden = true
	viewer.video.style.opacity = '0'
	viewer.video.style.visibility = 'hidden'
	viewer.media?.classList.remove('works-viewer__media--video', 'is-playing')
	viewer.media?.classList.add('is-paused')
	if (viewer.videoUi) {
		viewer.videoUi.hidden = true
		const muteBtn = viewer.videoUi.querySelector('[data-mute-toggle]')
		syncMuteButton(muteBtn, true)
	}
	const playBtn = document.getElementById('works-viewer-play')
	if (playBtn) playBtn.hidden = true
}

function fillViewerDetails(data) {
	viewer.eyebrow.textContent = data.eyebrow || 'Selected work'
	viewer.title.textContent = data.name || data.title
	viewer.role.textContent = data.role || ''
	viewer.copy.textContent = data.copy || ''
	viewer.meta.textContent = data.meta || ''
	viewer.skills.innerHTML = ''
	;(data.skills || []).forEach((skill) => {
		const li = document.createElement('li')
		li.textContent = skill
		viewer.skills.appendChild(li)
	})
}

function setupViewerImages(data) {
	viewer.cycleTimer = stopImageCycle(viewer.cycleTimer)
	stopViewerVideo()

	const images = projectImages(data)
	viewer.img.removeAttribute('hidden')
	viewer.img.src = images[0] || ''
	viewer.img.alt = data.name || data.title
	viewer.img.classList.add('is-active')
	viewer.img.style.opacity = '1'
	viewer.img.style.visibility = 'visible'

	if (data.video && viewer.video) {
		if (viewer.imgB) {
			viewer.imgB.hidden = true
			viewer.imgB.removeAttribute('src')
			viewer.imgB.classList.remove('is-active')
		}
		viewer.media?.classList.remove('works-viewer__media--cycle')
		viewer.media?.classList.add('works-viewer__media--video', 'is-paused')
		viewer.media?.classList.remove('is-playing')

		/* Keep <video> hidden until Play so poster card stays visible */
		viewer.video.hidden = true
		viewer.video.muted = true
		viewer.video.dataset.src = data.video
		viewer.video.poster = images[0] || ''
		viewer.video.removeAttribute('src')
		viewer.video.style.opacity = '0'
		viewer.video.style.visibility = 'hidden'

		if (viewer.videoUi) {
			viewer.videoUi.hidden = false
			syncMuteButton(viewer.videoUi.querySelector('[data-mute-toggle]'), true)
		}
		const playBtn = document.getElementById('works-viewer-play')
		if (playBtn) playBtn.hidden = false

		if (typeof gsap !== 'undefined') {
			gsap.set(viewer.img, { opacity: 1, visibility: 'visible' })
			gsap.set(viewer.video, { opacity: 0, visibility: 'hidden' })
		}
		return
	}

	gsap.set(viewer.img, { clearProps: 'opacity,visibility' })
	viewer.img.style.opacity = ''
	viewer.img.style.visibility = ''

	const playBtn = document.getElementById('works-viewer-play')
	if (playBtn) {
		playBtn.hidden = true
		playBtn.setAttribute('hidden', '')
	}
	viewer.media?.classList.remove('works-viewer__media--video', 'is-playing', 'is-paused')

	if (images.length > 1 && viewer.imgB) {
		viewer.imgB.hidden = false
		viewer.imgB.src = images[1]
		viewer.imgB.alt = `${data.name || data.title} — architecture`
		viewer.imgB.classList.remove('is-active')
		viewer.media?.classList.add('works-viewer__media--cycle')
		if (typeof gsap !== 'undefined') gsap.set(viewer.imgB, { clearProps: 'opacity' })
	} else if (viewer.imgB) {
		viewer.imgB.hidden = true
		viewer.imgB.removeAttribute('src')
		viewer.imgB.classList.remove('is-active')
		viewer.media?.classList.remove('works-viewer__media--cycle')
	}
}

function playViewerVideo() {
	/* kept for API compat — videos stay paused until Play */
}

function openProject(slide, data) {
	if (!viewer.root || state.viewerOpen || state.viewerBusy) return
	if (typeof gsap === 'undefined') return

	const cardImg =
		slide.querySelector('.slide-image > img.is-active') ||
		slide.querySelector('.slide-image > img')
	if (!cardImg) return

	state.viewerBusy = true
	state.viewerOpen = true
	state.originSlide = slide
	state.originImg = cardImg

	if (slide._imageCycleTimer) {
		slide._imageCycleTimer = stopImageCycle(slide._imageCycleTimer)
	}

	const cardVideo = slide.querySelector('.slide-image video')
	const cardMedia = slide.querySelector('.slide-image--video')
	if (cardVideo && cardMedia) {
		setVideoPaused(cardMedia, cardVideo, slide.querySelector('.media-play-btn'))
		syncMuteButton(slide.querySelector('[data-mute-toggle]'), true)
	}

	fillViewerDetails(data)
	setupViewerImages(data)

	document.body.classList.add('works-viewer-open')
	viewer.root.classList.add('is-open')
	viewer.root.setAttribute('aria-hidden', 'false')

	gsap.set(viewer.root, { opacity: 0 })
	gsap.set(viewer.details, { opacity: 0, y: 20 })
	gsap.set(viewer.closeBtn, { opacity: 0 })
	const slideMeta = slide.querySelector('.slide-meta')
	const slideContacts = slide.querySelector('.slide-contacts')
	if (slideMeta) gsap.set(slideMeta, { opacity: 0 })
	if (slideContacts) gsap.set(slideContacts, { opacity: 0 })
	const cardUi = slide.querySelector('.media-video-ui')
	if (cardUi) cardUi.style.visibility = 'hidden'

	/* Video case studies: soft fade — poster visible until Play */
	if (data.video) {
		viewer.img.style.opacity = '1'
		viewer.img.style.visibility = 'visible'
		gsap.set(viewer.img, { opacity: 1, visibility: 'visible' })
		gsap.set(viewer.video, { opacity: 0, visibility: 'hidden' })
		viewer.video.hidden = true

		gsap.set(cardImg, { opacity: 0 })
		if (cardVideo) gsap.set(cardVideo, { opacity: 0 })
		const playBtn = slide.querySelector('.media-play-btn')
		if (playBtn) playBtn.style.visibility = 'hidden'

		const tl = gsap.timeline({
			defaults: { ease: 'power2.out' },
			onComplete: () => {
				viewer.media?.classList.add('is-paused')
				viewer.media?.classList.remove('is-playing')
				viewer.img.style.opacity = '1'
				viewer.img.style.visibility = 'visible'
				gsap.set(viewer.img, { opacity: 1, visibility: 'visible' })
				viewer.video.hidden = true
				gsap.set(viewer.video, { opacity: 0, visibility: 'hidden' })
				const vPlay = document.getElementById('works-viewer-play')
				if (vPlay) vPlay.hidden = false
				state.viewerBusy = false
			},
		})

		tl.to(viewer.root, { opacity: 1, duration: 0.36 }, 0)
			.to(viewer.closeBtn, { opacity: 1, duration: 0.28 }, 0.1)
			.to(
				viewer.details,
				{ opacity: 1, y: 0, duration: 0.42 },
				0.1,
			)
		return
	}

	gsap.set(viewer.img, { opacity: 0 })
	if (viewer.imgB && !viewer.imgB.hidden) gsap.set(viewer.imgB, { opacity: 0 })

	const from = cardImg.getBoundingClientRect()
	viewer.root.offsetHeight
	const to = viewer.media.getBoundingClientRect()

	const fly = cardImg.cloneNode(true)
	fly.className = 'works-viewer__fly'
	fly.style.left = `${from.left}px`
	fly.style.top = `${from.top}px`
	fly.style.width = `${from.width}px`
	fly.style.height = `${from.height}px`
	fly.style.objectFit = data.fit === 'full' ? 'contain' : 'cover'
	fly.style.opacity = '1'
	fly.style.background = '#e8e4da'
	document.body.appendChild(fly)

	gsap.set(slide.querySelectorAll('.slide-image > img'), { opacity: 0 })

	const tl = gsap.timeline({
		defaults: { ease: 'power3.inOut' },
		onComplete: () => {
			fly.remove()
			const cycleImgs = [viewer.img, viewer.imgB].filter(
				(el) => el && !el.hidden,
			)
			if (cycleImgs.length > 1) {
				gsap.set(cycleImgs, { clearProps: 'opacity' })
				viewer.img.classList.add('is-active')
				viewer.imgB.classList.remove('is-active')
				viewer.cycleTimer = startImageCycle(cycleImgs)
			} else {
				gsap.set(viewer.img, { opacity: 1 })
			}
			state.viewerBusy = false
		},
	})

	tl.to(viewer.root, { opacity: 1, duration: 0.45 }, 0)
		.to(
			fly,
			{
				left: to.left,
				top: to.top,
				width: to.width,
				height: to.height,
				duration: 0.85,
			},
			0,
		)
		.to(viewer.closeBtn, { opacity: 1, duration: 0.35 }, 0.4)
		.to(
			viewer.details,
			{ opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
			0.45,
		)
}

function closeProject() {
	if (!viewer.root || !state.viewerOpen || state.viewerBusy) return
	if (typeof gsap === 'undefined') return

	state.viewerBusy = true
	viewer.cycleTimer = stopImageCycle(viewer.cycleTimer)
	if (viewer.video && !viewer.video.hidden) {
		viewer.video.pause()
	}

	const originImg = state.originImg
	const originSlide = state.originSlide
	const toRect =
		originImg && document.body.contains(originImg)
			? originImg.getBoundingClientRect()
			: null

	const activeViewerImg =
		viewer.media?.querySelector('.works-viewer__img.is-active') || viewer.img

	const from = viewer.media.getBoundingClientRect()
	const fly = activeViewerImg.cloneNode(true)
	fly.className = 'works-viewer__fly'
	fly.style.left = `${from.left}px`
	fly.style.top = `${from.top}px`
	fly.style.width = `${from.width}px`
	fly.style.height = `${from.height}px`
	fly.style.objectFit = getComputedStyle(activeViewerImg).objectFit || 'contain'
	fly.style.background = '#e8e4da'
	fly.style.opacity = '1'
	document.body.appendChild(fly)

	gsap.set([viewer.img, viewer.imgB, viewer.video].filter(Boolean), {
		opacity: 0,
	})

	const tl = gsap.timeline({
		defaults: { ease: 'power3.inOut' },
		onComplete: () => {
			fly.remove()
			stopViewerVideo()
			if (originSlide) {
				const stackImgs = originSlide.querySelectorAll('.slide-image > img')
				const cardVideo = originSlide.querySelector('.slide-image video')
				const cardMedia = originSlide.querySelector('.slide-image--video')
				gsap.set(stackImgs, { clearProps: 'opacity' })
				if (cardVideo && cardMedia) {
					gsap.set(cardVideo, { clearProps: 'opacity' })
					cardVideo.currentTime = 0
					setVideoPaused(
						cardMedia,
						cardVideo,
						originSlide.querySelector('.media-play-btn'),
					)
					const muteBtn = originSlide.querySelector('[data-mute-toggle]')
					syncMuteButton(muteBtn, true)
					const slidePlay = originSlide.querySelector('.media-play-btn')
					if (slidePlay) slidePlay.style.visibility = ''
				} else if (stackImgs.length > 1) {
					originSlide._imageCycleTimer = startImageCycle([...stackImgs])
				} else if (originImg) {
					gsap.set(originImg, { opacity: 1 })
				}
				const slideMeta = originSlide.querySelector('.slide-meta')
				const slideContacts = originSlide.querySelector('.slide-contacts')
				if (slideMeta) gsap.set(slideMeta, { clearProps: 'opacity' })
				if (slideContacts) gsap.set(slideContacts, { clearProps: 'opacity' })
				const cardUi = originSlide.querySelector('.media-video-ui')
				if (cardUi) cardUi.style.visibility = ''
			}
			viewer.root.classList.remove('is-open')
			viewer.root.setAttribute('aria-hidden', 'true')
			document.body.classList.remove('works-viewer-open')
			viewer.media?.classList.remove('works-viewer__media--cycle')
			if (viewer.imgB) {
				viewer.imgB.hidden = true
				viewer.imgB.classList.remove('is-active')
			}
			viewer.img.classList.add('is-active')
			gsap.set(viewer.root, { clearProps: 'opacity' })
			gsap.set([viewer.img, viewer.imgB, viewer.video].filter(Boolean), {
				clearProps: 'opacity',
			})
			state.viewerOpen = false
			state.viewerBusy = false
			state.originSlide = null
			state.originImg = null
		},
	})

	tl.to(viewer.details, { opacity: 0, y: 16, duration: 0.28 }, 0)
		.to(viewer.closeBtn, { opacity: 0, duration: 0.2 }, 0)

	if (toRect && toRect.width > 0) {
		tl.to(
			fly,
			{
				left: toRect.left,
				top: toRect.top,
				width: toRect.width,
				height: toRect.height,
				duration: 0.85,
			},
			0.05,
		).to(viewer.root, { opacity: 0, duration: 0.35 }, 0.45)
	} else {
		tl.to(fly, { opacity: 0, duration: 0.35 }, 0.05).to(
			viewer.root,
			{ opacity: 0, duration: 0.35 },
			0.05,
		)
	}
}

function createSlideElement(index) {
	const slide = document.createElement('div')
	const dataIndex = index % totalSlideCount
	const data = sliderData[dataIndex]
	slide.className = data.fit === 'full' ? 'slide slide--full' : 'slide'
	slide.dataset.projectIndex = String(dataIndex)

	const imageContainer = document.createElement('div')
	const images = projectImages(data)

	if (data.video) {
		imageContainer.className = 'slide-image slide-image--video is-paused'
		const poster = document.createElement('img')
		poster.src = images[0] || data.img
		poster.alt = data.title
		poster.draggable = false
		poster.loading = 'lazy'
		poster.classList.add('is-active')

		const video = document.createElement('video')
		video.src = data.video
		video.muted = true
		video.loop = false
		video.playsInline = true
		video.setAttribute('playsinline', '')
		video.preload = 'metadata'
		video.setAttribute('aria-label', data.title)

		const playBtn = createPlayButton()
		const ui = createSlideVideoUi()
		bindVideoUi(ui, video, { container: imageContainer, playBtn })
		syncMuteButton(ui.querySelector('[data-mute-toggle]'), true)

		imageContainer.appendChild(poster)
		imageContainer.appendChild(video)
		imageContainer.appendChild(playBtn)
		imageContainer.appendChild(ui)
	} else {
		imageContainer.className =
			images.length > 1 ? 'slide-image slide-image--cycle' : 'slide-image'

		images.forEach((src, i) => {
			const img = document.createElement('img')
			img.src = src
			img.alt = data.title
			img.draggable = false
			img.loading = 'lazy'
			if (i === 0) img.classList.add('is-active')
			imageContainer.appendChild(img)
		})

		if (images.length > 1) {
			/* Start cycling only when the card is near the viewport (perf). */
			slide._cycleImgs = [...imageContainer.querySelectorAll(':scope > img')]
		}
	}

	const contacts = createSlideContacts()
	imageContainer.appendChild(contacts)

	const overlay = document.createElement('div')
	overlay.className = 'slide-overlay'

	const overviewBtn = document.createElement('button')
	overviewBtn.type = 'button'
	overviewBtn.className = 'slide-overlay__overview'
	overviewBtn.setAttribute('aria-label', `Overview: ${data.title}`)
	overviewBtn.innerHTML = `
		<span>Overview</span>
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M7 17L17 7M17 7H7M17 7V17" />
		</svg>
	`

	const bullets = document.createElement('ul')
	bullets.className = 'slide-overlay__bullets'
	projectBullets(data).forEach((line) => {
		const li = document.createElement('li')
		li.textContent = line
		bullets.appendChild(li)
	})

	overviewBtn.addEventListener('click', (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (state.dragDistance >= 10 || state.hasActuallyDragged) return
		openOverviewSmooth(slide, data, overviewBtn, overlay)
	})

	overlay.appendChild(overviewBtn)
	if (bullets.childElementCount) overlay.appendChild(bullets)
	imageContainer.appendChild(overlay)

	const meta = document.createElement('div')
	meta.className = 'slide-meta'

	const tag = document.createElement('p')
	tag.className = 'slide-meta__tag'
	tag.textContent = data.eyebrow || 'Case study'

	const title = document.createElement('p')
	title.className = 'slide-meta__title'
	title.textContent = data.title

	const context = document.createElement('p')
	context.className = 'slide-meta__context'
	context.textContent = data.context
		? `• ${data.context}`
		: data.name || ''

	meta.appendChild(tag)
	meta.appendChild(title)
	meta.appendChild(context)

	slide.addEventListener('click', (e) => {
		if (
			e.target.closest(
				'.media-video-ui, .media-play-btn, .slide-contacts, .about-magnetic__item, .slide-overlay__overview',
			)
		) {
			return
		}
		e.preventDefault()
		if (state.dragDistance < 10 && !state.hasActuallyDragged) {
			openOverviewSmooth(slide, data, overviewBtn, overlay)
		}
	})

	slide.appendChild(imageContainer)
	slide.appendChild(meta)
	bindSlideHover(slide)

	return slide
}

function projectBullets(data) {
	if (Array.isArray(data.bullets) && data.bullets.length) {
		return data.bullets.map(String).filter(Boolean).slice(0, 3)
	}
	const raw = String(data.context || '').trim()
	if (!raw) return []
	const parts = raw
		.split(/\s*,\s*|\s+\+\s+|\s+—\s+|\s+–\s+|\sand\s+/i)
		.map((part) => part.replace(/^and\s+/i, '').trim())
		.filter((part) => part.length > 2)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
	if (parts.length >= 2) return parts.slice(0, 3)
	return [raw]
}

function openOverviewSmooth(slide, data, overviewBtn, overlay) {
	if (state.viewerOpen || state.viewerBusy) return
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (reduce || typeof gsap === 'undefined') {
		openProject(slide, data)
		return
	}

	const image = slide.querySelector('.slide-image')
	const bullets = overlay?.querySelector('.slide-overlay__bullets')
	state.viewerBusy = true

	const tl = gsap.timeline({
		defaults: { ease: 'power2.out' },
		onComplete: () => {
			state.viewerBusy = false
			if (image) gsap.set(image, { clearProps: 'scale,transform' })
			if (overlay) gsap.set(overlay, { clearProps: 'opacity,y,transform' })
			if (bullets) gsap.set(bullets, { clearProps: 'opacity,y,transform' })
			if (overviewBtn) gsap.set(overviewBtn, { clearProps: 'scale,transform' })
			openProject(slide, data)
		},
	})

	tl.to(overviewBtn, { scale: 0.96, duration: 0.12, ease: 'power2.inOut' }, 0)
		.to(overviewBtn, { scale: 1, duration: 0.16, ease: 'power2.out' }, 0.12)
		.to(
			[overlay, bullets].filter(Boolean),
			{ opacity: 0, y: -6, duration: 0.22 },
			0.08,
		)
		.to(image, { scale: 0.985, duration: 0.28, ease: 'power2.inOut' }, 0)
}

function bindSlideHover(slide) {
	if (!slide) return
	if (window.matchMedia('(pointer: coarse)').matches) return

	slide.addEventListener('pointerenter', (e) => {
		if (e.pointerType === 'touch') return
		if (state.isDragging || state.viewerOpen) return
		slide.classList.add('is-hot')
	})

	slide.addEventListener('pointerleave', () => {
		slide.classList.remove('is-hot')
	})

	slide.addEventListener('pointercancel', () => {
		slide.classList.remove('is-hot')
	})
}

function measureSlideWidth() {
	const sample = state.slides[0]
	if (!sample) return
	const styles = window.getComputedStyle(sample)
	const ml = parseFloat(styles.marginLeft) || 0
	const mr = parseFloat(styles.marginRight) || 0
	state.slideWidth = sample.offsetWidth + ml + mr
}

function initializeSlides() {
	const track = document.querySelector('.slide-track')
	if (!track) return

	if (state.cycleIo) {
		state.cycleIo.disconnect()
		state.cycleIo = null
	}

	track.innerHTML = ''
	state.slides = []

	checkMobile()

	/* 3 sequences is enough for seamless wrap and cuts DOM ~50% vs 6. */
	const copies = 3
	const totalSlides = totalSlideCount * copies

	for (let i = 0; i < totalSlides; i++) {
		const slide = createSlideElement(i)
		track.appendChild(slide)
		state.slides.push(slide)
	}

	state.skipParallax = state.slides.every((slide) =>
		slide.classList.contains('slide--full'),
	)

	measureSlideWidth()
	const startOffset = -(totalSlideCount * state.slideWidth)
	state.currentX = startOffset
	state.targetX = startOffset

	bindImageCycleObserver()
}

function bindImageCycleObserver() {
	if (state.cycleIo) state.cycleIo.disconnect()

	state.cycleIo = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const slide = entry.target
				if (!slide._cycleImgs) return
				if (entry.isIntersecting) {
					if (!slide._imageCycleTimer) {
						slide._imageCycleTimer = startImageCycle(slide._cycleImgs)
					}
				} else if (slide._imageCycleTimer) {
					slide._imageCycleTimer = stopImageCycle(slide._imageCycleTimer)
				}
			})
		},
		{ root: null, rootMargin: '20% 0px', threshold: 0.01 },
	)

	state.slides.forEach((slide) => {
		if (slide._cycleImgs) state.cycleIo.observe(slide)
	})
}

function updateSlidePositions() {
	const track = document.querySelector('.slide-track')
	if (!track) return

	const sequenceWidth = state.slideWidth * totalSlideCount
	if (!sequenceWidth) return

	/* Keep the track inside the middle copy (works with 3 cloned sequences). */
	if (state.currentX > -sequenceWidth * 0.5) {
		state.currentX -= sequenceWidth
		state.targetX -= sequenceWidth
	} else if (state.currentX < -sequenceWidth * 1.5) {
		state.currentX += sequenceWidth
		state.targetX += sequenceWidth
	}

	track.style.transform = `translate3d(${state.currentX}px, 0, 0)`
}

function updateParallax() {
	/* All case-study cards are fit:full — skip per-frame getBoundingClientRect work. */
	if (state.skipParallax) return

	const viewportCenter = window.innerWidth / 2

	state.slides.forEach((slide) => {
		if (slide.classList.contains('slide--full')) {
			return
		}

		const img = slide.querySelector('.slide-image > img')
		if (!img) return

		const slideRect = slide.getBoundingClientRect()

		if (slideRect.right < -200 || slideRect.left > window.innerWidth + 200) {
			return
		}

		const slideCenter = slideRect.left + slideRect.width / 2
		const distanceFromCenter = slideCenter - viewportCenter
		const parallaxOffset = distanceFromCenter * -0.25

		img.style.transform = `translateX(${parallaxOffset}px) scale(2.25)`
	})
}

function updateMovingState() {
	state.velocity = Math.abs(state.currentX - state.lastCurrentX)
	state.lastCurrentX = state.currentX

	const isSlowEnough = state.velocity < 0.1
	const hasBeenStillLongEnough = Date.now() - state.lastScrollTime > 200
	state.isMoving =
		state.hasActuallyDragged || !isSlowEnough || !hasBeenStillLongEnough

	document.documentElement.style.setProperty(
		'--slider-moving',
		state.isMoving ? '1' : '0',
	)
}

function animate() {
	state.rafId = requestAnimationFrame(animate)

	if (state.viewerOpen || !state.sliderLive) return

	const delta = state.targetX - state.currentX
	const needsLerp = Math.abs(delta) > 0.08 || state.isDragging

	if (!needsLerp) {
		if (state.currentX !== state.targetX) {
			state.currentX = state.targetX
			updateSlidePositions()
		}
		if (state.isMoving) updateMovingState()
		return
	}

	state.currentX += delta * config.LERP_FACTOR
	updateMovingState()
	updateSlidePositions()
	updateParallax()
}

function handleWheel(e) {
	if (state.viewerOpen) return

	const absX = Math.abs(e.deltaX)
	const absY = Math.abs(e.deltaY)

	/* Never steal vertical page scroll. Only explicit horizontal trackpad/mouse-tilt. */
	if (absY >= absX || absX < 10) return

	e.preventDefault()
	state.lastScrollTime = Date.now()
	state.upIntent = 0
	endDrag()

	const scrollDelta = e.deltaX * config.SCROLL_SPEED
	state.targetX -= Math.max(
		Math.min(scrollDelta, config.MAX_VELOCITY),
		-config.MAX_VELOCITY,
	)
}

function setSliderDragging(active) {
	const slider = document.querySelector('.site-panel--works .slider')
	if (!slider) return
	slider.classList.toggle('is-dragging', Boolean(active))
}

function endDrag() {
	state.isDragging = false
	setSliderDragging(false)
}

function handleTouchStart(e) {
	if (state.viewerOpen) return
	if (e.target.closest('.media-video-ui, .media-play-btn, .media-seek, .slide-contacts, .about-magnetic__item, .slide-overlay__overview')) return
	state.isDragging = true
	setSliderDragging(true)
	state.startX = e.touches[0].clientX
	state.lastX = state.targetX
	state.dragDistance = 0
	state.hasActuallyDragged = false
	state.lastScrollTime = Date.now()
	state._touchStartY = e.touches[0].clientY
}

function handleTouchMove(e) {
	if (!state.isDragging || state.viewerOpen) return

	const deltaX = (e.touches[0].clientX - state.startX) * 1.5
	const deltaY = Math.abs((state._touchStartY || 0) - e.touches[0].clientY)

	/* Vertical page scroll wins — release card drag */
	if (deltaY > Math.abs(deltaX) && deltaY > 8) {
		endDrag()
		return
	}

	state.targetX = state.lastX + deltaX
	state.dragDistance = Math.abs(deltaX)

	if (state.dragDistance > 5) {
		state.hasActuallyDragged = true
	}

	state.lastScrollTime = Date.now()
}

function handleTouchEnd() {
	endDrag()
	setTimeout(() => {
		state.hasActuallyDragged = false
	}, 100)
}

function handleMouseDown(e) {
	if (state.viewerOpen) return
	if (e.target.closest('.media-video-ui, .media-play-btn, .media-seek, .slide-contacts, .about-magnetic__item, .slide-overlay__overview, .slider-nav')) return
	/* Don't preventDefault yet — keeps page scroll / click feel smooth until real drag */
	state.isDragging = true
	setSliderDragging(true)
	state.startX = e.clientX
	state.lastMouseX = e.clientX
	state.lastX = state.targetX
	state.dragDistance = 0
	state.hasActuallyDragged = false
	state.lastScrollTime = Date.now()
}

function handleMouseMove(e) {
	if (!state.isDragging || state.viewerOpen) return

	const deltaX = (e.clientX - state.lastMouseX) * 2
	state.targetX += deltaX
	state.lastMouseX = e.clientX
	state.dragDistance += Math.abs(deltaX)

	if (state.dragDistance > 5) {
		state.hasActuallyDragged = true
		e.preventDefault()
	}

	state.lastScrollTime = Date.now()
}

function handleMouseUp() {
	endDrag()
	setTimeout(() => {
		state.hasActuallyDragged = false
	}, 100)
}

function handleResize() {
	if (state.viewerOpen) return
	const prevWidth = state.slideWidth
	initializeSlides()
	if (prevWidth && state.slideWidth && prevWidth !== state.slideWidth) {
		const ratio = state.slideWidth / prevWidth
		state.currentX *= ratio
		state.targetX *= ratio
	}
}

function slideBy(direction) {
	if (state.viewerOpen) return
	state.targetX += direction * state.slideWidth
	state.lastScrollTime = Date.now()
}

function initializeEventListeners() {
	const slider = document.querySelector('.slider')
	if (!slider) return

	slider.addEventListener('wheel', handleWheel, { passive: false })
	slider.addEventListener('touchstart', handleTouchStart, { passive: true })
	slider.addEventListener('touchmove', handleTouchMove, { passive: true })
	slider.addEventListener('touchend', handleTouchEnd)
	slider.addEventListener('mousedown', handleMouseDown)
	slider.addEventListener('mouseleave', handleMouseUp)
	slider.addEventListener('dragstart', (e) => e.preventDefault())

	const prev = slider.querySelector('.slider-nav--prev')
	const next = slider.querySelector('.slider-nav--next')
	;[prev, next].forEach((btn) => {
		if (!btn) return
		btn.addEventListener('mousedown', (e) => e.stopPropagation())
		btn.addEventListener('touchstart', (e) => e.stopPropagation(), {
			passive: true,
		})
	})
	if (prev) {
		prev.addEventListener('click', (e) => {
			e.preventDefault()
			e.stopPropagation()
			slideBy(1)
		})
	}
	if (next) {
		next.addEventListener('click', (e) => {
			e.preventDefault()
			e.stopPropagation()
			slideBy(-1)
		})
	}

	if (viewer.closeBtn) {
		viewer.closeBtn.addEventListener('click', (e) => {
			e.preventDefault()
			closeProject()
		})
	}

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && state.viewerOpen) closeProject()
	})

	document.addEventListener('mousemove', handleMouseMove)
	document.addEventListener('mouseup', handleMouseUp)
	window.addEventListener('blur', handleMouseUp)
	window.addEventListener('pointerup', handleMouseUp)
	window.addEventListener('pointercancel', handleMouseUp)
	window.addEventListener('resize', handleResize)
}

function initializeSlider() {
	cacheViewer()
	initializeSlides()
	initializeEventListeners()
	syncWorksCount()
	watchWorksIntro()
	animate()
}

function syncWorksCount() {
	/* Case-study count chips removed — heading uses a professional line instead. */
}

function playWorksIntro(force = false) {
	if (typeof gsap === 'undefined') return
	const panel = document.getElementById('panel-works')
	if (!panel) return

	const rect = panel.getBoundingClientRect()
	const mostlyOff =
		rect.bottom < window.innerHeight * 0.28 ||
		rect.top > window.innerHeight * 0.72
	if (!force && mostlyOff) return
	if (state.worksIntroPlayed && !force) return

	state.worksIntroPlayed = true
	if (typeof window.revealStickyCursor === 'function') {
		window.revealStickyCursor()
	}

	const heading = panel.querySelector('.works-heading')
	const title = heading?.querySelector('h1')
	const line = heading?.querySelector('.works-heading__line')
	const meta = heading?.querySelector('.works-heading__meta')
	const stack = heading?.querySelector('.works-stack')
	const logos = stack ? [...stack.querySelectorAll('.works-stack__logos li')] : []
	const tags = stack ? [...stack.querySelectorAll('.works-stack__tags li')] : []
	const visibleSlides = [...panel.querySelectorAll('.slide')].filter((slide) => {
		const r = slide.getBoundingClientRect()
		return r.right > 24 && r.left < window.innerWidth - 24
	})
	const cardFaces = visibleSlides
		.map((slide) => slide.querySelector('.slide-image'))
		.filter(Boolean)
	const visibleMetas = visibleSlides
		.map((slide) => slide.querySelector('.slide-meta'))
		.filter(Boolean)

	if (state.worksIntroTl) {
		state.worksIntroTl.kill()
		state.worksIntroTl = null
	}

	const ease = 'expo.out'
	const targets = [
		title,
		line,
		meta,
		...logos,
		...tags,
		...cardFaces,
		...visibleMetas,
	].filter(Boolean)
	gsap.killTweensOf(targets)
	gsap.set(targets, { clearProps: 'filter' })

	if (title) gsap.set(title, { y: 22, opacity: 0 })
	if (line) gsap.set(line, { y: 14, opacity: 0 })
	if (meta) gsap.set(meta, { y: 10, opacity: 0 })
	if (logos.length) gsap.set(logos, { y: 8, opacity: 0 })
	if (tags.length) gsap.set(tags, { y: 6, opacity: 0 })
	if (cardFaces.length) gsap.set(cardFaces, { y: 36, opacity: 0 })
	if (visibleMetas.length) gsap.set(visibleMetas, { y: 14, opacity: 0 })

	const tl = gsap.timeline({
		defaults: { ease },
		onComplete: () => {
			heading?.classList.add('is-ready')
			state.worksIntroTl = null
		},
	})
	state.worksIntroTl = tl

	if (title) tl.to(title, { y: 0, opacity: 1, duration: 1.05 }, 0)
	if (line) tl.to(line, { y: 0, opacity: 1, duration: 0.95 }, 0.06)
	if (meta) tl.to(meta, { y: 0, opacity: 1, duration: 0.9 }, 0.12)
	if (logos.length) {
		tl.to(logos, { y: 0, opacity: 1, duration: 0.75, stagger: 0.03 }, 0.16)
	}
	if (tags.length) {
		tl.to(tags, { y: 0, opacity: 1, duration: 0.7, stagger: 0.025 }, 0.24)
	}
	if (cardFaces.length) {
		tl.to(cardFaces, { y: 0, opacity: 1, duration: 1.15, stagger: 0.08 }, 0.14)
	}
	if (visibleMetas.length) {
		tl.to(
			visibleMetas,
			{ y: 0, opacity: 1, duration: 0.9, stagger: 0.05 },
			0.32,
		)
	}
}

window.playWorksEnter = playWorksIntro

function watchWorksIntro() {
	const panel = document.getElementById('panel-works')
	if (!panel) return

	const tryPlay = () => playWorksIntro(false)
	tryPlay()

	const io = new IntersectionObserver(
		(entries) => {
			const visible = entries.some(
				(e) => e.isIntersecting && e.intersectionRatio > 0.12,
			)
			state.sliderLive = visible
			if (visible) {
				tryPlay()
				if (typeof window.revealStickyCursor === 'function') {
					window.revealStickyCursor()
				}
			} else {
				/* Pause off-screen image cycles to free the main thread. */
				state.slides.forEach((slide) => {
					if (slide._imageCycleTimer) {
						slide._imageCycleTimer = stopImageCycle(slide._imageCycleTimer)
					}
				})
			}
		},
		{ threshold: [0.05, 0.15, 0.3, 0.5, 0.75] },
	)
	io.observe(panel)

	const flow = document.getElementById('site-flow')
	if (flow) {
		flow.addEventListener(
			'scroll',
			() => {
				if (!state.worksIntroPlayed) tryPlay()
			},
			{ passive: true },
		)
	}
	window.addEventListener('hashchange', () => {
		if (location.hash === '#works') {
			state.sliderLive = true
			if (typeof window.revealStickyCursor === 'function') {
				window.revealStickyCursor()
			}
			requestAnimationFrame(() => playWorksIntro(!state.worksIntroPlayed))
		}
	})
}

document.addEventListener('DOMContentLoaded', initializeSlider)
