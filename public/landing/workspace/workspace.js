// Projects: a dark studio wall of lit project cards, with Haris working at his desk below.
// Click a card (or use the arrows) and the camera walks over to it and opens the project.
// Three.js is imported lazily inside buildScene(), so it costs nothing until the room is near.

const REF = './workspace/ref/'
const LOGO = './assets/img/tools/'
const CONTACT = 'mailto:hello@autoany.io'

// tool name -> [brand colour, logo file]; used by the detail panel and the desk screens
const TOOLS = {
	n8n: ['#ff6d5a', 'n8n.png'], openai: ['#10a37f', 'openai.svg'], gpt: ['#10a37f', 'openai.svg'], airtable: ['#fcb400', 'airtable.svg'],
	zapier: ['#ff4f00', 'zapier.png'], make: ['#8f3cff', 'make.png'], gohighlevel: ['#188bf6', 'ghl.png'], twilio: ['#f22f46', 'twilio.svg'],
	retell: ['#e9e9e9', 'retell.png'], webflow: ['#4353ff', 'webflow.svg'], postgresql: ['#4f8cc9', 'postgresql.svg'], 'next.js': ['#e9e9e9', 'nextjs.svg'],
	microsoft: ['#2f8fe0'], google: ['#1fae63'], gemini: ['#4285f4'], whatsapp: ['#25d366'], apify: ['#97d700'], monday: ['#ff3d57'],
	veo: ['#4285f4'], synology: ['#b5b5b6'], firecrawl: ['#ff6a00'], power: ['#2f7bff'], rag: ['#a58cff'], speech: ['#29b6f6'], text: ['#ffb020'],
}
const toolOf = (name) => {
	const n = name.toLowerCase()
	const k = Object.keys(TOOLS).find((key) => n.includes(key))
	return k ? TOOLS[k] : ['#8a93a3']
}

