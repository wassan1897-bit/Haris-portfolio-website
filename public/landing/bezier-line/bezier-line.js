/* Physics Effects / 2 — SVG bezier line (vanilla port) */

window.__bezierLineCleanup = null

window.initBezierLine = function initBezierLine() {
	if (typeof window.__bezierLineCleanup === 'function') {
		window.__bezierLineCleanup()
		window.__bezierLineCleanup = null
	}

	const root = document.querySelector('.about-bezier')
	const line = document.querySelector('.about-bezier__line')
	const path = document.querySelector('.about-bezier__path')
	const hit = document.querySelector('.about-bezier__hit')
	if (!path || !hit) return

	let progress = 0
	let x = 0.5
	let time = Math.PI / 2
	let reqId = null
	const midY = 100

	const lerp = (a, b, t) => a * (1 - t) + b * t

	function setPath(value) {
		const width =
			path.ownerSVGElement?.clientWidth || line?.clientWidth || root?.clientWidth || 1
		path.setAttributeNS(
			null,
			'd',
			`M0 ${midY} Q${width * x} ${midY + value}, ${width} ${midY}`,
		)
	}

	function resetAnimation() {
		time = Math.PI / 2
		progress = 0
	}

	function animateOut() {
		const newProgress = progress * Math.sin(time)
		progress = lerp(progress, 0, 0.025)
		time += 0.2
		setPath(newProgress)
		if (Math.abs(progress) > 0.75) {
			reqId = requestAnimationFrame(animateOut)
		} else {
			resetAnimation()
			setPath(0)
		}
	}

	function onEnter() {
		if (reqId) {
			cancelAnimationFrame(reqId)
			reqId = null
			resetAnimation()
		}
	}

	function onMove(e) {
		const bounds = path.getBoundingClientRect()
		if (!bounds.width) return
		x = (e.clientX - bounds.left) / bounds.width
		progress += e.movementY
		setPath(progress)
	}

	function onLeave() {
		animateOut()
	}

	function onResize() {
		setPath(progress)
	}

	setPath(0)
	hit.addEventListener('mouseenter', onEnter)
	hit.addEventListener('mousemove', onMove)
	hit.addEventListener('mouseleave', onLeave)
	window.addEventListener('resize', onResize)

	if (root && typeof gsap !== 'undefined') {
		gsap.fromTo(
			root,
			{ opacity: 0, y: 14 },
			{ opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.05 },
		)
	} else if (root) {
		root.style.opacity = '1'
		root.style.transform = 'none'
	}

	window.__bezierLineCleanup = () => {
		hit.removeEventListener('mouseenter', onEnter)
		hit.removeEventListener('mousemove', onMove)
		hit.removeEventListener('mouseleave', onLeave)
		window.removeEventListener('resize', onResize)
		if (reqId) cancelAnimationFrame(reqId)
		reqId = null
	}
}
