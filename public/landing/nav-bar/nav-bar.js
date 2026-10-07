window.__navBarCleanup = null

window.initNavBar = function initNavBar() {
	if (typeof window.__navBarCleanup === 'function') {
		window.__navBarCleanup()
		window.__navBarCleanup = null
	}

	const toggle = document.getElementById('js-menu-btn')
	const burger = document.getElementById('js-burger')
	const labelMenu = document.getElementById('js-label-menu')
	const labelClose = document.getElementById('js-label-close')
	const actions = document.getElementById('js-header-actions')
	const nav = document.getElementById('js-nav')
	const navBody = document.getElementById('js-nav-body')
	const navLinks = Array.from(document.querySelectorAll('.site-nav__link'))
	const navImage = document.getElementById('js-nav-image')
	const navImageEl = document.getElementById('js-nav-image-el')
	const highlight = document.getElementById('js-nav-highlight')
	const line1 = document.getElementById('js-nav-line1')
	const line2 = document.getElementById('js-nav-line2')
	const footerItems = Array.from(document.querySelectorAll('.site-nav__footer li'))
	const background = document.getElementById('js-background')
	const header = document.getElementById('js-site-header')

	if (!toggle || !burger || !nav || !navBody || !navLinks.length || !background) return
	if (typeof gsap === 'undefined') return

	const ease = 'power3.inOut'
	let isOpen = false
	let splitDone = false
	let activeIndex = null

	function setFlowLock(lock) {
		const flow = document.getElementById('site-flow')
		if (!flow) return
		if (lock) {
			flow.dataset.navLock = '1'
			flow.style.overflow = 'hidden'
		} else if (flow.dataset.navLock === '1') {
			delete flow.dataset.navLock
			flow.style.overflow = ''
		}
	}

	function setOpenState(open) {
		isOpen = open
		burger.classList.toggle('site-header__burger--active', open)
		toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
		toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
		nav.setAttribute('aria-hidden', open ? 'false' : 'true')
		if (header) header.classList.toggle('site-header--open', open)
		if (open) nav.removeAttribute('inert')
		else nav.setAttribute('inert', '')
	}

	function splitLinks() {
		if (splitDone) return
		navLinks.forEach((link) => {
			if (link.dataset.split === '1') return
			const text = link.textContent
			const dotIndex = Number.parseInt(link.dataset.dot ?? '-1', 10)
			link.textContent = ''
			text.split('').forEach((char, i) => {
				const span = document.createElement('span')
				span.textContent = char === ' ' ? '\u00A0' : char
				if (i === dotIndex) span.classList.add('site-nav__char--dot')
				link.appendChild(span)
			})
			link.dataset.split = '1'
		})
		splitDone = true
	}

	splitLinks()

	const allChars = Array.from(document.querySelectorAll('.site-nav__link span'))
	gsap.set(allChars, { y: '100%', opacity: 0 })
	if (footerItems.length) gsap.set(footerItems, { y: '100%', opacity: 0 })
	if (labelClose) gsap.set(labelClose, { opacity: 0 })
	if (navImage) gsap.set(navImage, { opacity: 0 })
	if (highlight) gsap.set(highlight, { autoAlpha: 0, y: 10 })
	nav.setAttribute('inert', '')

	navLinks.forEach((link) => {
		const src = link.dataset.src
		if (!src) return
		const img = new Image()
		img.src = src
	})

	const tl = gsap.timeline({
		paused: true,
		onReverseComplete() {
			setOpenState(false)
			setFlowLock(false)
			clearHover()
		},
	})

	tl.to(nav, { height: 'auto', duration: 1, ease }, 0)
		.to(background, { height: '100vh', duration: 1, ease }, 0)

	if (labelMenu) tl.to(labelMenu, { opacity: 0, duration: 0.35 }, 0)
	if (labelClose) tl.to(labelClose, { opacity: 1, duration: 0.35 }, 0)
	if (actions) tl.to(actions, { opacity: 0, duration: 0.35 }, 0)

	tl.to(
		allChars,
		{ y: '0%', opacity: 1, duration: 1, ease, stagger: 0.02 },
		0.2,
	)

	if (footerItems.length) {
		tl.to(
			footerItems,
			{ y: '0%', opacity: 1, duration: 1, ease, stagger: 0.05 },
			0.4,
		)
	}

	function showHighlight(link) {
		if (!highlight || !line1 || !line2) return
		const next1 = link.dataset.line1 || ''
		const next2 = link.dataset.line2 || ''

		const apply = () => {
			line1.textContent = next1
			line2.textContent = next2
			highlight.classList.add('is-visible')
			gsap.to(highlight, {
				autoAlpha: 1,
				y: 0,
				duration: 0.35,
				ease: 'power2.out',
				overwrite: true,
			})
		}

		if (highlight.classList.contains('is-visible') && gsap.getProperty(highlight, 'opacity') > 0.2) {
			gsap.to(highlight, {
				autoAlpha: 0,
				y: 6,
				duration: 0.15,
				ease: 'power2.in',
				overwrite: true,
				onComplete: apply,
			})
		} else {
			apply()
		}
	}

	function hideHighlight() {
		if (!highlight) return
		highlight.classList.remove('is-visible')
		gsap.to(highlight, {
			autoAlpha: 0,
			y: 10,
			duration: 0.28,
			ease: 'power2.inOut',
			overwrite: true,
		})
	}

	function clearHover() {
		activeIndex = null
		navLinks.forEach((link) => link.classList.remove('is-active'))
		gsap.to(navLinks, {
			filter: 'blur(0px)',
			opacity: 1,
			duration: 0.3,
			overwrite: true,
		})
		if (navImage) gsap.set(navImage, { opacity: 0 })
		hideHighlight()
	}

	function openMenu() {
		setOpenState(true)
		setFlowLock(true)
		tl.play()
	}

	function closeMenu() {
		if (tl.progress() === 0) return
		burger.classList.remove('site-header__burger--active')
		toggle.setAttribute('aria-expanded', 'false')
		toggle.setAttribute('aria-label', 'Open menu')
		isOpen = false
		clearHover()
		tl.reverse()
	}

	function toggleMenu() {
		if (tl.reversed() || tl.progress() === 0) openMenu()
		else closeMenu()
	}

	const onKeyDown = (e) => {
		if (e.key === 'Escape' && (isOpen || tl.progress() > 0)) {
			e.preventDefault()
			closeMenu()
		}
	}

	const onNavOver = (e) => {
		const link = e.target.closest('.site-nav__link')
		if (!link) return

		const hoveredIndex = link.dataset.index
		if (activeIndex === hoveredIndex) return
		activeIndex = hoveredIndex

		navLinks.forEach((other) => {
			const isHovered = other.dataset.index === hoveredIndex
			other.classList.toggle('is-active', isHovered)
			gsap.to(other, {
				filter: isHovered ? 'blur(0px)' : 'blur(5px)',
				opacity: isHovered ? 1 : 0.45,
				duration: 0.35,
				overwrite: true,
			})
		})

		showHighlight(link)

		const src = link.dataset.src
		if (navImageEl && src) {
			if (navImageEl.getAttribute('src') !== src) {
				navImageEl.src = src
			}
			navImageEl.alt = link.dataset.label || 'Preview'
		}
		if (navImage) gsap.to(navImage, { opacity: 1, duration: 0.35, overwrite: true })
	}

	const onNavLeave = () => {
		clearHover()
	}

	const linkCleanups = []
	navLinks.forEach((link) => {
		const onClick = (e) => {
			const href = link.getAttribute('href')
			if (!href || href === '#') {
				e.preventDefault()
				return
			}

			if (href.startsWith('http') || href.startsWith('mailto:')) {
				closeMenu()
				return
			}

			e.preventDefault()
			closeMenu()
			window.setTimeout(() => {
				if (typeof goToPage === 'function') goToPage(href)
				else location.href = href
			}, 420)
		}
		link.addEventListener('click', onClick)
		linkCleanups.push(() => link.removeEventListener('click', onClick))
	})

	toggle.addEventListener('click', toggleMenu)
	navBody.addEventListener('mouseover', onNavOver)
	navBody.addEventListener('mouseleave', onNavLeave)
	document.addEventListener('keydown', onKeyDown)

	window.__navBarCleanup = () => {
		toggle.removeEventListener('click', toggleMenu)
		navBody.removeEventListener('mouseover', onNavOver)
		navBody.removeEventListener('mouseleave', onNavLeave)
		document.removeEventListener('keydown', onKeyDown)
		linkCleanups.forEach((fn) => fn())
		tl.kill()
		setFlowLock(false)
		setOpenState(false)
		gsap.set(nav, { clearProps: 'height' })
		gsap.set(background, { clearProps: 'height' })
		if (actions) gsap.set(actions, { clearProps: 'opacity' })
		if (highlight) gsap.set(highlight, { clearProps: 'all' })
	}
}
