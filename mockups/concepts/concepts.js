// Four alternative directions for the Projects room, rendered from one scene builder.
// ?concept=wires | control | gallery | orbit
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const CONCEPT = new URLSearchParams(location.search).get('concept') || 'wires'
const REF = '/landing/workspace/ref/'
const LOGO = '/landing/assets/img/tools/'
const DETAIL = {
	Inbox: ['Multi-inbox email triage', '224', 'workflow nodes'],
	Support: ['AI customer support', '6,700+', 'conversations automated'],
	Compliance: ['FERPA staff compliance', '7', 'staff roles tracked'],
	'Ten Zaps': ['10-Zap AI suite', '10', 'Zaps in production'],
	Voices: ['Multimodal RAG chatbots', '2', 'languages, voice and text'],
	Caller: ['Insurance voice agent', '300%', 'more leads processed'],
	WhatsApp: ['Timezone-aware WhatsApp bot', '200+', 'global customers'],
	Grocery: ['Grocery flyer data system', '5 min', 'per flyer, down from 2 hrs'],
	Studio: ['Monday.com content pipeline', 'VEO 3', 'video and image routing'],
	Scout: ['YouTube creator lead qualifier', 'Gemini', 'channel summaries'],
	Icebreaker: ['AI icebreaker generator', '1:1', 'personal openers at scale'],
	Screener: ['AI resume screener', '20-30 hrs', 'saved a week'],
}
const CATEGORY = { Support: 'voice', Voices: 'voice', Caller: 'voice', WhatsApp: 'voice' }
const PROJECTS = [
	{ card: 'Inbox', sub: 'Email triage, n8n', img: 'ref-1031.jpg', logo: 'n8n.png' },
	{ card: 'Support', sub: 'Support agent, n8n', img: 'ref-1005.jpg', logo: 'openai.svg' },
	{ card: 'Compliance', sub: 'FERPA platform, GHL', img: 'ref-1018.jpg', logo: 'ghl.png' },
	{ card: 'Ten Zaps', sub: 'Event pipeline, Zapier', img: 'ref-1016.jpg', logo: 'zapier.png' },
	{ card: 'Voices', sub: 'RAG chatbots, n8n', img: 'ref-1027.jpg', logo: 'n8n.png' },
	{ card: 'Caller', sub: 'Voice agent, Retell AI', img: 'ref-26.jpg', logo: 'retell.png' },
	{ card: 'WhatsApp', sub: 'WhatsApp agent, n8n', img: 'ref-1015.jpg', logo: 'twilio.svg' },
	{ card: 'Grocery', sub: 'Vision pipeline, Make', img: 'ref-1060.jpg', logo: 'make.png' },
	{ card: 'Studio', sub: 'Content pipeline, n8n', img: 'ref-1050.jpg', logo: 'n8n.png' },
	{ card: 'Scout', sub: 'Lead qualifier, n8n', img: 'ref-1044.jpg', logo: 'ghl.png' },
	{ card: 'Icebreaker', sub: 'AI outreach, n8n', img: 'ref-1036.jpg', logo: 'n8n.png' },
	{ card: 'Screener', sub: 'Resume AI, n8n', img: 'ref-201.jpg', logo: 'n8n.png' },
]

const QS = new URLSearchParams(location.search)
const HOVER = Number(QS.get('hover') ?? -1)
const FEAT = new Set((QS.get('f') || '').split(',').filter(Boolean))
const MOBILE = QS.has('m')
const COPY = {
	daynight: {
		chip: { day: 'Day', dusk: 'Switching: sunset', night: 'Night' }[QS.get('mode') || 'day'] + (HOVER >= 0 ? ', hover' : ''),
		accent: QS.get('mode') === 'day' || !QS.get('mode') ? '#b8642a' : '#ffb46a',
		title: 'The work,<br /><span>on the wall</span>',
		lede: MOBILE ? 'Twelve systems running in production. Tap a card to light it up.' : 'Twelve systems running in production. Move over a card to light it up.',
		hint: MOBILE ? 'Tap a card to light it. Tap again to open.' : 'Hover a card to light it. Click to open it.',
	},
	light: {
		chip: (QS.get('theme') === 'cream' ? 'Cream studio' : 'White gallery') + (HOVER >= 0 ? ', hover' : ''),
		accent: QS.get('theme') === 'cream' ? '#b8642a' : '#c2621f',
		title: 'The work,<br /><span>on the wall</span>',
		lede: MOBILE ? 'Twelve systems running in production. Tap a card to light it up.' : 'Twelve systems running in production. Move over a card to light it up.',
		hint: MOBILE ? 'Tap a card to light it. Tap again to open.' : 'Hover a card to light it. Click to open it.',
	},
	dim: {
		chip: FEAT.has('filter') ? 'Idea: filter the wall' : FEAT.has('look') ? 'Idea: he looks, his screen follows' : FEAT.has('plaque') ? 'Idea: lit plaque and dust in the beam' : HOVER >= 0 ? (MOBILE ? 'Tap to light' : 'Your plan: hover lights it') : 'Your plan: lights down',
		accent: '#ffb46a',
		title: 'The work,<br /><span>on the wall</span>',
		lede: MOBILE ? 'The room rests in the dark. Tap a card to switch its light on.' : 'The room rests in the dark. Move over a card to switch its light on.',
		hint: MOBILE ? 'Tap a card to light it. Tap again to open.' : 'Hover a card to light it. Click to open it.',
	},
	row: {
		chip: HOVER >= 0 ? 'Hover state' : 'Studio wall', accent: '#ffb46a',
		title: 'The work,<br /><span>on the wall</span>',
		lede: 'Twelve systems running in production. Pick a card to step inside one.',
		hint: 'Hover a card to light it up. Click to open it.',
	},
	grid: {
		chip: HOVER >= 0 ? 'Hover state' : 'Studio grid', accent: '#ffb46a',
		title: 'The work,<br /><span>on the wall</span>',
		lede: 'Twelve systems running in production. Pick a card to step inside one.',
		hint: 'Hover a card to light it up. Click to open it.',
	},
	wires: {
		chip: 'Concept 1, workflow wall', accent: '#ffb46a',
		title: 'Every system, <span>wired together</span>',
		lede: 'Twelve production systems hang on the wall as one live workflow, with data pulsing between them.',
		hint: 'Click a node to open it. Use the arrows to follow the wire.',
	},
	control: {
		chip: 'Concept 2, control room', accent: '#62d2ff',
		title: 'The <span>ops room</span>',
		lede: 'Every system Haris runs, live on one wall of screens. Pick a screen to see how it works.',
		hint: 'Click a screen to open it. Use the arrows to switch screens.',
	},
	gallery: {
		chip: 'Concept 3, gallery walk', accent: '#ffb46a',
		title: 'A walk through <span>the work</span>',
		lede: 'A quiet gallery of twelve systems. Scroll to walk the corridor and stop at any piece to read it.',
		hint: 'Scroll to walk. Click a piece to read it.',
	},
	orbit: {
		chip: 'Concept 4, orbit', accent: '#ffc27a',
		title: 'Twelve systems, <span>in orbit</span>',
		lede: 'Haris at the centre, the work all around him. Drag to turn the ring, click a card to bring it close.',
		hint: 'Drag to turn the ring. Click a card to bring it close.',
	},
}[CONCEPT]
document.documentElement.style.setProperty('--accent', COPY.accent)
document.getElementById('chip').textContent = COPY.chip
document.getElementById('title').innerHTML = COPY.title
document.getElementById('lede').textContent = COPY.lede
document.getElementById('hint').textContent = COPY.hint

// ---------- assets first, so the frozen frame is complete ----------
const loadImage = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src })
await Promise.all([document.fonts.load('600 84px Manrope'), document.fonts.load('500 38px Manrope')])
await Promise.all(PROJECTS.map(async (p) => { [p.photo, p.logoImg] = await Promise.all([loadImage(REF + p.img), loadImage(LOGO + p.logo)]) }))

function cardCanvas(p) {
	const cv = document.createElement('canvas')
	cv.width = 900
	cv.height = 1200
	const c = cv.getContext('2d')
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
	c.fillStyle = '#fff'
	c.fill()
	c.restore()
	if (p.logoImg) {
		const L = p.logoImg
		const lw = L.naturalWidth || 1
		const lh = L.naturalHeight || 1
		const f = Math.min(88 / lw, 64 / lh)
		c.save()
		c.beginPath()
		c.arc(110, 1086, 60, 0, Math.PI * 2)
		c.clip()
		c.drawImage(L, 110 - (lw * f) / 2, 1086 - (lh * f) / 2, lw * f, lh * f)
		c.restore()
	}
	return cv
}

// ---------- renderer ----------
const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
renderer.setSize(innerWidth, innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const scene = new THREE.Scene()
scene.background = new THREE.Color('#060607')
scene.fog = new THREE.FogExp2('#060607', 0.045)
// bloom strength, radius, threshold; bright themes lower it so the white wall does not haze over
let BLOOM = [0.55, 0.6, 0.9]
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.05, 90)
scene.add(new THREE.HemisphereLight('#3a3530', '#050505', 0.35))

