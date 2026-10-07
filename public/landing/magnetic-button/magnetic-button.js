/* Physics Effects / 3 — magnetic icons (GSAP elastic) + profile popups */

window.__magneticButtonCleanup = null

window.initMagneticButtons = function initMagneticButtons() {
	if (typeof window.__magneticButtonCleanup === 'function') {
		window.__magneticButtonCleanup()
		window.__magneticButtonCleanup = null
	}

	const root = document.querySelector('.about-connect')
	const magneticRoot = document.querySelector('.about-magnetic')
	const items = [
		...document.querySelectorAll(
			'.about-connect .about-magnetic__item, .works-viewer__connect .about-magnetic__item, .scaling-quote__social, .scaling__close-socials .scaling-quote__social, .site-nav__socials .about-magnetic__item, .works-closeout__icons .about-magnetic__item',
		),
	]


	const cleanups = []
	let openPopup = null
	let openOwner = null

	function getPopupEl(item) {
		if (!item) return null
		if (item._dockPopup) return item._dockPopup
		const popup = item.querySelector('.about-magnetic__popup')
		if (!popup) return null
		document.body.appendChild(popup)
		item._dockPopup = popup
		return popup
	}

	function placePopup(item) {
		const popup = getPopupEl(item)
		if (!popup) return

		const gap = 14
		const pad = 12
		const rect = item.getBoundingClientRect()
		const pw = popup.offsetWidth || Math.min(352, window.innerWidth - pad * 2)
		const ph = popup.offsetHeight || 206

		let left = rect.left + rect.width / 2 - pw / 2
		left = Math.max(pad, Math.min(left, window.innerWidth - pw - pad))

		let top = rect.top - ph - gap
		if (top < pad) {
			top = Math.min(rect.bottom + gap, window.innerHeight - ph - pad)
		}

		const caretX = rect.left + rect.width / 2 - left
		popup.style.left = `${Math.round(left)}px`
		popup.style.top = `${Math.round(top)}px`
		popup.style.setProperty('--popup-caret-x', `${Math.round(caretX)}px`)
	}

	function showPopup(item) {
		if (!item?.hasAttribute('data-popup')) {
			hidePopup()
			return
		}
		const popup = getPopupEl(item)
		if (!popup) return

		if (openPopup && openPopup !== popup) {
			openPopup.classList.remove('is-open')
		}
		openPopup = popup
		openOwner = item
		placePopup(item)
		popup.classList.add('is-open')
	}

	function hidePopup() {
		if (openPopup) {
			openPopup.classList.remove('is-open')
			openPopup = null
			openOwner = null
		}
	}

	const canMagnetic =
		typeof gsap !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches

	items.forEach((el) => {
		if (canMagnetic) {
			const xTo = gsap.quickTo(el, 'x', {
				duration: 1,
				ease: 'elastic.out(1, 0.3)',
			})
			const yTo = gsap.quickTo(el, 'y', {
				duration: 1,
				ease: 'elastic.out(1, 0.3)',
			})

			const onMove = (e) => {
				const { height, width, left, top } = el.getBoundingClientRect()
				const x = e.clientX - (left + width / 2)
				const y = e.clientY - (top + height / 2)
				xTo(x)
				yTo(y)
				if (openOwner === el) placePopup(el)
			}

			const onLeaveMag = () => {
				xTo(0)
				yTo(0)
			}

			el.addEventListener('mousemove', onMove)
			el.addEventListener('mouseleave', onLeaveMag)
			cleanups.push(() => {
				el.removeEventListener('mousemove', onMove)
				el.removeEventListener('mouseleave', onLeaveMag)
				gsap.set(el, { clearProps: 'x,y' })
			})
		}

		const onEnter = () => showPopup(el)
		const onLeave = () => {
			if (el.hasAttribute('data-popup')) hidePopup()
		}
		el.addEventListener('mouseenter', onEnter)
		el.addEventListener('focus', onEnter)
		el.addEventListener('mouseleave', onLeave)
		el.addEventListener('blur', onLeave)
		cleanups.push(() => {
			el.removeEventListener('mouseenter', onEnter)
			el.removeEventListener('focus', onEnter)
			el.removeEventListener('mouseleave', onLeave)
			el.removeEventListener('blur', onLeave)
		})
	})

	const onResize = () => {
		if (openOwner) placePopup(openOwner)
	}
	window.addEventListener('resize', onResize)
	cleanups.push(() => window.removeEventListener('resize', onResize))

	const onScroll = () => {
		if (openOwner) placePopup(openOwner)
	}
	window.addEventListener('scroll', onScroll, true)
	cleanups.push(() => window.removeEventListener('scroll', onScroll, true))

	const fadeTarget = root || magneticRoot
	if (fadeTarget && typeof gsap !== 'undefined') {
		gsap.fromTo(
			fadeTarget,
			{ opacity: 0, y: 12 },
			{
				opacity: 1,
				y: 0,
				duration: 0.55,
				ease: 'power3.out',
				delay: 0.08,
				onComplete: () => {
					fadeTarget.style.transform = 'none'
					fadeTarget.style.willChange = 'auto'
				},
			},
		)
	} else if (fadeTarget) {
		fadeTarget.style.opacity = '1'
		fadeTarget.style.transform = 'none'
	}

	window.__magneticButtonCleanup = () => {
		hidePopup()
		items.forEach((item) => {
			const popup = item._dockPopup
			if (popup && popup.parentElement === document.body) {
				popup.classList.remove('is-open')
				item.appendChild(popup)
			}
			item._dockPopup = null
		})
		cleanups.forEach((fn) => fn())
	}
}
