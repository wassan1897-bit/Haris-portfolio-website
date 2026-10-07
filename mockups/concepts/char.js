// Character and desk style study. ?style=polish | lowpoly | toon | clay   ?night   ?view=back|side
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js'
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js'
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const QS = new URLSearchParams(location.search)
const STYLE = QS.get('style') || 'polish'
const NIGHT = QS.has('night')
const VIEW = QS.get('view') || 'back'
const INFO = {
	polish: ['1. Studio polished', 'Smoother, better-proportioned figure: tapered coat, real shoulders, sculpted cap and hair, hands with fingers on the keys. Full desk setup.'],
	lowpoly: ['2. Faceted low-poly', 'A deliberate geometric art style. Flat-shaded facets read as designed, not unfinished, and are very cheap to render.'],
	toon: ['3. Illustrated toon', 'Cel shading with ink outlines, like a premium illustration. Hides the simple shapes and feels hand-drawn.'],
	real: ['5. Realistic', 'Physically based materials, studio reflections, ambient occlusion and a touch of lens depth of field: varnished walnut, oak floor, wool coat, glazed ceramics, brushed metal.'],
	clay: ['4. Clay studio', 'Everything in one soft matte clay, like a design-studio render. Calm and premium; only the screens and lamp carry colour.'],
}[STYLE]
document.getElementById('name').textContent = INFO[0] + (NIGHT ? ', night' : '')
document.getElementById('desc').textContent = INFO[1]
if (NIGHT) document.body.classList.add('dark')

const REAL = STYLE === 'real'
const SEG = STYLE === 'lowpoly' ? 0.28 : REAL ? 1.6 : 1 // geometry detail
let seedN = 11
const rnd = () => (seedN = (seedN * 9301 + 49297) % 233280) / 233280
function woodTex(base, dark, w = 1024, h = 256, rings = 70) {
	const cv = document.createElement('canvas')
	cv.width = w
	cv.height = h
	const c = cv.getContext('2d')
	c.fillStyle = base
	c.fillRect(0, 0, w, h)
	for (let i = 0; i < rings; i++) {
		const y0 = rnd() * h
		const amp = 2 + rnd() * 6
		const freq = 0.002 + rnd() * 0.006
		c.strokeStyle = dark
		c.globalAlpha = 0.05 + rnd() * 0.18
		c.lineWidth = 0.6 + rnd() * 2.2
		c.beginPath()
		for (let x = 0; x <= w; x += 8) c.lineTo(x, y0 + Math.sin(x * freq + i) * amp + Math.sin(x * freq * 3.1) * amp * 0.3)
		c.stroke()
	}
	c.globalAlpha = 1
	const t = new THREE.CanvasTexture(cv)
	t.colorSpace = THREE.SRGBColorSpace
	t.wrapS = t.wrapT = THREE.RepeatWrapping
	t.anisotropy = 8
	return t
}
function noiseTex(size = 256, scale = 1) {
	const cv = document.createElement('canvas')
	cv.width = cv.height = size
	const c = cv.getContext('2d')
	const img = c.createImageData(size, size)
	for (let i = 0; i < size * size; i++) {
		const v = 110 + rnd() * 70 * scale
		img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
		img.data[i * 4 + 3] = 255
	}
	c.putImageData(img, 0, 0)
	c.globalAlpha = 0.18
	c.fillStyle = '#000'
	for (let y = 0; y < size; y += 3) c.fillRect(0, y, size, 1)
	const t = new THREE.CanvasTexture(cv)
	t.wrapS = t.wrapT = THREE.RepeatWrapping
	t.repeat.set(6, 6)
	return t
}
function plankTex() {
	const cv = document.createElement('canvas')
	cv.width = 1024
	cv.height = 1024
	const c = cv.getContext('2d')
	const rows = 8
	for (let r = 0; r < rows; r++) {
		const y = (r * 1024) / rows
		const tone = 180 + rnd() * 30
		const sub = woodTex(`rgb(${tone},${tone * 0.82},${tone * 0.62})`, '#6b4a2c', 1024, 128, 30).image
		const off = rnd() * 600
		c.drawImage(sub, -off, y, 1024, 1024 / rows)
		c.drawImage(sub, 1024 - off, y, 1024, 1024 / rows)
		c.fillStyle = 'rgba(60,40,22,0.55)'
		c.fillRect(0, y, 1024, 2)
		c.fillRect(((r * 397) % 900) + 60, y, 2, 1024 / rows)
	}
	const t = new THREE.CanvasTexture(cv)
	t.colorSpace = THREE.SRGBColorSpace
	t.wrapS = t.wrapT = THREE.RepeatWrapping
	t.repeat.set(5, 5)
	t.anisotropy = 8
	return t
}
const TEX = REAL ? { walnut: woodTex('#6b4428', '#2e1a0c'), fabric: noiseTex(256, 1), knit: noiseTex(128, 1.4), plank: plankTex() } : {}
const seg = (n) => Math.max(3, Math.round(n * SEG))

