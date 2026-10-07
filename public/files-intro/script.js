document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(CustomEase, SplitText)

	CustomEase.create('hop', '.8, 0, .3, 1')

	const splitTextElements = (
		selector,
		type = 'words,chars',
		addFirstChar = false,
	) => {
		const elements = document.querySelectorAll(selector)
		elements.forEach(element => {
			const splitText = new SplitText(element, {
				type,
				wordsClass: 'word',
				charsClass: 'char',
			})

			if (type.includes('chars')) {
				splitText.chars.forEach((char, index) => {
					const originalText = char.textContent
					char.innerHTML = `<span>${originalText}</span>`

					if (addFirstChar && index === 0) {
						char.classList.add('first-char')
					}
				})
			}
		})
	}

	splitTextElements('.intro-title h1', 'words, chars', true)
	splitTextElements('.outro-title h1')
	splitTextElements('.tag p', 'words')

	const isMobile = window.innerWidth <= 1000

	gsap.set(
		[
			'.split-overlay .intro-title .first-char span',
			'.split-overlay .outro-title .char span',
		],
		{ y: '0%' },
	)

	gsap.set('.container .card-photo', {
		opacity: 0,
		scale: 1.12,
		transformOrigin: '50% 20%',
	})

	gsap.set('.split-overlay .intro-title .first-char', {
		x: isMobile ? '4.5rem' : '10rem',
		y: isMobile ? '-1rem' : '-2.75rem',
		fontWeight: '900',
		scale: 0.75,
	})

	gsap.set('.split-overlay .outro-title .char', {
		x: isMobile ? '-0.5rem' : '-1rem',
		fontSize: isMobile ? '6rem' : '14rem',
		fontWeight: '500',
	})

	const tl = gsap.timeline({ defaults: { ease: 'hop' } })
	const tags = gsap.utils.toArray('.tag')

	tags.forEach((tag, index) => {
		tl.to(
			tag.querySelectorAll('p .word'),
			{
				y: '0%',
				duration: 0.75,
			},
			0.5 + index * 0.1,
		)
	})

	tl.to(
		'.preloader .intro-title .char span',
		{
			y: '0%',
			duration: 0.75,
			stagger: 0.05,
		},
		0.5,
	)
		.to(
			'.preloader .intro-title .char:not(.first-char) span',
			{
				y: '100%',
				duration: 0.75,
				stagger: 0.05,
			},
			2,
		)
		.to(
			'.preloader .outro-title .char span',
			{
				y: '0%',
				duration: 0.75,
				stagger: 0.075,
			},
			2.5,
		)
		.to(
			'.preloader .intro-title .first-char',
			{
				x: isMobile ? '5.5rem' : '12.5rem',
				duration: 1,
			},
			3.5,
		)
		.to(
			'.preloader .outro-title .char',
			{
				x: isMobile ? '-0.5rem' : '-1rem',
				duration: 1,
			},
			3.5,
		)
		.to(
			'.preloader .intro-title .first-char',
			{
				x: isMobile ? '4.5rem' : '10rem',
				y: isMobile ? '-1rem' : '-2.75rem',
				fontWeight: '900',
				scale: 0.75,
				duration: 0.75,
			},
			4.5,
		)
		.to(
			'.preloader .outro-title .char',
			{
				x: isMobile ? '-0.5rem' : '-1rem',
				fontSize: isMobile ? '6rem' : '14rem',
				fontWeight: '500',
				duration: 0.75,
				onComplete: () => {
					gsap.set('.preloader', {
						clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
					})
					gsap.set('.split-overlay', {
						clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
					})
				},
			},
			4.5,
		)
		.to(
			'.container',
			{
				clipPath: 'polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)',
				duration: 1,
			},
			5,
		)

	tags.forEach((tag, index) => {
		tl.to(
			tag.querySelectorAll('p .word'),
			{
				y: '100%',
				duration: 0.75,
			},
			5.5 + index * 0.1,
		)
	})

	tl.to(
		['.preloader', '.split-overlay'],
		{
			y: i => (i === 0 ? '-50%' : '50%'),
			duration: 1,
		},
		6,
	)
		.to(
			'.container',
			{
				clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
				duration: 1,
			},
			6,
		)
		.to(
			'.container .card',
			{
				clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
				duration: 0.75,
			},
			6.25,
		)
		.to(
			'.container .card-photo',
			{
				opacity: 1,
				scale: 1,
				duration: 1.05,
				ease: 'power2.out',
			},
			6.4,
		)
		.to(
			'.container .card-bio',
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
			},
			7.15,
		)

	// After card: Page Transitions/7 line animation, then open landing
	const goLandingWithLine = () => {
		if (window.__goingLanding) return
		window.__goingLanding = true

		CustomEase.create('wipe', '0.87, 0, 0.13, 1')

		// Warm cache before hard nav
		try {
			sessionStorage.setItem('harisFromIntro', '1')
			fetch('/landing/about.html', { credentials: 'same-origin' }).catch(() => {})
		} catch (_) {}

		// move-out (old page)
		gsap.to('.container, .preloader, .split-overlay, .tags-overlay', {
			y: '-35%',
			opacity: 0.4,
			duration: 1.25,
			ease: 'wipe',
		})

		// move-in line wipe → cream plane, then landing
		gsap.to('.page-wipe', {
			clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
			duration: 1.25,
			ease: 'wipe',
			onComplete: () => {
				window.location.href = '/landing/about.html'
			},
		})
	}

	tl.add(() => {
		window.setTimeout(goLandingWithLine, 900)
	}, 8.0)

	// Fallback if GSAP throttled (hidden tab)
	window.setTimeout(() => {
		if (!window.__goingLanding && !location.pathname.includes('/landing')) {
			goLandingWithLine()
		}
	}, 12000)
})
