/* Real portfolio works — add items as Haris sends photos + details */
const collection = [
	{
		title: 'Six automated workflows',
		eyebrow: 'One Amazon reselling business',
		description:
			'They read the inbox, pull the numbers off scanned invoices, match the product and update the books. Every day.',
		stack: 'n8n · Gmail · OpenAI · Sheets · Amazon',
		img: './gallery/img/work-amazon-n8n.png',
		focus: '50% 50%',
	},
	{
		title: 'Same automations. Now apps.',
		eyebrow: 'No-code client → iPhone app',
		description:
			'Started on n8n and Make. Now shipping the same client’s iPhone app with Claude Code, Cursor, and Lovable — I decide what needs to happen; they write, test, and open the PR.',
		stack: 'Claude Code · Cursor · Lovable · Codex · n8n · Make',
		img: './gallery/img/work-claude-apps.png',
		focus: '50% 50%',
	},
	{
		title: 'The model is rarely the reason',
		eyebrow: 'Gartner · June 2025',
		description:
			'A translation-company guardrail held a reply that looked wrong to a blunt “send + document” rule — then failed safe. Fixed the rule, retested nine more sentences, turned it back on. Checks need the same testing the AI gets.',
		stack: 'Claude · Gemini · LangChain · CrewAI · Cursor · Ollama',
		img: './gallery/img/work-gartner-agentic.png',
		focus: '50% 45%',
	},
]

window.__galleryRaf = null
window.__galleryCleanup = null

