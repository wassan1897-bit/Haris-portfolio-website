/* Physics Effects / 1 — sticky cursor + magnetic (GSAP port) */

window.__stickyCursorCleanup = null

window.initStickyCursor = function initStickyCursor() {
	if (typeof window.__stickyCursorCleanup === 'function') {
		window.__stickyCursorCleanup()
		window.__stickyCursorCleanup = null
	}

	if (typeof gsap === 'undefined') return
	// Touch / coarse pointers only — keep cursor on desktop even with reduced motion
	if (window.matchMedia('(pointer: coarse)').matches) return
	if (window.matchMedia('(hover: none)').matches) return

	const menuBtn = document.getElementById('js-menu-btn')
	if (!menuBtn) return

	let target = document.getElementById('js-sticky-bounds')
	if (!target) {
		target = document.createElement('div')
		target.className = 'sticky-bounds'
		target.id = 'js-sticky-bounds'
		target.setAttribute('aria-hidden', 'true')
		menuBtn.appendChild(target)
	}

	let cursor = document.querySelector('.sticky-cursor')
	if (!cursor) {
		cursor = document.createElement('div')
		cursor.className = 'sticky-cursor'
		cursor.setAttribute('aria-hidden', 'true')
		document.body.appendChild(cursor)
	}

	document.documentElement.classList.add('has-sticky-cursor')

	let isHovered = false
	let cursorSize = 15
	let scaleX = 1
	let scaleY = 1
	let rotate = 0
	let nativeZone = false

	gsap.set(cursor, {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
		xPercent: -50,
		yPercent: -50,
		width: cursorSize,
		height: cursorSize,
		scaleX: 1,
		scaleY: 1,
		rotation: 0,
		opacity: 1,
		display: 'block',
	})

	const xTo = gsap.quickTo(cursor, 'x', {
		duration: 0.35,
		ease: 'power3.out',
	})
	const yTo = gsap.quickTo(cursor, 'y', {
		duration: 0.35,
		ease: 'power3.out',
	})

	function setCursorSize(size) {
		cursorSize = size
		gsap.to(cursor, {
			width: size,
			height: size,
			duration: 0.25,
			ease: 'power2.out',
			overwrite: 'auto',
		})
	}

	function manageMouseMove(e) {
		const { clientX, clientY } = e

		if (nativeZone) {
			gsap.set(cursor, { autoAlpha: 0 })
			return
		}
		gsap.set(cursor, { autoAlpha: 1 })

		if (isHovered) {
			const rect = target.getBoundingClientRect()
			const center = {
				x: rect.left + rect.width / 2,
				y: rect.top + rect.height / 2,
			}
			const distance = {
				x: clientX - center.x,
				y: clientY - center.y,
			}
			rotate = (Math.atan2(distance.y, distance.x) * 180) / Math.PI

			const absDistance = Math.max(Math.abs(distance.x), Math.abs(distance.y))
			const halfH = Math.max(rect.height / 2, 1)
			const halfW = Math.max(rect.width / 2, 1)
			const tX = Math.min(Math.max(absDistance / halfH, 0), 1)
			const tY = Math.min(Math.max(absDistance / halfW, 0), 1)
			scaleX = 1 + tX * 0.3
			scaleY = 1 - tY * 0.2

			gsap.set(cursor, { scaleX, scaleY, rotation: rotate })
			xTo(center.x + distance.x * 0.1)
			yTo(center.y + distance.y * 0.1)
		} else {
			gsap.set(cursor, { scaleX: 1, scaleY: 1, rotation: 0 })
			xTo(clientX)
			yTo(clientY)
		}
	}

	function manageMouseOver() {
		isHovered = true
		setCursorSize(60)
	}

	function manageMouseLeave() {
		isHovered = false
		setCursorSize(15)
		gsap.to(cursor, {
			scaleX: 1,
			scaleY: 1,
			rotation: 0,
			duration: 0.15,
			ease: 'power2.out',
			overwrite: 'auto',
		})
	}

	function syncNativeZone(e) {
		const el = e.target
		const inNative =
			el &&
			typeof el.closest === 'function' &&
			!!el.closest('.grid--interaction, .content-open .content, .works-viewer.is-open')
		if (inNative === nativeZone) return
		nativeZone = inNative
		document.documentElement.classList.toggle('sticky-cursor--native', nativeZone)
		gsap.set(cursor, { autoAlpha: nativeZone ? 0 : 1 })
	}

	window.revealStickyCursor = function revealStickyCursor() {
		nativeZone = false
		document.documentElement.classList.remove('sticky-cursor--native')
		if (!cursor) return
		gsap.set(cursor, {
			autoAlpha: 1,
			display: 'block',
			opacity: 1,
			visibility: 'visible',
		})
	}

	target.addEventListener('mouseenter', manageMouseOver)
	target.addEventListener('mouseleave', manageMouseLeave)
	window.addEventListener('mousemove', manageMouseMove)
	window.addEventListener('mousemove', syncNativeZone, { passive: true })

	const magnetics = []
	document.querySelectorAll('[data-magnetic]').forEach((el) => {
		el.classList.add('magnetic')
		const onMove = (e) => {
			const { height, width, left, top } = el.getBoundingClientRect()
			const middleX = e.clientX - (left + width / 2)
			const middleY = e.clientY - (top + height / 2)
			gsap.to(el, {
				x: middleX * 0.2,
				y: middleY * 0.2,
				duration: 0.45,
				ease: 'power3.out',
				overwrite: 'auto',
			})
		}
		const onLeave = () => {
			gsap.to(el, {
				x: 0,
				y: 0,
				duration: 0.7,
				ease: 'elastic.out(1, 0.35)',
				overwrite: 'auto',
			})
		}
		el.addEventListener('mousemove', onMove)
		el.addEventListener('mouseleave', onLeave)
		magnetics.push({ el, onMove, onLeave })
	})

	window.__stickyCursorCleanup = () => {
		target.removeEventListener('mouseenter', manageMouseOver)
		target.removeEventListener('mouseleave', manageMouseLeave)
		window.removeEventListener('mousemove', manageMouseMove)
		window.removeEventListener('mousemove', syncNativeZone)
		magnetics.forEach(({ el, onMove, onLeave }) => {
			el.removeEventListener('mousemove', onMove)
			el.removeEventListener('mouseleave', onLeave)
			gsap.set(el, { clearProps: 'x,y' })
		})
		document.documentElement.classList.remove(
			'has-sticky-cursor',
			'sticky-cursor--native',
		)
		if (cursor && cursor.parentNode) cursor.parentNode.removeChild(cursor)
	}
}
