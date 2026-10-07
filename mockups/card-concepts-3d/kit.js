// Shared Three.js setup for the 3D card concepts: one fixed-size renderer, canvas textures, bloom.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export { THREE, RoundedBoxGeometry }
export * from './data.js'

export const W = 1440
export const H = 900

export function stage({ fov = 35, exposure = 1, env = 0.5, bloom = null, shadows = false } = {}) {
	const canvas = document.getElementById('scene')
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true })
	renderer.setPixelRatio(1)
	renderer.setSize(W, H, false)
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = exposure
	renderer.shadowMap.enabled = shadows
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	const scene = new THREE.Scene()
	const pmrem = new THREE.PMREMGenerator(renderer)
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
	scene.environmentIntensity = env
	pmrem.dispose()
	const camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 200)
	let composer = null
	if (bloom) {
		composer = new EffectComposer(renderer)
		composer.addPass(new RenderPass(scene, camera))
		composer.addPass(new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), ...bloom))
		composer.addPass(new OutputPass())
	}
	const render = () => (composer ? composer.render() : renderer.render(scene, camera))
	return { renderer, scene, camera, render }
}

export const loadImg = (src) =>
	new Promise((res) => {
		const i = new Image()
		i.onload = () => res(i)
		i.onerror = () => res(null)
		i.src = src
	})

// canvas texture drawn once; sRGB so the colours match the page
export function tex(w, h, draw) {
	const cv = document.createElement('canvas')
	cv.width = w
	cv.height = h
	draw(cv.getContext('2d'), w, h)
	const t = new THREE.CanvasTexture(cv)
	t.colorSpace = THREE.SRGBColorSpace
	t.anisotropy = 8
	return t
}

// object-fit: cover for canvas drawing
export function cover(c, img, x, y, w, h, fx = 0.5, fy = 0.5) {
	if (!img) return
	const s = Math.max(w / img.width, h / img.height)
	const sw = w / s
	const sh = h / s
	c.drawImage(img, (img.width - sw) * fx, (img.height - sh) * fy, sw, sh, x, y, w, h)
}

// screen-space gradient behind the scene
export function backdrop(scene, inner, outer, cx = 0.5, cy = 0.45) {
	scene.background = tex(720, 450, (c, w, h) => {
		const g = c.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, w * 0.75)
		g.addColorStop(0, inner)
		g.addColorStop(1, outer)
		c.fillStyle = g
		c.fillRect(0, 0, w, h)
	})
}

export async function fonts(list) {
	await Promise.all(list.map((f) => document.fonts.load(f)))
}

// world point to page pixels
export function toScreen(v, camera) {
	const p = v.clone().project(camera)
	return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H }
}

export async function finish(render) {
	await document.fonts.ready
	await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))))
	render()
	render()
	window.__ready = true
}

// ---------- overlay helpers ----------
import { LOGO as _LOGO, pad as _pad } from './data.js'
export function ui(cls, html, style = {}) {
	const el = document.createElement('div')
	el.className = 'ui ' + cls
	el.innerHTML = html
	Object.assign(el.style, style)
	document.body.appendChild(el)
	return el
}
export const chipHTML = (p, i) => `<img src="${_LOGO + p.logo}" alt=""><div><b>${p.card}<em>${_pad(i)}</em></b><span>${p.sub}</span></div>`
export const detailHTML = (p, i, { k = 'Project', next = 'Next project', back = 'Back to all 12' } = {}) => `
	<span class="k"><img src="${_LOGO + p.logo}" alt="">${k} ${_pad(i)} / 12 &nbsp;&middot;&nbsp; ${p.tag.replace('Case study, ', '')}</span>
	<h1>${p.name}</h1><div class="sub">${p.sub}</div><p>${p.copy}</p>
	${p.figs.length ? `<div class="figs">${p.figs.map((f) => `<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join('')}</div>` : ''}
	<div class="stack">${p.stack.map((s) => `<span>${s}</span>`).join('')}</div>
	<div class="acts"><span>${next} &rarr;</span><span>${back}</span></div>`