const mat = (color, roughness = 0.8, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness })
const glowMat = (color, intensity) => new THREE.MeshStandardMaterial({ color: '#111', emissive: color, emissiveIntensity: intensity })
function mesh(geo, material, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], cast = true } = {}) {
	const m = new THREE.Mesh(geo, material)
	m.position.set(...pos)
	m.rotation.set(...rot)
	m.scale.set(...scale)
	m.castShadow = cast
	m.receiveShadow = true
	return m
}
const UP = new THREE.Vector3(0, 1, 0)
function limb(a, b, r, material) {
	const A = new THREE.Vector3(...a)
	const B = new THREE.Vector3(...b)
	const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(A.distanceTo(B), 0.0001), 6, 16), material)
	m.position.copy(A).add(B).multiplyScalar(0.5)
	m.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize())
	m.castShadow = true
	m.receiveShadow = true
	return m
}
const textures = PROJECTS.map((p) => {
	const t = new THREE.CanvasTexture(cardCanvas(p))
	t.colorSpace = THREE.SRGBColorSpace
	t.anisotropy = 8
	return t
})
// printed card: face plane + paper edge
function makeCard(i, { w = 1.08, h = 1.44, glow = 0.14, emissiveEdge = null } = {}) {
	const g = new THREE.Group()
	g.add(mesh(new THREE.BoxGeometry(w, h, 0.016), mat('#e9e6e0', 0.8), { pos: [0, 0, 0] }))
	g.add(mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: textures[i], roughness: 0.78, emissive: '#fff', emissiveMap: textures[i], emissiveIntensity: glow }), { pos: [0, 0, 0.0085], cast: false }))
	if (emissiveEdge) {
		const back = mesh(new THREE.PlaneGeometry(w + 0.05, h + 0.05), glowMat(emissiveEdge, 2.2), { pos: [0, 0, -0.012], cast: false })
		g.add(back)
	}
	return g
}
// picture light above a card, in the card's local space
function pictureLight(g, h = 1.44, { len = 0.62, glow = 6, lift = 0.2 } = {}) {
	const body = mat('#0b0b0b', 0.35, 0.6)
	const lamp = new THREE.Group()
	lamp.position.set(0, h / 2 + lift, 0.12)
	lamp.add(mesh(new THREE.CylinderGeometry(0.032, 0.032, len, 18), body, { rot: [0, 0, Math.PI / 2] }))
	lamp.add(mesh(new THREE.BoxGeometry(len - 0.06, 0.008, 0.03), glowMat('#ffb064', glow), { pos: [0, -0.032, 0.004], cast: false }))
	lamp.add(limb([0, 0, -0.12], [0, 0, -0.01], 0.012, body))
	g.add(lamp)
}
function spotOn(target, from, color = '#ffc590', intensity = 4.5, angle = 0.5, shadow = false) {
	const s = new THREE.SpotLight(color, intensity, 7, angle, 0.75, 2)
	s.position.copy(from)
	s.target.position.copy(target)
	s.castShadow = shadow
	s.shadow.mapSize.set(1024, 1024)
	s.shadow.bias = -0.0004
	scene.add(s, s.target)
	return s
}

// ---------- Haris ----------
const skin = mat('#c48a64', 0.5)
const coat = mat('#151517', 0.92)
const trousers = mat('#1b1d22', 0.85)
function addHead(parent, y) {
	const head = new THREE.Group()
	head.position.set(0, y, -0.02)
	parent.add(head)
	head.add(mesh(new THREE.SphereGeometry(0.115, 32, 24), skin, { scale: [0.9, 1.08, 1] }))
	head.add(mesh(new THREE.SphereGeometry(0.06, 16, 12), skin, { pos: [0, -0.07, -0.045], scale: [1.1, 0.8, 1] }))
	head.add(mesh(new THREE.ConeGeometry(0.018, 0.05, 12), skin, { pos: [0, -0.01, -0.12], rot: [-Math.PI / 2 + 0.25, 0, 0] }))
	for (const sx of [-1, 1]) head.add(mesh(new THREE.SphereGeometry(0.026, 12, 10), skin, { pos: [sx * 0.104, -0.005, 0.005], scale: [0.45, 1, 0.75] }))
	head.add(mesh(new THREE.SphereGeometry(0.126, 32, 20, -Math.PI * 0.12, Math.PI * 1.24, 0, Math.PI * 0.74), mat('#1a110c', 0.75), { pos: [0, 0.008, 0.014] }))
	const capMat = mat('#1d1d1f', 0.95)
	head.add(mesh(new THREE.SphereGeometry(0.132, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), capMat, { pos: [0, 0.045, -0.012], scale: [1.04, 0.62, 1.14], rot: [0.12, 0, 0] }))
	head.add(mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.012, 32, 1, false, Math.PI / 2, Math.PI), capMat, { pos: [0, 0.05, -0.085], rot: [0.28, 0, 0], scale: [1, 1, 0.85] }))
	const glass = mat('#0b0b0b', 0.3, 0.6)
	for (const sx of [-1, 1]) {
		head.add(mesh(new THREE.TorusGeometry(0.03, 0.0045, 8, 24), glass, { pos: [sx * 0.045, 0.012, -0.112] }))
		head.add(limb([sx * 0.077, 0.014, -0.106], [sx * 0.104, 0.016, 0], 0.003, glass))
	}
	head.add(limb([-0.016, 0.014, -0.114], [0.016, 0.014, -0.114], 0.003, glass))
	return head
}
// seated at a desk, typing (desk top at y 0.7725, laptop about 0.6 in front)
let lastHead = null
function seatedHaris(x, z) {
	const h = new THREE.Group()
	h.position.set(x, 0, z)
	const DT = 0.7725
	h.add(limb([-0.1, 0.53, 0.02], [-0.12, 0.55, -0.38], 0.075, trousers))
	h.add(limb([0.1, 0.53, 0.02], [0.13, 0.55, -0.38], 0.075, trousers))
	h.add(limb([-0.12, 0.55, -0.38], [-0.12, 0.08, -0.42], 0.06, trousers))
	h.add(limb([0.13, 0.55, -0.38], [0.14, 0.08, -0.42], 0.06, trousers))
	const torso = new THREE.Group()
	torso.position.set(0, 0.56, 0.02)
	torso.rotation.x = -0.2
	h.add(torso)
	torso.add(mesh(new THREE.CapsuleGeometry(0.17, 0.36, 8, 22), coat, { pos: [0, 0.32, 0], scale: [1.32, 1, 0.9] }))
	torso.add(mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.09, 20), coat, { pos: [0, 0.66, -0.01] }))
	torso.add(mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.08, 16), skin, { pos: [0, 0.72, -0.02] }))
	const head = addHead(torso, 0.86)
	head.rotation.x = 0.16
	lastHead = head
	for (const [s, e, hd] of [
		[[-0.215, 1.0, -0.06], [-0.27, 0.8, -0.3], [-0.1, DT + 0.035, -0.62]],
		[[0.215, 1.0, -0.06], [0.28, 0.8, -0.28], [0.12, DT + 0.035, -0.6]],
	]) {
		h.add(limb(s, e, 0.058, coat), limb(e, hd, 0.05, coat), mesh(new THREE.SphereGeometry(0.036, 14, 10), skin, { pos: hd, scale: [1, 0.75, 1.25] }))
	}
	scene.add(h)
	return h
}
// standing, hands in his coat pockets
function standingHaris(x, z, rotY) {
	const h = new THREE.Group()
	h.position.set(x, 0, z)
	h.rotation.y = rotY
	for (const sx of [-1, 1]) {
		h.add(limb([sx * 0.1, 0.9, 0], [sx * 0.105, 0.5, 0.02], 0.068, trousers))
		h.add(limb([sx * 0.105, 0.5, 0.02], [sx * 0.11, 0.09, 0], 0.058, trousers))
		h.add(mesh(new THREE.BoxGeometry(0.1, 0.07, 0.24), mat('#0d0d0e', 0.5), { pos: [sx * 0.11, 0.035, -0.04] }))
	}
	h.add(mesh(new THREE.CylinderGeometry(0.21, 0.25, 0.42, 24), coat, { pos: [0, 0.98, 0] })) // coat skirt
	h.add(mesh(new THREE.CapsuleGeometry(0.17, 0.34, 8, 22), coat, { pos: [0, 1.3, 0], scale: [1.32, 1, 0.9] }))
	h.add(mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.09, 20), coat, { pos: [0, 1.62, 0] }))
	h.add(mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.08, 16), skin, { pos: [0, 1.68, -0.01] }))
	addHead(h, 1.8).rotation.x = 0.05
	for (const sx of [-1, 1]) {
		h.add(limb([sx * 0.215, 1.5, 0], [sx * 0.25, 1.18, 0.03], 0.058, coat))
		h.add(limb([sx * 0.25, 1.18, 0.03], [sx * 0.21, 0.98, -0.06], 0.05, coat))
	}
	scene.add(h)
	return h
}