// ---------- palette and material factory ----------
const PAL = {
	coat: '#2a2a2f', coatSeam: '#16161a', trousers: '#2a2d34', skin: '#c48a64', hair: '#1a110c', cap: '#26262a', glasses: '#0b0b0b',
	walnut: '#6b4428', metal: '#141416', felt: '#2a2c30', key: '#1d1e21', keyTop: '#2c2e33', mug: '#ece6da', pot: '#d9cfc0', leaf: '#2f6a43',
	chairFabric: '#2b2d31', chairFrame: '#121214', paper: '#f3efe6', brass: '#b8894a', floor: NIGHT ? '#0d0d0e' : '#cdb79a', wall: NIGHT ? '#0a0a0b' : '#e9e2d5',
}
const gradientMap = (() => {
	const d = new Uint8Array([70, 70, 70, 255, 160, 160, 160, 255, 255, 255, 255, 255])
	const t = new THREE.DataTexture(d, 3, 1)
	t.minFilter = t.magFilter = THREE.NearestFilter
	t.needsUpdate = true
	return t
})()
const CLAY = { coatSeam: '#2e2c2a', '#202024': '#3a3836', '#121214': '#2e2c2a', '#2a160a': '#6b5a4c', '#2c3e50': '#cfc8bd', coat: '#3a3836', trousers: '#4a4744', hair: '#3a3532', cap: '#45423f', glasses: '#2a2826', metal: '#5a5754', chairFrame: '#55524f', key: '#cfc8bd', keyTop: '#ddd6cb', felt: '#c9c1b5' }
function M(name, { rough = 0.7, metal = 0, emissive = null, ei = 0 } = {}) {
	let color = PAL[name] || name
	if (STYLE === 'clay') color = CLAY[name] || (['skin'].includes(name) ? '#e6d2c0' : '#ece6dc')
	if (REAL) {
		const R = {
			coat: { color: '#202024', roughness: 0.95, sheen: 0.7, sheenRoughness: 0.8, sheenColor: '#46464e', bumpMap: TEX.fabric, bumpScale: 1.2 },
			coatSeam: { roughness: 0.9 },
			'#202024': { roughness: 0.95, sheen: 1, sheenRoughness: 0.6, sheenColor: '#4a4a52', bumpMap: TEX.knit, bumpScale: 2 },
			trousers: { roughness: 0.85, sheen: 0.6, sheenColor: '#4a4e58', bumpMap: TEX.fabric, bumpScale: 0.8 },
			skin: { roughness: 0.55, sheen: 0.4, sheenRoughness: 0.5, sheenColor: '#e8a888' },
			hair: { roughness: 0.6, bumpMap: TEX.knit, bumpScale: 3 },
			cap: { roughness: 0.95, sheen: 1, sheenColor: '#55555c', bumpMap: TEX.knit, bumpScale: 2.5 },
			glasses: { roughness: 0.2, metalness: 0.2, clearcoat: 1 },
			walnut: { map: TEX.walnut, color: '#ffffff', roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.22 },
			metal: { roughness: 0.32, metalness: 1 },
			chairFrame: { roughness: 0.35, metalness: 0.8 },
			chairFabric: { roughness: 0.95, sheen: 1, sheenColor: '#55575d', bumpMap: TEX.fabric, bumpScale: 1.5 },
			felt: { roughness: 1, sheen: 1, sheenColor: '#55575c', bumpMap: TEX.fabric, bumpScale: 1 },
			key: { roughness: 0.45, clearcoat: 0.3 },
			keyTop: { roughness: 0.55 },
			mug: { roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08 },
			pot: { roughness: 0.6, clearcoat: 0.4 },
			leaf: { roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.3, sheen: 0.4, sheenColor: '#7fbf8f' },
			brass: { roughness: 0.25, metalness: 1 },
			floor: { map: TEX.plank, color: '#ffffff', roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.4 },
			paper: { roughness: 0.9 },
		}[name] || { roughness: rough, metalness: metal }
		const opts = { ...R }
		delete opts.sheenColor
		delete opts.color
		const m = new THREE.MeshPhysicalMaterial({ color: R.color || color, ...opts })
		if (R.sheenColor) m.sheenColor = new THREE.Color(R.sheenColor)
		if (emissive) {
			m.emissive = new THREE.Color(emissive)
			m.emissiveIntensity = ei
		}
		return m
	}
	if (STYLE === 'toon') {
		const m = new THREE.MeshToonMaterial({ color, gradientMap })
		if (emissive) {
			m.emissive = new THREE.Color(emissive)
			m.emissiveIntensity = ei
		}
		return m
	}
	const m = new THREE.MeshStandardMaterial({ color, roughness: STYLE === 'clay' ? 0.92 : rough, metalness: STYLE === 'clay' ? 0 : metal, flatShading: STYLE === 'lowpoly' })
	if (emissive) {
		m.emissive = new THREE.Color(emissive)
		m.emissiveIntensity = ei
	}
	return m
}
function mesh(geo, mat, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], cast = true } = {}) {
	const m = new THREE.Mesh(geo, mat)
	m.position.set(...pos)
	m.rotation.set(...rot)
	m.scale.set(...scale)
	m.castShadow = cast
	m.receiveShadow = true
	return m
}
const UP = new THREE.Vector3(0, 1, 0)
function limb(a, b, r1, mat, r2 = r1) {
	const A = a.isVector3 ? a : new THREE.Vector3(...a)
	const B = b.isVector3 ? b : new THREE.Vector3(...b)
	const g = new THREE.Group()
	const len = A.distanceTo(B)
	g.add(mesh(new THREE.CylinderGeometry(r2, r1, len, seg(20)), mat))
	g.add(mesh(new THREE.SphereGeometry(r1, seg(18), seg(12)), mat, { pos: [0, -len / 2, 0] }))
	g.add(mesh(new THREE.SphereGeometry(r2, seg(18), seg(12)), mat, { pos: [0, len / 2, 0] }))
	g.position.copy(A).add(B).multiplyScalar(0.5)
	g.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize())
	return g
}
const rbox = (w, h, d, r = 0.01) => (STYLE === 'lowpoly' ? new THREE.BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, 3, r))

