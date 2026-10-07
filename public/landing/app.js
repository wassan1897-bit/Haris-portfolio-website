/* About page animations + video. Page scroll flow lives in page-flow.js */

function applyPageBody(htmlText) {
	const match = htmlText.match(/<body([^>]*)>([\s\S]*)<\/body>/i)
	if (!match) return

	;[...document.body.attributes].forEach((attr) => {
		document.body.removeAttribute(attr.name)
	})

	const attrText = match[1] || ''
	attrText.replace(
		/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
		(_, name, dq, sq, bare) => {
			if (!name || name === '/') return ''
			const value = dq ?? sq ?? bare
			if (value === undefined) document.body.setAttribute(name, '')
			else document.body.setAttribute(name, value)
			return ''
		},
	)

	document.body.innerHTML = match[2]

	const title = htmlText.match(/<title[^>]*>(.*?)<\/title>/i)
	if (title) document.title = title[1]
}

function initializeAnimations() {
	document.documentElement.style.overflow = 'hidden'
	document.body.style.overflow = 'hidden'

	const fromIntro = sessionStorage.getItem('harisFromIntro') === '1'
	if (fromIntro) sessionStorage.removeItem('harisFromIntro')

	// Coming from intro wipe: start immediately (no blank cream hold)
	const navDelay = fromIntro ? 0.05 : 0.85
	const heroDelay = fromIntro ? 0.08 : 0.85
	const aboutDelay = fromIntro ? 0.75 : 0.5

	// Keep cream continuity: intro ends covered in #f1efe7 → About lifts the same plane
	const receiveWipe = document.getElementById('intro-receive-wipe')
	if (fromIntro && receiveWipe && document.body.dataset.page === 'about') {
		receiveWipe.style.display = 'block'
		gsap.set(receiveWipe, { yPercent: 0, opacity: 1 })
		gsap.set(['.info--about', '.site-header'], { opacity: 0 })
		gsap
			.timeline({
				onComplete: () => {
					receiveWipe.remove()
				},
			})
			.to(receiveWipe, {
				yPercent: -100,
				duration: 0.95,
				ease: 'power3.inOut',
				delay: 0.02,
			})
			.to(
				['.info--about', '.site-header'],
				{
					opacity: 1,
					duration: 0.55,
					ease: 'power2.out',
				},
				'-=0.4',
			)
	} else if (receiveWipe) {
		receiveWipe.remove()
	}

	gsap.to('.link a', {
		y: 0,
		duration: fromIntro ? 0.7 : 1,
		stagger: 0.08,
		ease: 'power4.out',
		delay: navDelay,
	})

	if (typeof window.initNavBar === 'function') {
		window.initNavBar()
	} else if (typeof window.initCurvedNav === 'function') {
		window.initCurvedNav()
	}

	if (typeof window.initStickyCursor === 'function') {
		window.initStickyCursor()
	}

	if (typeof window.initBezierLine === 'function') {
		window.initBezierLine()
	}

	if (typeof window.initMagneticButtons === 'function') {
		window.initMagneticButtons()
	}

	if (document.querySelector('.hero h1')) {
		const heroEl = document.querySelector('.hero h1')
		// Avoid double-wrapping SplitType on revisit
		heroEl.querySelectorAll('.char').forEach((char) => {
			char.replaceWith(...char.childNodes)
		})
		heroEl.normalize()

		const heroText = new SplitType(heroEl, { types: 'chars' })
		gsap.set(heroText.chars, { y: '110%' })
		gsap.to(heroText.chars, {
			y: '0%',
			duration: fromIntro ? 0.75 : 1,
			stagger: fromIntro ? 0.05 : 0.075,
			ease: 'power4.out',
			delay: heroDelay,
			onComplete: () => {
				if (document.querySelector('.hero-welcome')) {
					gsap.fromTo(
						'.hero-welcome',
						{ opacity: 0, y: 16 },
						{ opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
					)
				}
				if (document.querySelector('.scroll-hint')) {
					gsap.fromTo(
						'.scroll-hint',
						{ opacity: 0, y: 12, xPercent: -50 },
						{
							opacity: 1,
							y: 0,
							xPercent: -50,
							duration: 0.6,
							ease: 'power3.out',
							delay: 0.08,
							onComplete: () => {
								gsap.to('.scroll-hint', {
									y: 6,
									xPercent: -50,
									duration: 1.1,
									ease: 'sine.inOut',
									yoyo: true,
									repeat: -1,
								})
							},
						},
					)
				}
			},
		})
	} else {
		if (document.querySelector('.hero-welcome')) {
			gsap.fromTo(
				'.hero-welcome',
				{ opacity: 0, y: 24 },
				{ opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', delay: heroDelay },
			)
		}
		if (document.querySelector('.scroll-hint')) {
			gsap.fromTo(
				'.scroll-hint',
				{ opacity: 0, y: 12, xPercent: -50 },
				{
					opacity: 1,
					y: 0,
					xPercent: -50,
					duration: 0.8,
					ease: 'power3.out',
					delay: heroDelay + 0.5,
					onComplete: () => {
						gsap.to('.scroll-hint', {
							y: 6,
							xPercent: -50,
							duration: 1.1,
							ease: 'sine.inOut',
							yoyo: true,
							repeat: -1,
						})
					},
				},
			)
		}
	}

	if (document.querySelector('.about-block')) {
		typeAboutBlock(aboutDelay)
		playAboutVideo()
	} else if (document.querySelector('.info p:not(.scroll-hint)')) {
		document.querySelectorAll('.info p:not(.scroll-hint) .line').forEach((line) => {
			line.replaceWith(document.createTextNode(line.textContent))
		})

		const text = new SplitType('.info p:not(.scroll-hint)', {
			types: 'lines',
			tagName: 'div',
			lineClass: 'line',
		})

		text.lines.forEach((line) => {
			line.innerHTML = `<span>${line.innerHTML}</span>`
		})

		gsap.set('.info p:not(.scroll-hint) .line span', {
			y: 400,
			display: 'block',
		})

		gsap.to('.info p:not(.scroll-hint) .line span', {
			y: 0,
			duration: 2,
			stagger: 0.075,
			ease: 'power4.out',
			delay: 0.25,
		})
	}

	if (document.querySelector('.grid--slideshow')) {
		if (typeof window.initCrossroadsSlideshow === 'function') {
			window.initCrossroadsSlideshow()
		}
	} else if (typeof window.__crossroadsCleanup === 'function') {
		window.__crossroadsCleanup()
		window.__crossroadsCleanup = null
	}
}

function playAboutVideo() {
	const video = document.querySelector('.about-video')
	if (!video) return
	video.muted = true
	const tryPlay = () => {
		const p = video.play()
		if (p && typeof p.catch === 'function') p.catch(() => {})
	}
	if (video.readyState >= 2) tryPlay()
	else video.addEventListener('canplay', tryPlay, { once: true })
}

let aboutToolsTl = null

function animateAboutTools(delay = 0) {
	const tech = document.querySelector('.about-tech-block')
	const stack = document.querySelector('.about-stack')
	const tools = document.querySelectorAll('.about-tool')
	if (!tech && !stack && !tools.length) return

	if (aboutToolsTl) aboutToolsTl.kill()

	aboutToolsTl = gsap.timeline({ delay })

	if (tech) {
		aboutToolsTl.fromTo(
			tech,
			{ opacity: 0, y: 10 },
			{ opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
		)
	}

	if (stack) {
		aboutToolsTl.fromTo(
			stack,
			{ opacity: 0, y: 10 },
			{ opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
			'-=0.22',
		)
	}

	if (tools.length) {
		aboutToolsTl.fromTo(
			tools,
			{ opacity: 0, y: 14 },
			{
				opacity: 1,
				y: 0,
				duration: 0.45,
				stagger: 0.05,
				ease: 'power3.out',
			},
			'-=0.22',
		)
	}
}

function typeAboutBlock(delay = 0.5) {
	// Text Animations/17 — Copy.jsx line mask reveal (GSAP SplitText lines)
	const wrapper = document.querySelector('.about-block')
	if (!wrapper) return

	const intro = wrapper.querySelector('.about-intro')
	const elements = intro
		? [...intro.querySelectorAll(':scope > p')]
		: [...wrapper.querySelectorAll(':scope > p')]
	const allLines = []

	elements.forEach((element) => {
		element.classList.add('is-typed')
		element.style.visibility = 'visible'

		// clean previous splits if revisiting page
		element.querySelectorAll('.line').forEach((line) => {
			line.replaceWith(...line.childNodes)
		})
		element.normalize()

		const split = new SplitType(element, {
			types: 'lines',
			tagName: 'div',
			lineClass: 'line',
			lineThreshold: 0.1,
		})

		split.lines.forEach((line) => {
			line.innerHTML = `<span>${line.innerHTML}</span>`
		})

		allLines.push(...split.lines)
	})

	const spans = allLines.map((line) => line.querySelector('span')).filter(Boolean)
	if (!spans.length) {
		animateAboutTools(0.05)
		return
	}

	gsap.set(spans, { y: '100%' })

	// Reveal tech/logos while intro lines are still animating — don't wait
	// until typing finishes or they look "missing" for several seconds.
	animateAboutTools(delay + 0.55)

	gsap.to(spans, {
		y: '0%',
		duration: 1,
		stagger: 0.1,
		ease: 'power4.out',
		delay,
	})
}

document.addEventListener('DOMContentLoaded', () => {
	initializeAnimations()
	if (typeof window.bindScrollNav === 'function') window.bindScrollNav()
})