// ---------- desk set (desk centred at x, laptop facing +z sitter) ----------
const DT = 0.7725
function screenCanvas(kind = 'flow') {
	const cv = document.createElement('canvas')
	cv.width = 660
	cv.height = 420
	const c = cv.getContext('2d')
	c.fillStyle = '#16181c'
	c.fillRect(0, 0, 660, 420)
	c.fillStyle = '#1f2228'
	c.fillRect(0, 0, 660, 34)
	if (kind === 'flow') {
		const nodes = [[60, 220], [180, 140], [180, 300], [310, 220], [440, 130], [440, 220], [440, 320], [575, 220]]
		const cols = ['#ff6d5a', '#7b61ff', '#29b6f6', '#ffb020', '#2ecc71', '#7b61ff', '#29b6f6', '#ff6d5a']
		c.strokeStyle = 'rgba(200,210,225,0.55)'
		c.lineWidth = 2
		;[[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]].forEach(([a, b]) => {
			const [x1, y1] = nodes[a]
			const [x2, y2] = nodes[b]
			c.beginPath()
			c.moveTo(x1 + 30, y1)
			c.bezierCurveTo(x1 + 70, y1, x2 - 70, y2, x2 - 30, y2)
			c.stroke()
		})
		nodes.forEach(([x, y], i) => {
			c.fillStyle = '#2a2e36'
			c.beginPath()
			c.roundRect(x - 30, y - 30, 60, 60, 12)
			c.fill()
			c.fillStyle = cols[i]
			c.beginPath()
			c.roundRect(x - 12, y - 12, 24, 24, 6)
			c.fill()
		})
	} else {
		// dashboard: bars and a line chart
		for (let i = 0; i < 12; i++) {
			const h = 40 + ((i * 53) % 150)
			c.fillStyle = i % 3 ? '#2b6cb0' : '#62d2ff'
			c.fillRect(40 + i * 48, 380 - h, 30, h)
		}
		c.strokeStyle = '#ffb46a'
		c.lineWidth = 3
		c.beginPath()
		for (let i = 0; i < 12; i++) c.lineTo(55 + i * 48, 140 - Math.sin(i * 0.8) * 40 - i * 4)
		c.stroke()
	}
	const t = new THREE.CanvasTexture(cv)
	t.colorSpace = THREE.SRGBColorSpace
	return t
}
function deskSet(x, z, { width = 2.0, monitors = false, rightTex = null } = {}) {
	const g = new THREE.Group()
	g.position.set(x, 0, z)
	const metal = mat('#0d0d0d', 0.35, 0.65)
	g.add(mesh(new THREE.BoxGeometry(width, 0.045, 0.82), mat('#5b3a22', 0.48), { pos: [0, 0.75, 0] }))
	for (const sx of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(0.035, 0.73, 0.7), metal, { pos: [(sx * width) / 2 - sx * 0.08, 0.365, 0] }))
	// laptop
	const lap = new THREE.Group()
	lap.position.set(0.02, DT, 0.07)
	const alu = mat('#9da1a6', 0.32, 0.85)
	lap.add(mesh(new THREE.BoxGeometry(0.36, 0.012, 0.25), alu, { pos: [0, 0.006, 0] }))
	const hinge = new THREE.Group()
	hinge.position.set(0, 0.012, -0.125)
	hinge.rotation.x = -0.32
	hinge.add(mesh(new THREE.BoxGeometry(0.36, 0.24, 0.008), alu, { pos: [0, 0.12, -0.004] }))
	hinge.add(mesh(new THREE.PlaneGeometry(0.33, 0.21), new THREE.MeshBasicMaterial({ map: screenCanvas('flow'), toneMapped: false, color: '#c9d2dc' }), { pos: [0, 0.12, 0.0005], cast: false }))
	lap.add(hinge)
	g.add(lap)
	const sl = new THREE.PointLight('#9fc3ff', 0.55, 1.4, 2)
	sl.position.set(0.02, 0.98, 0.17)
	g.add(sl)
	if (monitors) {
		for (const sx of [-1, 1]) {
			const m = new THREE.Group()
			m.position.set(sx * 0.62, DT, -0.15)
			m.rotation.y = -sx * 0.35
			m.add(mesh(new THREE.BoxGeometry(0.62, 0.38, 0.025), metal, { pos: [0, 0.42, 0] }))
			m.add(mesh(new THREE.PlaneGeometry(0.58, 0.34), new THREE.MeshBasicMaterial({ map: sx > 0 && rightTex ? rightTex : screenCanvas(sx < 0 ? 'dash' : 'flow'), toneMapped: false, color: '#b8c8d8' }), { pos: [0, 0.42, 0.0135], cast: false }))
			m.add(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 10), metal, { pos: [0, 0.12, -0.02] }))
			m.add(mesh(new THREE.BoxGeometry(0.2, 0.012, 0.14), metal, { pos: [0, 0.006, -0.02] }))
			g.add(m)
		}
	}
	// desk lamp
	const lamp = new THREE.Group()
	lamp.position.set(-0.68 * (width / 2), DT, -0.1)
	lamp.add(mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.022, 32), metal, { pos: [0, 0.011, 0] }))
	lamp.add(limb([0, 0.02, 0], [0.02, 0.42, -0.08], 0.011, metal))
	lamp.add(limb([0.02, 0.42, -0.08], [0.24, 0.47, 0.06], 0.011, metal))
	lamp.add(mesh(new THREE.ConeGeometry(0.085, 0.13, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.4, metalness: 0.5, side: THREE.DoubleSide }), { pos: [0.27, 0.43, 0.07], rot: [0.2, 0, -0.35] }))
	lamp.add(mesh(new THREE.SphereGeometry(0.03, 16, 16), glowMat('#ffc27a', 9), { pos: [0.28, 0.4, 0.075], cast: false }))
	g.add(lamp)
	const ll = new THREE.SpotLight('#ffbf78', 6, 3, 0.95, 0.7, 2)
	ll.position.set(lamp.position.x + 0.28, DT + 0.4, lamp.position.z + 0.07)
	ll.target.position.set(lamp.position.x + 0.53, DT, lamp.position.z + 0.25)
	ll.castShadow = true
	ll.shadow.mapSize.set(1024, 1024)
	ll.shadow.bias = -0.0005
	g.add(ll, ll.target)
	const fill = new THREE.PointLight('#ffb36b', 0.9, 2.4, 2)
	fill.position.set(lamp.position.x + 0.3, DT + 0.36, lamp.position.z + 0.11)
	g.add(fill)
	// mug and plant
	const mugM = mat('#e9e3d8', 0.35)
	g.add(mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.1, 24), mugM, { pos: [0.42, DT + 0.05, 0.27] }))
	g.add(mesh(new THREE.TorusGeometry(0.026, 0.008, 10, 20), mugM, { pos: [0.465, DT + 0.052, 0.27] }))
	const plant = new THREE.Group()
	plant.position.set(width / 2 - 0.18, DT, -0.23)
	plant.add(mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.12, 24), mat('#d9cfc0', 0.6), { pos: [0, 0.06, 0] }))
	for (let i = 0; i < 9; i++) {
		const a = (i / 9) * Math.PI * 2
		const leaf = mesh(new THREE.SphereGeometry(0.05, 12, 10), mat('#2f5a3a', 0.6), { scale: [0.45, 1.6, 0.18] })
		leaf.position.set(Math.cos(a) * 0.045, 0.2 + (i % 3) * 0.03, Math.sin(a) * 0.045)
		leaf.rotation.set(Math.sin(a) * 0.5, -a, Math.cos(a) * 0.5)
		plant.add(leaf)
	}
	g.add(plant)
	// chair
	const chair = new THREE.Group()
	chair.position.set(0.02, 0, 0.83)
	const cm = mat('#151516', 0.55)
	chair.add(mesh(new THREE.BoxGeometry(0.5, 0.06, 0.48), cm, { pos: [0, 0.47, 0] }))
	chair.add(mesh(new THREE.BoxGeometry(0.48, 0.34, 0.05), cm, { pos: [0, 0.74, 0.24], rot: [0.12, 0, 0] }))
	chair.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 12), metal, { pos: [0, 0.24, 0] }))
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2
		chair.add(limb([0, 0.05, 0], [Math.cos(a) * 0.28, 0.03, Math.sin(a) * 0.28], 0.016, metal))
	}
	g.add(chair)
	scene.add(g)
	seatedHaris(x + 0.02, z + 0.75)
	// rim lights so his silhouette separates from the background
	spotOn(new THREE.Vector3(x + 0.05, 1.25, z + 0.7), new THREE.Vector3(x - 0.55, 2.15, z - 0.8), '#ffd2a1', 7, 0.7)
	spotOn(new THREE.Vector3(x + 0.05, 1.2, z + 0.7), new THREE.Vector3(x + 0.8, 2.0, z - 0.75), '#ffcf9d', 4, 0.7)
	return g
}

// slatted wall helper
function slatWall(z, color = '#121213', from = -14, to = 26) {
	const n = Math.round((to - from) / 0.108)
	const s = new THREE.InstancedMesh(new THREE.BoxGeometry(0.085, 12, 0.05), mat(color, 0.62, 0.05), n)
	s.receiveShadow = true
	const o = new THREE.Object3D()
	for (let i = 0; i < n; i++) {
		o.position.set(from + i * 0.108, 6, z - 0.025)
		o.updateMatrix()
		s.setMatrixAt(i, o.matrix)
	}
	scene.add(s)
	scene.add(mesh(new THREE.PlaneGeometry(80, 12), mat('#050505', 1), { pos: [(from + to) / 2, 6, z - 0.06], cast: false }))
}
function floor(color = '#0d0d0e', roughness = 0.42) {
	scene.add(mesh(new THREE.PlaneGeometry(90, 90), mat(color, roughness), { rot: [-Math.PI / 2, 0, 0], cast: false }))
}

const WALL_Z = -2.2
const key = new THREE.DirectionalLight('#ffe2c4', 0.35)
key.position.set(3, 3.5, 6)
scene.add(key)

// ============================================================
if (CONCEPT === 'wires') {
	floor()
	slatWall(WALL_Z)
	const yOff = [0.05, -0.32, 0.28, -0.12, 0.22, -0.28, 0.1, -0.2, 0.25, -0.1, 0.18, -0.25]
	const pts = PROJECTS.map((_, i) => new THREE.Vector3((i - 2) * 1.85, 2.3 + yOff[i], WALL_Z + 0.06))
	const wire = glowMat('#ff9a4a', 2.4)
	const socket = glowMat('#ffc27a', 5)
	const pulse = glowMat('#fff0d8', 9)
	pts.forEach((p, i) => {
		const card = makeCard(i)
		card.position.copy(p)
		scene.add(card)
		pictureLight(card)
		spotOn(new THREE.Vector3(p.x, p.y - 0.1, WALL_Z), new THREE.Vector3(p.x, p.y + 1.17, WALL_Z + 1.05), '#ffc590', i === 2 ? 7 : 3.6, 0.5, i >= 1 && i <= 4)
		// sockets on both sides, like workflow nodes
		for (const sx of [-1, 1]) scene.add(mesh(new THREE.SphereGeometry(0.03, 16, 12), socket, { pos: [p.x + sx * 0.57, p.y, p.z + 0.02], cast: false }))
		if (i < pts.length - 1) {
			const q = pts[i + 1]
			const a = new THREE.Vector3(p.x + 0.57, p.y, p.z + 0.02)
			const b = new THREE.Vector3(q.x - 0.57, q.y, q.z + 0.02)
			const curve = new THREE.CubicBezierCurve3(a, new THREE.Vector3(a.x + 0.42, a.y, a.z + 0.05), new THREE.Vector3(b.x - 0.42, b.y, b.z + 0.05), b)
			scene.add(mesh(new THREE.TubeGeometry(curve, 48, 0.008, 8, false), wire, { cast: false }))
			scene.add(mesh(new THREE.SphereGeometry(0.018, 12, 10), pulse, { pos: curve.getPoint((0.35 + i * 0.17) % 0.8 + 0.1).toArray(), cast: false }))
		}
	})
	// a branch from the laptop up to the wall: the work starts at his desk
	const branch = new THREE.CatmullRomCurve3([new THREE.Vector3(0.3, DT + 0.02, 0.45), new THREE.Vector3(0.9, DT + 0.02, -0.05), new THREE.Vector3(1.0, 0.9, WALL_Z + 0.08), new THREE.Vector3(1.05, 1.6, WALL_Z + 0.08), new THREE.Vector3(pts[3].x - 0.57, pts[3].y, WALL_Z + 0.08)])
	scene.add(mesh(new THREE.TubeGeometry(branch, 80, 0.007, 8, false), wire, { cast: false }))
	scene.add(mesh(new THREE.SphereGeometry(0.018, 12, 10), pulse, { pos: branch.getPoint(0.62).toArray(), cast: false }))
	deskSet(0, 0.55)
	camera.position.set(0.1, 1.72, 5.1)
	camera.lookAt(-0.9, 1.7, -2.2)
}