// ---------- renderer ----------
const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(1)
renderer.setSize(innerWidth, innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = STYLE === 'toon' ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = NIGHT ? 1 : 0.95
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const scene = new THREE.Scene()
const BG = NIGHT ? '#060607' : STYLE === 'clay' ? '#efe9df' : '#ece6da'
scene.background = new THREE.Color(BG)
scene.fog = new THREE.FogExp2(BG, NIGHT ? 0.05 : 0.03)
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.05, 60)
if (REAL) {
	const pmrem = new THREE.PMREMGenerator(renderer)
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
	scene.environmentIntensity = NIGHT ? 0.05 : 0.22
	renderer.toneMappingExposure = NIGHT ? 1.05 : 0.9
}

// ---------- lights ----------
const hemi = new THREE.HemisphereLight(NIGHT ? '#3a3530' : '#ffffff', NIGHT ? '#050505' : '#c9b89e', REAL ? (NIGHT ? 0.12 : 0.55) : NIGHT ? 0.25 : 1.2)
scene.add(hemi)
const sun = new THREE.DirectionalLight(NIGHT ? '#9fb4ff' : '#fff1dd', NIGHT ? 0.12 : 1.05)
sun.position.set(-4, 5, 3)
sun.castShadow = true
sun.shadow.mapSize.set(REAL ? 4096 : 2048, REAL ? 4096 : 2048)
Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -1, near: 0.5, far: 15 })
sun.shadow.bias = -0.0004
sun.shadow.radius = 5
scene.add(sun)
const rim = new THREE.SpotLight('#ffd2a1', NIGHT ? 6 : 2, 4, 0.7, 0.9, 2)
rim.position.set(0.6, 2.2, -1.1)
rim.target.position.set(0, 1.1, 0.8)
scene.add(rim, rim.target)
// soft fill from the viewer's side so his back and the desk front read
const fill = new THREE.DirectionalLight(NIGHT ? '#ffcf9d' : '#fff4e6', NIGHT ? 0.18 : 0.55)
fill.position.set(1.5, 2.2, 5)
scene.add(fill)

