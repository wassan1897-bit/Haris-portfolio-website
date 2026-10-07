// A poseable, code-built Haris for the scene concepts. Facing +z, feet at y 0, about 1.78 m tall.
// Joint rotations: a negative x swings a limb forward, a positive x at the knee bends it.
import * as THREE from 'three'

export function makeHaris({ jacket = '#2c3035', pants = '#24272c', knit = '#e7dfd2', skin = '#c48d69', shoes = '#151515', cap = '#1d1f22' } = {}) {
	const M = (color, rough = 0.7, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra })
	const mats = {
		jacket: new THREE.MeshPhysicalMaterial({ color: jacket, roughness: 0.78, sheen: 0.6, sheenColor: '#8a8f96', sheenRoughness: 0.6 }),
		pants: M(pants, 0.82),
		knit: new THREE.MeshPhysicalMaterial({ color: knit, roughness: 0.9, sheen: 0.8, sheenColor: '#ffffff' }),
		skin: M(skin, 0.55),
		shoes: M(shoes, 0.45),
		hair: M('#17120f', 0.85),
		cap: M(cap, 0.8),
		dark: M('#0d0d0e', 0.3, { metalness: 0.6 }),
	}
	const add = (parent, geo, mat, [x, y, z] = [0, 0, 0], [rx, ry, rz] = [0, 0, 0], [sx, sy, sz] = [1, 1, 1]) => {
		const m = new THREE.Mesh(geo, mat)
		m.position.set(x, y, z)
		m.rotation.set(rx, ry, rz)
		m.scale.set(sx, sy, sz)
		m.castShadow = true
		parent.add(m)
		return m
	}
	const joint = (parent, x, y, z) => {
		const g = new THREE.Group()
		g.position.set(x, y, z)
		parent.add(g)
		return g
	}
	// limb hanging down from a joint
	const limb = (parent, len, r0, r1, mat) => {
		const g = new THREE.CylinderGeometry(r1, r0, len, 14, 1)
		add(parent, g, mat, [0, -len / 2, 0])
		add(parent, new THREE.SphereGeometry(r0, 14, 10), mat)
	}

	const root = new THREE.Group()
	const hips = joint(root, 0, 0.95, 0)
	add(hips, new THREE.CylinderGeometry(0.172, 0.15, 0.2, 20), mats.pants, [0, -0.03, 0], [0, 0, 0], [1, 1, 0.72])

	// torso: jacket as a lathe, flattened front to back
	const spine = joint(hips, 0, 0.04, 0)
	const prof = [[0.0, -0.06], [0.175, -0.06], [0.18, 0.06], [0.19, 0.24], [0.205, 0.4], [0.19, 0.48], [0.12, 0.53], [0.07, 0.545], [0.0, 0.545]].map(([r, y]) => new THREE.Vector2(r, y))
	add(spine, new THREE.LatheGeometry(prof, 24), mats.jacket, [0, 0, 0], [0, 0, 0], [1, 1, 0.68])
	// open jacket front shows the knit
	add(spine, new THREE.BoxGeometry(0.1, 0.3, 0.01), mats.knit, [0, 0.36, 0.128], [-0.12, 0, 0])
	for (const s of [-1, 1]) add(spine, new THREE.BoxGeometry(0.05, 0.32, 0.012), mats.jacket, [s * 0.06, 0.34, 0.132], [-0.12, 0, s * 0.18]) // lapels
	const neck = joint(spine, 0, 0.53, 0)
	add(neck, new THREE.CylinderGeometry(0.068, 0.075, 0.11, 18), mats.knit, [0, 0.03, 0])
	add(neck, new THREE.CylinderGeometry(0.048, 0.05, 0.1, 12), mats.skin, [0, 0.1, 0])
	const head = joint(neck, 0, 0.2, 0.0)
	head.scale.setScalar(1.12)
	add(head, new THREE.SphereGeometry(0.105, 28, 20), mats.skin, [0, 0, 0], [0, 0, 0], [0.9, 1.08, 0.98])
	add(head, new THREE.SphereGeometry(0.05, 16, 10), mats.skin, [0, -0.07, 0.045], [0, 0, 0], [1.25, 0.8, 1]) // jaw
	add(head, new THREE.ConeGeometry(0.016, 0.04, 10), mats.skin, [0, -0.005, 0.105], [Math.PI / 2.4, 0, 0]) // nose
	for (const s of [-1, 1]) add(head, new THREE.SphereGeometry(0.022, 10, 8), mats.skin, [s * 0.095, 0, -0.005], [0, 0, 0], [0.5, 1, 0.8]) // ears
	// hair
	add(head, new THREE.SphereGeometry(0.11, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), mats.hair, [0, 0.012, -0.008], [-0.15, 0, 0], [0.92, 1.0, 1.0])
	// cap with a brim
	add(head, new THREE.SphereGeometry(0.113, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.45), mats.cap, [0, 0.03, -0.004], [-0.1, 0, 0], [0.95, 0.95, 1.02])
	add(head, new THREE.CylinderGeometry(0.075, 0.075, 0.008, 20, 1, false, -Math.PI / 2, Math.PI), mats.cap, [0, 0.055, 0.075], [0.12, 0, 0], [1, 1, 1.15])
	// glasses
	for (const s of [-1, 1]) {
		add(head, new THREE.TorusGeometry(0.026, 0.0042, 6, 20), mats.dark, [s * 0.038, 0.012, 0.1])
		add(head, new THREE.CylinderGeometry(0.003, 0.003, 0.1, 5), mats.dark, [s * 0.066, 0.014, 0.05], [Math.PI / 2, 0, 0])
		add(head, new THREE.SphereGeometry(0.008, 8, 6), mats.dark, [s * 0.038, 0.012, 0.088])
	}
	add(head, new THREE.CylinderGeometry(0.003, 0.003, 0.025, 5), mats.dark, [0, 0.018, 0.104], [0, 0, Math.PI / 2])

	// arms: shoulder -> elbow -> hand
	const arm = (s) => {
		const sh = joint(spine, s * 0.19, 0.455, 0)
		limb(sh, 0.29, 0.054, 0.05, mats.jacket)
		const el = joint(sh, 0, -0.29, 0)
		limb(el, 0.25, 0.05, 0.043, mats.jacket)
		add(el, new THREE.CylinderGeometry(0.036, 0.036, 0.03, 12), mats.knit, [0, -0.25, 0]) // cuff
		const hand = joint(el, 0, -0.28, 0)
		add(hand, new THREE.BoxGeometry(0.065, 0.085, 0.03), mats.skin, [0, -0.02, 0])
		for (let f = 0; f < 4; f++) add(hand, new THREE.CapsuleGeometry(0.008, 0.04, 2, 6), mats.skin, [-0.022 + f * 0.0145, -0.08, 0.004], [0.25, 0, 0])
		add(hand, new THREE.CapsuleGeometry(0.009, 0.035, 2, 6), mats.skin, [-s * 0.035, -0.03, 0.015], [0.5, 0, s * 0.6])
		return { sh, el, hand }
	}
	const L = arm(1)
	const R = arm(-1)
	// legs: hip -> knee -> foot
	const leg = (s) => {
		const hp = joint(hips, s * 0.095, -0.04, 0)
		limb(hp, 0.45, 0.078, 0.06, mats.pants)
		const kn = joint(hp, 0, -0.45, 0)
		limb(kn, 0.42, 0.058, 0.045, mats.pants)
		const ft = joint(kn, 0, -0.43, 0)
		add(ft, new THREE.BoxGeometry(0.095, 0.07, 0.26), mats.shoes, [0, -0.025, 0.06])
		return { hp, kn, ft }
	}
	const LL = leg(1)
	const RL = leg(-1)

	const J = { hips, spine, neck, head, lSh: L.sh, lEl: L.el, lHand: L.hand, rSh: R.sh, rEl: R.el, rHand: R.hand, lHip: LL.hp, lKnee: LL.kn, lFoot: LL.ft, rHip: RL.hp, rKnee: RL.kn, rFoot: RL.ft }
	function pose(p) {
		for (const k in p) {
			if (k === 'y') hips.position.y = p.y
			else J[k].rotation.set(...p[k])
		}
	}
	return { root, J, pose, mats }
}

// ready-made poses
export const POSES = {
	// sitting on something about 0.45 m high, forearms forward
	sit: { y: 0.53, lHip: [-1.5, 0, 0.05], rHip: [-1.5, 0, -0.05], lKnee: [1.45, 0, 0], rKnee: [1.45, 0, 0], lFoot: [0.05, 0, 0], rFoot: [0.05, 0, 0] },
	stand: { y: 0.95 },
	// on one knee
	kneel: { y: 0.55, lHip: [-1.55, 0, 0.08], lKnee: [1.5, 0, 0], lFoot: [0.05, 0, 0], rHip: [0.15, 0, -0.05], rKnee: [1.7, 0, 0], rFoot: [0.4, 0, 0] },
}