// Card photos are reference photography, not project screenshots
const PROJECTS = [
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

const section = document.getElementById('panel-works')
if (section) init()

function init() {
	const $ = (s) => section.querySelector(s)
	const canvas = $('.ws__canvas')
	const flow = document.getElementById('site-flow')
	const header = document.getElementById('js-site-header')
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const mobileQuery = window.matchMedia('(max-width: 767px)')
	const debug = new URLSearchParams(location.search).has('wsdebug')

	const ui = {
		count: $('.ws__count b'),
		total: $('.ws__count span'),
		prev: $('.ws__btn--prev'),
		next: $('.ws__btn--next'),
		num: $('.ws__num'),
		kind: $('.ws__kind'),
		close: $('.ws__close'),
		prevFile: $('.ws__pager-btn--prev'),
		nextFile: $('.ws__pager-btn--next'),
		name: $('.ws__name'),
		copy: $('.ws__copy'),
		figs: $('.ws__figs'),
		stack: $('.ws__stack'),
		cta: $('.ws__cta'),
		back: $('.ws__back'),
		list: $('.ws__list'),
	}

	let focus = 0
	let selected = false
	let open = false
	const pad = (n) => String(n).padStart(2, '0')
	ui.total.textContent = pad(PROJECTS.length)

	// accessible list of every project; also the visible cards when WebGL is unavailable
	const listButtons = PROJECTS.map((p, i) => {
		const li = document.createElement('li')
		const b = document.createElement('button')
		b.type = 'button'
		b.setAttribute('aria-label', `Open project: ${p.name}`)
		b.innerHTML = `${p.card}<small>${p.sub}</small>`
		b.addEventListener('focus', () => setFocus(i))
		b.addEventListener('click', () => openProject(i))
		li.appendChild(b)
		ui.list.appendChild(li)
		return b
	})

	// the opened project as a case file: headline result first, tools with their logos,
	// and the neighbouring projects one tap away
	const neighbour = (i, d) => PROJECTS[(i + d + PROJECTS.length) % PROJECTS.length]
	function fillPager(btn, p, label) {
		// small thumbnails: decoding the full photos for these tiny boxes stalled a frame on phones
		btn.querySelector('i').style.backgroundImage = `url(${REF}thumb/${p.img})`
		btn.querySelector('span').textContent = p.card
		// phones show these as bare arrows, so the name lives on the button too
		btn.setAttribute('aria-label', `${label} project: ${p.card}`)
	}
	function fillDetail(i) {
		const p = PROJECTS[i]
		ui.num.textContent = pad(i + 1)
		ui.kind.textContent = p.tag.replace(/^Case study, /, '')
		ui.name.textContent = p.name
		ui.copy.textContent = p.copy
		const [first, ...rest] = p.figs
		ui.figs.innerHTML = first
			? `<div class="ws__hero"><b>${first[0]}</b><span>${first[1]}</span></div>` +
				(rest.length ? `<div class="ws__more">${rest.map(([n, l]) => `<div><b>${n}</b><small>${l}</small></div>`).join('')}</div>` : '')
			: ''
		ui.stack.innerHTML = p.stack
			.map((s) => {
				const file = toolOf(s)[1]
				const mark = file ? `<img src="${LOGO}${file}" alt="" width="24" height="24" />` : `<em aria-hidden="true">${s[0]}</em>`
				return `<li>${mark}${s}</li>`
			})
			.join('')
		ui.cta.href = `${CONTACT}?subject=${encodeURIComponent('A project like ' + p.name)}`
		fillPager(ui.prevFile, neighbour(i, -1), 'Previous')
		fillPager(ui.nextFile, neighbour(i, 1), 'Next')
	}

	// shared controls work in both the 3D room and the flat fallback
	let scene3d = null
	function setFocus(i) {
		focus = (i + PROJECTS.length) % PROJECTS.length
		selected = true
		ui.count.textContent = pad(focus + 1)
		if (open) fillDetail(focus)
		scene3d?.wake()
	}
	function openProject(i) {
		setFocus(i)
		fillDetail(focus)
		open = true
		section.classList.add('is-open')
		ui.close.focus({ preventScroll: true })
		scene3d?.wake()
	}
	function closeProject() {
		if (!open) return
		open = false
		section.classList.remove('is-open')
		scene3d?.wake()
	}
	ui.prev.addEventListener('click', () => setFocus(focus - 1))
	ui.next.addEventListener('click', () => setFocus(focus + 1))
	ui.back.addEventListener('click', closeProject)
	ui.close.addEventListener('click', closeProject)
	ui.prevFile.addEventListener('click', () => setFocus(focus - 1))
	ui.nextFile.addEventListener('click', () => setFocus(focus + 1))

	let inView = false
	window.addEventListener('keydown', (e) => {
		if (!inView || e.target.closest('input, textarea, [contenteditable]')) return
		if (e.key === 'ArrowRight') setFocus(focus + 1)
		else if (e.key === 'ArrowLeft') setFocus(focus - 1)
		else if (e.key === 'Escape') closeProject()
		else if (e.key === 'Enter' && !open && e.target === document.body) openProject(focus)
		else return
		e.preventDefault()
	})

	// ---------- day / night ----------
	// Starts from the visitor's own clock (day 6am to 6pm), unless they picked a mode before.
	const hourNow = new Date().getHours()
	let night = hourNow < 6 || hourNow >= 18
	try {
		const saved = localStorage.getItem('ws-mode')
		if (saved === 'day' || saved === 'night') night = saved === 'night'
	} catch (e) {}
	const dnButton = $('.ws__dn')
	let headerUnder = false
	function syncMode() {
		section.classList.toggle('is-day', !night)
		section.classList.toggle('is-night', night)
		dnButton.setAttribute('aria-pressed', String(night))
		dnButton.setAttribute('aria-label', night ? 'Switch to day' : 'Switch to night')
		if (header) header.classList.toggle('site-header--on-dark', headerUnder && night)
	}
	dnButton.addEventListener('click', () => {
		night = !night
		try {
			localStorage.setItem('ws-mode', night ? 'night' : 'day')
		} catch (e) {}
		syncMode()
		scene3d?.setNight(night)
	})

	// the global header turns light while the dark (night) room sits under it
	if (header && flow && 'IntersectionObserver' in window) {
		new IntersectionObserver(
			([entry]) => {
				headerUnder = entry.intersectionRatio > 0
				syncMode()
			},
			{ root: flow, rootMargin: '-1px 0px -90% 0px', threshold: 0 },
		).observe(section)
	}
	syncMode()

	// the visitor's local time and place. The place comes from the browser's time zone
	// (e.g. Asia/Karachi -> Karachi): no location permission, nothing leaves the device.
	const timeEl = $('.ws__time')
	let place = ''
	try {
		const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
		place = zone.split('/').pop().replace(/_/g, ' ')
		if (/^(UTC|GMT|Etc)/i.test(zone)) place = ''
	} catch (e) {}
	function tickLabel() {
		const t = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
		timeEl.querySelector('b').textContent = t
		timeEl.querySelector('span').textContent = place ? place : 'Your time'
	}
	tickLabel()
	setInterval(tickLabel, 15000)

	function goFlat(err) {
		section.classList.add('ws--flat', 'is-seen')
		listButtons.forEach((b, i) => (b.style.backgroundImage = `url(${REF}${PROJECTS[i].img})`))
		if (err) console.warn('Workspace: 3D unavailable, showing the flat card grid instead.', err)
	}

	// Visibility. The 1px inset matters: a section whose edge only touches the screen edge
	// would otherwise count as visible and keep rendering while you read the next section.
	let seen = false
	// The still picture of the room (finished state) covers the wait when the visitor reaches
	// the room before the 3D is ready. The live scene then starts on that same frame.
	let posterShown = false
	new IntersectionObserver(
		([entry]) => {
			const ratio = entry.intersectionRatio
			inView = ratio > 0.5
			if (ratio > 0 && !scene3d) posterShown = true
			if (ratio > 0) scene3d?.start()
			else scene3d?.stop()
			if (!seen && ratio > 0.35) {
				seen = true
				section.classList.add('is-seen')
				scene3d?.enter()
			}
		},
		{ root: flow || null, rootMargin: '-1px 0px -1px 0px', threshold: [0, 0.35, 0.5] },
	).observe(section)
	document.addEventListener('visibilitychange', () => (document.hidden ? scene3d?.stop() : inView && scene3d?.start()))

	// Lazy load: the 3D library and the card photos are fetched only once the visitor starts
	// scrolling toward the room, or once the browser is idle after the hero's opening
	// animation, whichever comes first. They never compete with the hero entrance.
	let loading = false
	function startLoad() {
		if (loading) return
		loading = true
		loadIO.disconnect()
		buildScene()
			.then((s) => {
				scene3d = s
				const r = section.getBoundingClientRect()
				const fr = flow ? flow.getBoundingClientRect() : { top: 0, bottom: innerHeight }
				const visible = r.bottom > fr.top + 1 && r.top < fr.bottom - 1
				// the still was on screen: skip the entrance so the live frame matches it, then cross-fade
				if (posterShown) scene3d.enter(true)
				else section.classList.add('is-live-now')
				if (visible) scene3d.start()
				if (seen) scene3d.enter()
			})
			.catch(goFlat)
	}
	// The room sits right below the hero, so any positive margin would fire at page load.
	// A -1px inset fires as soon as the visitor starts scrolling toward it.
	const loadIO = new IntersectionObserver(([entry]) => entry.intersectionRatio > 0 && startLoad(), {
		root: flow || null,
		rootMargin: '-1px 0px -1px 0px',
		threshold: 0,
	})
	loadIO.observe(section)
	const loadWhenIdle = () =>
		window.requestIdleCallback ? requestIdleCallback(startLoad, { timeout: 4000 }) : setTimeout(startLoad, 800)
	if (document.readyState === 'complete') setTimeout(loadWhenIdle, 5000)
	else window.addEventListener('load', () => setTimeout(loadWhenIdle, 5000), { once: true })

	// ------------------------------------------------------------------
	async function buildScene() {
		const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }, { RoundedBoxGeometry }, { RoomEnvironment }] = await Promise.all([
			import('three'),
			import('three/addons/postprocessing/EffectComposer.js'),
			import('three/addons/postprocessing/RenderPass.js'),
			import('three/addons/postprocessing/UnrealBloomPass.js'),
			import('three/addons/postprocessing/OutputPass.js'),
			import('three/addons/geometries/RoundedBoxGeometry.js'),
			import('three/addons/environments/RoomEnvironment.js'),
		])

		const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
		renderer.outputColorSpace = THREE.SRGBColorSpace
		renderer.toneMapping = THREE.ACESFilmicToneMapping

		// ---------- quality tier: 2 full, 1 balanced, 0 light ----------
		// Picked from the hardware, then lowered at runtime if the frame rate drops.
		function detectTier() {
			const forced = new URLSearchParams(location.search).get('wsq')
			if (forced !== null) return Math.max(0, Math.min(2, Number(forced)))
			const cores = navigator.hardwareConcurrency || 8
			const memory = navigator.deviceMemory || 8
			const coarse = window.matchMedia('(pointer: coarse)').matches
			const saveData = navigator.connection && navigator.connection.saveData
			let gpu = ''
			try {
				const gl = renderer.getContext()
				const ext = gl.getExtension('WEBGL_debug_renderer_info')
				gpu = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || '')
			} catch (e) {
				gpu = ''
			}
			if (/swiftshader|llvmpipe|software|basic render/i.test(gpu) || saveData || cores <= 2 || memory <= 2) return 0
			if (coarse && (cores <= 4 || memory <= 3)) return 0
			if (coarse || cores <= 4 || memory <= 4 || /intel|mali|adreno \(tm\) [1-5]|powervr|videocore/i.test(gpu)) return 1
			return 2
		}
		let tier = detectTier()
		const startTier = tier
		// a tier forced with ?wsq= stays put for testing, unless ?wsgov is also given
		const qs = new URLSearchParams(location.search)
		const pinned = qs.has('wsq') && !qs.has('wsgov')
		const dprFor = (t) => {
			const dpr = window.devicePixelRatio || 1
			return t === 2 ? Math.min(dpr, 1.5) : t === 1 ? Math.min(dpr, mobileQuery.matches ? 1.25 : 1) : Math.min(dpr, 1)
		}
		renderer.shadowMap.enabled = tier > 0
		renderer.shadowMap.type = tier === 2 ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap

		const scene = new THREE.Scene()
		scene.background = new THREE.Color('#060607')
		scene.fog = new THREE.FogExp2('#060607', 0.045)
		// every value that differs between day and night, blended by nightMix (0 day, 1 night)
		const C = (hex) => new THREE.Color(hex)
		const LOOK = {
			bg: [C('#ece6da'), C('#060607')],
			fog: [0.035, 0.045],
			floor: [C('#f2e6d3'), C('#161618')],
			envLight: [0.22, 0.04],
			wall: [C('#efe9de'), C('#050505')],
			slat: [C('#e6dfd2'), C('#121213')],
			hemiSky: [C('#ffffff'), C('#3a3530')],
			hemiGround: [C('#cbb89c'), C('#050505')],
			hemi: [1.25, 0.22],
			keyColor: [C('#fff1dd'), C('#9fb4ff')],
			key: [0.95, 0.12],
			exposure: [0.95, 1],
			bloom: [
				[0.22, 0.4, 1.15],
				[0.5, 0.6, 0.92],
			],
		}
		let nightMix = night ? 1 : 0
		let nightTarget = nightMix
		const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 80)
		{
			const pmrem = new THREE.PMREMGenerator(renderer)
			scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
			pmrem.dispose()
		}
		const hemi = new THREE.HemisphereLight('#3a3530', '#050505', 0.22)
		scene.add(hemi)

		const mat = (color, roughness = 0.8, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness })
		function mesh(geo, material, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], cast = true, receive = true } = {}) {
			const m = new THREE.Mesh(geo, material)
			m.position.set(...pos)
			m.rotation.set(...rot)
			m.scale.set(...scale)
			m.castShadow = cast
			m.receiveShadow = receive
			return m
		}
		const UP = new THREE.Vector3(0, 1, 0)
		function limb(a, b, r, material, cast = true) {
			const A = new THREE.Vector3(...a)
			const B = new THREE.Vector3(...b)
			const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(A.distanceTo(B), 0.0001), 6, 14), material)
			m.position.copy(A).add(B).multiplyScalar(0.5)
			m.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize())
			m.castShadow = cast
			m.receiveShadow = true
			return m
		}
		// moving segment: one unit cylinder re-aimed every frame, so no geometry is ever rebuilt
		const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 14)
		function segment(r, material) {
			const m = mesh(unitCyl, material)
			m.userData.r = r
			return m
		}
		const segDir = new THREE.Vector3()
		function aim(m, A, B) {
			segDir.subVectors(B, A)
			const len = Math.max(segDir.length(), 0.0001)
			m.position.copy(A).add(B).multiplyScalar(0.5)
			m.quaternion.setFromUnitVectors(UP, segDir.divideScalar(len))
			m.scale.set(m.userData.r, len, m.userData.r)
		}

		// ---------- room ----------
		const WALL_Z = -2.2
		const ROOM_X = 8
		const plankCv = document.createElement('canvas')
		plankCv.width = plankCv.height = 512
		{
			const c = plankCv.getContext('2d')
			let sd = 5
			const r = () => (sd = (sd * 9301 + 49297) % 233280) / 233280
			for (let row = 0; row < 8; row++) {
				const y = row * 64
				const tone = 180 + r() * 30
				c.fillStyle = `rgb(${tone},${tone * 0.82},${tone * 0.62})`
				c.fillRect(0, y, 512, 64)
				for (let i = 0; i < 16; i++) {
					c.strokeStyle = '#6b4a2c'
					c.globalAlpha = 0.05 + r() * 0.15
					c.lineWidth = 0.6 + r() * 1.6
					const y0 = y + r() * 64
					c.beginPath()
					for (let x = 0; x <= 512; x += 8) c.lineTo(x, y0 + Math.sin(x * 0.01 + i) * 2.5)
					c.stroke()
				}
				c.globalAlpha = 0.55
				c.fillStyle = 'rgb(60,40,22)'
				c.fillRect(0, y, 512, 1.5)
				c.fillRect(((row * 197) % 450) + 30, y, 1.5, 64)
				c.globalAlpha = 1
			}
		}
		const plankTex = new THREE.CanvasTexture(plankCv)
		plankTex.colorSpace = THREE.SRGBColorSpace
		plankTex.wrapS = plankTex.wrapT = THREE.RepeatWrapping
		plankTex.repeat.set(24, 16)
		plankTex.anisotropy = 4
		const floorMat = new THREE.MeshStandardMaterial({ color: '#0d0d0e', roughness: 0.42, map: plankTex })
		const wallMat = mat('#050505', 1)
		const slatMat = mat('#121213', 0.62, 0.05)
		scene.add(mesh(new THREE.PlaneGeometry(60, 40), floorMat, { pos: [ROOM_X, 0, 0], rot: [-Math.PI / 2, 0, 0], cast: false }))
		scene.add(mesh(new THREE.PlaneGeometry(60, 12), wallMat, { pos: [ROOM_X, 6, WALL_Z - 0.06], cast: false }))
		// the window takes the first slot on the wall; the cards start one slot to its right
		const SPACING = 1.85
		const WIN_W = 1.5
		const WIN_H = 2.0
		const WIN_Y = 2.3
		const winX = () => (mobileQuery.matches ? -1 : -2) * SPACING
		const SLATS = 370
		const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.085, 12, 0.035), slatMat, SLATS)
		slats.receiveShadow = true
		const tmp = new THREE.Object3D()
		function layoutSlats() {
			let k = 0
			for (let i = 0; i < SLATS; i++) {
				const x = -12 + i * 0.108
				if (Math.abs(x - winX()) < WIN_W / 2 + 0.12) continue
				tmp.position.set(x, 6, WALL_Z - 0.0425)
				tmp.updateMatrix()
				slats.setMatrixAt(k++, tmp.matrix)
			}
			slats.count = k
			slats.instanceMatrix.needsUpdate = true
		}
		layoutSlats()
		scene.add(slats)

		// ---------- window: day, sunset and night skies cross-fade behind the glass ----------
		function skyCanvas(kind) {
			const cv = document.createElement('canvas')
			const W = 400
			const H = 534
			cv.width = W
			cv.height = H
			const c = cv.getContext('2d')
			const g = c.createLinearGradient(0, 0, 0, H)
			const stops = {
				day: [[0, '#6fa8e2'], [0.65, '#bcd9f0'], [1, '#e6f0f5']],
				dusk: [[0, '#2a2f5e'], [0.45, '#b4566a'], [0.75, '#f08a4b'], [1, '#ffc57a']],
				night: [[0, '#03060f'], [0.7, '#0d1834'], [1, '#1b2a4d']],
			}[kind]
			stops.forEach(([o, col]) => g.addColorStop(o, col))
			c.fillStyle = g
			c.fillRect(0, 0, W, H)
			const glow = (x, y, r, col) => {
				const gg = c.createRadialGradient(x, y, 0, x, y, r)
				gg.addColorStop(0, col)
				gg.addColorStop(1, 'rgba(255,255,255,0)')
				c.fillStyle = gg
				c.fillRect(x - r, y - r, r * 2, r * 2)
			}
			if (kind === 'day') {
				glow(270, 140, 150, 'rgba(255,250,225,0.95)')
				c.fillStyle = '#fffbea'
				c.beginPath()
				c.arc(270, 140, 36, 0, Math.PI * 2)
				c.fill()
				c.fillStyle = 'rgba(255,255,255,0.75)'
				;[[85, 225, 54], [130, 216, 40], [46, 238, 36], [230, 315, 46], [268, 308, 34]].forEach(([x, y, r]) => {
					c.beginPath()
					c.ellipse(x, y, r, r * 0.42, 0, 0, Math.PI * 2)
					c.fill()
				})
			} else if (kind === 'dusk') {
				glow(220, 450, 200, 'rgba(255,190,110,0.9)')
				c.fillStyle = '#ffd08a'
				c.beginPath()
				c.arc(220, 450, 44, 0, Math.PI * 2)
				c.fill()
			} else {
				let seed = 3
				const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
				for (let i = 0; i < 130; i++) {
					c.fillStyle = `rgba(255,255,255,${0.35 + rnd() * 0.65})`
					c.beginPath()
					c.arc(rnd() * W, rnd() * H * 0.72, rnd() * 1.4 + 0.3, 0, Math.PI * 2)
					c.fill()
				}
				glow(262, 130, 100, 'rgba(210,225,255,0.32)')
				const mc = document.createElement('canvas')
				mc.width = mc.height = 96
				const m = mc.getContext('2d')
				m.fillStyle = '#f4f1e6'
				m.beginPath()
				m.arc(48, 48, 34, 0, Math.PI * 2)
				m.fill()
				m.globalCompositeOperation = 'destination-out'
				m.beginPath()
				m.arc(64, 36, 31, 0, Math.PI * 2)
				m.fill()
				c.drawImage(mc, 214, 82)
			}
			// city skyline; lit windows at sunset and night
			let seed = 7
			const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
			let x = 0
			while (x < W) {
				const bw = 26 + rnd() * 40
				const bh = 70 + rnd() * 130
				c.fillStyle = kind === 'day' ? '#a9bccb' : kind === 'dusk' ? '#3b2c3d' : '#070b17'
				c.fillRect(x, H - bh, bw - 3, bh)
				if (kind !== 'day') {
					for (let wy = H - bh + 8; wy < H - 6; wy += 12) {
						for (let wx = x + 5; wx < x + bw - 9; wx += 8) {
							if (rnd() < (kind === 'night' ? 0.42 : 0.25)) {
								c.fillStyle = rnd() < 0.8 ? 'rgba(255,205,120,0.9)' : 'rgba(170,210,255,0.85)'
								c.fillRect(wx, wy, 4, 5)
							}
						}
					}
				}
				x += bw
			}
			const t = new THREE.CanvasTexture(cv)
			t.colorSpace = THREE.SRGBColorSpace
			return t
		}
		const win = new THREE.Group()
		win.userData.dynamic = true
		const skyGeo = new THREE.PlaneGeometry(WIN_W, WIN_H)
		const skyDay = mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyCanvas('day'), toneMapped: false }), { pos: [0, 0, -0.012], cast: false })
		const skyDusk = mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyCanvas('dusk'), toneMapped: false, transparent: true, depthWrite: false, opacity: 0 }), { pos: [0, 0, -0.011], cast: false })
		const skyNight = mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyCanvas('night'), toneMapped: false, transparent: true, depthWrite: false, opacity: 0, color: '#d8def0' }), { pos: [0, 0, -0.01], cast: false })
		win.add(skyDay, skyDusk, skyNight)
		const oak = mat('#9c7448', 0.55)
		const FR = 0.07
		;[[WIN_W + FR * 2, FR, 0, WIN_H / 2 + FR / 2], [WIN_W + FR * 2, FR, 0, -WIN_H / 2 - FR / 2], [FR, WIN_H, WIN_W / 2 + FR / 2, 0], [FR, WIN_H, -WIN_W / 2 - FR / 2, 0]].forEach(([w, h, x, y]) =>
			win.add(mesh(new THREE.BoxGeometry(w, h, 0.12), oak, { pos: [x, y, 0.02] })),
		)
		win.add(mesh(new THREE.BoxGeometry(0.035, WIN_H, 0.05), oak, { pos: [0, 0, 0.01] }))
		for (const yy of [-WIN_H / 6, WIN_H / 6]) win.add(mesh(new THREE.BoxGeometry(WIN_W, 0.035, 0.05), oak, { pos: [0, yy, 0.01] }))
		win.add(mesh(new THREE.BoxGeometry(WIN_W + 0.3, 0.05, 0.22), oak, { pos: [0, -WIN_H / 2 - FR - 0.02, 0.09] }))
		scene.add(win)

		// light falling through the window onto the floor: warm sun by day, cool moon by night
		const patchCv = document.createElement('canvas')
		patchCv.width = patchCv.height = 128
		{
			const c = patchCv.getContext('2d')
			const g = c.createLinearGradient(0, 0, 0, 128)
			g.addColorStop(0, 'rgba(255,255,255,0.95)')
			g.addColorStop(1, 'rgba(255,255,255,0)')
			c.fillStyle = g
			c.fillRect(0, 0, 128, 128)
			c.globalCompositeOperation = 'destination-out'
			c.fillRect(62, 0, 4, 128)
			c.fillRect(0, 41, 128, 4)
			c.fillRect(0, 84, 128, 4)
		}
		const patchMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(patchCv), transparent: true, depthWrite: false, opacity: 0.4 })
		const patch = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), patchMat)
		patch.userData.dynamic = true
		scene.add(patch)
		function layoutWindow() {
			const x = winX()
			win.position.set(x, WIN_Y, WALL_Z - 0.04)
			const P = patch.geometry.attributes.position
			const corners = [[x - 0.55, WALL_Z + 0.05], [x + 0.75, WALL_Z + 0.05], [x + 0.55, WALL_Z + 1.9], [x + 2.0, WALL_Z + 1.9]]
			corners.forEach(([cx, cz], i) => P.setXYZ(i, cx, 0.004, cz))
			P.needsUpdate = true
			patch.geometry.computeBoundingSphere()
		}
		layoutWindow()

		// ---------- wall clock above the window: the visitor's real local time ----------
		const clockG = new THREE.Group()
		clockG.userData.dynamic = true
		const faceCv = document.createElement('canvas')
		faceCv.width = faceCv.height = 256
		{
			const c = faceCv.getContext('2d')
			c.fillStyle = '#f6f2ea'
			c.beginPath()
			c.arc(128, 128, 128, 0, Math.PI * 2)
			c.fill()
			c.strokeStyle = '#1d1d1f'
			for (let i = 0; i < 60; i++) {
				const a = (i / 60) * Math.PI * 2
				const major = i % 5 === 0
				c.lineWidth = major ? 7 : 2.5
				const r1 = major ? 92 : 104
				c.beginPath()
				c.moveTo(128 + Math.sin(a) * r1, 128 - Math.cos(a) * r1)
				c.lineTo(128 + Math.sin(a) * 116, 128 - Math.cos(a) * 116)
				c.stroke()
			}
			c.fillStyle = '#1d1d1f'
			c.font = '700 22px Manrope, sans-serif'
			c.textAlign = 'center'
			c.fillText('HARIS', 128, 88)
		}
		const faceTex = new THREE.CanvasTexture(faceCv)
		faceTex.colorSpace = THREE.SRGBColorSpace
		const CLOCK_R = 0.24
		const clockFace = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.6, emissive: '#fff4e0', emissiveMap: faceTex, emissiveIntensity: 0 })
		clockG.add(mesh(new THREE.CircleGeometry(CLOCK_R, 48), clockFace, { pos: [0, 0, 0.022], cast: false }))
		clockG.add(mesh(new THREE.CylinderGeometry(CLOCK_R + 0.025, CLOCK_R + 0.025, 0.04, 48), mat('#1d1d1f', 0.4, 0.5), { rot: [Math.PI / 2, 0, 0] }))
		const handMat = mat('#1d1d1f', 0.5)
		function hand(len, width, material, z) {
			const pivot = new THREE.Group()
			pivot.userData.dynamic = true // rotates every second, so its matrix must stay live
			pivot.position.z = z
			pivot.add(mesh(new THREE.BoxGeometry(width, len, 0.006), material, { pos: [0, len / 2 - 0.02, 0], cast: false }))
			clockG.add(pivot)
			return pivot
		}
		const hourHand = hand(0.13, 0.016, handMat, 0.027)
		const minuteHand = hand(0.19, 0.011, handMat, 0.031)
		const secondHand = hand(0.21, 0.004, mat('#c2621f', 0.5), 0.035)
		clockG.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 16), handMat, { pos: [0, 0, 0.04], rot: [Math.PI / 2, 0, 0], cast: false }))
		scene.add(clockG)
		function layoutClock() {
			clockG.position.set(winX(), WIN_Y + WIN_H / 2 + 0.45, WALL_Z + 0.02)
			// on phones the clock would sit behind the intro text; the time label shows the time there
			clockG.visible = !mobileQuery.matches
		}
		layoutClock()
		let lastSecond = -1
		function setClockHands() {
			const d = new Date()
			// the hands tick once a second, so only move them when the second changes
			if (d.getSeconds() === lastSecond) return
			lastSecond = d.getSeconds()
			const sec = d.getSeconds()
			const min = d.getMinutes() + sec / 60
			const hr = (d.getHours() % 12) + min / 60
			secondHand.rotation.z = -(sec / 60) * Math.PI * 2
			minuteHand.rotation.z = -(min / 60) * Math.PI * 2
			hourHand.rotation.z = -(hr / 12) * Math.PI * 2
		}
		setClockHands()

		const beamMat = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
			uniforms: { uColor: { value: new THREE.Color('#ffae5e') }, uStrength: { value: 0 } },
			vertexShader: `
				varying float vH; varying vec3 vN; varying vec3 vV;
				void main() {
					vH = uv.y;
					vec4 wp = modelMatrix * vec4(position, 1.0);
					vN = normalize(mat3(modelMatrix) * normal);
					vV = normalize(cameraPosition - wp.xyz);
					gl_Position = projectionMatrix * viewMatrix * wp;
				}`,
			fragmentShader: `
				uniform vec3 uColor; uniform float uStrength;
				varying float vH; varying vec3 vN; varying vec3 vV;
				void main() {
					float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
					gl_FragColor = vec4(uColor, edge * pow(vH, 1.8) * uStrength);
				}`,
		})

		// ---------- cards ----------
		// Card faces are drawn in 900x1200 design units. Phones and the lighter tiers use a smaller
		// canvas: about 2-3 MB of graphics memory per card instead of 5.8 MB, with no visible loss.
		const CARD_SCALE = tier === 0 ? 0.6 : tier === 1 || mobileQuery.matches ? 0.75 : 1
		function paintCard(p, cv) {
			cv.width = Math.round(900 * CARD_SCALE)
			cv.height = Math.round(1200 * CARD_SCALE)
			const c = cv.getContext('2d')
			c.scale(CARD_SCALE, CARD_SCALE)
			c.fillStyle = '#efece6'
			c.fillRect(0, 0, 900, 1200)
			if (p.photo) {
				const ir = p.photo.width / p.photo.height
				const dw = ir > 0.75 ? 1200 * ir : 900
				const dh = ir > 0.75 ? 1200 : 900 / ir
				c.drawImage(p.photo, (900 - dw) / 2, (1200 - dh) / 2, dw, dh)
			}
			const wash = c.createLinearGradient(0, 0, 0, 500)
			wash.addColorStop(0, 'rgba(247,245,241,0.94)')
			wash.addColorStop(0.55, 'rgba(247,245,241,0.55)')
			wash.addColorStop(1, 'rgba(247,245,241,0)')
			c.fillStyle = wash
			c.fillRect(0, 0, 900, 500)
			c.textAlign = 'center'
			c.fillStyle = '#1b1c1d'
			c.font = '600 84px Manrope'
			c.fillText(p.card, 450, 170)
			c.fillStyle = '#3f4143'
			c.font = '500 38px Manrope'
			c.fillText(p.sub, 450, 232)
			c.save()
			c.shadowColor = 'rgba(0,0,0,0.28)'
			c.shadowBlur = 18
			c.beginPath()
			c.arc(110, 1086, 64, 0, Math.PI * 2)
			c.fillStyle = '#ffffff'
			c.fill()
			c.restore()
			if (p.logoImg) {
				const L = p.logoImg
				const lw = L.naturalWidth || L.width || 1
				const lh = L.naturalHeight || L.height || 1
				const fit = Math.min(88 / lw, 64 / lh)
				c.save()
				c.beginPath()
				c.arc(110, 1086, 60, 0, Math.PI * 2)
				c.clip()
				c.drawImage(L, 110 - (lw * fit) / 2, 1086 - (lh * fit) / 2, lw * fit, lh * fit)
				c.restore()
			}
		}
		// decode images off the main thread before they are drawn, so painting never stalls a frame
		const loadImage = (src) =>
			new Promise((resolve) => {
				const img = new Image()
				img.decoding = 'async'
				img.src = src
				img.decode().then(() => resolve(img), () => resolve(null))
			})

		const CARD_W = 1.08
		const CARD_H = 1.44
		const CARD_Y = 2.35
		const edgeMat = mat('#9c7448', 0.55)
		const lampBodyMat = mat('#0b0b0b', 0.35, 0.6)
		const lampBodyGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.62, 18)
		const glowGeo = new THREE.BoxGeometry(0.56, 0.008, 0.03)
		const beamGeo = new THREE.ConeGeometry(0.85, 1.9, 32, 1, true)
		const cardFaceGeo = new THREE.PlaneGeometry(CARD_W, CARD_H)
		const washCv = document.createElement('canvas')
		washCv.width = 128
		washCv.height = 160
		{
			const c = washCv.getContext('2d')
			c.translate(64, 60)
			c.scale(1, 1.25)
			const g = c.createRadialGradient(0, 0, 0, 0, 0, 64)
			g.addColorStop(0, 'rgba(255,170,80,1)')
			g.addColorStop(0.45, 'rgba(255,160,70,0.45)')
			g.addColorStop(1, 'rgba(255,150,60,0)')
			c.fillStyle = g
			c.fillRect(-64, -64, 128, 128)
		}
		const washTex = new THREE.CanvasTexture(washCv)
		washTex.colorSpace = THREE.SRGBColorSpace
		const washGeo = new THREE.PlaneGeometry(3.1, 3.5)
		// 'beam' soft warm cone, 'spot' crisp focused pool, 'top' light falling over the top of the card, 'white' neutral daylight
		const DAYLIGHT = new URLSearchParams(location.search).get('daylight') || 'beam'
		const DL = {
			beam: { color: [1, 0.86, 0.66], glow: [1, 0.78, 0.5], rest: 1.6, hover: 3.2, angle: 0.5, pen: 0.8, beam: [0.035, 0.13], top: [0, 0] },
			spot: { color: [1, 0.93, 0.82], glow: [1, 0.85, 0.62], rest: 1.1, hover: 5.2, angle: 0.33, pen: 0.22, beam: [0, 0], top: [0, 0] },
			top: { color: [1, 0.86, 0.66], glow: [1, 0.78, 0.5], rest: 1.0, hover: 1.4, angle: 0.5, pen: 0.8, beam: [0, 0], top: [0.12, 0.55] },
			white: { color: [1, 1, 1], glow: [1, 0.98, 0.94], rest: 1.4, hover: 3.4, angle: 0.5, pen: 0.7, beam: [0, 0], top: [0, 0] },
		}[DAYLIGHT]
		const NIGHT_GLOW = new THREE.Color('#ffb064')
		const NIGHT_SPOT = new THREE.Color('#ffc590')
		// light falling over the top of a card: bright at the top edge, gone by the middle
		const topCv = document.createElement('canvas')
		topCv.width = 8
		topCv.height = 128
		{
			const c = topCv.getContext('2d')
			const g = c.createLinearGradient(0, 0, 0, 128)
			g.addColorStop(0, 'rgba(255,214,160,0.9)')
			g.addColorStop(0.45, 'rgba(255,200,140,0.25)')
			g.addColorStop(1, 'rgba(255,190,130,0)')
			c.fillStyle = g
			c.fillRect(0, 0, 8, 128)
		}
		const topTex = new THREE.CanvasTexture(topCv)
		topTex.colorSpace = THREE.SRGBColorSpace
		const cardEdgeGeo = new THREE.BoxGeometry(CARD_W + 0.05, CARD_H + 0.05, 0.03)
		// soft warm halo: stands in for bloom on the light tier, where bloom is switched off
		const haloCv = document.createElement('canvas')
		haloCv.width = haloCv.height = 64
		{
			const c = haloCv.getContext('2d')
			const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32)
			gr.addColorStop(0, 'rgba(255,190,110,1)')
			gr.addColorStop(0.3, 'rgba(255,150,60,0.45)')
			gr.addColorStop(1, 'rgba(255,120,40,0)')
			c.fillStyle = gr
			c.fillRect(0, 0, 64, 64)
		}
		const haloTex = new THREE.CanvasTexture(haloCv)
		const haloMat = () => new THREE.SpriteMaterial({ map: haloTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
		const cards = PROJECTS.map((p, i) => {
			const group = new THREE.Group()
			const cv = document.createElement('canvas')
			paintCard(p, cv)
			const tex = new THREE.CanvasTexture(cv)
			tex.colorSpace = THREE.SRGBColorSpace
			tex.anisotropy = tier === 0 ? 1 : Math.min(tier === 2 ? 8 : 4, renderer.capabilities.getMaxAnisotropy())
			const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.78, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.14 })
			// a plane for the printed face and one plain box for the paper edge: 2 draw calls per card
			const art = mesh(cardFaceGeo, face, { pos: [0, 0, 0.0125], cast: false })
			art.userData.index = i
			// the print (frame and face) can leave the wall when the card is opened; the lamp stays
			const print = new THREE.Group()
			print.userData.dynamic = true
			print.add(mesh(cardEdgeGeo, edgeMat, { pos: [0, 0, -0.004] }), art)
			group.add(print)
			const lamp = new THREE.Group()
			lamp.position.set(0, CARD_H / 2 + 0.2, 0.12)
			lamp.add(mesh(lampBodyGeo, lampBodyMat, { rot: [0, 0, Math.PI / 2] }))
			const glow = mesh(glowGeo, new THREE.MeshStandardMaterial({ color: '#2a2016', emissive: '#ffb064', emissiveIntensity: 0 }), { pos: [0, -0.034, 0.004], cast: false })
			lamp.add(glow)
			lamp.add(limb([0, 0, -0.12], [0, 0, -0.01], 0.012, lampBodyMat, false))
			const halo = new THREE.Sprite(haloMat())
			halo.position.set(0, -0.07, 0.09)
			halo.scale.set(1.25, 0.5, 1)
			lamp.add(halo)
			group.add(lamp)
			const topLight = new THREE.Mesh(cardFaceGeo, new THREE.MeshBasicMaterial({ map: topTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
			topLight.position.z = 0.0135
			topLight.visible = false
			print.add(topLight)
			const wash = new THREE.Mesh(washGeo, new THREE.MeshBasicMaterial({ map: washTex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 }))
			wash.position.set(0, 0.3, -0.07)
			group.add(wash)
			const beam = new THREE.Mesh(beamGeo, beamMat.clone())
			beam.rotation.x = -0.12
			group.userData.dynamic = true
			beam.userData.dynamic = true
			scene.add(group, beam)
			return { p, group, print, art, glow, halo, wash, beam, topLight, tex, cv, x: 0, lit: reduceMotion ? 1 : 0, on: 0, z: 0, flyT: 0 }
		})
		const cardMeshes = cards.map((c) => c.art)

		// Picture lights are a small pool that follows the camera: only the cards near the
		// view get a real spotlight. The light count never changes, so shaders never recompile.
		const POOL = mobileQuery.matches || tier === 0 ? 3 : 6
		const pool = Array.from({ length: POOL }, (_, k) => {
			const light = new THREE.SpotLight('#ffc590', 0, 6, 0.5, 0.75, 2)
			light.castShadow = tier === 2 && k < 4
			light.shadow.mapSize.set(1024, 1024)
			light.shadow.bias = -0.0004
			light.shadow.autoUpdate = false
			light.target.userData.dynamic = true // follows its card, so its matrix must stay live
			scene.add(light, light.target)
			return { light, card: -1 }
		})

		let mobile = mobileQuery.matches
		function layoutCards() {
			cards.forEach((c, i) => {
				c.x = (i - (mobile ? 0 : 1)) * SPACING
				c.group.position.set(c.x, CARD_Y, WALL_Z + 0.06)
				c.beam.position.set(c.x, CARD_Y + CARD_H / 2 + 0.17 - 0.95, WALL_Z + 0.32)
			})
			pool.forEach((s) => (s.card = -1))
			if (typeof layoutWindow === 'function') {
				layoutSlats()
				layoutWindow()
				layoutClock()
			}
		}
		layoutCards()

		// photos and logos arrive one at a time; each card repaints when its pieces are ready
		const fontsReady = Promise.all([document.fonts.load('600 84px Manrope'), document.fonts.load('500 38px Manrope')]).catch(() => {})
		;(async () => {
			await fontsReady
			for (const c of cards) {
				const [photo, logo] = await Promise.all([loadImage(REF + c.p.img), loadImage(LOGO + c.p.logo)])
				c.p.photo = photo
				c.p.logoImg = logo
				paintCard(c.p, c.cv)
				c.tex.needsUpdate = true
				// upload it now, while loading, not the first time the card comes into view: on phones the
				// camera pans to each new card, and a first-sight upload stalled a frame there
				renderer.initTexture(c.tex)
				wake()
			}
		})()

		// ---------- desk and props (realistic materials) ----------
		const DESK_TOP = 0.7725
		const DESK_Z = 0.55 // desk centre; Haris sits at z 1.3
		const hi = tier > 0 // the light tier skips small props and uses cheaper materials
		const sg = (n) => (tier === 0 ? Math.max(6, Math.round(n * 0.5)) : n)
		// physically based material on the balanced and full tiers, plain standard on the light tier
		function pmat(color, o = {}) {
			const { sheenColor, ...rest } = o
			if (!hi) {
				const keep = { roughness: rest.roughness ?? 0.7, metalness: rest.metalness ?? 0 }
				if (rest.map) keep.map = rest.map
				return new THREE.MeshStandardMaterial({ color, ...keep })
			}
			const m = new THREE.MeshPhysicalMaterial({ color, ...rest })
			if (sheenColor) m.sheenColor = new THREE.Color(sheenColor)
			return m
		}
		const rbox = (w, h, d, r = 0.01) => (hi ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d))
		// tapered limb: cylinder plus rounded ends
		function taper(a, b, r1, r2, material, cast = true) {
			const A = a.isVector3 ? a : new THREE.Vector3(...a)
			const B = b.isVector3 ? b : new THREE.Vector3(...b)
			const g = new THREE.Group()
			const len = A.distanceTo(B)
			g.add(mesh(new THREE.CylinderGeometry(r2, r1, len, sg(18)), material, { cast }))
			// rounded end caps only where they are big enough to see (each cap is an extra draw call)
			if (Math.max(r1, r2) >= 0.02 || (hi && Math.max(r1, r2) >= 0.012)) {
				g.add(mesh(new THREE.SphereGeometry(r1, sg(16), sg(10)), material, { pos: [0, -len / 2, 0], cast: false }))
				g.add(mesh(new THREE.SphereGeometry(r2, sg(16), sg(10)), material, { pos: [0, len / 2, 0], cast: false }))
			}
			g.position.copy(A).add(B).multiplyScalar(0.5)
			g.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize())
			return g
		}
		// procedural textures: walnut grain and a fine fabric weave for bump
		let seedN = 11
		const rnd = () => (seedN = (seedN * 9301 + 49297) % 233280) / 233280
		function grain(base, dark, w, h, rings) {
			const cv = document.createElement('canvas')
			cv.width = w
			cv.height = h
			const c = cv.getContext('2d')
			c.fillStyle = base
			c.fillRect(0, 0, w, h)
			for (let i = 0; i < rings; i++) {
				const y0 = rnd() * h
				const amp = 2 + rnd() * 6
				const f = 0.002 + rnd() * 0.006
				c.strokeStyle = dark
				c.globalAlpha = 0.05 + rnd() * 0.18
				c.lineWidth = 0.6 + rnd() * 2.2
				c.beginPath()
				for (let x = 0; x <= w; x += 8) c.lineTo(x, y0 + Math.sin(x * f + i) * amp + Math.sin(x * f * 3.1) * amp * 0.3)
				c.stroke()
			}
			return cv
		}
		const walnutTex = new THREE.CanvasTexture(grain('#6b4428', '#2e1a0c', 1024, 256, 70))
		walnutTex.colorSpace = THREE.SRGBColorSpace
		walnutTex.anisotropy = 4
		const weaveCv = document.createElement('canvas')
		weaveCv.width = weaveCv.height = 128
		{
			const c = weaveCv.getContext('2d')
			const img = c.createImageData(128, 128)
			for (let i = 0; i < 128 * 128; i++) {
				const v = 110 + rnd() * 80
				img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
				img.data[i * 4 + 3] = 255
			}
			c.putImageData(img, 0, 0)
			c.globalAlpha = 0.18
			c.fillStyle = '#000'
			for (let y = 0; y < 128; y += 3) c.fillRect(0, y, 128, 1)
		}
		const weave = new THREE.CanvasTexture(weaveCv)
		weave.wrapS = weave.wrapT = THREE.RepeatWrapping
		weave.repeat.set(6, 6)

		const walnut = pmat('#ffffff', { map: walnutTex, roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.22 })
		const blackMetal = pmat('#141416', { roughness: 0.32, metalness: 1 })
		const desk = new THREE.Group()
		desk.position.set(0, 0, DESK_Z)
		const DESK_W = 2.6
		const DESK_D = 0.8
		desk.add(mesh(rbox(DESK_W, 0.035, DESK_D, 0.012), walnut, { pos: [0, DESK_TOP - 0.0175, 0] }))
		// black sled legs: an open frame each side
		for (const sx of [-1, 1]) {
			const x = sx * (DESK_W / 2 - 0.12)
			desk.add(mesh(rbox(0.04, DESK_TOP - 0.035, 0.04, 0.008), blackMetal, { pos: [x, (DESK_TOP - 0.035) / 2, -DESK_D / 2 + 0.06] }))
			desk.add(mesh(rbox(0.04, DESK_TOP - 0.035, 0.04, 0.008), blackMetal, { pos: [x, (DESK_TOP - 0.035) / 2, DESK_D / 2 - 0.06], cast: false }))
			desk.add(mesh(rbox(0.04, 0.04, DESK_D - 0.08, 0.008), blackMetal, { pos: [x, 0.02, 0], cast: false }))
			desk.add(mesh(rbox(0.04, 0.04, DESK_D - 0.08, 0.008), blackMetal, { pos: [x, DESK_TOP - 0.055, 0], cast: false }))
		}
		// felt desk mat, keyboard with keys, mouse
		const felt = pmat('#2a2c30', { roughness: 1, sheen: 1, sheenColor: '#55575c', bumpMap: weave, bumpScale: 1 })
		desk.add(mesh(rbox(0.95, 0.006, 0.36, 0.004), felt, { pos: [0.05, DESK_TOP + 0.003, 0.12], cast: false }))
		{
			const kb = new THREE.Group()
			kb.position.set(-0.04, DESK_TOP + 0.006, 0.13)
			kb.rotation.x = 0.04
			kb.add(mesh(rbox(0.44, 0.022, 0.15, 0.006), pmat('#1d1e21', { roughness: 0.45, clearcoat: 0.3 })))
			const keys = new THREE.InstancedMesh(rbox(0.022, 0.012, 0.022, 0.003), pmat('#2c2e33', { roughness: 0.55 }), 75)
			const o = new THREE.Object3D()
			let k = 0
			for (let r = 0; r < 5; r++)
				for (let col = 0; col < 15; col++) {
					o.position.set(-0.196 + col * 0.028, 0.016, -0.056 + r * 0.028)
					o.updateMatrix()
					keys.setMatrixAt(k++, o.matrix)
				}
			kb.add(keys)
			desk.add(kb)
			desk.add(mesh(new THREE.SphereGeometry(0.03, sg(24), sg(16)), pmat('#1d1e21', { roughness: 0.35, clearcoat: 0.5 }), { pos: [0.34, DESK_TOP + 0.016, 0.15], scale: [0.85, 0.55, 1.45] }))
		}
		scene.add(desk)

		// screen canvases: a workflow and a dashboard
		function screenCanvas(kind) {
			const cv = document.createElement('canvas')
			cv.width = 640
			cv.height = 400
			const c = cv.getContext('2d')
			c.fillStyle = '#15171b'
			c.fillRect(0, 0, 640, 400)
			c.fillStyle = '#1e2127'
			c.fillRect(0, 0, 640, 30)
			;['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
				c.fillStyle = col
				c.beginPath()
				c.arc(18 + i * 16, 15, 4.5, 0, Math.PI * 2)
				c.fill()
			})
			if (kind === 'dash') {
				for (let i = 0; i < 12; i++) {
					const h = 40 + ((i * 53) % 150)
					c.fillStyle = i % 3 ? '#2b6cb0' : '#62d2ff'
					c.fillRect(40 + i * 48, 370 - h, 30, h)
				}
				c.strokeStyle = '#ffb46a'
				c.lineWidth = 3
				c.beginPath()
				for (let i = 0; i < 12; i++) c.lineTo(55 + i * 48, 130 - Math.sin(i * 0.8) * 40 - i * 4)
				c.stroke()
			} else {
				const nodes = [[60, 210], [180, 130], [180, 290], [310, 210], [440, 120], [440, 210], [440, 300], [570, 210]]
				const cols = ['#ff6d5a', '#7b61ff', '#29b6f6', '#ffb020', '#2ecc71', '#7b61ff', '#29b6f6', '#ff6d5a']
				c.strokeStyle = 'rgba(200,210,225,0.55)'
				c.lineWidth = 2
				;[[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]].forEach(([a, b]) => {
					const [x1, y1] = nodes[a]
					const [x2, y2] = nodes[b]
					c.beginPath()
					c.moveTo(x1 + 28, y1)
					c.bezierCurveTo(x1 + 70, y1, x2 - 70, y2, x2 - 28, y2)
					c.stroke()
				})
				nodes.forEach(([x, y], i) => {
					c.fillStyle = '#2a2e36'
					c.beginPath()
					c.roundRect(x - 28, y - 28, 56, 56, 12)
					c.fill()
					c.fillStyle = cols[i]
					c.beginPath()
					c.roundRect(x - 11, y - 11, 22, 22, 6)
					c.fill()
				})
			}
			const t = new THREE.CanvasTexture(cv)
			t.colorSpace = THREE.SRGBColorSpace
			return t
		}
		const screenTex = screenCanvas('flow')

		// ---------- live screens: the project you are on, running ----------
		// Right screen: its workflow built from its real tool stack, with a run passing through it.
		// Left screen: its headline numbers and a live chart. Redrawn at a capped rate per tier.
		const toolLogo = {}
		function logoFor(file) {
			if (!file) return null
			if (!(file in toolLogo)) {
				toolLogo[file] = null
				loadImage(LOGO + file).then((img) => (toolLogo[file] = img))
			}
			return toolLogo[file]
		}
		document.fonts.load('800 40px Montserrat').catch(() => {})
		const SW = 640
		const SH = 400
		function liveScreen() {
			const cv = document.createElement('canvas')
			cv.width = SW
			cv.height = SH
			const tex = new THREE.CanvasTexture(cv)
			tex.colorSpace = THREE.SRGBColorSpace
			return { c: cv.getContext('2d'), tex }
		}
		const flowScreen = liveScreen()
		const dashScreen = liveScreen()
		const clamp01 = (v) => Math.min(1, Math.max(0, v))
		const easeOut = (v) => 1 - (1 - v) * (1 - v) * (1 - v)
		function windowChrome(c, title) {
			c.fillStyle = '#15171b'
			c.fillRect(0, 0, SW, SH)
			c.fillStyle = '#1e2127'
			c.fillRect(0, 0, SW, 30)
			;['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
				c.fillStyle = col
				c.beginPath()
				c.arc(18 + i * 16, 15, 4.5, 0, Math.PI * 2)
				c.fill()
			})
			c.fillStyle = '#9aa1ad'
			c.font = '600 13px Manrope, sans-serif'
			c.textAlign = 'left'
			c.fillText(title, 76, 20)
		}
		// cubic link from the right side of node a to the left side of node b
		function linkPoint(a, b, u) {
			const x1 = a[0] + 34
			const x2 = b[0] - 34
			const m = 1 - u
			return [m * m * m * x1 + 3 * m * m * u * (x1 + 46) + 3 * m * u * u * (x2 - 46) + u * u * u * x2, m * m * m * a[1] + 3 * m * m * u * a[1] + 3 * m * u * u * b[1] + u * u * u * b[1]]
		}
		function drawFlow(p, t, a) {
			const c = flowScreen.c
			windowChrome(c, `Workflow  /  ${p.sub}`)
			const names = ['Trigger', ...p.stack]
			const n = names.length
			const pts = names.map((_, i) => [72 + (i * 496) / (n - 1), 186 + [0, -44, 36, -30, 40][i % 5]])
			// a run: the pulse takes 0.6s per link, then rests a moment on the finished flow
			const total = (n - 1) * 0.6 + 1.1
			const pos = ((t % total) / 0.6)
			c.lineWidth = 2
			for (let i = 0; i < n - 1; i++) {
				const k = clamp01(a * n - i - 0.6)
				if (k <= 0) continue
				c.globalAlpha = k
				c.strokeStyle = 'rgba(200,210,225,0.22)'
				c.beginPath()
				for (let s = 0; s <= 16; s++) c.lineTo(...linkPoint(pts[i], pts[i + 1], s / 16))
				c.stroke()
				c.strokeStyle = 'rgba(200,210,225,0.55)'
				c.setLineDash([5, 7])
				c.lineDashOffset = -t * 26
				c.stroke()
				c.setLineDash([])
			}
			c.globalAlpha = 1
			pts.forEach(([x, y], i) => {
				const k = clamp01(a * n - i)
				if (k <= 0) return
				const [col, file] = i === 0 ? ['#ffb020'] : toolOf(names[i])
				const hit = Math.max(0, 1 - Math.abs(pos - i) * 2.5)
				c.globalAlpha = easeOut(k)
				const s = 30 * (0.8 + 0.2 * easeOut(k))
				if (hit > 0) {
					const g = c.createRadialGradient(x, y, 0, x, y, 64)
					g.addColorStop(0, col + '66')
					g.addColorStop(1, col + '00')
					c.fillStyle = g
					c.fillRect(x - 64, y - 64, 128, 128)
				}
				c.fillStyle = '#23262d'
				c.beginPath()
				c.roundRect(x - s, y - s, s * 2, s * 2, 12)
				c.fill()
				c.strokeStyle = col
				c.globalAlpha = easeOut(k) * (0.35 + 0.65 * hit)
				c.lineWidth = 2
				c.stroke()
				c.globalAlpha = easeOut(k)
				const logo = logoFor(file)
				if (i === 0) {
					// lightning bolt: the trigger
					c.fillStyle = col
					c.beginPath()
					;[[3, -15], [-9, 2], [-1, 2], [-4, 15], [9, -3], [1, -3]].forEach(([px, py]) => c.lineTo(x + px, y + py))
					c.fill()
				} else if (logo) {
					const lw = logo.naturalWidth || logo.width || 1
					const lh = logo.naturalHeight || logo.height || 1
					const f = Math.min(30 / lw, 30 / lh)
					c.drawImage(logo, x - (lw * f) / 2, y - (lh * f) / 2, lw * f, lh * f)
				} else {
					c.fillStyle = col
					c.beginPath()
					c.roundRect(x - 13, y - 13, 26, 26, 7)
					c.fill()
					c.fillStyle = '#15171b'
					c.font = '800 15px Manrope, sans-serif'
					c.textAlign = 'center'
					c.fillText(names[i][0].toUpperCase(), x, y + 5)
				}
				// finished this run: a small green tick
				if (pos >= i + 0.15) {
					c.fillStyle = '#28c840'
					c.beginPath()
					c.arc(x + s - 3, y - s + 3, 7, 0, Math.PI * 2)
					c.fill()
					c.strokeStyle = '#0f1a12'
					c.lineWidth = 2
					c.beginPath()
					c.moveTo(x + s - 6.5, y - s + 3)
					c.lineTo(x + s - 4, y - s + 5.5)
					c.lineTo(x + s + 0.5, y - s + 0.5)
					c.stroke()
				}
				c.fillStyle = '#c8ccd4'
				c.font = '600 13px Manrope, sans-serif'
				c.textAlign = 'center'
				const label = names[i].length > 15 ? names[i].slice(0, 14) + '…' : names[i]
				c.fillText(label, x, y + s + 20)
				c.globalAlpha = 1
			})
			// the data packet travelling the current link
			if (a >= 1 && pos < n - 1) {
				const seg = Math.floor(pos)
				const [px, py] = linkPoint(pts[seg], pts[seg + 1], pos - seg)
				const g = c.createRadialGradient(px, py, 0, px, py, 16)
				g.addColorStop(0, 'rgba(255,255,255,0.95)')
				g.addColorStop(0.35, 'rgba(255,214,150,0.6)')
				g.addColorStop(1, 'rgba(255,180,100,0)')
				c.fillStyle = g
				c.fillRect(px - 16, py - 16, 32, 32)
			}
			// status line
			c.fillStyle = '#1b1e23'
			c.fillRect(0, SH - 36, SW, 36)
			const running = pos < n - 1
			c.fillStyle = running ? '#febc2e' : '#28c840'
			c.beginPath()
			c.arc(22, SH - 18, 5, 0, Math.PI * 2)
			c.fill()
			c.fillStyle = '#c8ccd4'
			c.font = '600 13px Manrope, sans-serif'
			c.textAlign = 'left'
			c.fillText(running ? 'Running' : 'Succeeded', 36, SH - 13)
			c.fillStyle = '#8f96a3'
			c.textAlign = 'right'
			c.fillText(p.figs[0] ? `${p.figs[0][0]} ${p.figs[0][1]}` : p.tag.replace('Case study, ', ''), SW - 18, SH - 13)
		}
		function drawDash(p, idx, t, a) {
			const c = dashScreen.c
			windowChrome(c, `Live  /  ${p.card}`)
			const figs = p.figs.length ? p.figs.slice(0, 3) : [['Live', 'in production'], [String(p.stack.length), 'tools in the flow']]
			const gap = 12
			const tw = (SW - 48 - gap * (figs.length - 1)) / figs.length
			figs.forEach(([big, small], i) => {
				const k = easeOut(clamp01(a * 3 - i * 0.6))
				const x = 24 + i * (tw + gap)
				const y = 50 + (1 - k) * 14
				c.globalAlpha = k
				c.fillStyle = '#1e2127'
				c.beginPath()
				c.roundRect(x, y, tw, 112, 10)
				c.fill()
				c.fillStyle = '#f3efe8'
				let size = 44
				c.font = `800 ${size}px Montserrat, Manrope, sans-serif`
				while (c.measureText(big).width > tw - 32 && size > 22) c.font = `800 ${(size -= 2)}px Montserrat, Manrope, sans-serif`
				c.textAlign = 'left'
				c.fillText(big, x + 16, y + 62)
				c.fillStyle = '#8f96a3'
				c.font = '500 13px Manrope, sans-serif'
				c.fillText(small.length > 30 ? small.slice(0, 29) + '…' : small, x + 16, y + 92)
			})
			c.globalAlpha = 1
			// live chart: a gentle trace that keeps scrolling
			const top = 186
			const bottom = 330
			const step = 16
			const shift = (reduceMotion ? 0 : t * 1.6) % 1
			const base = Math.floor(reduceMotion ? 0 : t * 1.6)
			const val = (j) => 0.55 + 0.2 * Math.sin(j * 0.55 + idx) + 0.12 * Math.sin(j * 1.7 + idx * 2.3) + 0.06 * Math.sin(j * 3.1)
			const ptsX = []
			for (let j = 0; j <= 38; j++) ptsX.push([24 + (j - shift) * step, bottom - val(base + j) * (bottom - top)])
			c.save()
			c.beginPath()
			c.rect(24, top - 10, SW - 48, bottom - top + 12)
			c.clip()
			const reveal = 24 + (SW - 48) * easeOut(clamp01(a * 1.4 - 0.2))
			c.beginPath()
			c.rect(0, 0, reveal, SH)
			c.clip()
			const g = c.createLinearGradient(0, top, 0, bottom)
			g.addColorStop(0, 'rgba(255,180,106,0.28)')
			g.addColorStop(1, 'rgba(255,180,106,0)')
			c.beginPath()
			ptsX.forEach(([x, y]) => c.lineTo(x, y))
			c.lineTo(ptsX[ptsX.length - 1][0], bottom)
			c.lineTo(ptsX[0][0], bottom)
			c.fillStyle = g
			c.fill()
			c.beginPath()
			ptsX.forEach(([x, y]) => c.lineTo(x, y))
			c.strokeStyle = '#ffb46a'
			c.lineWidth = 2.5
			c.stroke()
			c.restore()
			// tool chips along the bottom
			let x = 24
			c.font = '600 12px Manrope, sans-serif'
			c.textAlign = 'left'
			for (const name of p.stack) {
				const w = c.measureText(name).width + 30
				if (x + w > SW - 20) break
				c.fillStyle = '#1e2127'
				c.beginPath()
				c.roundRect(x, 348, w, 28, 14)
				c.fill()
				c.fillStyle = toolOf(name)[0]
				c.beginPath()
				c.arc(x + 13, 362, 4, 0, Math.PI * 2)
				c.fill()
				c.fillStyle = '#c8ccd4'
				c.fillText(name, x + 22, 366)
				x += w + 8
			}
		}
		// which project the screens show; they keep the last one when nothing is lit
		let shownProject = -1
		let shownAt = 0
		let lastScreenDraw = -1
		const SCREEN_FPS = tier === 2 ? 24 : tier === 1 ? 15 : 8
		const screenMats = {}
		function updateScreens(t, want) {
			if (want >= 0 && want !== shownProject) {
				shownProject = want
				shownAt = t
				lastScreenDraw = -1
				screenMats.flow.map = flowScreen.tex
				screenMats.dash.map = dashScreen.tex
			}
			if (shownProject < 0) return
			const a = reduceMotion ? 1 : clamp01((t - shownAt) / 0.8)
			// reduced motion: draw once per project, no running animation
			if (reduceMotion && lastScreenDraw >= 0) return
			if (lastScreenDraw >= 0 && t - lastScreenDraw < 1 / SCREEN_FPS) return
			lastScreenDraw = t
			const p = PROJECTS[shownProject]
			drawFlow(p, reduceMotion ? 0 : t - shownAt, a)
			drawDash(p, shownProject, t, a)
			flowScreen.tex.needsUpdate = true
			dashScreen.tex.needsUpdate = true
		}

		// monitors on arms, each with a glowing light bar on top
		const barGlow = new THREE.MeshStandardMaterial({ color: '#2a2016', emissive: '#ffd9a8', emissiveIntensity: 2 })
		for (const [x, rotY, kind] of [[-0.4, 0.22, 'dash'], [0.4, -0.22, 'flow']]) {
			const g = new THREE.Group()
			g.position.set(x, DESK_TOP, DESK_Z - 0.2)
			g.rotation.y = rotY
			g.add(mesh(rbox(0.66, 0.39, 0.022, 0.008), blackMetal, { pos: [0, 0.47, 0] }))
			screenMats[kind] = new THREE.MeshBasicMaterial({ map: kind === 'dash' ? screenCanvas('dash') : screenTex, toneMapped: false, color: '#c4cfdb' })
			g.add(mesh(new THREE.PlaneGeometry(0.635, 0.365), screenMats[kind], { pos: [0, 0.47, 0.0115], cast: false }))
			g.add(mesh(rbox(0.08, 0.08, 0.02, 0.006), blackMetal, { pos: [0, 0.47, -0.02], cast: false }))
			g.add(taper([0, 0.47, -0.03], [0, 0.32, -0.16], 0.012, 0.012, blackMetal, false))
			g.add(taper([0, 0.32, -0.16], [0, 0.02, -0.16], 0.014, 0.014, blackMetal))
			g.add(mesh(rbox(0.06, 0.04, 0.06, 0.006), blackMetal, { pos: [0, 0.02, -0.16], cast: false }))
			g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, sg(14)), blackMetal, { pos: [0, 0.68, 0.035], rot: [0, 0, Math.PI / 2], cast: false }))
			g.add(mesh(new THREE.BoxGeometry(0.38, 0.004, 0.012), barGlow, { pos: [0, 0.668, 0.04], cast: false }))
			scene.add(g)
		}
		const screenLight = new THREE.PointLight('#8fb6ff', 0.4, 1.4, 2)
		// close to the screens, clear of the mug's path to his mouth
		screenLight.position.set(0, DESK_TOP + 0.47, DESK_Z - 0.04)
		scene.add(screenLight)

		// ---------- architect lamp ----------
		// Weighted base, two-joint arm, a dome shade (dark outside, lit warm inside) with a brass rim
		// and a visible bulb. The head leans toward the front of the desk, so from the camera you see
		// into the shade. Its light is a soft spot, a small fill for the props, and a warm pool on the desk.
		const brass = pmat('#b8894a', { roughness: 0.28, metalness: 1 })
		const lampPaint = pmat('#1d2226', { roughness: 0.38, metalness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.25 })
		const lampG = new THREE.Group()
		lampG.position.set(-0.95, DESK_TOP, DESK_Z - 0.12)
		lampG.add(mesh(new THREE.CylinderGeometry(0.082, 0.094, 0.024, sg(36)), lampPaint, { pos: [0, 0.012, 0] }))
		lampG.add(mesh(new THREE.CylinderGeometry(0.026, 0.03, 0.014, sg(20)), brass, { pos: [0, 0.031, 0], cast: false }))
		const lj1 = new THREE.Vector3(0, 0.036, 0)
		const lj2 = new THREE.Vector3(0.03, 0.37, -0.07)
		const lj3 = new THREE.Vector3(0.2, 0.5, 0.1)
		// paired rods, like a real balanced-arm lamp
		for (const o of [-0.012, 0.012]) {
			lampG.add(taper(lj1.clone().setX(lj1.x + o), lj2.clone().setX(lj2.x + o), 0.0055, 0.0055, lampPaint))
			lampG.add(taper(lj2.clone().setX(lj2.x + o), lj3.clone().setX(lj3.x + o), 0.005, 0.005, lampPaint))
		}
		lampG.add(mesh(new THREE.SphereGeometry(0.017, 14, 10), brass, { pos: lj2.toArray(), cast: false }))
		lampG.add(mesh(new THREE.SphereGeometry(0.015, 14, 10), brass, { pos: lj3.toArray(), cast: false }))
		// the head: its -y axis is the opening, aimed at the front-left of the desk
		const LAMP_AIM = new THREE.Vector3(-0.55, DESK_TOP, DESK_Z + 0.3)
		const shade = new THREE.Group()
		shade.position.copy(lj3)
		shade.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), LAMP_AIM.clone().sub(lampG.position).sub(lj3).normalize())
		const domeGeo = new THREE.LatheGeometry(
			[[0.011, 0.036], [0.026, 0.031], [0.044, 0.014], [0.061, -0.018], [0.075, -0.058], [0.084, -0.094], [0.086, -0.104]].map(([r, y]) => new THREE.Vector2(r, y)),
			sg(40),
		)
		shade.add(mesh(domeGeo, lampPaint))
		// inside of the shade, lit by the bulb
		const shadeInside = new THREE.MeshStandardMaterial({ color: '#efe3cc', roughness: 0.6, emissive: '#ffc985', emissiveIntensity: 0.85, side: THREE.BackSide })
		shade.add(mesh(domeGeo, shadeInside, { scale: [0.975, 0.99, 0.975], cast: false }))
		shade.add(mesh(new THREE.TorusGeometry(0.086, 0.0045, 8, sg(40)), brass, { pos: [0, -0.104, 0], rot: [Math.PI / 2, 0, 0], cast: false }))
		shade.add(mesh(new THREE.CylinderGeometry(0.016, 0.019, 0.034, sg(16)), blackMetal, { pos: [0, 0.006, 0], cast: false }))
		shade.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.022, sg(14)), brass, { pos: [0, 0.046, 0], cast: false }))
		// the bulb: brighter than white, so bloom gives it a soft glow (the light tier uses the halo)
		const BULB_Y = -0.052
		const bulb = mesh(new THREE.SphereGeometry(0.024, 18, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.05, 1.3), toneMapped: false }), { pos: [0, BULB_Y, 0], scale: [1, 1.22, 1], cast: false })
		shade.add(bulb)
		const bulbHalo = new THREE.Sprite(haloMat())
		bulbHalo.position.set(0, BULB_Y - 0.01, 0)
		bulbHalo.scale.set(0.34, 0.34, 1)
		shade.add(bulbHalo)
		lampG.add(shade)
		scene.add(lampG)
		lampG.updateMatrixWorld(true)
		const bulbAt = bulb.getWorldPosition(new THREE.Vector3())
		// a soft, wide spot: lights the work area without blowing the paper out to white
		const lampLight = new THREE.SpotLight('#ffc183', 1.1, 2.6, 0.66, 1, 2)
		lampLight.position.copy(bulbAt)
		lampLight.target.position.copy(LAMP_AIM)
		lampLight.castShadow = tier > 0
		lampLight.shadow.mapSize.set(tier === 2 ? 1024 : 512, tier === 2 ? 1024 : 512)
		lampLight.shadow.bias = -0.0005
		lampLight.shadow.radius = 4
		lampLight.shadow.autoUpdate = false
		scene.add(lampLight, lampLight.target)
		// low fill so the keyboard, notebook and mug pick up a little warmth
		const lampFill = new THREE.PointLight('#ffb36b', 0.35, 1.5, 2)
		lampFill.position.copy(bulbAt).add(new THREE.Vector3(0.05, -0.12, 0.08))
		scene.add(lampFill)
		// the warm pool on the desk top, under everything that sits on it
		const poolCv = document.createElement('canvas')
		poolCv.width = poolCv.height = 128
		{
			const c = poolCv.getContext('2d')
			const g = c.createRadialGradient(64, 64, 0, 64, 64, 64)
			g.addColorStop(0, 'rgba(255,196,120,0.9)')
			g.addColorStop(0.4, 'rgba(255,170,90,0.42)')
			g.addColorStop(1, 'rgba(255,150,70,0)')
			c.fillStyle = g
			c.fillRect(0, 0, 128, 128)
		}
		const lampPoolMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(poolCv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5, polygonOffset: true, polygonOffsetFactor: -2 })
		scene.add(mesh(new THREE.PlaneGeometry(1.05, 0.5), lampPoolMat, { pos: [LAMP_AIM.x - 0.02, DESK_TOP + 0.001, LAMP_AIM.z - 0.15], rot: [-Math.PI / 2, 0, 0], cast: false, receive: false }))

		// glazed mug with coffee and steam. Open at the top, so the coffee shows; a closed top was a flat
		// white disc that flared under the monitor light when he lifted the mug.
		const mugMat = pmat('#ece6da', { roughness: 0.22, clearcoat: 0.8, clearcoatRoughness: 0.2 })
		const mugBodyMat = mugMat.clone()
		mugBodyMat.side = THREE.DoubleSide
		const mug = new THREE.Group()
		mug.add(mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.095, sg(28), 1, true), mugBodyMat, { pos: [0, 0.0475, 0] }))
		mug.add(mesh(new THREE.CircleGeometry(0.036, sg(28)), mugMat, { pos: [0, 0.001, 0], rot: [Math.PI / 2, 0, 0], cast: false }))
		// matte coffee: any shine on it caught the monitor light as a bloom flare during the lift
		mug.add(mesh(new THREE.CircleGeometry(0.038, sg(24)), new THREE.MeshLambertMaterial({ color: '#24130a' }), { pos: [0, 0.084, 0], rot: [-Math.PI / 2, 0, 0], cast: false }))
		mug.add(mesh(new THREE.TorusGeometry(0.024, 0.007, 10, sg(20)), mugMat, { pos: [0.043, 0.05, 0], cast: false }))
		const puff = document.createElement('canvas')
		puff.width = puff.height = 64
		{
			const c = puff.getContext('2d')
			const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32)
			gr.addColorStop(0, 'rgba(255,255,255,0.9)')
			gr.addColorStop(1, 'rgba(255,255,255,0)')
			c.fillStyle = gr
			c.fillRect(0, 0, 64, 64)
		}
		const puffTex = new THREE.CanvasTexture(puff)
		const steam = []
		for (let i = 0; i < (tier === 0 ? 3 : 6); i++) {
			const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, color: '#fff4e6', transparent: true, opacity: 0.1, depthWrite: false }))
			s.scale.set(0.05, 0.08, 1)
			mug.add(s)
			steam.push(s)
		}
		scene.add(mug)
		// within easy reach of his right hand, past the mouse
		const MUG_DESK = new THREE.Vector3(0.42, DESK_TOP, DESK_Z + 0.27)

		// snake plant in a glazed pot
		const plant = new THREE.Group()
		plant.position.set(1.08, DESK_TOP, DESK_Z + 0.2)
		plant.add(mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.12, sg(28)), pmat('#d9cfc0', { roughness: 0.6, clearcoat: 0.4 }), { pos: [0, 0.06, 0] }))
		const leafMat = pmat('#2f6a43', { roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.3 })
		const leafGeo = new THREE.SphereGeometry(0.05, sg(14), sg(10))
		for (let i = 0; i < 7; i++) {
			const a = (i / 7) * Math.PI * 2
			const h = 0.22 + (i % 3) * 0.06
			const l = mesh(leafGeo, leafMat, { scale: [0.38, h / 0.1, 0.12], cast: false })
			l.position.set(Math.cos(a) * 0.025, 0.12 + h / 2, Math.sin(a) * 0.025)
			l.rotation.set(Math.sin(a) * 0.22, -a, Math.cos(a) * 0.22)
			plant.add(l)
		}
		scene.add(plant)

		// notebook, pen and headphones (skipped on the light tier)
		if (hi) {
			desk.add(mesh(rbox(0.2, 0.012, 0.27, 0.004), pmat('#2c3e50', { roughness: 0.7 }), { pos: [-0.62, DESK_TOP + 0.006, 0.16], rot: [0, 0.18, 0], cast: false }))
			desk.add(mesh(rbox(0.19, 0.004, 0.26, 0.002), pmat('#cbc2b0', { roughness: 0.95 }), { pos: [-0.6, DESK_TOP + 0.014, 0.16], rot: [0, 0.18, 0], cast: false }))
			desk.add(mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 8), pmat('#b8894a', { metalness: 1, roughness: 0.3 }), { pos: [-0.53, DESK_TOP + 0.02, 0.15], rot: [Math.PI / 2, 0, 0.4], cast: false }))
			const hp = new THREE.Group()
			hp.position.set(0.92, DESK_TOP, -0.15)
			const hpMat = pmat('#202024', { roughness: 0.5 })
			hp.add(mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.012, 24), blackMetal, { cast: false }))
			hp.add(mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.26, 10), blackMetal, { pos: [0, 0.13, 0] }))
			hp.add(mesh(new THREE.TorusGeometry(0.075, 0.012, 10, 32, Math.PI), hpMat, { pos: [0, 0.27, 0], rot: [0, Math.PI / 2, 0] }))
			for (const s of [-1, 1]) hp.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 24), hpMat, { pos: [0, 0.2, s * 0.075], rot: [Math.PI / 2, 0, 0] }))
			desk.add(hp)
		}

		// office chair: low curved back so his shoulders stay in view
		const SEAT = 0.48
		const chair = new THREE.Group()
		chair.position.set(0.02, 0, 1.33)
		const chairFabric = pmat('#2b2d31', { roughness: 0.95, sheen: 1, sheenColor: '#55575d', bumpMap: weave, bumpScale: 1.5 })
		const chairFrame = pmat('#121214', { roughness: 0.35, metalness: 0.8 })
		chair.add(mesh(rbox(0.5, 0.07, 0.48, 0.03), chairFabric, { pos: [0, SEAT - 0.035, 0] }))
		const backMat = chairFabric.clone()
		backMat.side = THREE.DoubleSide
		chair.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.2, sg(32), 1, true, -0.55, 1.1), backMat, { pos: [0, 0.66, -0.16] }))
		chair.add(mesh(rbox(0.05, 0.2, 0.03, 0.01), chairFrame, { pos: [0, 0.53, 0.27], rot: [-0.12, 0, 0], cast: false }))
		for (const s of [-1, 1]) {
			chair.add(mesh(rbox(0.03, 0.2, 0.03, 0.008), chairFrame, { pos: [s * 0.27, SEAT + 0.08, 0.02], cast: false }))
			chair.add(mesh(rbox(0.07, 0.025, 0.26, 0.01), chairFrame, { pos: [s * 0.27, SEAT + 0.19, -0.02] }))
		}
		chair.add(mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.3, 16), chairFrame, { pos: [0, 0.27, 0], cast: false }))
		for (let i = 0; i < 5; i++) {
			const a = (i / 5) * Math.PI * 2 + 0.3
			chair.add(taper([0, 0.08, 0], [Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.3], 0.016, 0.016, chairFrame, false))
			chair.add(mesh(new THREE.SphereGeometry(0.025, 10, 8), chairFrame, { pos: [Math.cos(a) * 0.3, 0.025, Math.sin(a) * 0.3], cast: false }))
		}
		scene.add(chair)

		const rim = new THREE.SpotLight('#ffd2a1', 7, 4, 0.7, 0.9, 2)
		rim.position.set(-0.55, 2.15, -0.25)
		rim.target.position.set(0.05, 1.25, 1.25)
		const rim2 = new THREE.SpotLight('#ffcf9d', 4, 4, 0.7, 0.9, 2)
		rim2.position.set(0.8, 2.0, -0.2)
		rim2.target.position.set(0.05, 1.2, 1.25)
		const key = new THREE.DirectionalLight('#ffe2c4', 0.18)
		// sun (or moon) comes in from the window side
		key.position.set(-7, 5, 3)
		key.castShadow = tier === 2
		key.shadow.mapSize.set(1024, 1024)
		Object.assign(key.shadow.camera, { left: -7, right: 7, top: 5, bottom: -2, near: 0.5, far: 24 })
		key.shadow.bias = -0.0005
		scene.add(rim, rim.target, rim2, rim2.target, key)

		// ---------- Haris: tapered wool coat, sloped shoulders, cap and glasses ----------
		const skin = pmat('#c48a64', { roughness: 0.55, sheen: 0.4, sheenRoughness: 0.5, sheenColor: '#e8a888' })
		const coat = pmat('#202024', { roughness: 0.95, sheen: 0.7, sheenRoughness: 0.8, sheenColor: '#46464e', bumpMap: weave, bumpScale: 1.2 })
		const knit = pmat('#202024', { roughness: 0.95, sheen: 1, sheenRoughness: 0.6, sheenColor: '#4a4a52', bumpMap: weave, bumpScale: 2 })
		const trousers = pmat('#2a2d34', { roughness: 0.85, sheen: 0.6, sheenColor: '#4a4e58', bumpMap: weave, bumpScale: 0.8 })
		const haris = new THREE.Group()
		haris.position.set(0.02, 0, 1.31)
		scene.add(haris)
		for (const s of [-1, 1]) {
			const hip = new THREE.Vector3(s * 0.1, SEAT + 0.04, 0.02)
			const knee = new THREE.Vector3(s * 0.13, SEAT + 0.06, -0.38)
			const ankle = new THREE.Vector3(s * 0.13, 0.09, -0.4)
			haris.add(taper(hip, knee, 0.078, 0.066, trousers, false))
			haris.add(taper(knee, ankle, 0.058, 0.05, trousers, false))
			haris.add(mesh(rbox(0.1, 0.07, 0.25, 0.03), pmat('#121214', { roughness: 0.4, clearcoat: 0.5 }), { pos: [s * 0.13, 0.04, -0.46], cast: false }))
		}
		const torso = new THREE.Group()
		torso.position.set(0, SEAT, 0.03)
		torso.rotation.x = -0.2
		haris.add(torso)
		{
			const prof = [[0.16, 0], [0.175, 0.08], [0.168, 0.22], [0.182, 0.36], [0.2, 0.46], [0.196, 0.52], [0.15, 0.585], [0.09, 0.615], [0.05, 0.625]].map(([r, y]) => new THREE.Vector2(r, y))
			torso.add(mesh(new THREE.LatheGeometry(prof, sg(40)), coat, { scale: [1.32, 1, 0.82] }))
			torso.add(mesh(new THREE.BoxGeometry(0.006, 0.5, 0.004), pmat('#141417', { roughness: 0.9 }), { pos: [0, 0.27, 0.163], cast: false }))
			const hemMat = coat.clone()
			hemMat.side = THREE.DoubleSide
			torso.add(mesh(new THREE.CylinderGeometry(0.235, 0.25, 0.08, sg(40), 1, true), hemMat, { pos: [0, 0.03, 0], scale: [1, 1, 0.82], cast: false }))
			for (const s of [-1, 1]) torso.add(mesh(new THREE.SphereGeometry(0.075, sg(20), sg(16)), coat, { pos: [s * 0.22, 0.5, 0], scale: [1, 0.85, 0.9], cast: false }))
			torso.add(mesh(new THREE.CylinderGeometry(0.068, 0.078, 0.07, sg(28)), knit, { pos: [0, 0.65, -0.01], cast: false }))
			torso.add(mesh(new THREE.CylinderGeometry(0.05, 0.054, 0.06, sg(20)), skin, { pos: [0, 0.69, -0.015], cast: false }))
		}
		const head = new THREE.Group()
		head.position.set(0, 0.785, -0.03)
		head.rotation.x = 0.22
		torso.add(head)
		head.add(mesh(new THREE.SphereGeometry(0.108, sg(40), sg(30)), skin, { scale: [0.92, 1.06, 1.02] }))
		head.add(mesh(new THREE.SphereGeometry(0.075, sg(28), sg(20)), skin, { pos: [0, -0.06, -0.04], scale: [1, 0.85, 1], cast: false }))
		head.add(mesh(new THREE.ConeGeometry(0.018, 0.05, 12), skin, { pos: [0, -0.01, -0.115], rot: [-Math.PI / 2 + 0.25, 0, 0], cast: false }))
		for (const s of [-1, 1]) head.add(mesh(new THREE.SphereGeometry(0.028, 16, 12), skin, { pos: [s * 0.098, -0.005, 0.005], scale: [0.4, 1, 0.7], cast: false }))
		head.add(mesh(new THREE.SphereGeometry(0.113, sg(40), sg(24), -Math.PI * 0.1, Math.PI * 1.2, 0, Math.PI * 0.8), pmat('#1a110c', { roughness: 0.6, bumpMap: weave, bumpScale: 3 }), { pos: [0, 0.004, 0.012], cast: false }))
		const capMat = pmat('#26262a', { roughness: 0.95, sheen: 1, sheenColor: '#55555c', bumpMap: weave, bumpScale: 2.5 })
		head.add(mesh(new THREE.SphereGeometry(0.128, sg(40), sg(20), 0, Math.PI * 2, 0, Math.PI * 0.5), capMat, { pos: [0, 0.035, -0.008], scale: [1.06, 0.6, 1.16], rot: [0.1, 0, 0] }))
		const bandMat = capMat.clone()
		bandMat.side = THREE.DoubleSide
		head.add(mesh(new THREE.CylinderGeometry(0.118, 0.118, 0.025, sg(40), 1, true), bandMat, { pos: [0, 0.03, -0.004], scale: [1.01, 1, 1.06], cast: false }))
		head.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.01, sg(40), 1, false, Math.PI / 2, Math.PI), capMat, { pos: [0, 0.03, -0.08], rot: [0.32, 0, 0], scale: [1, 1, 0.8], cast: false }))
		head.add(mesh(new THREE.SphereGeometry(0.012, 10, 8), capMat, { pos: [0, 0.112, -0.01], cast: false }))
		const glassMat = pmat('#0b0b0b', { roughness: 0.2, metalness: 0.2, clearcoat: 1 })
		for (const sx of [-1, 1]) {
			head.add(mesh(new THREE.TorusGeometry(0.028, 0.004, 8, 28), glassMat, { pos: [sx * 0.043, 0.008, -0.108], cast: false }))
			head.add(taper([sx * 0.072, 0.01, -0.104], [sx * 0.1, 0.012, 0.01], 0.0028, 0.0028, glassMat, false))
		}

		// arms: fixed meshes re-aimed every frame (typing, and lifting the mug to sip)
		torso.updateMatrixWorld(true)
		haris.updateMatrixWorld(true)
		const torsoToHaris = (v) => haris.worldToLocal(torso.localToWorld(v.clone()))
		const jointGeo = new THREE.SphereGeometry(1, sg(16), sg(12))
		const fingerMat = skin
		function makeHand(side) {
			const g = new THREE.Group()
			g.add(mesh(rbox(0.07, 0.026, 0.08, 0.012), fingerMat))
			for (let f = 0; f < 4; f++) g.add(taper([-0.026 + f * 0.017, -0.004, -0.035], [-0.026 + f * 0.017, -0.016, -0.075], 0.0075, 0.0075, fingerMat, false))
			// thumb on the inner side of each hand
			g.add(taper([side * 0.038, 0, -0.01], [side * 0.045, -0.012, -0.045], 0.008, 0.008, fingerMat, false))
			g.userData.dynamic = true
			return g
		}
		const arms = [0, 1].map((i) => ({
			upper: segment(0.06, coat),
			fore: segment(0.05, coat),
			elbow: mesh(jointGeo, coat, { scale: [0.056, 0.056, 0.056], cast: false }),
			cuff: mesh(new THREE.TorusGeometry(0.044, 0.008, 8, 20), knit, { cast: false }),
			hand: makeHand(i === 0 ? 1 : -1),
		}))
		arms.forEach((a) => {
			haris.add(a.upper, a.fore, a.elbow, a.cuff, a.hand)
			;[a.upper, a.fore, a.elbow, a.cuff].forEach((m) => (m.userData.dynamic = true))
		})
		head.userData.dynamic = true
		mug.userData.dynamic = true
		steam.forEach((sp) => (sp.userData.dynamic = true))
		const P = {
			shoulderL: torsoToHaris(new THREE.Vector3(-0.235, 0.47, 0)),
			shoulderR: torsoToHaris(new THREE.Vector3(0.235, 0.47, 0)),
			elbowL: new THREE.Vector3(-0.29, 0.86, -0.35),
			elbowRtype: new THREE.Vector3(0.29, 0.86, -0.35),
		}
		// ---------- the sip, in his own space (he faces -z) ----------
		// reach for the handle, lift, tilt and drink, lower, let go. The mug only moves while his hand
		// is on it, so it never floats. Handle on the mug's +x side.
		const MUG_LOCAL = MUG_DESK.clone().sub(haris.position)
		const MUG_MOUTH = new THREE.Vector3(0.01, 1.085, -0.31)
		const HANDLE = new THREE.Vector3(0.062, 0.05, 0)
		const ELBOW_GRIP = new THREE.Vector3(0.4, 0.86, -0.26)
		const ELBOW_SIP = new THREE.Vector3(0.26, 0.92, -0.33)
		const X_AXIS = new THREE.Vector3(1, 0, 0)
		const UP_HAND = new THREE.Vector3(0, 0.012, 0) // placeArm drops the hand by this much
		const sipNow = { carry: 0, tilt: 0 }
		const mugLocal = new THREE.Vector3()
		const grip = new THREE.Vector3()
		const wristDir = new THREE.Vector3()
		const handGrip = new THREE.Quaternion()
		const gripRoll = new THREE.Quaternion()
		const ss = (a, b, x) => {
			const v = Math.min(1, Math.max(0, (x - a) / (b - a)))
			return v * v * (3 - 2 * v)
		}
		const sipState = { reach: 0, carry: 0, tilt: 0 }
		function sipPhase(p, w) {
			if (p < 0) {
				sipState.reach = sipState.carry = sipState.tilt = 0
				return sipState
			}
			sipState.reach = ss(0, 0.16, p) * (1 - ss(0.84, 1, p)) * w
			sipState.carry = ss(0.17, 0.38, p) * (1 - ss(0.64, 0.84, p)) * w
			sipState.tilt = ss(0.38, 0.48, p) * (1 - ss(0.56, 0.64, p)) * w
			return sipState
		}
		const handL = new THREE.Vector3()
		const handR = new THREE.Vector3()
		const elbowR = new THREE.Vector3()
		const cuffDir = new THREE.Vector3()
		const FWD = new THREE.Vector3(0, 0, -1)
		const handRest = new THREE.Quaternion()
		function placeArm(a, s, e, h, gripW) {
			aim(a.upper, s, e)
			aim(a.fore, e, h)
			a.elbow.position.copy(e)
			a.cuff.position.copy(h)
			cuffDir.subVectors(h, e).normalize()
			a.cuff.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), cuffDir)
			a.hand.position.copy(h).addScaledVector(cuffDir, 0.05)
			a.hand.position.y -= 0.012
			a.hand.rotation.set(-0.15, a === arms[0] ? 0.22 : -0.22, 0)
			if (gripW > 0.001) {
				// holding the mug: the hand follows the forearm, palm turned in to the handle
				handRest.copy(a.hand.quaternion)
				handGrip.setFromUnitVectors(FWD, cuffDir).multiply(gripRoll.setFromAxisAngle(FWD, -1.45))
				a.hand.quaternion.copy(handRest).slerp(handGrip, gripW)
			}
		}

		// ---------- reactions ----------
		// He stays seated straight at his desk. His head glances up at the card you are on (and at
		// the wall as the lights come on); everything else is typing and the odd sip.
		head.rotation.order = 'YXZ'
		const elbowL = new THREE.Vector3()
		const lookLocal = new THREE.Vector3()
		const torsoInv = new THREE.Matrix4()
		const react = { look: 0, yaw: 0, pitch: 0.22, tYaw: 0, tPitch: 0 }
		function pose(sipP, t, dt, look) {
			const { reach, carry, tilt } = sipPhase(sipP, 1)
			const tap = reduceMotion ? 0 : Math.sin(t * 14) * 0.008
			handL.set(-0.15, DESK_TOP + 0.05 + tap, -0.58)
			handR.set(0.15, DESK_TOP + 0.05 - tap, -0.58)
			elbowR.copy(P.elbowRtype)
			elbowL.copy(P.elbowL)
			// the sip: mug from desk to mouth on a slight arc, tipped toward him to drink
			mugLocal.copy(MUG_LOCAL).lerp(MUG_MOUTH, carry)
			mugLocal.y += 0.05 * Math.sin(Math.PI * carry)
			const mugTilt = 0.9 * tilt + 0.06 * carry
			if (reach > 0.001) {
				grip.copy(HANDLE).applyAxisAngle(X_AXIS, mugTilt).add(mugLocal)
				elbowR.lerp(ELBOW_GRIP, reach).lerp(ELBOW_SIP, carry)
				// the wrist sits just short of the handle, along the forearm
				wristDir.subVectors(grip, elbowR).normalize()
				handR.lerp(grip.addScaledVector(wristDir, -0.05).add(UP_HAND), reach)
			}
			placeArm(arms[0], P.shoulderL, elbowL, handL, 0)
			placeArm(arms[1], P.shoulderR, elbowR, handR, reach)
			if (carry > 0.0005) mug.position.copy(mugLocal).applyMatrix4(haris.matrix)
			else mug.position.copy(MUG_DESK)
			mug.rotation.set(mugTilt, 0, 0)
			sipNow.carry = carry
			sipNow.tilt = tilt

			// head: on the screens, or turned toward what he is looking at
			react.look += ((look ? 1 : 0) - react.look) * (reduceMotion ? 1 : 1 - Math.exp(-dt * 4))
			if (look) {
				torsoInv.multiplyMatrices(haris.matrix, torso.matrix).invert()
				lookLocal.copy(look).applyMatrix4(torsoInv).sub(head.position)
				react.tYaw = Math.max(-1.2, Math.min(1.2, Math.atan2(-lookLocal.x, -lookLocal.z)))
				react.tPitch = Math.max(-0.35, Math.min(0.75, Math.atan2(lookLocal.y, Math.hypot(lookLocal.x, lookLocal.z))))
			}
			const ks = reduceMotion ? 1 : 1 - Math.exp(-dt * 5)
			react.yaw += (react.tYaw * react.look - react.yaw) * ks
			// glances down at the mug as he lifts it, tips his head back a touch to drink
			const restPitch = 0.22 - 0.05 * carry * (1 - tilt) + 0.12 * tilt
			react.pitch += (restPitch + (react.tPitch - restPitch) * react.look - react.pitch) * ks
			head.rotation.set(react.pitch, react.yaw, 0)
		}

		// ---------- post: bloom on the balanced and full tiers, plain render on the light tier ----------
		const composer = new EffectComposer(renderer)
		composer.addPass(new RenderPass(scene, camera))
		const bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.6, 0.92)
		composer.addPass(bloomPass)

		// apply the day/night blend to every shared colour and light
		const lerp = (a, b, k) => a + (b - a) * k
		function applyLook(k) {
			scene.background.copy(LOOK.bg[0]).lerp(LOOK.bg[1], k)
			scene.fog.color.copy(scene.background)
			scene.fog.density = lerp(LOOK.fog[0], LOOK.fog[1], k)
			floorMat.color.copy(LOOK.floor[0]).lerp(LOOK.floor[1], k)
			scene.environmentIntensity = lerp(LOOK.envLight[0], LOOK.envLight[1], k)
			floorMat.roughness = lerp(0.55, 0.42, k)
			wallMat.color.copy(LOOK.wall[0]).lerp(LOOK.wall[1], k)
			slatMat.color.copy(LOOK.slat[0]).lerp(LOOK.slat[1], k)
			slatMat.roughness = lerp(0.85, 0.62, k)
			hemi.color.copy(LOOK.hemiSky[0]).lerp(LOOK.hemiSky[1], k)
			hemi.groundColor.copy(LOOK.hemiGround[0]).lerp(LOOK.hemiGround[1], k)
			hemi.intensity = lerp(LOOK.hemi[0], LOOK.hemi[1], k)
			key.color.copy(LOOK.keyColor[0]).lerp(LOOK.keyColor[1], k)
			key.intensity = lerp(LOOK.key[0], LOOK.key[1], k)
			renderer.toneMappingExposure = lerp(LOOK.exposure[0], LOOK.exposure[1], k)
			bloomPass.strength = lerp(LOOK.bloom[0][0], LOOK.bloom[1][0], k)
			bloomPass.radius = lerp(LOOK.bloom[0][1], LOOK.bloom[1][1], k)
			bloomPass.threshold = lerp(LOOK.bloom[0][2], LOOK.bloom[1][2], k)
			skyDusk.material.opacity = Math.sin(Math.PI * k) * 0.95
			skyNight.material.opacity = k
			skyNight.visible = k > 0.001
			skyDusk.visible = skyDusk.material.opacity > 0.001
			patchMat.color.setRGB(lerp(1, 0.6, k), lerp(0.93, 0.72, k), lerp(0.78, 1, k))
			patchMat.opacity = lerp(0.42, 0.1, k)
			clockFace.emissiveIntensity = 0.28 * k
			if (key.castShadow) key.shadow.needsUpdate = true
		}
		applyLook(nightMix)
		composer.addPass(new OutputPass())

		function applyTier() {
			const dpr = dprFor(tier)
			renderer.setPixelRatio(dpr)
			composer.setPixelRatio(dpr)
			resize()
		}

		// ---------- size ----------
		function resize() {
			const w = section.clientWidth
			const h = section.clientHeight
			if (!w || !h) return
			renderer.setSize(w, h, false)
			composer.setSize(w, h)
			camera.aspect = w / h
			camera.updateProjectionMatrix()
			const wasMobile = mobile
			mobile = mobileQuery.matches
			if (wasMobile !== mobile) layoutCards()
			snapCamera = true
			frameTimes.length = 0
			wake()
		}
		new ResizeObserver(() => resize()).observe(section)

		// ---------- camera ----------
		const camPos = new THREE.Vector3(0.55, 2.3, 7.2)
		const camLook = new THREE.Vector3(-0.45, 1.9, -2.2)
		const wantPos = new THREE.Vector3()
		const wantLook = new THREE.Vector3()
		let snapCamera = false
		let entered = reduceMotion
		function cameraTarget() {
			const x = cards[focus].x
			// an opened card flies to the camera, so the camera keeps its framing and only eases in
			if (mobile) {
				// framed a little higher so the wall sits below the intro text
				wantPos.set(x + 0.15, 1.95, 6.3)
				wantLook.set(x, 1.95, -2)
			} else {
				const pan = Math.max(0, x - 1.6)
				wantPos.set(0.1 + pan, 1.72, 5.1)
				wantLook.set(-0.9 + pan, 1.68, -2.2)
			}
			if (open) wantPos.z -= 0.35
			if (!entered) {
				wantPos.y += 0.6
				wantPos.z += 2.1
				wantLook.y += 0.25
			}
			const fov = mobile ? 50 : 38
			if (Math.abs(fov - camera.fov) > 0.01) {
				camera.fov += (fov - camera.fov) * 0.1
				camera.updateProjectionMatrix()
			}
		}

		// ---------- pointer (hover picking is throttled to the frame loop) ----------
		const raycaster = new THREE.Raycaster()
		const pointer = new THREE.Vector2()
		let pointerInside = false
		let pointerMoved = false
		let hovered = -1
		let lastPointerType = 'mouse'
		canvas.addEventListener('pointerdown', (e) => (lastPointerType = e.pointerType))
		canvas.addEventListener('pointermove', (e) => {
			if (e.pointerType === 'touch') return
			const r = canvas.getBoundingClientRect()
			pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
			pointerInside = true
			pointerMoved = true
			wake()
		})
		canvas.addEventListener('pointerleave', (e) => {
			// a lifted finger also "leaves"; keep a tapped highlight so the next tap can open it
			if (e.pointerType === 'touch') return
			pointerInside = false
			hovered = -1
			section.classList.remove('is-hover')
		})
		function pick(x, y) {
			if (x !== undefined) {
				const r = canvas.getBoundingClientRect()
				pointer.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1)
			}
			raycaster.setFromCamera(pointer, camera)
			const hit = raycaster.intersectObjects(cardMeshes, false)[0]
			return hit ? hit.object.userData.index : -1
		}
		canvas.addEventListener('click', (e) => {
			const i = pick(e.clientX, e.clientY)
			const touch = lastPointerType === 'touch'
			if (i >= 0) {
				// touch screens have no hover, so the first tap lights the card and the second opens it
				if (touch && !open && hovered !== i) {
					hovered = i
					setFocus(i)
					wake()
					return
				}
				openProject(i)
			} else {
				if (touch) hovered = -1
				closeProject()
			}
		})

		// ---------- fly-to-detail ----------
		// The opened print lifts off its frame, turns over once and lands facing you in the clear
		// space beside the detail panel (above it on phones). Its target is worked out in camera
		// space every frame, so it stays put while the camera eases.
		const detailEl = section.querySelector('.ws__detail')
		const FLY_D = 1.6
		const Y_AXIS = new THREE.Vector3(0, 1, 0)
		const flyTo = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 1 }
		const flyWorld = new THREE.Vector3()
		const flyQ = new THREE.Quaternion()
		const qSpin = new THREE.Quaternion()
		const qTilt = new THREE.Quaternion()
		const easeInOut = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2)
		function flyTarget() {
			const W = section.clientWidth
			const H = section.clientHeight
			const r = detailEl.getBoundingClientRect()
			const sr = section.getBoundingClientRect()
			let cx, cy, ch
			if (mobile) {
				const top = 76
				const bottom = Math.max(top + 140, r.top - sr.top - 14)
				ch = Math.min((bottom - top) * 0.92, (W * 0.7) / 0.75)
				cx = W / 2
				cy = (top + bottom) / 2
			} else {
				// clear of the panel and of the scrim's fade in front of it
				const right = Math.max(260, r.left - sr.left - 150)
				ch = Math.min(H * 0.64, (right * 0.8) / 0.75)
				cx = right / 2 + 12
				cy = H * 0.5
			}
			const tanY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
			const tanX = tanY * camera.aspect
			flyTo.pos.set(((cx / W) * 2 - 1) * tanX * FLY_D, (1 - (cy / H) * 2) * tanY * FLY_D, -FLY_D).applyMatrix4(camera.matrixWorld)
			flyTo.scale = ((ch / H) * 2 * tanY * FLY_D) / CARD_H
			// facing you, turned a touch toward the panel
			flyTo.quat.copy(camera.quaternion).multiply(qTilt.setFromAxisAngle(Y_AXIS, mobile ? 0 : 0.16))
		}
		// position eases in gently so the lift-off reads at once; the turn keeps the stronger curve
		const easeQuad = (v) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2)
		function placeFlying(c) {
			const e = easeQuad(c.flyT)
			const gs = c.group.scale.x
			flyWorld.copy(c.group.position).lerp(flyTo.pos, e)
			// lift up and away from the wall on the way
			const arc = Math.sin(Math.PI * e)
			flyWorld.y += 0.3 * arc
			flyWorld.z += 0.45 * arc
			c.print.position.copy(flyWorld).sub(c.group.position).divideScalar(gs)
			// one full turn, finished just before it lands
			qSpin.setFromAxisAngle(Y_AXIS, Math.PI * 2 * easeInOut(Math.min(1, c.flyT * 1.12)))
			c.print.quaternion.copy(flyQ.identity().slerp(flyTo.quat, e)).multiply(qSpin)
			c.print.scale.setScalar(THREE.MathUtils.lerp(gs, flyTo.scale, e) / gs)
		}
		function landPrint(c) {
			c.print.position.set(0, 0, 0)
			c.print.quaternion.identity()
			c.print.scale.setScalar(1)
		}

		// ---------- picture-light pool ----------
		const order = cards.map((_, i) => i)
		function assignPool() {
			order.sort((a, b) => Math.abs(cards[a].x - camLook.x) - Math.abs(cards[b].x - camLook.x))
			const wanted = order.slice(0, POOL)
			const free = []
			pool.forEach((s) => {
				if (!wanted.includes(s.card)) free.push(s)
			})
			wanted.forEach((ci) => {
				if (pool.some((s) => s.card === ci)) return
				const s = free.shift()
				s.card = ci
				const c = cards[ci]
				s.light.position.set(c.x, CARD_Y + CARD_H / 2 + 0.45, WALL_Z + 1.05)
				s.light.target.position.set(c.x, CARD_Y - 0.1, WALL_Z)
				s.light.target.updateMatrixWorld()
				s.light.shadow.needsUpdate = true
			})
		}

		// ---------- frame-rate governor ----------
		// If the device cannot hold about 40fps, drop a tier: full -> balanced -> light.
		// Judged on time, not frame count, so a very slow device is caught within seconds.
		const frameTimes = []
		let warmup = 1.5
		function govern(dt) {
			if (tier === 0 || reduceMotion || pinned) return
			if (warmup > 0) {
				warmup -= dt
				return
			}
			frameTimes.push(dt)
			const span = frameTimes.reduce((a, b) => a + b, 0)
			if (span < 2 || frameTimes.length < 8) return
			const avg = span / frameTimes.length
			frameTimes.length = 0
			if (avg > 1 / 40) {
				tier -= 1
				warmup = 1.5
				if (tier < 2) pool.forEach((s) => s.light.castShadow && (s.light.castShadow = false))
				if (tier === 0) lampLight.castShadow = false
				applyTier()
			}
		}

		// a picture light coming on: three kinds of bulb (a double blink, a single blink, a clean start)
		function flicker(s, i) {
			if (s <= 0) return 0
			const kind = i % 3
			if (kind === 0) {
				if (s < 0.05) return 0.85
				if (s < 0.12) return 0.06
				if (s < 0.17) return 0.7
				if (s < 0.24) return 0.18
				return Math.min(1, 0.55 + (s - 0.24) * 2.2)
			}
			if (kind === 1) {
				if (s < 0.06) return 0.6
				if (s < 0.14) return 0.08
				return Math.min(1, 0.55 + (s - 0.14) * 2.2)
			}
			return Math.min(1, 0.45 + s * 2.2)
		}
		const wallSpot = new THREE.Vector3()
		const cardSpot = new THREE.Vector3()

		// ---------- loop ----------
		const clock = new THREE.Clock()
		let live = false
		let timeScale = 1 // debug only: slows the animations so test captures can catch them mid-move
		let forceSip = null // debug only: hold the sip at one phase
		let debugView = null // debug only: a fixed close-up camera
		let lightRest = null // debug only: resting level for every picture light (0..1)
		let wallWash = 0 // debug only: warm wash on the wall behind the cards at night (0..1)
		let nightFill = 0 // debug only: extra soft fill at night, so the wall itself reads
		let running = false
		let raf = 0
		let idleFrames = 0
		let enterStart = -1
		let skip = false
		let frameNo = 0
		let lastFrameAt = 0
		let shadowsDirty = false
		renderer.info.autoReset = false
		function frame() {
			raf = 0
			// the light tier draws every other display frame (about 30fps)
			if (tier === 0 && !reduceMotion) {
				skip = !skip
				if (skip) {
					raf = requestAnimationFrame(frame)
					return
				}
			}
			const dt = Math.min(clock.getDelta(), 0.1) * timeScale
			const t = clock.elapsedTime
			frameNo++
			const ease = reduceMotion || snapCamera ? 1 : 1 - Math.exp(-dt * 2.6)
			snapCamera = false

			// entrance: the picture lights switch on one by one along the wall, each with a bulb's
			// flicker, then Haris looks up from his screens at the wall and goes back to work
			let entranceLook = null
			if (enterStart >= 0) {
				const since = (enterStart += dt)
				cards.forEach((c, i) => (c.lit = flicker(since - 0.35 - i * 0.16, i)))
				if (since > 0.6 && !entered) entered = true
				const lookFrom = mobile ? 1.0 : 1.45
				if (since > lookFrom && since < lookFrom + 1.9) entranceLook = wallSpot.set(camLook.x, CARD_Y, WALL_Z)
				if (since > 4) enterStart = -1
			}

			cameraTarget()
			camPos.lerp(wantPos, ease)
			camLook.lerp(wantLook, ease)
			// the camera stays steady: it does not follow the mouse
			camera.position.copy(camPos)
			camera.lookAt(camLook)
			if (debugView) {
				camera.position.copy(debugView[0])
				camera.lookAt(debugView[1])
			}
			camera.updateMatrixWorld()
			assignPool()

			if (pointerInside && pointerMoved) {
				pointerMoved = false
				hovered = pick()
				section.classList.toggle('is-hover', hovered >= 0)
			}
			// a tapped (touch) highlight follows the selected card; the arrows clear it
			if (lastPointerType === 'touch' && hovered >= 0 && hovered !== focus) hovered = -1
			// Lights down: every picture light rests low. Exactly one card is switched on: the one
			// under the cursor, else the open one, else the one picked with the arrows or a tap.
			const litCard = open ? focus : hovered >= 0 ? hovered : selected ? focus : -1
			const step = reduceMotion ? 1 : 1 - Math.exp(-dt * 8)
			// day/night: about 1.6 seconds through a sunset (or sunrise)
			if (nightMix !== nightTarget) {
				const dir = Math.sign(nightTarget - nightMix)
				nightMix = reduceMotion ? nightTarget : Math.min(1, Math.max(0, nightMix + dir * dt / 1.6))
				if (dir > 0 ? nightMix >= nightTarget : nightMix <= nightTarget) nightMix = nightTarget
				applyLook(nightMix * nightMix * (3 - 2 * nightMix))
				shadowsDirty = true
			}
			const nk = nightMix
			setClockHands()

			let cardsMoved = false
			let targetReady = false
			cards.forEach((c, i) => {
				c.on += ((i === litCard ? 1 : 0) - c.on) * step
				// fly-to-detail: about a second out, a little quicker back
				const flyWant = open && i === focus ? 1 : 0
				if (flyWant || c.flyT > 0) {
					c.flyT = reduceMotion ? flyWant : Math.min(1, Math.max(0, c.flyT + (flyWant ? dt / 1.05 : -dt / 0.8)))
					if (c.flyT > 0) {
						if (!targetReady) {
							flyTarget()
							targetReady = true
						}
						placeFlying(c)
					} else landPrint(c)
					cardsMoved = true
				}
				const quiet = open && i !== focus ? 0.35 : 1
				const on = c.on
				// light level: the lit card, or every card at the debug resting level being tried out
				const lv = lightRest !== null ? Math.max(on, lightRest) : on
				// night: lights down, the lit card switches on. Day: the sun lights the room, lamps barely on.
				c.intensity = lerp(DL.rest + (DL.hover - DL.rest) * lv, 0.95 + 5.9 * lv, nk) * quiet * c.lit
				// without bloom a very bright bar clips to flat white, so the light tier keeps it warmer
				c.glow.material.emissiveIntensity = (tier === 0 ? 0.35 + 1.5 * lv : lerp(0.6 + 2.4 * lv, 1.1 + 7.9 * lv, nk)) * c.lit
				c.halo.material.opacity = tier === 0 ? (0.18 + 0.82 * lv) * quiet * c.lit * nk : 0
				c.beam.material.uniforms.uStrength.value = lerp(DL.beam[0] + (DL.beam[1] - DL.beam[0]) * lv, 0.03 + 0.2 * lv, nk) * quiet * c.lit
				c.glow.material.emissive.setRGB(...DL.glow).lerp(NIGHT_GLOW, nk)
				// no wall wash and no glowing print by day: that is what made the card look foggy
				// (debug: a warm wash on the wall behind each card, at night only)
				c.wash.visible = wallWash > 0 && nk > 0.01
				if (c.wash.visible) c.wash.material.opacity = wallWash * nk * c.lit * (0.75 + 0.25 * on)
				// in flight the print carries its own light, so it reads clearly away from its lamp
				const fe = c.flyT > 0 ? easeInOut(c.flyT) : 0
				c.art.material.emissiveIntensity = Math.max((0.035 + 0.165 * lv) * nk, fe * lerp(0.5, 0.72, nk))
				c.print.children[0].castShadow = fe === 0
				c.topLight.material.opacity = (DL.top[0] + (DL.top[1] - DL.top[0]) * on) * (1 - nk) * c.lit * (1 - fe)
				c.topLight.visible = c.topLight.material.opacity > 0.003
				c.group.scale.setScalar(1 + 0.035 * on)
				const z = WALL_Z + 0.06 + 0.09 * on
				if (Math.abs(z - c.z) > 0.0005) cardsMoved = true
				c.z = z
				c.group.position.z = z
			})
			pool.forEach((s) => {
				s.light.angle = lerp(DL.angle, 0.5, nk)
				s.light.penumbra = lerp(DL.pen, 0.75, nk)
				s.light.color.setRGB(...DL.color).lerp(NIGHT_SPOT, nk)
				s.light.intensity = s.card >= 0 ? cards[s.card].intensity : 0
				if ((cardsMoved || shadowsDirty) && s.light.castShadow) s.light.shadow.needsUpdate = true
			})

			// a sip every 11 seconds, 4.4 seconds long (phase 0..1, or -1 while he types)
			const cycle = t % 11
			const sip = forceSip !== null ? forceSip : reduceMotion ? -1 : cycle > 6.6 ? (cycle - 6.6) / 4.4 : -1
			// what he glances at: the wall as the lights come on, or the card you are on. With a card
			// open he just keeps working.
			let look = entranceLook
			if (!look && !open && litCard >= 0) look = cardSpot.set(cards[litCard].x, CARD_Y, WALL_Z)
			pose(sip, t, dt, look)
			updateScreens(t, litCard)
			// the desk-lamp shadow follows his arms: every frame on full, every third on balanced
			if (lampLight.castShadow && (tier === 2 || frameNo % 3 === 0)) lampLight.shadow.needsUpdate = true
			steam.forEach((s, i) => {
				const k = ((reduceMotion ? 0.3 : t * 0.12) + i / steam.length) % 1
				s.position.set(Math.sin(t * 1.3 + i * 2.1) * 0.012 * (1 + k * 2), 0.11 + k * 0.2, 0)
				s.scale.set(0.04 + k * 0.05, 0.06 + k * 0.08, 1)
				s.material.opacity = 0.16 * Math.sin(k * Math.PI) * (1 - sipNow.tilt) * (1 - 0.5 * sipNow.carry)
			})
			lampLight.intensity = 1.1 * (1 + Math.sin(t * 0.7) * 0.03)
			// the pool reads at night; by day the sun washes most of it out
			lampPoolMat.opacity = lerp(0.1, 0.5, nk)
			if (cardsMoved && key.castShadow) key.shadow.needsUpdate = true
			shadowsDirty = false
			bulbHalo.material.opacity = tier === 0 ? 0.6 : 0

			renderer.info.reset()
			if (tier === 0) renderer.render(scene, camera)
			else composer.render()
			// first real frame: fade the canvas in over the still picture
			if (!live) {
				live = true
				section.classList.add('is-live')
			}

			govern(Math.min(clock.elapsedTime - lastFrameAt, 1))
			lastFrameAt = clock.elapsedTime

			const settled = camPos.distanceTo(wantPos) < 0.002 && camLook.distanceTo(wantLook) < 0.002
			idleFrames = reduceMotion && settled ? idleFrames + 1 : 0
			if (running && idleFrames < 3) raf = requestAnimationFrame(frame)
		}
		function wake() {
			idleFrames = 0
			if (running && !raf) raf = requestAnimationFrame(frame)
		}
		function start() {
			if (running) return
			running = true
			clock.getDelta()
			lastFrameAt = clock.elapsedTime
			frameTimes.length = 0
			warmup = 1.5
			wake()
		}
		function stop() {
			running = false
			if (raf) cancelAnimationFrame(raf)
			raf = 0
		}
		// instant: the still picture was showing, so start on the finished frame with no entrance
		let enteredOnce = false
		function enter(instant) {
			if (enteredOnce) return
			enteredOnce = true
			if (reduceMotion || instant) {
				cards.forEach((c) => (c.lit = 1))
				entered = true
				snapCamera = true
			} else {
				enterStart = 0 // counts up with each frame from here
			}
			wake()
		}

		// Everything that never moves gets its matrix computed once instead of every frame.
		scene.traverse((o) => {
			if (o === scene || o.isLight || o.userData.dynamic) return
			o.updateMatrix()
			o.matrixAutoUpdate = false
		})

		applyTier()
		cameraTarget()
		camera.position.copy(camPos)
		camera.lookAt(camLook)
		assignPool()
		// compile every shader up front, without blocking the page where the browser allows it
		await renderer.compileAsync(scene, camera)

		if (debug) {
			window.__ws = {
				snap() {
					snapCamera = true
					wake()
				},
				// page position of a card's centre on the wall
				cardAt(i) {
					const v = cards[i].group.getWorldPosition(new THREE.Vector3()).project(camera)
					const r = canvas.getBoundingClientRect()
					return [Math.round(r.left + ((v.x + 1) / 2) * r.width), Math.round(r.top + ((1 - v.y) / 2) * r.height)]
				},
				slow(k) {
					timeScale = k
				},
				// page box of a card on the wall: [left, top, right, bottom]
				cardBox(i) {
					const r = canvas.getBoundingClientRect()
					const g = cards[i].group
					const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => g.localToWorld(new THREE.Vector3((sx * CARD_W) / 2, (sy * CARD_H) / 2, 0)).project(camera))
					const xs = pts.map((v) => r.left + ((v.x + 1) / 2) * r.width)
					const ys = pts.map((v) => r.top + ((1 - v.y) / 2) * r.height)
					return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(Math.round)
				},
				lights(rest, wash = 0, fill = 0) {
					lightRest = rest
					wallWash = wash
					nightFill = fill
					hemi.intensity = lerp(LOOK.hemi[0], LOOK.hemi[1] + nightFill, nightMix)
				},
				sipAt(p) {
					forceSip = p
				},
				view(pos, look) {
					debugView = pos ? [new THREE.Vector3(...pos), new THREE.Vector3(...look)] : null
				},
				state: () => ({ fly: cards.map((c) => +c.flyT.toFixed(2)), lit: cards.map((c) => +c.lit.toFixed(2)), react: { ...react }, shownProject, live }),
				info: () => ({
					hovered,
					lastPointerType,
					focus,
					open,
					startTier,
					tier,
					dpr: renderer.getPixelRatio(),
					drawCalls: renderer.info.render.calls,
					triangles: renderer.info.render.triangles,
					programs: renderer.info.programs.length,
					textures: renderer.info.memory.textures,
					spotLights: POOL + 3,
					shadowCasters: pool.filter((s) => s.light.castShadow).length + (lampLight.castShadow ? 1 : 0),
				}),
			}
		}
		function setNight(v) {
			nightTarget = v ? 1 : 0
			wake()
		}
		// with reduced motion the loop sleeps when idle, so wake it once a minute for the clock
		if (reduceMotion) setInterval(wake, 60000)
		return { start, stop, enter, wake, setNight }
	}
}
