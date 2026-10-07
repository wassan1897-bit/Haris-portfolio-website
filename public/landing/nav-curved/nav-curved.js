window.__curvedNavCleanup = null

window.initCurvedNav = function initCurvedNav() {
	if (typeof window.__curvedNavCleanup === 'function') {
		window.__curvedNavCleanup()
		window.__curvedNavCleanup = null
	}

	const menuBtn = document.getElementById('js-menu-btn')
	const burger = document.getElementById('js-burger')
	const menu = document.getElementById('js-menu')
	const nav = document.getElementById('js-nav')
	const curvePath = document.getElementById('js-curve-path')
	const links = Array.from(document.querySelectorAll('.menu__link'))
	const menuHeader = menu?.querySelector('.menu__header')
	const footerLinks = Array.from(menu?.querySelectorAll('.menu__footer a') || [])

	if (!menuBtn || !burger || !menu || !nav || !curvePath || !links.length) return
	if (typeof gsap === 'undefined') return

	const PANEL_W = 480
	const OFFSCREEN = PANEL_W + 100
	const ease = 'power3.inOut'

	const pageToHref = {
		about: 'about.html',
		work: 'work.html',
		scaling: 'scaling.html',
	}

	const initialPath = () =>
		`M100 0 L200 0 L200 ${innerHeight} L100 ${innerHeight} Q-100 ${innerHeight / 2} 100 0`

	const targetPath = () =>
		`M100 0 L200 0 L200 ${innerHeight} L100 ${innerHeight} Q100 ${innerHeight / 2} 100 0`

	let currentHref = pageToHref[document.body.dataset.page] || 'about.html'
	let isOpen = false

	function syncHrefFromPage() {
		currentHref = pageToHref[document.body.dataset.page] || 'about.html'
	}

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

	function setButtonState(open) {
		burger.classList.toggle('header__burger--active', open)
		menu.setAttribute('aria-hidden', open ? 'false' : 'true')
		menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false')
		menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
		menu.classList.toggle('menu--open', open)
		if (open) menu.removeAttribute('inert')
		else menu.setAttribute('inert', '')
	}

	curvePath.setAttribute('d', initialPath())
	gsap.set(menu, { x: OFFSCREEN, force3D: true })
	gsap.set(links, { x: 80 })
	if (menuHeader) gsap.set(menuHeader, { autoAlpha: 0, y: 16 })
	if (footerLinks.length) gsap.set(footerLinks, { autoAlpha: 0, y: 18 })
	menu.classList.add('is-ready')

	const tl = gsap.timeline({
		paused: true,
		defaults: { duration: 0.8, ease },
		onReverseComplete() {
			isOpen = false
			setButtonState(false)
			setFlowLock(false)
		},
	})

	tl.fromTo(menu, { x: OFFSCREEN }, { x: 0, force3D: true }, 0)
		.fromTo(
			curvePath,
			{ attr: { d: initialPath() } },
			{ attr: { d: targetPath() }, duration: 1 },
			0,
		)
		.fromTo(links, { x: 80 }, { x: 0, stagger: 0.05 }, 0)

	if (menuHeader) {
		tl.fromTo(
			menuHeader,
			{ autoAlpha: 0, y: 16 },
			{ autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },
			0.12,
		)
	}

	if (footerLinks.length) {
		tl.fromTo(
			footerLinks,
			{ autoAlpha: 0, y: 18 },
			{ autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out' },
			0.28,
		)
	}

	function setIndicator(href) {
		links.forEach((link) => {
			const dot = link.querySelector('.menu__indicator')
			if (!dot) return
			gsap.to(dot, {
				scale: link.dataset.href === href ? 1 : 0,
				duration: 0.3,
				ease: 'power2.out',
			})
		})
	}

	function closeMenu() {
		if (!isOpen && tl.progress() === 0) return
		isOpen = false
		setButtonState(false)
		gsap.to('.menu__indicator', { scale: 0, duration: 0.25 })
		tl.reverse()
	}

	function openMenu() {
		syncHrefFromPage()
		isOpen = true
		setButtonState(true)
		setFlowLock(true)
		tl.play()
		setIndicator(currentHref)
	}

	function toggleMenu() {
		if (isOpen || (tl.progress() > 0 && !tl.reversed())) closeMenu()
		else openMenu()
	}

	const onResize = () => {
		const open = isOpen || (tl.progress() > 0 && !tl.reversed())
		curvePath.setAttribute('d', open ? targetPath() : initialPath())
	}

	const onKeyDown = (e) => {
		if (e.key === 'Escape' && (isOpen || tl.progress() > 0)) {
			e.preventDefault()
			closeMenu()
		}
	}

	const onNavLeave = () => {
		if (isOpen || tl.progress() > 0) setIndicator(currentHref)
	}

	const pageObserver = new MutationObserver(() => {
		syncHrefFromPage()
		if (isOpen || tl.progress() > 0) setIndicator(currentHref)
	})
	pageObserver.observe(document.body, {
		attributes: true,
		attributeFilter: ['data-page'],
	})

	const linkCleanups = []
	links.forEach((link) => {
		const onEnter = () => setIndicator(link.dataset.href)
		link.addEventListener('mouseenter', onEnter)
		link.addEventListener('focusin', onEnter)

		const anchor = link.querySelector('a')
		const onClick = (e) => {
			const href = link.dataset.href || anchor?.getAttribute('href')
			if (!href) return
			currentHref = href
			closeMenu()

			if (href.startsWith('http') || href.startsWith('mailto:')) return

			e.preventDefault()
			window.setTimeout(() => {
				if (typeof goToPage === 'function') goToPage(href)
				else location.href = href
			}, 320)
		}
		if (anchor) anchor.addEventListener('click', onClick)
		linkCleanups.push(() => {
			link.removeEventListener('mouseenter', onEnter)
			link.removeEventListener('focusin', onEnter)
			if (anchor) anchor.removeEventListener('click', onClick)
		})
	})

	menuBtn.addEventListener('click', toggleMenu)
	nav.addEventListener('mouseleave', onNavLeave)
	window.addEventListener('resize', onResize)
	document.addEventListener('keydown', onKeyDown)

	window.__curvedNavCleanup = () => {
		menuBtn.removeEventListener('click', toggleMenu)
		nav.removeEventListener('mouseleave', onNavLeave)
		window.removeEventListener('resize', onResize)
		document.removeEventListener('keydown', onKeyDown)
		pageObserver.disconnect()
		linkCleanups.forEach((fn) => fn())
		tl.kill()
		setFlowLock(false)
		setButtonState(false)
		isOpen = false
	}
}