// ============================================================
if (CONCEPT === 'control') {
	scene.background = new THREE.Color('#04070b')
	scene.fog = new THREE.FogExp2('#04070b', 0.03)
	floor('#0a0d12', 0.3)
	scene.add(mesh(new THREE.PlaneGeometry(80, 14), mat('#080b10', 0.7, 0.3), { pos: [0, 7, WALL_Z - 0.05], cast: false }))
	const bezel = mat('#05070a', 0.4, 0.6)
	const cols = 6
	PROJECTS.forEach((_, i) => {
		const r = Math.floor(i / cols)
		const c = i % cols
		const x = (c - (cols - 1) / 2) * 1.02
		const y = r === 0 ? 3.05 : 1.72
		const g = new THREE.Group()
		g.position.set(x, y, WALL_Z + 0.08)
		g.add(mesh(new THREE.BoxGeometry(0.94, 1.22, 0.06), bezel))
		const on = i === 2
		g.add(mesh(new THREE.PlaneGeometry(0.86, 1.14), new THREE.MeshBasicMaterial({ map: textures[i], toneMapped: false, color: on ? '#ffffff' : '#a9b6c4' }), { pos: [0, 0, 0.031], cast: false }))
		if (on) {
			const frame = glowMat('#62d2ff', 6)
			for (const [w, h, px, py] of [[0.96, 0.012, 0, 0.616], [0.96, 0.012, 0, -0.616], [0.012, 1.24, 0.476, 0], [0.012, 1.24, -0.476, 0]]) g.add(mesh(new THREE.BoxGeometry(w, h, 0.01), frame, { pos: [px, py, 0.04], cast: false }))
		}
		scene.add(g)
	})
	// LED strips along the floor and over the wall
	const led = glowMat('#62d2ff', 3)
	scene.add(mesh(new THREE.BoxGeometry(7.2, 0.018, 0.02), led, { pos: [0, 3.8, WALL_Z + 0.12], cast: false }))
	scene.add(mesh(new THREE.BoxGeometry(7.2, 0.018, 0.02), led, { pos: [0, 1.0, WALL_Z + 0.12], cast: false }))
	// the wall of screens lights the room cool
	const wash = new THREE.PointLight('#5fb4ff', 5, 7, 2)
	wash.position.set(0, 2.4, WALL_Z + 1.4)
	scene.add(wash)
	spotOn(new THREE.Vector3(0, 1.2, 1.3), new THREE.Vector3(-1.5, 3.2, WALL_Z + 0.6), '#7cc4ff', 10, 0.6)
	deskSet(0, 0.55, { width: 2.6, monitors: true })
	camera.position.set(0.0, 1.8, 5.4)
	camera.lookAt(0.25, 2.05, -2.2)
}

// ============================================================
if (CONCEPT === 'gallery') {
	scene.fog = new THREE.FogExp2('#060607', 0.04)
	floor('#101011', 0.22)
	const wallM = mat('#0e0e0f', 0.85)
	const W = 2.7
	for (const sx of [-1, 1]) scene.add(mesh(new THREE.PlaneGeometry(60, 6), wallM, { pos: [sx * W, 3, -20], rot: [0, -sx * Math.PI / 2, 0], cast: false }))
	scene.add(mesh(new THREE.PlaneGeometry(2 * W, 60), mat('#09090a', 1), { pos: [0, 4.2, -20], rot: [Math.PI / 2, 0, 0], cast: false }))
	// ceiling track light running down the corridor
	for (let k = 0; k < 8; k++) {
		const z = -0.5 - k * 3.1
		scene.add(mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24), glowMat('#ffd7a6', 3), { pos: [0, 4.19, z], cast: false }))
		if (k < 5) spotOn(new THREE.Vector3(0, 0, z - 0.3), new THREE.Vector3(0, 4.1, z), '#ffcf96', 6, 0.42)
	}
	PROJECTS.forEach((_, i) => {
		const left = i % 2 === 0
		const k = Math.floor(i / 2)
		const z = -1.2 - k * 3.1 - (left ? 0 : 1.55)
		const sx = left ? -1 : 1
		const card = makeCard(i)
		card.position.set(sx * (W - 0.03), 1.75, z)
		card.rotation.y = -sx * (Math.PI / 2)
		scene.add(card)
		pictureLight(card)
		spotOn(new THREE.Vector3(sx * W, 1.6, z), new THREE.Vector3(sx * (W - 1.05), 3.05, z), '#ffc590', i === 2 ? 7 : 4, 0.5, k <= 1)
	})
	// a low black bench mid-corridor
	scene.add(mesh(new THREE.BoxGeometry(0.5, 0.42, 1.8), mat('#121213', 0.45), { pos: [0, 0.21, -8.2] }))
	// Haris stops in front of the third piece (left wall)
	standingHaris(-1.2, -4.3, Math.PI / 2)
	spotOn(new THREE.Vector3(-1.2, 1.3, -4.3), new THREE.Vector3(0.9, 3.6, -2.6), '#ffd9b0', 14, 0.4, true)
	spotOn(new THREE.Vector3(-1.2, 1.5, -4.3), new THREE.Vector3(-0.2, 2.6, -6.4), '#ffcf9d', 9, 0.45)
	camera.position.set(0.75, 1.65, 0.9)
	camera.fov = 40
	camera.updateProjectionMatrix()
	camera.lookAt(-0.55, 1.45, -10)
}

// ============================================================
if (CONCEPT === 'orbit') {
	scene.fog = new THREE.FogExp2('#050506', 0.05)
	// floor with a soft pool of light under the platform
	const fc = document.createElement('canvas')
	fc.width = fc.height = 512
	{
		const c = fc.getContext('2d')
		const g = c.createRadialGradient(256, 256, 0, 256, 256, 256)
		g.addColorStop(0, '#2a2017')
		g.addColorStop(0.35, '#120f0c')
		g.addColorStop(1, '#060607')
		c.fillStyle = g
		c.fillRect(0, 0, 512, 512)
	}
	const ft = new THREE.CanvasTexture(fc)
	ft.colorSpace = THREE.SRGBColorSpace
	scene.add(mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.35 }), { pos: [0, 0, 0.9], rot: [-Math.PI / 2, 0, 0], cast: false }))
	// platform with a glowing rim
	scene.add(mesh(new THREE.CylinderGeometry(1.75, 1.8, 0.08, 64), mat('#121214', 0.4, 0.3), { pos: [0, 0.04, 0.9] }))
	scene.add(mesh(new THREE.TorusGeometry(1.77, 0.012, 8, 128), glowMat('#ffb064', 4), { pos: [0, 0.08, 0.9], rot: [Math.PI / 2, 0, 0], cast: false }))
	const C = new THREE.Vector3(0, 0, 0.9)
	const R = 4.6
	PROJECTS.forEach((_, i) => {
		const a = -1.32 + (i / (PROJECTS.length - 1)) * 2.64
		const ring = R + Math.sin(i * 2.3) * 0.35
		const x = C.x + Math.sin(a) * ring
		const z = C.z - Math.cos(a) * ring
		const y = 2.05 + Math.sin(i * 1.7) * 0.45 + (i % 2) * 0.15
		const card = makeCard(i, { glow: 0.42, emissiveEdge: '#ffa04a' })
		card.position.set(x, y, z)
		card.lookAt(C.x, y - 0.25, C.z + 2.5)
		card.rotation.z += Math.sin(i * 1.3) * 0.05
		scene.add(card)
	})
	// drifting dust
	const n = 700
	const pos = new Float32Array(n * 3)
	for (let i = 0; i < n; i++) {
		const r = 1 + Math.random() * 7
		const t = Math.random() * Math.PI * 2
		pos[i * 3] = Math.cos(t) * r
		pos[i * 3 + 1] = 0.3 + Math.random() * 4.2
		pos[i * 3 + 2] = 0.9 + Math.sin(t) * r
	}
	const pg = new THREE.BufferGeometry()
	pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
	scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: '#ffcf96', size: 0.018, transparent: true, opacity: 0.55, depthWrite: false })))
	spotOn(new THREE.Vector3(0, 0.8, 0.9), new THREE.Vector3(0.4, 5.5, 2.4), '#ffd2a1', 22, 0.5, true)
	deskSet(0, 0.35)
	camera.position.set(0.3, 2.75, 6.6)
	camera.fov = 44
	camera.updateProjectionMatrix()
	camera.lookAt(0, 1.85, -2.3)
}