// ---------- room ----------
const WALL_Z = -1.4
scene.add(mesh(new THREE.PlaneGeometry(30, 30), M('floor', { rough: 0.55 }), { rot: [-Math.PI / 2, 0, 0], cast: false }))
scene.add(mesh(new THREE.PlaneGeometry(30, 10), M('wall', { rough: 0.9 }), { pos: [0, 5, WALL_Z - 0.03], cast: false }))
{
	const n = 130
	const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.085, 10, 0.02), M(NIGHT ? '#121213' : '#e3dbcd', { rough: 0.85 }), n)
	slats.receiveShadow = true
	const o = new THREE.Object3D()
	for (let i = 0; i < n; i++) {
		o.position.set(-7 + i * 0.108, 5, WALL_Z - 0.01)
		o.updateMatrix()
		slats.setMatrixAt(i, o.matrix)
	}
	scene.add(slats)
}

// ---------- screens ----------
function screenTex(kind) {
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
const screenMat = (kind) => new THREE.MeshBasicMaterial({ map: screenTex(kind), toneMapped: false, color: '#c4cfdb' })

// ---------- desk ----------
const TOP = 0.75
const DW = 2.3
const DD = 0.78
const desk = new THREE.Group()
scene.add(desk)
desk.add(mesh(rbox(DW, 0.035, DD, 0.012), M('walnut', { rough: 0.45 }), { pos: [0, TOP - 0.0175, 0] }))
// black sled legs: an open rectangle frame each side
for (const sx of [-1, 1]) {
	const x = sx * (DW / 2 - 0.12)
	const frame = M('metal', { rough: 0.35, metal: 0.6 })
	desk.add(mesh(rbox(0.04, TOP - 0.035, 0.04, 0.008), frame, { pos: [x, (TOP - 0.035) / 2, -DD / 2 + 0.06] }))
	desk.add(mesh(rbox(0.04, TOP - 0.035, 0.04, 0.008), frame, { pos: [x, (TOP - 0.035) / 2, DD / 2 - 0.06] }))
	desk.add(mesh(rbox(0.04, 0.04, DD - 0.08, 0.008), frame, { pos: [x, 0.02, 0] }))
	desk.add(mesh(rbox(0.04, 0.04, DD - 0.08, 0.008), frame, { pos: [x, TOP - 0.055, 0] }))
}
desk.add(mesh(rbox(DW - 0.3, 0.06, 0.03, 0.008), M('metal', { metal: 0.6 }), { pos: [0, TOP - 0.07, -DD / 2 + 0.08] }))
// felt desk mat
desk.add(mesh(rbox(0.95, 0.006, 0.36, 0.004), M('felt', { rough: 0.95 }), { pos: [0.05, TOP + 0.003, 0.12] }))
// keyboard with keys
{
	const kb = new THREE.Group()
	kb.position.set(-0.04, TOP + 0.006, 0.13)
	kb.rotation.x = 0.04
	kb.add(mesh(rbox(0.44, 0.022, 0.15, 0.006), M('key', { rough: 0.5 })))
	const keyGeo = rbox(0.022, 0.012, 0.022, 0.003)
	const keys = new THREE.InstancedMesh(keyGeo, M('keyTop', { rough: 0.6 }), 15 * 5)
	keys.castShadow = true
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
	// mouse
	desk.add(mesh(new THREE.SphereGeometry(0.03, seg(24), seg(16)), M('key', { rough: 0.4 }), { pos: [0.34, TOP + 0.016, 0.15], scale: [0.85, 0.55, 1.45] }))
}
// monitors on arms, each with a light bar
function monitor(x, rotY, kind) {
	const g = new THREE.Group()
	g.position.set(x, TOP, -0.2)
	g.rotation.y = rotY
	const frame = M('metal', { rough: 0.4, metal: 0.5 })
	g.add(mesh(rbox(0.66, 0.39, 0.022, 0.008), frame, { pos: [0, 0.47, 0] }))
	g.add(mesh(new THREE.PlaneGeometry(0.635, 0.365), screenMat(kind), { pos: [0, 0.47, 0.0115], cast: false }))
	// arm to a clamp at the back edge
	g.add(mesh(rbox(0.08, 0.08, 0.02, 0.006), frame, { pos: [0, 0.47, -0.02] }))
	g.add(limb([0, 0.47, -0.03], [0, 0.32, -0.16], 0.012, frame))
	g.add(limb([0, 0.32, -0.16], [0, 0.02, -0.16], 0.014, frame))
	g.add(mesh(rbox(0.06, 0.04, 0.06, 0.006), frame, { pos: [0, 0.02, -0.16] }))
	// light bar on top
	g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, seg(14)), frame, { pos: [0, 0.68, 0.035], rot: [0, 0, Math.PI / 2] }))
	g.add(mesh(new THREE.BoxGeometry(0.38, 0.004, 0.012), M('#2a2016', { emissive: '#ffd9a8', ei: NIGHT ? 3 : 1.2 }), { pos: [0, 0.668, 0.04], cast: false }))
	desk.add(g)
	const bar = new THREE.SpotLight('#ffe2bd', NIGHT ? 2.4 : 0.8, 1.6, 0.9, 0.8, 2)
	bar.position.set(x, TOP + 0.66, -0.12)
	bar.target.position.set(x * 0.6, TOP, 0.15)
	scene.add(bar, bar.target)
	const glow = new THREE.PointLight('#8fb6ff', NIGHT ? 0.6 : 0.2, 1.2, 2)
	glow.position.set(x, TOP + 0.45, 0.1)
	scene.add(glow)
}
monitor(-0.36, 0.22, 'dash')
monitor(0.36, -0.22, 'flow')
// architect lamp
{
	const metal = M('metal', { rough: 0.35, metal: 0.6 })
	const g = new THREE.Group()
	g.position.set(-0.92, TOP, -0.12)
	g.add(mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.02, seg(32)), metal, { pos: [0, 0.01, 0] }))
	const j1 = new THREE.Vector3(0, 0.02, 0)
	const j2 = new THREE.Vector3(0.05, 0.36, -0.04)
	const j3 = new THREE.Vector3(0.26, 0.5, 0.08)
	g.add(limb(j1, j2, 0.009, metal), limb(j2, j3, 0.009, metal))
	g.add(mesh(new THREE.SphereGeometry(0.016, seg(12), seg(10)), M('brass', { rough: 0.3, metal: 0.9 }), { pos: j2.toArray() }))
	const shade = new THREE.Group()
	shade.position.copy(j3)
	shade.rotation.set(0.35, 0, -0.55)
	shade.add(mesh(new THREE.ConeGeometry(0.075, 0.12, seg(32), 1, true), new THREE.MeshStandardMaterial({ color: '#141416', roughness: 0.4, metalness: 0.5, side: THREE.DoubleSide, flatShading: STYLE === 'lowpoly' }), { pos: [0, -0.04, 0] }))
	shade.add(mesh(new THREE.SphereGeometry(0.026, seg(16), seg(12)), new THREE.MeshStandardMaterial({ color: '#fff1d6', emissive: '#ffc27a', emissiveIntensity: NIGHT ? 9 : 4 }), { pos: [0, -0.07, 0], cast: false }))
	g.add(shade)
	desk.add(g)
	const ll = new THREE.SpotLight('#ffbf78', NIGHT ? 5 : 1.6, 2.5, 0.85, 0.7, 2)
	ll.position.set(-0.66, TOP + 0.45, -0.02)
	ll.target.position.set(-0.45, TOP, 0.2)
	ll.castShadow = true
	ll.shadow.mapSize.set(1024, 1024)
	ll.shadow.bias = -0.0005
	scene.add(ll, ll.target)
}
// mug with coffee and steam
{
	const g = new THREE.Group()
	g.position.set(0.62, TOP, 0.18)
	const mm = M('mug', { rough: 0.35 })
	g.add(mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.095, seg(28)), mm, { pos: [0, 0.0475, 0] }))
	g.add(mesh(new THREE.TorusGeometry(0.024, 0.007, seg(10), seg(20)), mm, { pos: [0.043, 0.05, 0] }))
	g.add(mesh(new THREE.CircleGeometry(0.035, seg(24)), M('#2a160a', { rough: 0.2 }), { pos: [0, 0.088, 0], rot: [-Math.PI / 2, 0, 0], cast: false }))
	desk.add(g)
}
// notebook and pen
desk.add(mesh(rbox(0.2, 0.012, 0.27, 0.004), M('#2c3e50', { rough: 0.7 }), { pos: [-0.62, TOP + 0.006, 0.16], rot: [0, 0.18, 0] }))
desk.add(mesh(rbox(0.19, 0.004, 0.26, 0.002), M('paper', { rough: 0.9 }), { pos: [-0.6, TOP + 0.014, 0.16], rot: [0, 0.18, 0] }))
desk.add(mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.14, seg(8)), M('brass', { metal: 0.8, rough: 0.3 }), { pos: [-0.53, TOP + 0.02, 0.15], rot: [Math.PI / 2, 0, 0.4] }))
// headphones on a stand
{
	const g = new THREE.Group()
	g.position.set(0.92, TOP, -0.15)
	const metal = M('metal', { rough: 0.35, metal: 0.6 })
	g.add(mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.012, seg(24)), metal))
	g.add(mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.26, seg(10)), metal, { pos: [0, 0.13, 0] }))
	g.add(mesh(new THREE.TorusGeometry(0.075, 0.012, seg(10), seg(32), Math.PI), M('coat', { rough: 0.5 }), { pos: [0, 0.27, 0], rot: [0, Math.PI / 2, 0] }))
	for (const s of [-1, 1]) g.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, seg(24)), M('coat', { rough: 0.5 }), { pos: [0, 0.2, s * 0.075], rot: [Math.PI / 2, 0, 0] }))
	desk.add(g)
}
// snake plant
{
	const g = new THREE.Group()
	g.position.set(1.0, TOP, 0.2)
	g.add(mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.12, seg(28)), M('pot', { rough: 0.6 }), { pos: [0, 0.06, 0] }))
	const leaf = M('leaf', { rough: 0.55 })
	for (let i = 0; i < 7; i++) {
		const a = (i / 7) * Math.PI * 2
		const h = 0.22 + (i % 3) * 0.06
		const l = mesh(new THREE.SphereGeometry(0.05, seg(14), seg(10)), leaf, { scale: [0.38, h / 0.1, 0.12] })
		l.position.set(Math.cos(a) * 0.025, 0.12 + h / 2, Math.sin(a) * 0.025)
		l.rotation.set(Math.sin(a) * 0.22, -a, Math.cos(a) * 0.22)
		g.add(l)
	}
	desk.add(g)
}