window.initCircularGallery = function initCircularGallery() {
	const gallery = document.querySelector('.gallery-root .gallery')
	const galleryContainer = document.querySelector(
		'.gallery-root .gallery-container',
	)
	const titleContainer = document.querySelector('.title-container')

	if (!gallery || !galleryContainer || !titleContainer) return
	if (typeof gsap === 'undefined') return
	if (!collection.length) return

	if (window.__galleryCleanup) {
		window.__galleryCleanup()
		window.__galleryCleanup = null
	}

	if (window.SplitText) {
		gsap.registerPlugin(SplitText)
	}

	gallery.innerHTML = ''
	titleContainer.innerHTML = ''

	const cards = []
	const transformState = []

	let currentDetails = null
	let isPreviewActive = false
	let isGalleryTransitioning = false
	let rafId = null
	let destroyed = false

	// Keep a full ring; cycle real works until more photos arrive
	const config = {
		imageCount: Math.max(18, collection.length),
		radius: 275,
		sensitivity: 500,
		effectFalloff: 250,
		cardMoveAmount: 50,
		lerpFactor: 0.15,
		isMobile: window.innerWidth < 1000,
	}

	const parallaxState = {
		targetX: 0,
		targetY: 0,
		targetZ: 0,
		currentX: 0,
		currentY: 0,
		currentZ: 0,
	}

	for (let i = 0; i < config.imageCount; i++) {
		const angle = (i / config.imageCount) * Math.PI * 2
		const x = config.radius * Math.cos(angle)
		const y = config.radius * Math.sin(angle)
		const item = collection[i % collection.length]

		const card = document.createElement('div')
		card.className = 'card'
		card.dataset.index = i
		card.dataset.workIndex = String(i % collection.length)

		const img = document.createElement('img')
		img.src = item.img
		img.alt = item.title
		img.decoding = 'async'
		if (item.focus) img.style.objectPosition = item.focus
		card.appendChild(img)

		gsap.set(card, {
			x,
			y,
			rotation: (angle * 180) / Math.PI + 90,
			transformPerspective: 800,
			transformOrigin: 'center center',
		})

		gallery.appendChild(card)
		cards.push(card)
		transformState.push({
			currentRotation: 0,
			targetRotation: 0,
			currentX: 0,
			targetX: 0,
			currentY: 0,
			targetY: 0,
			currentScale: 1,
			targetScale: 1,
			angle,
		})

		card.addEventListener('click', (e) => {
			if (!isPreviewActive && !isGalleryTransitioning) {
				togglePreview(parseInt(card.dataset.index, 10))
				e.stopPropagation()
			}
		})
	}

	function splitWords(p) {
		if (window.SplitText) {
			return new SplitText(p, { type: 'words', wordsClass: 'word' }).words
		}
		const parts = p.textContent.split(/\s+/)
		p.textContent = ''
		return parts.map((word) => {
			const span = document.createElement('span')
			span.className = 'word'
			span.textContent = word + ' '
			p.appendChild(span)
			return span
		})
	}

	function showDetails(item) {
		titleContainer.innerHTML = ''

		const block = document.createElement('div')
		block.className = 'work-details'

		if (item.eyebrow) {
			const eye = document.createElement('p')
			eye.className = 'work-details__eyebrow'
			eye.textContent = item.eyebrow
			block.appendChild(eye)
		}

		const title = document.createElement('p')
		title.className = 'work-details__title'
		title.textContent = item.title
		block.appendChild(title)

		if (item.description) {
			const desc = document.createElement('p')
			desc.className = 'work-details__desc'
			desc.textContent = item.description
			block.appendChild(desc)
		}

		if (item.stack) {
			const stack = document.createElement('p')
			stack.className = 'work-details__stack'
			stack.textContent = item.stack
			block.appendChild(stack)
		}

		titleContainer.appendChild(block)
		currentDetails = block

		const words = splitWords(title)
		const extras = [
			...block.querySelectorAll(
				'.work-details__eyebrow, .work-details__desc, .work-details__stack',
			),
		]

		gsap.set(words, { y: '125%' })
		gsap.set(extras, { opacity: 0, y: 12 })

		gsap.to(words, {
			y: '0%',
			duration: 0.75,
			delay: 1.15,
			stagger: 0.08,
			ease: 'power4.out',
		})
		gsap.to(extras, {
			opacity: 1,
			y: 0,
			duration: 0.65,
			delay: 1.55,
			stagger: 0.08,
			ease: 'power3.out',
		})
	}

	function hideDetails() {
		if (!currentDetails) return
		const words = currentDetails.querySelectorAll('.word')
		const extras = currentDetails.querySelectorAll(
			'.work-details__eyebrow, .work-details__desc, .work-details__stack',
		)

		gsap.to(extras, {
			opacity: 0,
			y: -8,
			duration: 0.35,
			ease: 'power2.in',
		})
		gsap.to(words, {
			y: '-125%',
			duration: 0.55,
			delay: 0.15,
			stagger: 0.05,
			ease: 'power4.out',
			onComplete: () => {
				if (currentDetails) currentDetails.remove()
				currentDetails = null
				titleContainer.innerHTML = ''
			},
		})
	}

	function togglePreview(index) {
		isPreviewActive = true
		isGalleryTransitioning = true

		const angle = transformState[index].angle
		const targetPosition = (Math.PI * 3) / 2
		let rotationRadians = targetPosition - angle

		if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2
		else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2

		transformState.forEach((state) => {
			state.currentRotation = state.targetRotation = 0
			state.currentScale = state.targetScale = 1
			state.currentX = state.targetX = state.currentY = state.targetY = 0
		})

		gsap.to(gallery, {
			onStart: () => {
				cards.forEach((card, i) => {
					gsap.to(card, {
						x: config.radius * Math.cos(transformState[i].angle),
						y: config.radius * Math.sin(transformState[i].angle),
						rotationY: 0,
						scale: 1,
						duration: 1.25,
						ease: 'power4.out',
					})
				})
			},
			scale: 5,
			y: 1300,
			rotation: (rotationRadians * 180) / Math.PI + 360,
			duration: 2,
			ease: 'power4.inOut',
			onComplete: () => {
				isGalleryTransitioning = false
			},
		})

		gsap.to(parallaxState, {
			currentX: 0,
			currentY: 0,
			currentZ: 0,
			duration: 0.5,
			ease: 'power2.out',
			onUpdate: () => {
				gsap.set(galleryContainer, {
					rotateX: parallaxState.currentX,
					rotateY: parallaxState.currentY,
					rotation: parallaxState.currentZ,
					transformOrigin: 'center center',
				})
			},
		})

		const workIndex = parseInt(cards[index].dataset.workIndex, 10)
		showDetails(collection[workIndex])
	}

	function resetGallery() {
		if (isGalleryTransitioning) return

		isGalleryTransitioning = true
		hideDetails()

		const viewportWidth = window.innerWidth
		let galleryScale = 1

		if (viewportWidth < 768) {
			galleryScale = 0.6
		} else if (viewportWidth < 1200) {
			galleryScale = 0.8
		}

		gsap.to(gallery, {
			scale: galleryScale,
			y: 0,
			x: 0,
			rotation: 0,
			duration: 2.5,
			ease: 'power4.inOut',
			onComplete: () => {
				isPreviewActive = isGalleryTransitioning = false
				Object.assign(parallaxState, {
					targetX: 0,
					targetY: 0,
					targetZ: 0,
					currentX: 0,
					currentY: 0,
					currentZ: 0,
				})
			},
		})
	}

	function handleResize() {
		const viewportWidth = window.innerWidth
		config.isMobile = viewportWidth < 1000

		let galleryScale = 1

		if (viewportWidth < 768) {
			galleryScale = 0.6
		} else if (viewportWidth < 1200) {
			galleryScale = 0.8
		}

		gsap.set(gallery, {
			scale: galleryScale,
		})

		if (!isPreviewActive) {
			parallaxState.targetX = 0
			parallaxState.targetY = 0
			parallaxState.targetZ = 0
			parallaxState.currentX = 0
			parallaxState.currentY = 0
			parallaxState.currentZ = 0

			transformState.forEach((state) => {
				state.targetRotation = 0
				state.currentRotation = 0
				state.targetScale = 1
				state.currentScale = 1
				state.targetX = 0
				state.currentX = 0
				state.targetY = 0
				state.currentY = 0
			})
		}
	}

	const onClick = () => {
		if (isPreviewActive && !isGalleryTransitioning) resetGallery()
	}

	const onKeydown = (e) => {
		if (e.key === 'Escape' && isPreviewActive && !isGalleryTransitioning)
			resetGallery()
	}

	const onMousemove = (e) => {
		if (isPreviewActive || isGalleryTransitioning || config.isMobile) return

		const centerX = window.innerWidth / 2
		const centerY = window.innerHeight / 2
		const percentX = (e.clientX - centerX) / centerX
		const percentY = (e.clientY - centerY) / centerY

		parallaxState.targetY = percentX * 15
		parallaxState.targetX = -percentY * 15
		parallaxState.targetZ = (percentX + percentY) * 5

		cards.forEach((card, index) => {
			const rect = card.getBoundingClientRect()
			const dx = e.clientX - (rect.left + rect.width / 2)
			const dy = e.clientY - (rect.top + rect.height / 2)
			const distance = Math.sqrt(dx * dx + dy * dy)

			if (distance < config.sensitivity && !config.isMobile) {
				const flipFactor = Math.max(0, 1 - distance / config.effectFalloff)
				const angle = transformState[index].angle
				const moveAmount = config.cardMoveAmount * flipFactor

				transformState[index].targetRotation = 180 * flipFactor
				transformState[index].targetScale = 1 + 0.3 * flipFactor
				transformState[index].targetX = moveAmount * Math.cos(angle)
				transformState[index].targetY = moveAmount * Math.sin(angle)
			} else {
				transformState[index].targetRotation = 0
				transformState[index].targetScale = 1
				transformState[index].targetX = 0
				transformState[index].targetY = 0
			}
		})
	}

	const onMouseout = (e) => {
		if (
			(e.relatedTarget === null || e.relatedTarget.nodeName === 'HTML') &&
			!isPreviewActive &&
			!isGalleryTransitioning
		) {
			transformState.forEach((state) => {
				state.targetRotation = 0
				state.targetScale = 1
				state.targetX = 0
				state.targetY = 0
			})
			parallaxState.targetX = 0
			parallaxState.targetY = 0
			parallaxState.targetZ = 0
		}
	}

	window.addEventListener('resize', handleResize)
	document.addEventListener('click', onClick)
	document.addEventListener('keydown', onKeydown)
	document.addEventListener('mousemove', onMousemove)
	document.addEventListener('mouseout', onMouseout)
	handleResize()

	function animate() {
		if (destroyed) return
		if (!isPreviewActive && !isGalleryTransitioning) {
			parallaxState.currentX +=
				(parallaxState.targetX - parallaxState.currentX) * config.lerpFactor
			parallaxState.currentY +=
				(parallaxState.targetY - parallaxState.currentY) * config.lerpFactor
			parallaxState.currentZ +=
				(parallaxState.targetZ - parallaxState.currentZ) * config.lerpFactor

			gsap.set(galleryContainer, {
				rotateX: parallaxState.currentX,
				rotateY: parallaxState.currentY,
				rotation: parallaxState.currentZ,
				transformOrigin: 'center center',
			})

			cards.forEach((card, index) => {
				const state = transformState[index]

				state.currentRotation +=
					(state.targetRotation - state.currentRotation) * config.lerpFactor
				state.currentScale +=
					(state.targetScale - state.currentScale) * config.lerpFactor
				state.currentX += (state.targetX - state.currentX) * config.lerpFactor
				state.currentY += (state.targetY - state.currentY) * config.lerpFactor

				const angle = state.angle
				const x = config.radius * Math.cos(angle)
				const y = config.radius * Math.sin(angle)

				gsap.set(card, {
					x: x + state.currentX,
					y: y + state.currentY,
					rotationY: state.currentRotation,
					scale: state.currentScale,
					rotation: (angle * 180) / Math.PI + 90,
					transformOrigin: 'center center',
					transformPerspective: 1000,
				})
			})
		}
		rafId = requestAnimationFrame(animate)
		window.__galleryRaf = rafId
	}

	animate()

	window.__galleryCleanup = () => {
		destroyed = true
		if (rafId) cancelAnimationFrame(rafId)
		window.removeEventListener('resize', handleResize)
		document.removeEventListener('click', onClick)
		document.removeEventListener('keydown', onKeydown)
		document.removeEventListener('mousemove', onMousemove)
		document.removeEventListener('mouseout', onMouseout)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	window.initCircularGallery()
})