// ============================================================
// Combined: the control-room layout (long desk, two monitors, a 2 x 6 wall) with the
// warm studio's printed cards and brass picture lights. ?hover=N shows one card hovered.
if (CONCEPT === 'grid') {
	floor()
	slatWall(WALL_Z)
	const W = 0.92
	const H = 1.23
	const cols = 6
	const hovering = HOVER >= 0
	PROJECTS.forEach((_, i) => {
		const r = Math.floor(i / cols)
		const c = i % cols
		const x = (c - (cols - 1) / 2) * 1.16
		const y = r === 0 ? 3.28 : 1.74
		const isHover = i === HOVER
		// hovered: brighter light, card lifts toward you; everything else steps back
		const level = !hovering ? 1 : isHover ? 1.75 : 0.4
		const card = makeCard(i, { w: W, h: H, glow: !hovering ? 0.14 : isHover ? 0.2 : 0.06 })
		card.position.set(x, y, WALL_Z + 0.06 + (isHover ? 0.09 : 0))
		if (isHover) card.scale.setScalar(1.035)
		scene.add(card)
		pictureLight(card, H, { len: 0.56, glow: 6 * Math.min(level, 1.6), lift: 0.17 })
		spotOn(new THREE.Vector3(x, y - 0.08, WALL_Z), new THREE.Vector3(x, y + H / 2 + 0.42, WALL_Z + 0.95), '#ffc590', 3.2 * level, 0.48, i === 2 || i === 3 || isHover)
		// soft cone of light under each lamp, stronger on the hovered card
		const cone = new THREE.Mesh(
			new THREE.ConeGeometry(0.62, 1.45, 40, 1, true),
			new THREE.ShaderMaterial({
				transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
				uniforms: { uColor: { value: new THREE.Color('#ffae5e') }, uStrength: { value: 0.11 * level } },
				vertexShader: 'varying float vH; varying vec3 vN; varying vec3 vV; void main(){ vH = uv.y; vec4 wp = modelMatrix * vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }',
				fragmentShader: 'uniform vec3 uColor; uniform float uStrength; varying float vH; varying vec3 vN; varying vec3 vV; void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.6); gl_FragColor = vec4(uColor, e * pow(vH, 1.8) * uStrength); }',
			}),
		)
		cone.position.set(x, y + H / 2 + 0.15 - 0.72, WALL_Z + 0.28)
		cone.rotation.x = -0.12
		scene.add(cone)
	})
	deskSet(0, 0.55, { width: 2.6, monitors: true })
	camera.position.set(0.0, 1.95, 5.6)
	camera.lookAt(0.2, 2.25, -2.2)
	// mockup only: draw the mouse pointer over the hovered card
	if (hovering) {
		camera.updateMatrixWorld()
		const c = HOVER % cols
		const r = Math.floor(HOVER / cols)
		const v = new THREE.Vector3((c - (cols - 1) / 2) * 1.16 + 0.12, (r === 0 ? 3.28 : 1.74) - 0.18, WALL_Z + 0.15).project(camera)
		const el = document.createElement('div')
		el.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10 19z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>'
		el.style.cssText = `position:fixed;z-index:6;left:${(v.x * 0.5 + 0.5) * innerWidth}px;top:${(-v.y * 0.5 + 0.5) * innerHeight}px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.5))`
		document.body.appendChild(el)
	}
}

// ============================================================
// Current studio wall (one row of large cards) + the control-room desk with two monitors.
if (CONCEPT === 'row') {
	floor()
	slatWall(WALL_Z)
	const hovering = HOVER >= 0
	const beamVS = 'varying float vH; varying vec3 vN; varying vec3 vV; void main(){ vH = uv.y; vec4 wp = modelMatrix * vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }'
	const beamFS = 'uniform vec3 uColor; uniform float uStrength; varying float vH; varying vec3 vN; varying vec3 vV; void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.6); gl_FragColor = vec4(uColor, e * pow(vH, 1.8) * uStrength); }'
	PROJECTS.forEach((_, i) => {
		const x = (i - 2) * 1.85
		const y = 2.35
		const isHover = i === HOVER
		const level = !hovering ? 1 : isHover ? 1.75 : 0.4
		const card = makeCard(i, { glow: !hovering ? 0.14 : isHover ? 0.2 : 0.06 })
		card.position.set(x, y, WALL_Z + 0.06 + (isHover ? 0.09 : 0))
		if (isHover) card.scale.setScalar(1.035)
		scene.add(card)
		pictureLight(card, 1.44, { glow: 6 * Math.min(level, 1.6) })
		spotOn(new THREE.Vector3(x, y - 0.1, WALL_Z), new THREE.Vector3(x, y + 1.17, WALL_Z + 1.05), '#ffc590', 3.6 * level, 0.5, i >= 1 && i <= 4)
		const cone = new THREE.Mesh(
			new THREE.ConeGeometry(0.85, 1.9, 40, 1, true),
			new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uColor: { value: new THREE.Color('#ffae5e') }, uStrength: { value: 0.12 * level } }, vertexShader: beamVS, fragmentShader: beamFS }),
		)
		cone.position.set(x, y + 0.72 + 0.17 - 0.95, WALL_Z + 0.32)
		cone.rotation.x = -0.12
		scene.add(cone)
	})
	deskSet(0, 0.55, { width: 2.6, monitors: true })
	camera.position.set(0.1, 1.72, 5.1)
	camera.lookAt(-0.9, 1.68, -2.2)
	if (hovering) {
		camera.updateMatrixWorld()
		const v = new THREE.Vector3((HOVER - 2) * 1.85 + 0.15, 2.15, WALL_Z + 0.2).project(camera)
		const el = document.createElement('div')
		el.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10 19z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>'
		el.style.cssText = `position:fixed;z-index:6;left:${(v.x * 0.5 + 0.5) * innerWidth}px;top:${(-v.y * 0.5 + 0.5) * innerHeight}px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.5))`
		document.body.appendChild(el)
	}
}

// ============================================================
// Lights-down room: every picture light rests low; the hovered (or tapped) card switches on.
// Feature flags (?f=) show extra ideas: plaque, dust, look, filter.
if (CONCEPT === 'dim') {
	floor()
	slatWall(WALL_Z)
	scene.children.filter((o) => o.isHemisphereLight).forEach((h) => (h.intensity = 0.22))
	key.intensity = 0.18
	const filtering = FEAT.has('filter')
	// filter idea: the matching cards slide to the front of the wall
	const order = PROJECTS.map((_, i) => i)
	if (filtering) order.sort((a, b) => (CATEGORY[PROJECTS[b].card] === 'voice') - (CATEGORY[PROJECTS[a].card] === 'voice'))
	const beamVS = 'varying float vH; varying vec3 vN; varying vec3 vV; void main(){ vH = uv.y; vec4 wp = modelMatrix * vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }'
	const beamFS = 'uniform vec3 uColor; uniform float uStrength; varying float vH; varying vec3 vN; varying vec3 vV; void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.6); gl_FragColor = vec4(uColor, e * pow(vH, 1.8) * uStrength); }'
	const slotX = (slot) => (slot - (MOBILE ? 0 : 2)) * 1.85
	let hoverX = 0
	order.forEach((i, slot) => {
		const p = PROJECTS[i]
		const x = slotX(slot)
		const y = 2.35
		const isHover = i === HOVER
		const match = filtering && CATEGORY[p.card] === 'voice'
		// resting: low light; hovered: full; filter: matches at medium, the rest almost off
		const level = isHover ? 1.9 : filtering ? (match ? 0.85 : 0.1) : 0.26
		if (isHover) hoverX = x
		const card = makeCard(i, { glow: isHover ? 0.2 : filtering ? (match ? 0.12 : 0.015) : 0.035 })
		card.position.set(x, y, WALL_Z + 0.06 + (isHover ? 0.09 : 0))
		if (isHover) card.scale.setScalar(1.035)
		scene.add(card)
		pictureLight(card, 1.44, { glow: isHover ? 9 : filtering ? (match ? 5 : 0.35) : 1.1 })
		spotOn(new THREE.Vector3(x, y - 0.1, WALL_Z), new THREE.Vector3(x, y + 1.17, WALL_Z + 1.05), '#ffc590', 3.6 * level, 0.5, isHover || (filtering && match && slot < 4))
		const cone = new THREE.Mesh(
			new THREE.ConeGeometry(0.85, 1.9, 40, 1, true),
			new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uColor: { value: new THREE.Color('#ffae5e') }, uStrength: { value: 0.12 * level } }, vertexShader: beamVS, fragmentShader: beamFS }),
		)
		cone.position.set(x, y + 0.72 + 0.17 - 0.95, WALL_Z + 0.32)
		cone.rotation.x = -0.12
		scene.add(cone)

		if (isHover && FEAT.has('dust')) {
			// dust drifting in the beam
			const n = 200
			const pos = new Float32Array(n * 3)
			for (let k = 0; k < n; k++) {
				const t = Math.pow(Math.random(), 0.7)
				const r = 0.78 * t * Math.sqrt(Math.random())
				const a = Math.random() * Math.PI * 2
				pos[k * 3] = x + Math.cos(a) * r
				pos[k * 3 + 1] = y + 0.89 - t * 1.75
				pos[k * 3 + 2] = Math.max(WALL_Z + 0.12, WALL_Z + 0.32 + Math.sin(a) * r * 0.6)
			}
			const g = new THREE.BufferGeometry()
			g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
			scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffc27a', size: 0.008, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })))
		}
		if (isHover && FEAT.has('plaque')) {
			// museum plaque under the card: name, the headline number, a call to open
			const [name, num, label] = DETAIL[p.card]
			const cv = document.createElement('canvas')
			cv.width = 760
			cv.height = 230
			const c = cv.getContext('2d')
			c.fillStyle = '#ece6da'
			c.fillRect(0, 0, 760, 230)
			c.fillStyle = '#1b1c1d'
			c.font = '700 44px Manrope'
			c.fillText(name, 40, 72)
			c.fillStyle = '#b8642a'
			c.font = '800 58px Manrope'
			c.fillText(num, 40, 150)
			const w = c.measureText(num).width
			c.fillStyle = '#4a4c4e'
			c.font = '500 30px Manrope'
			c.fillText(label, 60 + w, 146)
			c.fillStyle = '#1b1c1d'
			c.font = '700 24px Manrope'
			c.fillText('CLICK TO OPEN  \u2192', 40, 200)
			const t = new THREE.CanvasTexture(cv)
			t.colorSpace = THREE.SRGBColorSpace
			scene.add(mesh(new THREE.BoxGeometry(1.0, 0.3, 0.014), mat('#cfc8bb', 0.6), { pos: [x, y - 0.98, WALL_Z + 0.07] }))
			scene.add(mesh(new THREE.PlaneGeometry(1.0, 0.3), new THREE.MeshStandardMaterial({ map: t, roughness: 0.7, emissive: '#fff', emissiveMap: t, emissiveIntensity: 0.3 }), { pos: [x, y - 0.98, WALL_Z + 0.0775], cast: false }))
		}
	})

	// look idea: the right monitor mirrors the card you are looking at
	let rightTex = null
	if (FEAT.has('look') && HOVER >= 0) {
		const p = PROJECTS[HOVER]
		const [name, num, label] = DETAIL[p.card]
		const cv = document.createElement('canvas')
		cv.width = 660
		cv.height = 420
		const c = cv.getContext('2d')
		c.fillStyle = '#16181c'
		c.fillRect(0, 0, 660, 420)
		c.fillStyle = '#1f2228'
		c.fillRect(0, 0, 660, 34)
		c.drawImage(cardCanvas(p), 24, 50, 270, 360)
		c.fillStyle = '#28c840'
		c.beginPath()
		c.arc(326, 86, 7, 0, Math.PI * 2)
		c.fill()
		c.fillStyle = '#9aa3ad'
		c.font = '600 20px Manrope'
		c.fillText('LIVE IN PRODUCTION', 342, 93)
		c.fillStyle = '#f3efe8'
		c.font = '700 30px Manrope'
		const words = name.split(' ')
		let line = ''
		let ly = 150
		words.forEach((wd) => {
			if (c.measureText(line + wd).width > 290) {
				c.fillText(line.trim(), 318, ly)
				line = ''
				ly += 38
			}
			line += wd + ' '
		})
		c.fillText(line.trim(), 318, ly)
		c.fillStyle = '#ffb46a'
		c.font = '800 56px Manrope'
		c.fillText(num, 318, ly + 80)
		c.fillStyle = '#9aa3ad'
		c.font = '500 22px Manrope'
		c.fillText(label, 318, ly + 114)
		rightTex = new THREE.CanvasTexture(cv)
		rightTex.colorSpace = THREE.SRGBColorSpace
	}
	deskSet(0, 0.55, { width: 2.6, monitors: true, rightTex })
	if (FEAT.has('look') && HOVER >= 0 && lastHead) {
		// Haris glances up at the card you are on
		const dx = hoverX - 0.02
		const dz = 1.3 - (WALL_Z + 0.1)
		lastHead.rotation.set(-0.18, -Math.max(-1.0, Math.min(1.0, Math.atan2(dx, dz) * 1.5)), 0)
	}

	if (filtering) {
		const bar = document.createElement('div')
		bar.style.cssText = 'position:fixed;z-index:6;top:132px;left:48px;display:flex;gap:8px;font:600 13px/1 Manrope,sans-serif'
		;['All work', 'Automation', 'Voice and chat', 'RAG', 'CRM', 'Lead generation'].forEach((t) => {
			const on = t === 'Voice and chat'
			const b = document.createElement('span')
			b.textContent = t
			b.style.cssText = `height:36px;padding:0 16px;display:inline-flex;align-items:center;border-radius:999px;${on ? 'background:#f3efe8;color:#111' : 'border:1px solid rgba(243,239,232,.18);color:#c9c3b8;background:rgba(255,255,255,.03)'}`
			bar.appendChild(b)
		})
		document.body.appendChild(bar)
		document.querySelector('.controls span b').textContent = '01'
		document.querySelector('.controls span').lastChild.textContent = ' / 4'
	}

	if (MOBILE) document.querySelector('.controls span b').textContent = '01'
	if (MOBILE) {
		const x = HOVER >= 0 ? slotX(order.indexOf(HOVER)) : 0
		camera.fov = 50
		camera.position.set(x + 0.15, 1.7, 6.3)
		camera.updateProjectionMatrix()
		camera.lookAt(x, 1.5, -2)
	} else {
		camera.position.set(0.1, 1.72, 5.1)
		camera.lookAt(-0.9, 1.68, -2.2)
	}
	if (HOVER >= 0 && !MOBILE) {
		camera.updateMatrixWorld()
		const v = new THREE.Vector3(hoverX + 0.15, 2.15, WALL_Z + 0.2).project(camera)
		const el = document.createElement('div')
		el.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10 19z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>'
		el.style.cssText = `position:fixed;z-index:6;left:${(v.x * 0.5 + 0.5) * innerWidth}px;top:${(-v.y * 0.5 + 0.5) * innerHeight}px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.5))`
		document.body.appendChild(el)
	}
	if (MOBILE && HOVER >= 0) {
		camera.updateMatrixWorld()
		const v = new THREE.Vector3(slotX(order.indexOf(HOVER)), 2.2, WALL_Z + 0.2).project(camera)
		const el = document.createElement('div')
		el.style.cssText = `position:fixed;z-index:6;left:${(v.x * 0.5 + 0.5) * innerWidth - 22}px;top:${(-v.y * 0.5 + 0.5) * innerHeight - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.28);box-shadow:0 0 0 2px rgba(255,255,255,.7)`
		document.body.appendChild(el)
	}
}

