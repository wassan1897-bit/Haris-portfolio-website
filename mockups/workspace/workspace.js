// Workspace projects concept: black slatted wall with lit project frames, Haris at his desk.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const params = new URLSearchParams(location.search)
const SHOT = params.get('shot') || 'wide' // wide | open | sip | mobile
const FROZEN = params.has('freeze')
const EXPOSURE = Number(params.get('exp') || 1)

// Reference photography (placeholder imagery, not project screenshots)
const REF = './ref/'
const LOGO = '/landing/assets/img/tools/'
const PROJECTS = [
  { img: 'ref-1044.jpg', title: 'Screener', tool: 'Resume AI, n8n', logo: 'n8n.png' },
  { img: 'ref-1016.jpg', title: 'Ten Zaps', tool: 'Event pipeline, Zapier', logo: 'zapier.png' },
  { img: 'ref-1031.jpg', title: 'Inbox', tool: 'Email triage, n8n', logo: 'n8n.png' },
  { img: 'ref-1027.jpg', title: 'Voices', tool: 'RAG chatbots, Claude', logo: 'claude.png' },
  { img: 'ref-1018.jpg', title: 'Compliance', tool: 'FERPA platform, GHL', logo: 'ghl.png' },
  { img: 'ref-1005.jpg', title: 'Caller', tool: 'Voice agent, Retell AI', logo: 'retell.png' },
  { img: 'ref-201.jpg', title: 'Support', tool: 'WhatsApp agent, n8n', logo: 'n8n.png' },
]
// the card face draws real text, so the fonts must be ready before any card is painted
await Promise.all([document.fonts.load('600 84px Manrope'), document.fonts.load('500 38px Manrope')])
const FOCUS = SHOT === 'open' ? 2 : 3

// ---------- renderer ----------
const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = EXPOSURE
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
scene.background = new THREE.Color('#060607')
scene.fog = new THREE.FogExp2('#060607', 0.045)

const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.05, 60)
scene.add(new THREE.HemisphereLight('#3a3530', '#050505', 0.35))

const loader = new THREE.TextureLoader()
const mat = (color, roughness = 0.8, metalness = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra })
function mesh(geo, material, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geo, material)
  m.position.set(...pos)
  m.rotation.set(...rot)
  m.scale.set(...scale)
  m.castShadow = cast
  m.receiveShadow = receive
  return m
}
// a capsule stretched between two points: arms, legs, lamp arms
function limb(a, b, r, material) {
  const A = new THREE.Vector3(...a)
  const B = new THREE.Vector3(...b)
  const len = A.distanceTo(B)
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(len - 0.0001, 0.0001), 8, 20), material)
  m.position.copy(A).add(B).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize())
  m.castShadow = true
  m.receiveShadow = true
  return m
}

// ---------- room ----------
const WALL_Z = -2.2
const floorMat = mat('#0d0d0e', 0.42, 0.0)
scene.add(mesh(new THREE.PlaneGeometry(40, 40), floorMat, { rot: [-Math.PI / 2, 0, 0], cast: false }))

// black slatted wall: real geometry so the warm lights rake across the slats
const slatMat = mat('#121213', 0.62, 0.05)
const backing = mesh(new THREE.PlaneGeometry(40, 12), mat('#050505', 1), { pos: [0, 6, WALL_Z - 0.06], cast: false })
scene.add(backing)
const slatGeo = new THREE.BoxGeometry(0.085, 12, 0.05)
const slats = new THREE.InstancedMesh(slatGeo, slatMat, 260)
slats.receiveShadow = true
slats.castShadow = true
const tmp = new THREE.Object3D()
for (let i = 0; i < 260; i++) {
  tmp.position.set(-14 + i * 0.108, 6, WALL_Z - 0.025)
  tmp.updateMatrix()
  slats.setMatrixAt(i, tmp.matrix)
}
scene.add(slats)