// ---------- chair (mid-back so his shoulders stay visible) ----------
const SEAT = 0.48
const CZ = 0.78
{
	const g = new THREE.Group()
	g.position.set(0, 0, CZ)
	const fabric = M('chairFabric', { rough: 0.9 })
	const frame = M('chairFrame', { rough: 0.35, metal: 0.5 })
	g.add(mesh(rbox(0.5, 0.07, 0.48, 0.03), fabric, { pos: [0, SEAT - 0.035, 0] }))
	// curved backrest
	const back = mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.2, seg(32), 1, true, -0.55, 1.1), new THREE.MeshStandardMaterial({ color: STYLE === 'clay' ? '#3f3d3b' : PAL.chairFabric, roughness: 0.9, side: THREE.DoubleSide, flatShading: STYLE === 'lowpoly' }), { pos: [0, 0.66, -0.16] })
	back.rotation.y = 0
	g.add(back)
	g.add(mesh(rbox(0.05, 0.2, 0.03, 0.01), frame, { pos: [0, 0.53, 0.27], rot: [-0.12, 0, 0] }))
	// armrests
	for (const s of [-1, 1]) {
		g.add(mesh(rbox(0.03, 0.2, 0.03, 0.008), frame, { pos: [s * 0.27, SEAT + 0.08, 0.02] }))
		g.add(mesh(rbox(0.07, 0.025, 0.26, 0.01), frame, { pos: [s * 0.27, SEAT + 0.19, -0.02] }))
	}
	g.add(mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.3, seg(16)), frame, { pos: [0, 0.27, 0] }))
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 + 0.3
		g.add(limb([0, 0.08, 0], [Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.3], 0.016, frame))
		g.add(mesh(new THREE.SphereGeometry(0.025, seg(12), seg(10)), frame, { pos: [Math.cos(a) * 0.3, 0.025, Math.sin(a) * 0.3] }))
	}
	scene.add(g)
}