// ============================================================
// Bright themes. ?theme=white (gallery: white slats, black picture lights, warm-white light)
// or ?theme=cream (the site's cream, oak frames, brass lights, golden light). ?hover=N lights one card.
if (CONCEPT === 'light') {
	const cream = QS.get('theme') === 'cream'
	const T = cream
		? { bg: '#ece6da', wall: '#efe9de', slat: '#e6dfd2', floor: '#cdb79a', frame: '#9c7448', lampBody: '#b8894a', glow: '#ffcf8a', light: '#ffc98a', desk: '#7a5232' }
		: { bg: '#eeeeec', wall: '#f4f4f2', slat: '#ebebe8', floor: '#d9d6d0', frame: '#1c1c1d', lampBody: '#18181a', glow: '#fff1dc', light: '#ffe6c4', desk: '#a6784e' }
	document.documentElement.classList.add('theme-light')
	if (cream) document.documentElement.classList.add('theme-cream')
	scene.background = new THREE.Color(T.bg)
	scene.fog = new THREE.FogExp2(T.bg, 0.035)
	BLOOM = [0.22, 0.4, 1.15]
	renderer.toneMappingExposure = 0.95
	scene.children.filter((o) => o.isHemisphereLight).forEach((h) => {
		h.color.set('#ffffff')
		h.groundColor.set(cream ? '#cbb89c' : '#bdbab4')
		h.intensity = 1.25
	})
	key.color.set(cream ? '#fff1dd' : '#ffffff')
	key.intensity = 0.95
	key.position.set(-4, 5, 6)
	key.castShadow = true
	key.shadow.mapSize.set(2048, 2048)
	Object.assign(key.shadow.camera, { left: -6, right: 6, top: 5, bottom: -2, near: 0.5, far: 20 })
	key.shadow.bias = -0.0004
	key.shadow.radius = 6

	// floor and slatted wall in the theme colours
	scene.add(mesh(new THREE.PlaneGeometry(90, 90), mat(T.floor, 0.55), { rot: [-Math.PI / 2, 0, 0], cast: false }))
	scene.add(mesh(new THREE.PlaneGeometry(80, 12), mat(T.wall, 0.9), { pos: [6, 6, WALL_Z - 0.06], cast: false }))
	if (cream) {
		// shallow slats: texture without the deep comb shadows
		const n = 370
		const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 12, 0.012), mat(T.slat, 0.85), n)
		slats.receiveShadow = true
		const o = new THREE.Object3D()
		for (let i = 0; i < n; i++) {
			o.position.set(-12 + i * 0.108, 6, WALL_Z - 0.05)
			o.updateMatrix()
			slats.setMatrixAt(i, o.matrix)
		}
		scene.add(slats)
	} else {
		// white gallery: a smooth painted wall with a slim skirting board
		scene.add(mesh(new THREE.BoxGeometry(80, 0.09, 0.02), mat('#e4e3df', 0.6), { pos: [6, 0.045, WALL_Z - 0.04], cast: false }))
	}

	const hovering = HOVER >= 0
	const slotX = (slot) => (slot - (MOBILE ? 0 : 2)) * 1.85
	let hoverX = 0
	// warm pool of light painted on the wall: on a bright wall this is what reads as "lit"
	const poolCv = document.createElement('canvas')
	poolCv.width = 256
	poolCv.height = 320
	{
		const c = poolCv.getContext('2d')
		c.translate(128, 120)
		c.scale(1, 1.25)
		const g = c.createRadialGradient(0, 0, 0, 0, 0, 128)
		g.addColorStop(0, cream ? 'rgba(255,170,80,1)' : 'rgba(255,184,110,1)')
		g.addColorStop(0.45, cream ? 'rgba(255,160,70,0.45)' : 'rgba(255,176,100,0.42)')
		g.addColorStop(1, 'rgba(255,150,60,0)')
		c.fillStyle = g
		c.fillRect(-128, -128, 256, 256)
	}
	const poolTex = new THREE.CanvasTexture(poolCv)
	poolTex.colorSpace = THREE.SRGBColorSpace
	PROJECTS.forEach((_, i) => {
		const x = slotX(i)
		const y = 2.35
		const isHover = i === HOVER
		scene.add(mesh(new THREE.PlaneGeometry(3.1, 3.5), new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, toneMapped: false, opacity: isHover ? 0.85 : hovering ? 0 : 0.14 }), { pos: [x, y + 0.3, WALL_Z - 0.035], cast: false }))
		// resting: soft even light; hovered: a stronger warm spot pools on that card
		const level = isHover ? 1.35 : hovering ? 0.42 : 0.62
		if (isHover) hoverX = x
		const card = makeCard(i, { glow: isHover ? 0.02 : 0 })
		// thin frame behind the print
		card.add(mesh(new THREE.BoxGeometry(1.08 + 0.05, 1.44 + 0.05, 0.03), mat(T.frame, cream ? 0.55 : 0.4, cream ? 0 : 0.2), { pos: [0, 0, -0.012] }))
		card.position.set(x, y, WALL_Z + 0.06 + (isHover ? 0.09 : 0))
		if (isHover) card.scale.setScalar(1.035)
		scene.add(card)
		// picture light in the theme metal, glow tuned for a bright room
		const body = mat(T.lampBody, cream ? 0.3 : 0.4, cream ? 0.9 : 0.5)
		const lamp = new THREE.Group()
		lamp.position.set(0, 0.72 + 0.2, 0.12)
		lamp.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.62, 18), body, { rot: [0, 0, Math.PI / 2] }))
		lamp.add(mesh(new THREE.BoxGeometry(0.56, 0.008, 0.03), glowMat(T.glow, isHover ? 3.2 : hovering ? 0.8 : 1.4), { pos: [0, -0.032, 0.004], cast: false }))
		lamp.add(limb([0, 0, -0.12], [0, 0, -0.01], 0.011, body))
		card.add(lamp)
		spotOn(new THREE.Vector3(x, y - 0.1, WALL_Z), new THREE.Vector3(x, y + 1.17, WALL_Z + 1.05), T.light, 5 * level, 0.5, isHover || i === 1 || i === 3)
	})
	deskSet(0, 0.55, { width: 2.6, monitors: true })
	// recolour the desk top to the theme wood
	scene.traverse((m) => {
		if (m.isMesh && m.material && m.material.color && m.material.color.getHexString() === '5b3a22') m.material = mat(T.desk, 0.5)
	})

	if (MOBILE) {
		document.querySelector('.controls span b').textContent = '01'
		const x = HOVER >= 0 ? slotX(HOVER) : 0
		camera.fov = 50
		camera.position.set(x + 0.15, 1.7, 6.3)
		camera.updateProjectionMatrix()
		camera.lookAt(x, 1.5, -2)
	} else {
		camera.position.set(0.1, 1.72, 5.1)
		camera.lookAt(-0.9, 1.68, -2.2)
	}
	if (hovering) {
		camera.updateMatrixWorld()
		const v = new THREE.Vector3(hoverX + (MOBILE ? 0 : 0.15), MOBILE ? 2.2 : 2.15, WALL_Z + 0.2).project(camera)
		const el = document.createElement('div')
		el.innerHTML = MOBILE ? '' : '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10 19z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>'
		el.style.cssText = MOBILE
			? `position:fixed;z-index:6;left:${(v.x * 0.5 + 0.5) * innerWidth - 22}px;top:${(-v.y * 0.5 + 0.5) * innerHeight - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,.18);box-shadow:0 0 0 2px rgba(0,0,0,.55)`
			: `position:fixed;z-index:6;left:${(v.x * 0.5 + 0.5) * innerWidth}px;top:${(-v.y * 0.5 + 0.5) * innerHeight}px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.35))`
		document.body.appendChild(el)
	}
}