// ---------- light beams (soft volumetric cones) ----------
const beamMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  uniforms: { uColor: { value: new THREE.Color('#ffae5e') }, uStrength: { value: 0.16 } },
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
      float fall = pow(vH, 1.8);
      gl_FragColor = vec4(uColor, edge * fall * uStrength);
    }`,
})

// ---------- project cards with picture lights ----------
function paintCard(p, photo, cv = document.createElement('canvas')) {
  if (photo) p.photo = photo
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
  // soft wash at the top so the title reads on any photo
  const wash = c.createLinearGradient(0, 0, 0, 500)
  wash.addColorStop(0, 'rgba(247,245,241,0.94)')
  wash.addColorStop(0.55, 'rgba(247,245,241,0.55)')
  wash.addColorStop(1, 'rgba(247,245,241,0)')
  c.fillStyle = wash
  c.fillRect(0, 0, 900, 500)
  c.textAlign = 'center'
  c.fillStyle = '#1b1c1d'
  c.font = '600 84px Manrope'
  c.fillText(p.title, 450, 170)
  c.fillStyle = '#3f4143'
  c.font = '500 38px Manrope'
  c.fillText(p.tool, 450, 232)
  // round badge with the tool's logo
  const bx = 110
  const by = 1086
  c.save()
  c.shadowColor = 'rgba(0,0,0,0.28)'
  c.shadowBlur = 18
  c.beginPath()
  c.arc(bx, by, 64, 0, Math.PI * 2)
  c.fillStyle = '#ffffff'
  c.fill()
  c.restore()
  if (p.logoImg) {
    const L = p.logoImg
    const fit = Math.min(88 / L.width, 64 / L.height)
    c.save()
    c.beginPath()
    c.arc(bx, by, 60, 0, Math.PI * 2)
    c.clip()
    c.drawImage(L, bx - (L.width * fit) / 2, by - (L.height * fit) / 2, L.width * fit, L.height * fit)
    c.restore()
  }
  return cv
}
const frames = []
const SPACING = 1.85
PROJECTS.forEach((p, i) => {
  const x = (i - 3) * SPACING
  const y = 2.35
  const g = new THREE.Group()
  g.position.set(x, y, WALL_Z + 0.06)

  // card like the reference: tall print, title and subtitle centred on top, photo full bleed, round badge bottom-left
  const w = 1.08
  const h = 1.44
  const tex = new THREE.CanvasTexture(paintCard(p))
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const edge = mat('#e9e6e0', 0.8)
  const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.78, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.14 })
  const art = mesh(new THREE.BoxGeometry(w, h, 0.016), [edge, edge, edge, edge, face, edge], { pos: [0, 0, 0.004] })
  g.add(art)
  new THREE.ImageLoader().load(REF + p.img, (img) => {
    paintCard(p, img, tex.image)
    tex.needsUpdate = true
  })
  new THREE.ImageLoader().load(LOGO + p.logo, (img) => {
    p.logoImg = img
    paintCard(p, p.photo, tex.image)
    tex.needsUpdate = true
  })

  // picture light: black bar with a glowing underside
  const lamp = new THREE.Group()
  lamp.position.set(0, h / 2 + 0.2, 0.12)
  lamp.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.62, 24), mat('#0b0b0b', 0.35, 0.6), { rot: [0, 0, Math.PI / 2] }))
  const glow = mesh(new THREE.BoxGeometry(0.56, 0.008, 0.03), new THREE.MeshStandardMaterial({ color: '#ffd29a', emissive: '#ffb064', emissiveIntensity: 6 }), { pos: [0, -0.034, 0.004], cast: false })
  lamp.add(glow)
  lamp.add(limb([0, 0, -0.12], [0, 0, -0.01], 0.012, mat('#0b0b0b', 0.35, 0.6)))
  g.add(lamp)

  const spot = new THREE.SpotLight('#ffc590', 4, 6, 0.5, 0.75, 2)
  spot.position.set(x, y + h / 2 + 0.45, WALL_Z + 1.05)
  spot.target.position.set(x, y - 0.1, WALL_Z)
  spot.castShadow = i >= 1 && i <= 5
  spot.shadow.mapSize.set(1024, 1024)
  spot.shadow.bias = -0.0004
  scene.add(spot, spot.target)

  // beam: cone from the lamp down across the frame
  const beam = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.9, 48, 1, true), beamMat.clone())
  beam.position.set(x, y + h / 2 + 0.17 - 0.95, WALL_Z + 0.32)
  beam.rotation.x = -0.12
  scene.add(beam)

  scene.add(g)
  frames.push({ group: g, spot, glow, beam, art, base: g.position.clone(), p })
})

// ---------- desk ----------
const desk = new THREE.Group()
desk.position.set(0, 0, 0.55)
const walnut = mat('#5b3a22', 0.48, 0.0)
const blackMetal = mat('#0d0d0d', 0.35, 0.65)
desk.add(mesh(new THREE.BoxGeometry(2.0, 0.045, 0.82), walnut, { pos: [0, 0.75, 0] }))
for (const sx of [-0.92, 0.92]) {
  desk.add(mesh(new THREE.BoxGeometry(0.035, 0.73, 0.7), blackMetal, { pos: [sx, 0.365, 0] }))
}
scene.add(desk)
const DESK_TOP = 0.7725

// laptop, screen facing Haris (+z) showing an n8n canvas
const laptop = new THREE.Group()
laptop.position.set(0.02, DESK_TOP, 0.62)
const alu = mat('#9da1a6', 0.32, 0.85)
laptop.add(mesh(new THREE.BoxGeometry(0.36, 0.012, 0.25), alu, { pos: [0, 0.006, 0] }))
laptop.add(mesh(new THREE.PlaneGeometry(0.3, 0.12), mat('#1b1c1e', 0.6), { pos: [0, 0.0125, -0.03], rot: [-Math.PI / 2, 0, 0], cast: false }))
const screenHinge = new THREE.Group()
screenHinge.position.set(0, 0.012, -0.125)
screenHinge.rotation.x = -0.32
const lid = mesh(new THREE.BoxGeometry(0.36, 0.24, 0.008), alu, { pos: [0, 0.12, -0.004] })
screenHinge.add(lid)
// drawn workflow canvas: nodes and wires, no real project screenshot
const screenCv = document.createElement('canvas')
screenCv.width = 660
screenCv.height = 420
{
  const c = screenCv.getContext('2d')
  c.fillStyle = '#16181c'
  c.fillRect(0, 0, 660, 420)
  c.fillStyle = '#1f2228'
  c.fillRect(0, 0, 660, 34)
  const dots = ['#ff5f57', '#febc2e', '#28c840']
  dots.forEach((col, i) => {
    c.fillStyle = col
    c.beginPath()
    c.arc(20 + i * 18, 17, 5, 0, Math.PI * 2)
    c.fill()
  })
  c.fillStyle = 'rgba(255,255,255,0.06)'
  for (let x = 11; x < 660; x += 22) for (let y = 50; y < 420; y += 22) c.fillRect(x, y, 2, 2)
  const nodes = [[60, 220], [180, 140], [180, 300], [310, 220], [440, 130], [440, 220], [440, 320], [575, 220]]
  const cols = ['#ff6d5a', '#7b61ff', '#29b6f6', '#ffb020', '#2ecc71', '#7b61ff', '#29b6f6', '#ff6d5a']
  const wires = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]]
  c.strokeStyle = 'rgba(200,210,225,0.55)'
  c.lineWidth = 2
  wires.forEach(([a, b]) => {
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
}
const screenTex = new THREE.CanvasTexture(screenCv)
screenTex.colorSpace = THREE.SRGBColorSpace
const screen = mesh(new THREE.PlaneGeometry(0.33, 0.21), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false, color: '#c8d4dc' }), { pos: [0, 0.12, 0.0005], cast: false })
screenHinge.add(screen)
laptop.add(screenHinge)
scene.add(laptop)
const screenLight = new THREE.PointLight('#9fc3ff', 0.55, 1.4, 2)
screenLight.position.set(0.02, 0.98, 0.72)
scene.add(screenLight)

// desk lamp: arched arm, glowing shade, warm pool on the desk
const lampG = new THREE.Group()
lampG.position.set(-0.68, DESK_TOP, 0.45)
const brass = mat('#b8894a', 0.3, 0.9)
lampG.add(mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.022, 40), blackMetal, { pos: [0, 0.011, 0] }))
lampG.add(limb([0, 0.02, 0], [0.02, 0.42, -0.08], 0.011, blackMetal))
lampG.add(limb([0.02, 0.42, -0.08], [0.24, 0.47, 0.06], 0.011, blackMetal))
lampG.add(mesh(new THREE.SphereGeometry(0.018, 16, 16), brass, { pos: [0.02, 0.42, -0.08] }))
const shade = mesh(new THREE.ConeGeometry(0.085, 0.13, 40, 1, true), new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.4, metalness: 0.5, side: THREE.DoubleSide }), { pos: [0.27, 0.43, 0.07], rot: [0.2, 0, -0.35] })
lampG.add(shade)
const bulb = mesh(new THREE.SphereGeometry(0.03, 20, 20), new THREE.MeshStandardMaterial({ color: '#fff1d6', emissive: '#ffc27a', emissiveIntensity: 9 }), { pos: [0.28, 0.4, 0.075], cast: false })
lampG.add(bulb)
scene.add(lampG)
const lampLight = new THREE.SpotLight('#ffbf78', 6, 3, 0.95, 0.7, 2)
lampLight.position.set(-0.4, DESK_TOP + 0.4, 0.52)
lampLight.target.position.set(-0.15, DESK_TOP, 0.7)
lampLight.castShadow = true
lampLight.shadow.mapSize.set(1024, 1024)
lampLight.shadow.bias = -0.0005
scene.add(lampLight, lampLight.target)
const lampFill = new THREE.PointLight('#ffb36b', 0.9, 2.4, 2)
lampFill.position.set(-0.38, DESK_TOP + 0.36, 0.56)
scene.add(lampFill)

// coffee mug with steam
const mugMat = mat('#e9e3d8', 0.35)
const mug = new THREE.Group()
mug.add(mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.1, 32), mugMat, { pos: [0, 0.05, 0] }))
mug.add(mesh(new THREE.CircleGeometry(0.037, 32), mat('#2a160a', 0.25), { pos: [0, 0.092, 0], rot: [-Math.PI / 2, 0, 0], cast: false }))
mug.add(mesh(new THREE.TorusGeometry(0.026, 0.008, 12, 28), mugMat, { pos: [0.045, 0.052, 0], rot: [0, 0, 0] }))
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
for (let i = 0; i < 6; i++) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, color: '#fff4e6', transparent: true, opacity: 0.12, depthWrite: false }))
  s.scale.set(0.05, 0.08, 1)
  mug.add(s)
  steam.push(s)
}
scene.add(mug)
const MUG_DESK = new THREE.Vector3(0.42, DESK_TOP, 0.82)

// small plant for life
const plant = new THREE.Group()
plant.position.set(0.82, DESK_TOP, 0.32)
plant.add(mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.12, 32), mat('#d9cfc0', 0.6), { pos: [0, 0.06, 0] }))
const leafMat = mat('#2f5a3a', 0.6)
for (let i = 0; i < 9; i++) {
  const a = (i / 9) * Math.PI * 2
  const leaf = mesh(new THREE.SphereGeometry(0.05, 16, 12), leafMat, { scale: [0.45, 1.6, 0.18] })
  leaf.position.set(Math.cos(a) * 0.045, 0.2 + (i % 3) * 0.03, Math.sin(a) * 0.045)
  leaf.rotation.set(Math.sin(a) * 0.5, -a, Math.cos(a) * 0.5)
  plant.add(leaf)
}
scene.add(plant)

// chair (low back so his shoulders stay in view)
const chair = new THREE.Group()
chair.position.set(0.02, 0, 1.38)
const chairMat = mat('#151516', 0.55)
chair.add(mesh(new THREE.BoxGeometry(0.5, 0.06, 0.48), chairMat, { pos: [0, 0.47, 0] }))
chair.add(mesh(new THREE.BoxGeometry(0.48, 0.34, 0.05), chairMat, { pos: [0, 0.74, 0.24], rot: [0.12, 0, 0] }))
chair.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 16), blackMetal, { pos: [0, 0.24, 0] }))
for (let i = 0; i < 5; i++) {
  const a = (i / 5) * Math.PI * 2
  chair.add(limb([0, 0.05, 0], [Math.cos(a) * 0.28, 0.03, Math.sin(a) * 0.28], 0.016, blackMetal))
}
scene.add(chair)

// rim light from behind him (towards the wall) so his silhouette separates from the dark wall,
// plus a very soft warm key from the viewer's side
const rim = new THREE.SpotLight('#ffd2a1', 7, 4, 0.7, 0.9, 2)
rim.position.set(-0.55, 2.15, -0.25)
rim.target.position.set(0.05, 1.25, 1.25)
scene.add(rim, rim.target)
const rim2 = new THREE.SpotLight('#ffcf9d', 4, 4, 0.7, 0.9, 2)
rim2.position.set(0.8, 2.0, -0.2)
rim2.target.position.set(0.05, 1.2, 1.25)
scene.add(rim2, rim2.target)
const key = new THREE.DirectionalLight('#ffe2c4', 0.35)
key.position.set(3, 3.5, 6)
scene.add(key)

// ---------- Haris (stylised) ----------
const skin = mat('#c48a64', 0.5)
const coat = mat('#151517', 0.92)
const hairMat = mat('#1a110c', 0.75)
const capMat = mat('#1d1d1f', 0.95)
const trousers = mat('#1b1d22', 0.85)
const haris = new THREE.Group()
haris.position.set(0.02, 0, 1.3)
scene.add(haris)

// legs under the desk
haris.add(limb([-0.1, 0.53, 0.02], [-0.12, 0.55, -0.38], 0.075, trousers))
haris.add(limb([0.1, 0.53, 0.02], [0.13, 0.55, -0.38], 0.075, trousers))
haris.add(limb([-0.12, 0.55, -0.38], [-0.12, 0.08, -0.42], 0.06, trousers))
haris.add(limb([0.13, 0.55, -0.38], [0.14, 0.08, -0.42], 0.06, trousers))

// torso, leaning toward the laptop
const torso = new THREE.Group()
torso.position.set(0, 0.56, 0.02)
torso.rotation.x = -0.2
haris.add(torso)
torso.add(mesh(new THREE.CapsuleGeometry(0.17, 0.36, 10, 28), coat, { pos: [0, 0.32, 0], scale: [1.32, 1, 0.9] }))
torso.add(mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.09, 28), coat, { pos: [0, 0.66, -0.01] })) // turtleneck
torso.add(mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.08, 20), skin, { pos: [0, 0.72, -0.02] }))

// head
const head = new THREE.Group()
head.position.set(0, 0.86, -0.035)
head.rotation.x = 0.16
torso.add(head)
head.add(mesh(new THREE.SphereGeometry(0.115, 40, 32), skin, { scale: [0.9, 1.08, 1.0] }))
head.add(mesh(new THREE.SphereGeometry(0.06, 24, 16), skin, { pos: [0, -0.07, -0.045], scale: [1.1, 0.8, 1.0] })) // jaw
head.add(mesh(new THREE.ConeGeometry(0.018, 0.05, 16), skin, { pos: [0, -0.01, -0.12], rot: [-Math.PI / 2 + 0.25, 0, 0] })) // nose
for (const sx of [-1, 1]) head.add(mesh(new THREE.SphereGeometry(0.026, 16, 12), skin, { pos: [sx * 0.104, -0.005, 0.005], scale: [0.45, 1.0, 0.75] }))
// hair: back and sides only, so the face stays clear
head.add(mesh(new THREE.SphereGeometry(0.126, 40, 24, -Math.PI * 0.12, Math.PI * 1.24, 0, Math.PI * 0.74), hairMat, { pos: [0, 0.008, 0.014] }))
// flat cap
head.add(mesh(new THREE.SphereGeometry(0.132, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), capMat, { pos: [0, 0.045, -0.012], scale: [1.04, 0.62, 1.14], rot: [0.12, 0, 0] }))
head.add(mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.012, 40, 1, false, Math.PI / 2, Math.PI), capMat, { pos: [0, 0.05, -0.085], rot: [0.28, 0, 0], scale: [1, 1, 0.85] }))
// round glasses
const glassMat = mat('#0b0b0b', 0.3, 0.6)
for (const sx of [-1, 1]) {
  head.add(mesh(new THREE.TorusGeometry(0.03, 0.0045, 10, 32), glassMat, { pos: [sx * 0.045, 0.012, -0.112] }))
  head.add(limb([sx * 0.077, 0.014, -0.106], [sx * 0.104, 0.016, 0.0], 0.003, glassMat))
}
head.add(limb([-0.016, 0.014, -0.114], [0.016, 0.014, -0.114], 0.003, glassMat))

// arms: built each frame from a pose so typing and sipping blend smoothly
const armGroup = new THREE.Group()
haris.add(armGroup)
const handGeo = new THREE.SphereGeometry(0.036, 20, 16)
let armMeshes = []
function buildArms(sip, typing) {
  armMeshes.forEach((m) => armGroup.remove(m))
  armMeshes = []
  // positions are relative to haris
  const shoulderL = new THREE.Vector3(-0.215, 1.0, -0.06)
  const shoulderR = new THREE.Vector3(0.215, 1.0, -0.06)
  const tap = Math.sin(typing * 14) * 0.008
  const handL = new THREE.Vector3(-0.1, DESK_TOP + 0.035 + tap, -0.62)
  const elbowL = new THREE.Vector3(-0.27, 0.8, -0.3)
  const handRtype = new THREE.Vector3(0.12, DESK_TOP + 0.035 - tap, -0.6)
  const elbowRtype = new THREE.Vector3(0.28, 0.8, -0.28)
  const handRsip = new THREE.Vector3(0.05, 1.27, -0.27)
  const elbowRsip = new THREE.Vector3(0.26, 0.95, -0.15)
  const handR = handRtype.clone().lerp(handRsip, sip)
  const elbowR = elbowRtype.clone().lerp(elbowRsip, sip)
  for (const [s, e, h] of [[shoulderL, elbowL, handL], [shoulderR, elbowR, handR]]) {
    armMeshes.push(limb(s.toArray(), e.toArray(), 0.058, coat))
    armMeshes.push(limb(e.toArray(), h.toArray(), 0.05, coat))
    armMeshes.push(mesh(handGeo, skin, { pos: h.toArray(), scale: [1, 0.75, 1.25] }))
  }
  armMeshes.forEach((m) => armGroup.add(m))
  // mug follows the right hand while sipping, rests on the desk otherwise
  const handWorld = handR.clone().add(haris.position)
  const held = handWorld.clone().add(new THREE.Vector3(0.0, -0.06, -0.035))
  mug.position.copy(MUG_DESK.clone().lerp(held, Math.min(1, sip * 1.6)))
  mug.rotation.x = -0.9 * Math.max(0, sip - 0.6) * 2.5
  head.rotation.x = 0.16 - 0.22 * sip
}

// ---------- camera shots ----------
const SHOTS = {
  wide: { pos: [0.55, 1.72, 5.1], look: [-0.45, 1.68, -2.2], fov: 38 },
  open: { pos: [-1.6, 2.35, 1.9], look: [-1.0, 2.33, WALL_Z], fov: 32 },
  sip: { pos: [2.3, 1.85, 3.35], look: [-0.2, 1.3, 0.4], fov: 33 },
  mobile: { pos: [0.15, 1.7, 6.3], look: [0.0, 1.5, -2], fov: 50 },
}
const shot = SHOTS[SHOT] || SHOTS.wide
camera.position.set(...shot.pos)
camera.fov = shot.fov
camera.updateProjectionMatrix()
const lookAt = new THREE.Vector3(...shot.look)
camera.lookAt(lookAt)
if (SHOT === 'open') document.body.classList.add('is-open')
if (SHOT === 'sip') document.body.classList.add('is-detail')

// focus: the focused frame steps forward and its lamp brightens, the rest dim slightly
frames.forEach((f, i) => {
  const on = i === FOCUS
  const quiet = SHOT === 'open' ? 0.35 : 1
  f.spot.intensity = on ? 6.5 : 3.2 * quiet
  f.beam.material.uniforms.uStrength.value = on ? 0.2 : 0.1 * quiet
  f.glow.material.emissiveIntensity = on ? 9 : 5
  if (on) f.group.position.z += 0.05
})
document.getElementById('count').textContent = String(FOCUS + 1).padStart(2, '0')

// ---------- post ----------
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.5, 0.6, 0.92)
composer.addPass(bloom)
composer.addPass(new OutputPass())

// ---------- labels ----------
const labelsRoot = document.getElementById('labels')
const labels = frames.map((f, i) => {
  const el = document.createElement('div')
  el.className = 'label' + (i === FOCUS ? '' : ' is-dim')
  el.innerHTML = `<b>${f.p.title}</b><small>${f.p.tool}</small>`
  labelsRoot.appendChild(el)
  return el
})
const v = new THREE.Vector3()
function placeLabels() {
  frames.forEach((f, i) => {
    v.set(f.group.position.x, f.group.position.y - 0.86, f.group.position.z).project(camera)
    const x = (v.x * 0.5 + 0.5) * innerWidth
    const y = (-v.y * 0.5 + 0.5) * innerHeight
    labels[i].style.left = x + 'px'
    labels[i].style.top = y + 'px'
    labels[i].style.display = v.z < 1 && x > -80 && x < innerWidth + 80 ? 'block' : 'none'
  })
}

// ---------- loop ----------
const mouse = new THREE.Vector2()
addEventListener('pointermove', (e) => mouse.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5))
const clock = new THREE.Clock()
const fixedSip = SHOT === 'sip' ? 1 : 0
function frame() {
  const t = FROZEN ? 3.2 : clock.getElapsedTime()
  // sip every 9 seconds, typing the rest of the time
  const cycle = t % 9
  const sip = FROZEN ? fixedSip : cycle > 6.5 ? Math.sin(((cycle - 6.5) / 2.5) * Math.PI) : 0
  buildArms(sip, t)
  steam.forEach((s, i) => {
    const k = (t * 0.12 + i / steam.length) % 1
    s.position.set(Math.sin(t * 1.3 + i * 2.1) * 0.012 * (1 + k * 2), 0.11 + k * 0.2, 0)
    s.scale.set(0.04 + k * 0.05, 0.06 + k * 0.08, 1)
    s.material.opacity = 0.16 * Math.sin(k * Math.PI) * (1 - sip)
  })
  const breathe = 1 + Math.sin(t * 0.7) * 0.03
  lampLight.intensity = (SHOT === 'sip' ? 3.2 : 6) * breathe
  if (!FROZEN) {
    camera.position.set(shot.pos[0] + mouse.x * 0.35, shot.pos[1] - mouse.y * 0.18, shot.pos[2])
    camera.lookAt(lookAt)
  }
  placeLabels()
  composer.render()
  if (!FROZEN) requestAnimationFrame(frame)
}

THREE.DefaultLoadingManager.onLoad = () => {
  frame()
  if (FROZEN) {
    // render twice so shadows and bloom settle, then flag readiness for the screenshot
    requestAnimationFrame(() => {
      frame()
      window.__ready = true
    })
  }
}
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
  composer.setSize(innerWidth, innerHeight)
})
