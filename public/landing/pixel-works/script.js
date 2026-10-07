/* Scroll Animation 57 — PixelImage (GSAP ScrollTrigger), vanilla port */
;(function () {
	if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return
	gsap.registerPlugin(ScrollTrigger)

	const DEFAULT_PX_STEPS = [2, 5, 6, 8, 100]

	function initPixelImage(container) {
		const canvas = container.querySelector('canvas')
		const hiddenImg = container.querySelector('img[data-pixel-src]')
		if (!canvas || !hiddenImg) return

		const ctx = canvas.getContext('2d')
		const pxSteps = (container.dataset.pxSteps || DEFAULT_PX_STEPS.join(','))
			.split(',')
			.map((n) => parseFloat(n.trim()))
			.filter((n) => !Number.isNaN(n))
		const triggerStart = container.dataset.triggerStart || 'top+=20% bottom'
		const speed = parseInt(container.dataset.speed || '80', 10)
		const initialDelay = parseInt(container.dataset.initialDelay || '300', 10)

		const state = { pxIndex: 0, imgRatio: 1, img: null }
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.src = hiddenImg.getAttribute('data-pixel-src') || hiddenImg.src
		state.img = img

		const render = () => {
			const cw = container.offsetWidth
			const ch = container.offsetHeight
			if (!cw || !ch || !state.img?.complete) return

			canvas.width = cw
			canvas.height = ch

			const w = cw * 1.05
			const h = ch * 1.05
			let newWidth = w
			let newHeight = h
			let newX = 0
			const newY = 0

			if (w / h > state.imgRatio) {
				newHeight = Math.round(w / state.imgRatio)
			} else {
				newWidth = Math.round(h * state.imgRatio)
				newX = (w - newWidth) / 2
			}

			const size = pxSteps[Math.min(state.pxIndex, pxSteps.length - 1)] * 0.01
			ctx.imageSmoothingEnabled = size === 1
			ctx.clearRect(0, 0, cw, ch)
			ctx.drawImage(img, 0, 0, w * size, h * size)
			ctx.drawImage(canvas, 0, 0, w * size, h * size, newX, newY, newWidth, newHeight)
		}

		const animatePixels = () => {
			if (state.pxIndex < pxSteps.length) {
				window.setTimeout(
					() => {
						render()
						state.pxIndex++
						animatePixels()
					},
					state.pxIndex === 0 ? initialDelay : speed,
				)
			}
		}

		img.onload = () => {
			state.imgRatio = img.width / img.height
			render()
			window.addEventListener('resize', render)

			ScrollTrigger.create({
				trigger: container,
				start: triggerStart,
				onEnter: animatePixels,
				once: true,
			})

			ScrollTrigger.create({
				trigger: container,
				start: 'top bottom',
				onEnter: () => gsap.set(container, { opacity: 1 }),
				once: true,
			})
		}
	}

	function initAll() {
		document.querySelectorAll('.pixel-image').forEach(initPixelImage)
		ScrollTrigger.refresh()
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAll)
	} else {
		initAll()
	}
})()