// ============================================================
// Day / night: the cream studio by day, the dark room by night, with a window that shows the sky.
// ?mode=day | dusk | night. ?hover=N lights one card. The window takes the first slot on the wall.
if (CONCEPT === 'daynight') {
	const mode = QS.get('mode') || 'day'
	const day = mode === 'day'
	const night = mode === 'night'
	const dusk = mode === 'dusk'
	const T = {
		day: { bg: '#ece6da', fog: 0.035, wall: '#efe9de', slat: '#e6dfd2', slatDepth: 0.012, floor: '#cdb79a', hemi: ['#ffffff', '#cbb89c', 1.25], key: ['#fff1dd', 0.95], exposure: 0.95, bloom: [0.22, 0.4, 1.15] },
		dusk: { bg: '#241d19', fog: 0.04, wall: '#4a3f35', slat: '#54473b', slatDepth: 0.03, floor: '#3a2f26', hemi: ['#ffb27a', '#2a2018', 0.55], key: ['#ff9a5a', 0.75], exposure: 1, bloom: [0.45, 0.6, 0.95] },
		night: { bg: '#060607', fog: 0.045, wall: '#050505', slat: '#121213', slatDepth: 0.05, floor: '#0d0d0e', hemi: ['#3a3530', '#050505', 0.22], key: ['#9fb4ff', 0.12], exposure: 1, bloom: [0.55, 0.6, 0.9] },
	}[mode]
	if (day) document.documentElement.classList.add('theme-light', 'theme-cream')
	scene.background = new THREE.Color(T.bg)
	scene.fog = new THREE.FogExp2(T.bg, T.fog)
	BLOOM = T.bloom
	renderer.toneMappingExposure = T.exposure
	scene.children.filter((o) => o.isHemisphereLight).forEach((h) => {
		h.color.set(T.hemi[0])
		h.groundColor.set(T.hemi[1])
		h.intensity = T.hemi[2]
	})
	key.color.set(T.key[0])
	key.intensity = T.key[1]
	// the sun (or moon) comes in from the window side
	key.position.set(-7, 5, 3)
	key.castShadow = !night
	key.shadow.mapSize.set(2048, 2048)
	Object.assign(key.shadow.camera, { left: -7, right: 7, top: 5, bottom: -2, near: 0.5, far: 24 })
	key.shadow.bias = -0.0004

	scene.add(mesh(new THREE.PlaneGeometry(90, 90), mat(T.floor, day ? 0.55 : 0.42), { rot: [-Math.PI / 2, 0, 0], cast: false }))
	scene.add(mesh(new THREE.PlaneGeometry(80, 12), mat(T.wall, 0.95), { pos: [6, 6, WALL_Z - 0.07], cast: false }))
	const WIN_X = -3.7
	const WIN_W = 1.5
	const WIN_H = 2.1
	const WIN_Y = 2.4
	const n = 370
	const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 12, T.slatDepth), mat(T.slat, day ? 0.85 : 0.62), n)
	slats.receiveShadow = true
	const o = new THREE.Object3D()
	let k = 0
	for (let i = 0; i < n; i++) {
		const x = -12 + i * 0.108
		if (Math.abs(x - WIN_X) < WIN_W / 2 + 0.12) continue // no slats behind the window
		o.position.set(x, 6, WALL_Z - 0.06 + T.slatDepth / 2)
		o.updateMatrix()
		slats.setMatrixAt(k++, o.matrix)
	}
	slats.count = k
	scene.add(slats)

	// ---------- the window ----------
	const sky = document.createElement('canvas')
	sky.width = 520
	sky.height = 728
	{
		const c = sky.getContext('2d')
		const W = 520
		const H = 728
		const g = c.createLinearGradient(0, 0, 0, H)
		if (day) {
			g.addColorStop(0, '#6fa8e2')
			g.addColorStop(0.65, '#bcd9f0')
			g.addColorStop(1, '#e6f0f5')
		} else if (dusk) {
			g.addColorStop(0, '#2a2f5e')
			g.addColorStop(0.45, '#b4566a')
			g.addColorStop(0.75, '#f08a4b')
			g.addColorStop(1, '#ffc57a')
		} else {
			g.addColorStop(0, '#03060f')
			g.addColorStop(0.7, '#0d1834')
			g.addColorStop(1, '#1b2a4d')
		}
		c.fillStyle = g
		c.fillRect(0, 0, W, H)
		const glow = (x, y, r, col) => {
			const gg = c.createRadialGradient(x, y, 0, x, y, r)
			gg.addColorStop(0, col)
			gg.addColorStop(1, 'rgba(255,255,255,0)')
			c.fillStyle = gg
			c.fillRect(x - r, y - r, r * 2, r * 2)
		}
		if (day) {
			glow(350, 190, 190, 'rgba(255,250,225,0.95)')
			c.fillStyle = '#fffbea'
			c.beginPath()
			c.arc(350, 190, 46, 0, Math.PI * 2)
			c.fill()
			c.fillStyle = 'rgba(255,255,255,0.75)'
			;[[110, 300, 70], [170, 288, 52], [60, 318, 46], [300, 420, 60], [350, 410, 44]].forEach(([x, y, r]) => {
				c.beginPath()
				c.ellipse(x, y, r, r * 0.42, 0, 0, Math.PI * 2)
				c.fill()
			})
		} else if (dusk) {
			glow(290, 610, 260, 'rgba(255,190,110,0.9)')
			c.fillStyle = '#ffd08a'
			c.beginPath()
			c.arc(290, 610, 58, 0, Math.PI * 2)
			c.fill()
		} else {
			for (let i = 0; i < 160; i++) {
				const r = Math.random() * 1.6 + 0.3
				c.fillStyle = `rgba(255,255,255,${0.35 + Math.random() * 0.65})`
				c.beginPath()
				c.arc(Math.random() * W, Math.random() * H * 0.72, r, 0, Math.PI * 2)
				c.fill()
			}
			glow(340, 170, 130, 'rgba(210,225,255,0.32)')
			// crescent: a full moon with an offset disc cut out of it, so no dark disc shows
			const mc = document.createElement('canvas')
			mc.width = mc.height = 120
			const m = mc.getContext('2d')
			m.fillStyle = '#f4f1e6'
			m.beginPath()
			m.arc(60, 60, 44, 0, Math.PI * 2)
			m.fill()
			m.globalCompositeOperation = 'destination-out'
			m.beginPath()
			m.arc(80, 46, 40, 0, Math.PI * 2)
			m.fill()
			c.drawImage(mc, 280, 110)
		}
		// city skyline along the bottom, lit windows at dusk and night
		const sky_col = day ? '#a9bccb' : dusk ? '#3b2c3d' : '#070b17'
		let x = 0
		let seed = 7
		const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
		while (x < W) {
			const bw = 34 + rnd() * 52
			const bh = 90 + rnd() * 170
			c.fillStyle = sky_col
			c.fillRect(x, H - bh, bw - 4, bh)
			if (!day) {
				for (let wy = H - bh + 10; wy < H - 8; wy += 16) {
					for (let wx = x + 6; wx < x + bw - 12; wx += 11) {
						if (rnd() < (night ? 0.42 : 0.25)) {
							c.fillStyle = rnd() < 0.8 ? 'rgba(255,205,120,0.9)' : 'rgba(170,210,255,0.85)'
							c.fillRect(wx, wy, 5, 7)
						}
					}
				}
			}
			x += bw
		}
	}
	const skyTex = new THREE.CanvasTexture(sky)
	skyTex.colorSpace = THREE.SRGBColorSpace
	const win = new THREE.Group()
	win.position.set(WIN_X, WIN_Y, WALL_Z - 0.04)
	win.add(mesh(new THREE.PlaneGeometry(WIN_W, WIN_H), new THREE.MeshBasicMaterial({ map: skyTex, toneMapped: false, color: day ? '#ffffff' : dusk ? '#f2e2d6' : '#d8def0' }), { pos: [0, 0, -0.02], cast: false }))
	const oak = mat('#9c7448', 0.55)
	const F = 0.07
	// frame, deep reveal and a sill
	for (const [w, h, x2, y2] of [[WIN_W + F * 2, F, 0, WIN_H / 2 + F / 2], [WIN_W + F * 2, F, 0, -WIN_H / 2 - F / 2], [F, WIN_H, WIN_W / 2 + F / 2, 0], [F, WIN_H, -WIN_W / 2 - F / 2, 0]]) {
		win.add(mesh(new THREE.BoxGeometry(w, h, 0.12), oak, { pos: [x2, y2, 0] }))
	}
	// mullions: 2 columns, 3 rows
	win.add(mesh(new THREE.BoxGeometry(0.035, WIN_H, 0.06), oak, { pos: [0, 0, -0.02] }))
	for (const yy of [-WIN_H / 6, WIN_H / 6]) win.add(mesh(new THREE.BoxGeometry(WIN_W, 0.035, 0.06), oak, { pos: [0, yy, -0.02] }))
	win.add(mesh(new THREE.BoxGeometry(WIN_W + 0.3, 0.05, 0.22), oak, { pos: [0, -WIN_H / 2 - F - 0.02, 0.06] }))
	// inside reveal so the window reads as an opening
	const reveal = mat(T.wall, 0.9)
	for (const [w, h, x2, y2] of [[WIN_W, 0.02, 0, WIN_H / 2], [WIN_W, 0.02, 0, -WIN_H / 2], [0.02, WIN_H, WIN_W / 2, 0], [0.02, WIN_H, -WIN_W / 2, 0]]) {
		win.add(mesh(new THREE.BoxGeometry(w, h, 0.12), reveal, { pos: [x2, y2, -0.06], cast: false }))
	}
	scene.add(win)

	// light falling through the window onto the floor (sun by day, warm low sun at dusk, cool moon at night)
	{
		const cv = document.createElement('canvas')
		cv.width = cv.height = 256
		const c = cv.getContext('2d')
		const col = day ? '255,236,196' : dusk ? '255,150,80' : '150,180,255'
		const g = c.createLinearGradient(0, 0, 0, 256)
		g.addColorStop(0, `rgba(${col},0.95)`)
		g.addColorStop(1, `rgba(${col},0)`)
		c.fillStyle = g
		c.fillRect(0, 0, 256, 256)
		c.fillStyle = 'rgba(0,0,0,1)'
		c.globalCompositeOperation = 'destination-out'
		c.fillRect(124, 0, 8, 256)
		c.fillRect(0, 82, 256, 7)
		c.fillRect(0, 168, 256, 7)
		const tex = new THREE.CanvasTexture(cv)
		const geo = new THREE.PlaneGeometry(1, 1)
		// skew the quad: near the wall it is window-width, it stretches into the room toward the right
		const P = geo.attributes.position
		const corners = [[WIN_X - 0.55, WALL_Z + 0.05], [WIN_X + 0.75, WALL_Z + 0.05], [WIN_X + 0.55, WALL_Z + 1.9], [WIN_X + 2.0, WALL_Z + 1.9]]
		;[[0, 0], [1, 1], [2, 2], [3, 3]].forEach(([vi, ci]) => P.setXYZ(vi, corners[ci][0], 0.003, corners[ci][1]))
		P.needsUpdate = true
		geo.computeVertexNormals()
		const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: day ? 0.42 : dusk ? 0.32 : 0.1, side: THREE.DoubleSide, blending: day ? THREE.NormalBlending : THREE.AdditiveBlending }))
		scene.add(m)
	}

	// ---------- cards (one slot right of the window) ----------
	const hovering = HOVER >= 0
	const slotX = (slot) => (slot - (MOBILE ? 0 : 2)) * 1.85 + (MOBILE ? WIN_X : 0)
	const beamVS = 'varying float vH; varying vec3 vN; varying vec3 vV; void main(){ vH = uv.y; vec4 wp = modelMatrix * vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }'
	const beamFS = 'uniform vec3 uColor; uniform float uStrength; varying float vH; varying vec3 vN; varying vec3 vV; void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.6); gl_FragColor = vec4(uColor, e * pow(vH, 1.8) * uStrength); }'
	let hoverX = 0
	PROJECTS.forEach((_, i) => {
		const x = slotX(i + 1)
		const y = 2.35
		const isHover = i === HOVER
		if (isHover) hoverX = x
		// day: lamps mostly off (the sun lights the room); dusk: warming up; night: every lamp on
		const level = isHover ? (day ? 1.35 : 1.8) : day ? (hovering ? 0.25 : 0.3) : dusk ? 0.55 : hovering ? 0.45 : 0.85
		const card = makeCard(i, { glow: day ? (isHover ? 0.02 : 0) : isHover ? 0.2 : 0.06 + 0.06 * level })
		card.add(mesh(new THREE.BoxGeometry(1.08 + 0.05, 1.44 + 0.05, 0.03), mat('#9c7448', 0.55), { pos: [0, 0, -0.012] }))
		card.position.set(x, y, WALL_Z + 0.06 + (isHover ? 0.09 : 0))
		if (isHover) card.scale.setScalar(1.035)
		scene.add(card)
		const body = mat('#b8894a', 0.3, 0.9)
		const lamp = new THREE.Group()
		lamp.position.set(0, 0.92, 0.12)
		lamp.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.62, 18), body, { rot: [0, 0, Math.PI / 2] }))
		lamp.add(mesh(new THREE.BoxGeometry(0.56, 0.008, 0.03), glowMat('#ffc98a', (day ? 2.2 : 6) * level), { pos: [0, -0.032, 0.004], cast: false }))
		lamp.add(limb([0, 0, -0.12], [0, 0, -0.01], 0.011, body))
		card.add(lamp)
		spotOn(new THREE.Vector3(x, y - 0.1, WALL_Z), new THREE.Vector3(x, y + 1.17, WALL_Z + 1.05), '#ffc590', (day ? 5 : 3.6) * level, 0.5, isHover || i === 1 || i === 2)
		if (!day) {
			const cone = new THREE.Mesh(
				new THREE.ConeGeometry(0.85, 1.9, 40, 1, true),
				new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uColor: { value: new THREE.Color('#ffae5e') }, uStrength: { value: 0.12 * level } }, vertexShader: beamVS, fragmentShader: beamFS }),
			)
			cone.position.set(x, y - 0.06, WALL_Z + 0.32)
			cone.rotation.x = -0.12
			scene.add(cone)
		}
	})
	deskSet(0, 0.55, { width: 2.6, monitors: true })

	// ---------- the Day / Night switch ----------
	const sun = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>'
	const moon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'
	const sw = document.createElement('div')
	const onDay = day
	const knobX = day ? 4 : dusk ? 52 : 100
	sw.innerHTML = `
		<span class="dn__knob" style="transform:translateX(${knobX}px)"></span>
		<span class="dn__opt ${onDay ? 'is-on' : ''}">${sun}Day</span>
		<span class="dn__opt ${!onDay ? 'is-on' : ''}">${moon}Night</span>`
	const light = day
	sw.style.cssText = `position:fixed;z-index:7;top:${MOBILE ? 72 : 84}px;right:${MOBILE ? 16 : 48}px;display:grid;grid-template-columns:96px 96px;height:44px;padding:4px;border-radius:999px;font:700 13px/1 Manrope,sans-serif;letter-spacing:.02em;
		background:${light ? 'rgba(255,255,255,.62)' : 'rgba(255,255,255,.06)'};box-shadow:inset 0 0 0 1px ${light ? 'rgba(60,45,30,.14)' : 'rgba(243,239,232,.16)'};backdrop-filter:blur(10px)`
	document.body.appendChild(sw)
	const css = document.createElement('style')
	css.textContent = `
		.dn__knob{position:absolute;top:4px;left:0;width:96px;height:36px;border-radius:999px;background:${light ? '#17191a' : dusk ? 'linear-gradient(90deg,#f08a4b,#3b3466)' : '#f3efe8'};box-shadow:0 6px 16px -6px rgba(0,0,0,.45)}
		.dn__opt{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:8px;color:${light ? '#5f6361' : '#9a958c'}}
		.dn__opt.is-on{color:${light ? '#f3efe8' : dusk ? '#fff' : '#111'}}
		.dn__opt svg{flex:none}`
	document.head.appendChild(css)

	if (MOBILE) {
		document.querySelector('.controls span b').textContent = '01'
		camera.fov = 50
		camera.position.set(WIN_X + 1.05, 2.05, 6.3)
		camera.updateProjectionMatrix()
		camera.lookAt(WIN_X + 0.9, 2.05, -2)
	} else {
		camera.position.set(0.1, 1.72, 5.1)
		camera.lookAt(-0.9, 1.68, -2.2)
	}
	if (hovering && !MOBILE) {
		camera.updateMatrixWorld()
		const v = new THREE.Vector3(hoverX + 0.15, 2.15, WALL_Z + 0.2).project(camera)
		const el = document.createElement('div')
		el.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10 19z" fill="${day ? '#111' : '#fff'}" stroke="${day ? '#fff' : '#111'}" stroke-width="1.4" stroke-linejoin="round"/></svg>`
		el.style.cssText = `position:fixed;z-index:6;left:${(v.x * 0.5 + 0.5) * innerWidth}px;top:${(-v.y * 0.5 + 0.5) * innerHeight}px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.4))`
		document.body.appendChild(el)
	}
	// on dark modes the chip sits under the switch on phones; on desktop keep it top-left
}

// ---------- render a frozen frame ----------
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), ...BLOOM))
composer.addPass(new OutputPass())
composer.render()
requestAnimationFrame(() => {
	composer.render()
	window.__ready = true
})
