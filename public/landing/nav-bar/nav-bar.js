/* The menu (#js-menu): a dark index of the page's sections. The header's MENU button and the hero's menu
   icon open it. Hovering or focusing a section plays that section's clip in the frame on the right; with
   nothing hovered, the frame shows the section you are on. Choosing a section jumps the page there behind
   the menu, then the menu lifts away. Motion is clip-path, transform and opacity only.

   window.siteJump(selector) is shared with the hero's top bar: it lands a section without scrolling
   through everything in between (behind the site's letterbox cut when that style is on). */
window.__navBarCleanup = null

window.initNavBar = function initNavBar() {
	if (typeof window.__navBarCleanup === 'function') {
		window.__navBarCleanup()
		window.__navBarCleanup = null
	}

	const menu = document.getElementById('js-menu')
	const toggle = document.getElementById('js-menu-btn')
	const flow = document.getElementById('site-flow')
	if (!menu || !flow) return

	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const small = window.matchMedia('(max-width: 899px)')
	const links = [...menu.querySelectorAll('.mn__list a')]
	const names = links.map((a) => a.querySelector('span > span'))
	const side = menu.querySelector('.mn__side')
	const top = menu.querySelector('.mn__top')
	const foot = menu.querySelector('.mn__foot')
	const close = menu.querySelector('.mn__close')
	const frame = menu.querySelector('.mn__frame')
	const video = menu.querySelector('.mn__video')
	const img = menu.querySelector('.mn__img')
	const card = menu.querySelector('.mn__card')
	const capN = menu.querySelector('.mn__cap-n')
	const capT = menu.querySelector('.mn__cap-t')
	const hasGsap = typeof gsap !== 'undefined'

	// ---------- landing a section ----------
	// where each section counts as landed (About lands after its slide-in, so on its marker)
	const LAND = { '#panel-about': '#about-land' }
	const pageTop = (el) => el.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop
	function landAt(sel) {
		const el = document.querySelector(LAND[sel] || sel)
		return el ? Math.round(pageTop(el)) : null
	}
	function jumpNow(sel) {
		const y = landAt(sel)
		if (y == null) return
		flow.scrollTo({ top: y, behavior: 'instant' })
	}
	window.siteJump = function (sel, label) {
		const y = landAt(sel)
		if (y == null || Math.abs(flow.scrollTop - y) < 2) return
		if (window.SiteScroll && window.SiteScroll.cut) window.SiteScroll.cut(() => jumpNow(sel), label || '')
		else jumpNow(sel)
	}

	// ---------- the section you are on ----------
	function current() {
		const mid = flow.scrollTop + flow.clientHeight / 2
		let at = 0
		links.forEach((a, i) => {
			const el = document.querySelector(a.dataset.mnGo)
			if (el && pageTop(el) <= mid) at = i
		})
		return at
	}

	// ---------- the frame ----------
	let shown = -1
	function show(i) {
		if (i === shown) return
		shown = i
		links.forEach((a, j) => a.classList.toggle('is-on', j === i))
		const a = links[i]
		capN.textContent = `(${a.querySelector('b').textContent})`
		capT.textContent = a.querySelector('em').textContent
		if (small.matches) return // no frame on small screens
		const kind = a.dataset.video ? 'video' : a.dataset.img ? 'img' : 'card'
		frame.classList.toggle('is-video', kind === 'video')
		frame.classList.toggle('is-img', kind === 'img')
		frame.classList.toggle('is-card', kind === 'card')
		if (kind === 'video') {
			if (video.getAttribute('src') !== a.dataset.video) {
				video.src = a.dataset.video
				video.currentTime = 0
			}
			if (!reduce) video.play().catch(() => {})
		} else {
			video.pause()
			if (kind === 'img' && img.getAttribute('src') !== a.dataset.img) img.src = a.dataset.img
			if (kind === 'card') card.textContent = a.dataset.card || ''
		}
	}

	// ---------- open and close ----------
	let isOpen = false
	let opener = null
	let tl = null
	function lockFlow(lock) {
		if (lock) {
			flow.dataset.navLock = '1'
			flow.style.overflow = 'hidden'
		} else if (flow.dataset.navLock === '1') {
			delete flow.dataset.navLock
			flow.style.overflow = ''
		}
	}
	function setExpanded(v) {
		if (toggle) toggle.setAttribute('aria-expanded', String(v))
		document.querySelectorAll('.ph-burger').forEach((b) => b.setAttribute('aria-expanded', String(v)))
	}
	function open(from) {
		if (isOpen) return
		isOpen = true
		opener = from || document.activeElement
		menu.hidden = false
		menu.scrollTop = 0
		shown = -1
		show(current())
		lockFlow(true)
		setExpanded(true)
		if (tl) tl.kill()
		if (hasGsap && !reduce) {
			tl = gsap.timeline()
			tl.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' }, 0)
			tl.fromTo(names, { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.05 }, 0.3)
			tl.fromTo([top, side, foot], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, 0.45)
			tl.eventCallback('onComplete', () => gsap.set([menu, ...names, top, side, foot], { clearProps: 'clipPath,transform,opacity' }))
		}
		setTimeout(() => close.focus({ preventScroll: true }), reduce ? 0 : 400)
	}
	function shut(then) {
		if (!isOpen) return
		isOpen = false
		setExpanded(false)
		const finish = () => {
			menu.hidden = true
			video.pause()
			lockFlow(false)
			if (then) then()
			else if (opener && opener.focus) opener.focus({ preventScroll: true })
		}
		if (tl) tl.kill()
		if (hasGsap && !reduce) {
			tl = gsap.timeline({ onComplete: finish })
			tl.to([top, side, foot, ...names], { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
			tl.to(menu, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.6, ease: 'expo.inOut' }, 0.1)
			tl.eventCallback('onComplete', () => {
				gsap.set([menu, ...names, top, side, foot], { clearProps: 'clipPath,transform,opacity' })
				finish()
			})
		} else finish()
	}

	// ---------- wiring ----------
	const onToggle = (e) => (isOpen ? shut() : open(e.currentTarget))
	const openers = [toggle, ...document.querySelectorAll('.ph-burger')].filter(Boolean)
	openers.forEach((b) => {
		b.setAttribute('aria-controls', 'js-menu')
		b.setAttribute('aria-expanded', 'false')
		b.addEventListener('click', onToggle)
	})
	const onClose = () => shut()
	close.addEventListener('click', onClose)

	const onOver = (e) => {
		const a = e.target.closest('.mn__list a')
		if (a) show(links.indexOf(a))
	}
	const onLeave = () => isOpen && show(current())
	const list = menu.querySelector('.mn__list')
	list.addEventListener('pointerover', onOver)
	list.addEventListener('focusin', onOver)
	list.addEventListener('pointerleave', onLeave)

	// a section link: land it behind the menu, then lift the menu away to reveal it
	const onGo = (e) => {
		const a = e.target.closest('[data-mn-go]')
		if (!a) return
		e.preventDefault()
		jumpNow(a.dataset.mnGo)
		shut(() => {})
	}
	menu.addEventListener('click', onGo)

	// while open, keys belong to the menu: Escape closes, Tab stays inside, and the page's own key handlers
	// (paging, the projects' arrows) do not run underneath it
	const onKey = (e) => {
		if (!isOpen) return
		e.stopPropagation()
		if (e.key === 'Escape') {
			e.preventDefault()
			shut()
		} else if (e.key === 'Tab') {
			const f = [...menu.querySelectorAll('a[href], button')]
			const first = f[0]
			const last = f[f.length - 1]
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault()
				last.focus()
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault()
				first.focus()
			}
		}
	}
	window.addEventListener('keydown', onKey, true)
	// wheel and touch on the menu never reach the page's scroll engines
	const swallow = (e) => isOpen && e.stopPropagation()
	menu.addEventListener('wheel', swallow, { passive: true })
	menu.addEventListener('touchmove', swallow, { passive: true })

	window.__navBarCleanup = () => {
		openers.forEach((b) => b.removeEventListener('click', onToggle))
		close.removeEventListener('click', onClose)
		list.removeEventListener('pointerover', onOver)
		list.removeEventListener('focusin', onOver)
		list.removeEventListener('pointerleave', onLeave)
		menu.removeEventListener('click', onGo)
		window.removeEventListener('keydown', onKey, true)
		if (tl) tl.kill()
		menu.hidden = true
		lockFlow(false)
	}
}