// ---------- Haris ----------
const coat = M('coat', { rough: 0.85 })
const skin = M('skin', { rough: 0.5 })
const trousers = M('trousers', { rough: 0.8 })
const haris = new THREE.Group()
haris.position.set(0, 0, CZ - 0.02)
scene.add(haris)
// legs
for (const s of [-1, 1]) {
	const hip = new THREE.Vector3(s * 0.1, SEAT + 0.04, 0.02)
	const knee = new THREE.Vector3(s * 0.13, SEAT + 0.06, -0.38)
	const ankle = new THREE.Vector3(s * 0.13, 0.09, -0.4)
	haris.add(limb(hip, knee, 0.078, trousers, 0.066))
	haris.add(limb(knee, ankle, 0.058, trousers, 0.05))
	haris.add(mesh(rbox(0.1, 0.07, 0.25, 0.03), M('#121214', { rough: 0.5 }), { pos: [s * 0.13, 0.04, -0.46] }))
}
// torso: a lathe silhouette (waist, chest, sloped shoulders), leaning toward the desk
const torso = new THREE.Group()
torso.position.set(0, SEAT, 0.03)
torso.rotation.x = -0.2
haris.add(torso)
{
	const prof = [[0.16, 0], [0.175, 0.08], [0.168, 0.22], [0.182, 0.36], [0.2, 0.46], [0.196, 0.52], [0.15, 0.585], [0.09, 0.615], [0.05, 0.625]].map(([r, y]) => new THREE.Vector2(r, y))
	const body = mesh(new THREE.LatheGeometry(prof, seg(40)), coat, { scale: [1.32, 1, 0.82] })
	torso.add(body)
	// back seam and coat hem flaring over the seat
	torso.add(mesh(new THREE.BoxGeometry(0.006, 0.5, 0.004), M('coatSeam'), { pos: [0, 0.27, 0.163], cast: false }))
	torso.add(mesh(new THREE.CylinderGeometry(0.235, 0.25, 0.08, seg(40), 1, true), coat, { pos: [0, 0.03, 0], scale: [1, 1, 0.82] }))
	// shoulders
	for (const s of [-1, 1]) torso.add(mesh(new THREE.SphereGeometry(0.075, seg(20), seg(16)), coat, { pos: [s * 0.22, 0.5, 0], scale: [1, 0.85, 0.9] }))
	// turtleneck and neck
	torso.add(mesh(new THREE.CylinderGeometry(0.068, 0.078, 0.07, seg(28)), M('#202024', { rough: 0.95 }), { pos: [0, 0.65, -0.01] }))
	torso.add(mesh(new THREE.CylinderGeometry(0.05, 0.054, 0.06, seg(20)), skin, { pos: [0, 0.69, -0.015] }))
}
// head: skull, jaw, ears, hair with a fade, newsboy cap, round glasses
const head = new THREE.Group()
head.position.set(0, 0.785, -0.03)
head.rotation.x = 0.22
torso.add(head)
head.add(mesh(new THREE.SphereGeometry(0.108, seg(40), seg(30)), skin, { scale: [0.92, 1.06, 1.02] }))
head.add(mesh(new THREE.SphereGeometry(0.075, seg(28), seg(20)), skin, { pos: [0, -0.06, -0.04], scale: [1, 0.85, 1] }))
for (const s of [-1, 1]) head.add(mesh(new THREE.SphereGeometry(0.028, seg(16), seg(12)), skin, { pos: [s * 0.098, -0.005, 0.005], scale: [0.4, 1, 0.7] }))
const hairM = M('hair', { rough: 0.8 })
head.add(mesh(new THREE.SphereGeometry(0.113, seg(40), seg(24), -Math.PI * 0.1, Math.PI * 1.2, 0, Math.PI * 0.8), hairM, { pos: [0, 0.004, 0.012] }))
// cap: rounded crown, band, short brim forward, a button on top
const capM = M('cap', { rough: 0.95 })
head.add(mesh(new THREE.SphereGeometry(0.128, seg(40), seg(20), 0, Math.PI * 2, 0, Math.PI * 0.5), capM, { pos: [0, 0.035, -0.008], scale: [1.06, 0.6, 1.16], rot: [0.1, 0, 0] }))
head.add(mesh(new THREE.CylinderGeometry(0.118, 0.118, 0.025, seg(40), 1, true), capM, { pos: [0, 0.03, -0.004], scale: [1.01, 1, 1.06] }))
head.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.01, seg(40), 1, false, Math.PI / 2, Math.PI), capM, { pos: [0, 0.03, -0.08], rot: [0.32, 0, 0], scale: [1, 1, 0.8] }))
head.add(mesh(new THREE.SphereGeometry(0.012, seg(10), seg(8)), capM, { pos: [0, 0.112, -0.01] }))
const glassM = M('glasses', { rough: 0.3, metal: 0.6 })
for (const s of [-1, 1]) {
	head.add(mesh(new THREE.TorusGeometry(0.028, 0.004, seg(8), seg(28)), glassM, { pos: [s * 0.043, 0.008, -0.108] }))
	head.add(limb([s * 0.072, 0.01, -0.104], [s * 0.1, 0.012, 0.01], 0.0028, glassM))
}
// arms reaching to the keyboard, hands with fingers on the keys
torso.updateMatrixWorld(true)
haris.updateMatrixWorld(true)
const toHaris = (v) => haris.worldToLocal(torso.localToWorld(v.clone()))
for (const s of [-1, 1]) {
	const shoulder = toHaris(new THREE.Vector3(s * 0.235, 0.47, 0))
	const elbow = new THREE.Vector3(s * 0.29, 0.86, -0.35)
	const wrist = new THREE.Vector3(s * 0.15, TOP + 0.05, -0.6)
	haris.add(limb(shoulder, elbow, 0.064, coat, 0.058))
	haris.add(limb(elbow, wrist, 0.054, coat, 0.046))
	haris.add(mesh(new THREE.TorusGeometry(0.044, 0.008, seg(8), seg(24)), M('#202024'), { pos: wrist.toArray(), rot: [Math.PI / 2 - 0.3, 0, 0] }))
	const hand = new THREE.Group()
	hand.position.copy(wrist).add(new THREE.Vector3(-s * 0.012, -0.012, -0.055))
	hand.rotation.set(-0.15, s * 0.22, 0)
	hand.add(mesh(rbox(0.07, 0.026, 0.08, 0.012), skin))
	for (let f = 0; f < 4; f++) hand.add(limb([-0.026 + f * 0.017, -0.004, -0.035], [-0.026 + f * 0.017, -0.016, -0.075], 0.0075, skin))
	hand.add(limb([s * -0.038, 0, -0.01], [s * -0.045, -0.012, -0.045], 0.008, skin))
	haris.add(hand)
}

// ---------- wall cards above (context) ----------
const loader = new THREE.TextureLoader()
;[['ref-1031.jpg', -1.7], ['ref-1005.jpg', 0], ['ref-1018.jpg', 1.7]].forEach(([img, x]) => {
	const t = loader.load('/landing/workspace/ref/' + img)
	t.colorSpace = THREE.SRGBColorSpace
	scene.add(mesh(new THREE.BoxGeometry(0.86, 1.14, 0.03), M('#9c7448', { rough: 0.55 }), { pos: [x, 2.05, WALL_Z + 0.03] }))
	scene.add(mesh(new THREE.PlaneGeometry(0.81, 1.09), new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 }), { pos: [x, 2.05, WALL_Z + 0.046], cast: false }))
})

// ---------- camera ----------
if (VIEW === 'side') {
	camera.position.set(1.55, 1.35, 1.85)
	camera.lookAt(0.05, 1.0, 0.25)
} else {
	camera.position.set(0.25, 1.55, 2.75)
	camera.lookAt(0, 1.02, -0.05)
}

// ---------- render ----------
THREE.DefaultLoadingManager.onLoad = () => render()
function render() {
	if (STYLE === 'toon') {
		const outline = new OutlineEffect(renderer, { defaultThickness: 0.006, defaultColor: [0.08, 0.07, 0.06] })
		outline.render(scene, camera)
		requestAnimationFrame(() => {
			outline.render(scene, camera)
			window.__ready = true
		})
		return
	}
	const composer = new EffectComposer(renderer)
	composer.addPass(new RenderPass(scene, camera))
	if (REAL) {
		const ao = new GTAOPass(scene, camera, innerWidth, innerHeight)
		ao.updateGtaoMaterial({ radius: 0.35, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 16 })
		ao.blendIntensity = 0.85
		composer.addPass(ao)
		const focus = camera.position.distanceTo(new THREE.Vector3(0, 1.1, 0.7))
		composer.addPass(new BokehPass(scene, camera, { focus, aperture: 0.0016, maxblur: 0.006 }))
	}
	composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), NIGHT ? 0.5 : 0.18, 0.5, NIGHT ? 0.9 : 1.1))
	composer.addPass(new OutputPass())
	composer.render()
	requestAnimationFrame(() => {
		composer.render()
		window.__ready = true
	})
}
