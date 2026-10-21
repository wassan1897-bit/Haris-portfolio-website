/* Up close: a strip of film made of stills from every project film (upclose.css).
   Desktop: the section pins and scrolling down runs the strip sideways (it can be dragged too). The frame at the
   middle is the live one: it lights up, plays a few seconds of its film from that moment, and the caption below
   says what the moment shows. Tablets and phones: a sideways swipe with each frame snapping to the middle.
   "Open project" (or a click on the live frame) opens that project's case file. */
;(function () {
	const flow = document.getElementById('site-flow')
	const uc = document.getElementById('panel-upclose')
	if (!flow || !uc) return
	const pin = uc.querySelector('.uc__pin')
	const strip = uc.querySelector('.uc__strip')
	const scroller = uc.querySelector('.uc__scroller')
	const track = uc.querySelector('.uc__track')
	const frames = [...uc.querySelectorAll('.uc-frame')]
	if (!pin || !strip || !scroller || !track || !frames.length) return
	const nameEl = uc.querySelector('.uc__name')
	const tcEl = uc.querySelector('.uc__tc')
	const lineEl = uc.querySelector('.uc__line')
	const countEl = uc.querySelector('.uc__count b')
	const openBtn = uc.querySelector('.uc__open')
	const ticks = [...uc.querySelectorAll('.uc__scrub i')]

	const wide = window.matchMedia('(min-width: 1024px)')
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const saveData = !!(navigator.connection && navigator.connection.saveData)
	// the live frame plays its film from the still (data-t), looping inside that scene (data-a to data-b)
	const SPEED = 0.6 // page scroll per pixel of strip movement
	const pageTop = (el) => el.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop

	// ---------- geometry ----------
	let centers = []
	let run = 1
	let vrun = 1
	let top = 0
	function measure() {
		const half = scroller.clientWidth / 2
		track.style.paddingLeft = Math.max(0, half - frames[0].offsetWidth / 2) + 'px'
		track.style.paddingRight = Math.max(0, half - frames[frames.length - 1].offsetWidth / 2) + 'px'
		centers = frames.map((f) => f.offsetLeft + f.offsetWidth / 2)
		run = Math.max(1, centers[centers.length - 1] - centers[0])
		if (wide.matches) {
			vrun = run * SPEED
			uc.style.setProperty('--uc-run', Math.round(vrun) + 'px')
			top = pageTop(uc)
		} else {
			uc.style.removeProperty('--uc-run')
			track.style.transform = ''
		}
		update()
	}

	// ---------- which frame is live ----------
	function nearest(x) {
		let best = 0
		centers.forEach((c, i) => Math.abs(c - x) < Math.abs(centers[best] - x) && (best = i))
		return best
	}
	function update() {
		if (wide.matches) {
			const p = Math.min(1, Math.max(0, (flow.scrollTop - top) / vrun))
			const x = centers[0] + p * run
			track.style.transform = `translate3d(${(scroller.clientWidth / 2 - x).toFixed(1)}px, 0, 0)`
			setLive(nearest(x))
		} else {
			setLive(nearest(scroller.scrollLeft + scroller.clientWidth / 2))
		}
	}

	let live = -1
	function setLive(i) {
		if (i === live) return
		const was = live
		live = i
		const f = frames[i]
		frames.forEach((g, j) => g.classList.toggle('is-on', j === i))
		uc.style.setProperty('--uc-now', getComputedStyle(f).getPropertyValue('--uc-acc').trim())
		nameEl.textContent = f.dataset.name
		tcEl.textContent = f.dataset.tc
		lineEl.innerHTML = f.querySelector('.uc-frame__cap').innerHTML
		countEl.textContent = String(i + 1).padStart(2, '0')
		ticks.forEach((t) => t.classList.toggle('is-on', t.dataset.p === f.dataset.open))
		if (was >= 0 && !reduce) lineEl.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' })
		queuePlay()
	}

	// ---------- the live frame's film ----------
	let inView = false
	let caseOpen = false
	let playTimer = 0
	function film(f) {
		let v = f.querySelector('video')
		if (v) return v
		v = document.createElement('video')
		v.className = 'uc-frame__vid'
		v.muted = true
		v.playsInline = true
		v.preload = 'auto'
		v.setAttribute('aria-hidden', 'true')
		const t = Number(f.dataset.t) || 0
		const a = Number(f.dataset.a) || t
		const b = Number(f.dataset.b) || t + 2
		v.addEventListener('timeupdate', () => v.currentTime > b && (v.currentTime = a))
		v.addEventListener('ended', () => {
			v.currentTime = a
			v.play().catch(() => {})
		})
		v.addEventListener('playing', () => f.classList.add('is-playing'))
		v.addEventListener('loadedmetadata', () => (v.currentTime = t), { once: true })
		v.src = f.dataset.clip
		f.querySelector('.uc-frame__img').insertBefore(v, f.querySelector('.uc-frame__tc'))
		return v
	}
	function stopAll(except) {
		frames.forEach((f) => {
			const v = f.querySelector('video')
			if (f !== except && v && !v.paused) v.pause()
			if (f !== except) f.classList.remove('is-playing')
		})
	}
	// wait for the strip to settle before starting a clip, so a fast scroll does not load every film it passes
	function queuePlay() {
		clearTimeout(playTimer)
		stopAll(null)
		if (reduce || saveData || !inView || caseOpen || document.visibilityState === 'hidden') return
		playTimer = setTimeout(() => {
			const f = frames[live]
			const v = film(f)
			if (v.readyState >= 1) v.currentTime = Number(f.dataset.t) || 0
			v.play().catch(() => {})
		}, 280)
	}

	// ---------- opening a project ----------
	function openProject(f) {
		const [kind, n] = f.dataset.open.split('-')
		if (kind === 'sw') {
			if (window.SWCases) window.SWCases.open('sw-detail-' + n, openBtn)
			return
		}
		// a project screen: go to it in the projects section, then open its case file
		const step = document.querySelector(`.pj-index [data-go="${Number(n) - 1}"]`)
		const view = document.querySelector(`[aria-controls="pj-detail-${n}"]`)
		if (step) step.click()
		setTimeout(() => view && view.click(), 80)
	}
	openBtn.addEventListener('click', () => openProject(frames[live]))

	function goTo(i) {
		if (wide.matches) flow.scrollTo({ top: top + ((centers[i] - centers[0]) / run) * vrun, behavior: reduce ? 'auto' : 'smooth' })
		else scroller.scrollTo({ left: centers[i] - scroller.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' })
	}

	// ---------- desktop: drag the strip (it moves the page, so the two always agree) ----------
	let drag = null
	pin.addEventListener('pointerdown', (e) => {
		if (!wide.matches || e.button !== 0 || e.target.closest('button, a')) return
		drag = { x: e.clientX, top: flow.scrollTop, moved: false, frame: e.target.closest('.uc-frame') }
		pin.setPointerCapture(e.pointerId)
	})
	pin.addEventListener('pointermove', (e) => {
		if (!drag) return
		const dx = e.clientX - drag.x
		if (Math.abs(dx) > 5) {
			drag.moved = true
			uc.classList.add('is-dragging')
		}
		if (drag.moved) flow.scrollTop = drag.top - dx * SPEED * 1.3
	})
	const endDrag = () => {
		if (!drag) return
		const d = drag
		drag = null
		uc.classList.remove('is-dragging')
		// a click, not a drag: the live frame opens its project, any other frame comes to the middle
		if (!d.moved && d.frame) {
			const i = frames.indexOf(d.frame)
			if (i === live) openProject(d.frame)
			else goTo(i)
		}
	}
	pin.addEventListener('pointerup', endDrag)
	pin.addEventListener('pointercancel', () => {
		drag = null
		uc.classList.remove('is-dragging')
	})

	// ---------- tablets and phones: tap a frame ----------
	frames.forEach((f, i) =>
		f.addEventListener('click', () => {
			if (wide.matches) return
			if (i === live) openProject(f)
			else goTo(i)
		}),
	)

	// ---------- keeping it in step ----------
	flow.addEventListener('scroll', () => wide.matches && update(), { passive: true })
	let raf = 0
	scroller.addEventListener(
		'scroll',
		() => {
			if (wide.matches || raf) return
			raf = requestAnimationFrame(() => {
				raf = 0
				update()
			})
		},
		{ passive: true },
	)
	if ('IntersectionObserver' in window) {
		new IntersectionObserver(
			([e]) => {
				inView = e.isIntersecting
				queuePlay()
			},
			{ root: flow, threshold: 0.2 },
		).observe(strip)
	} else inView = true
	document.addEventListener('visibilitychange', queuePlay)
	document.addEventListener('swcase', (e) => {
		caseOpen = e.detail.open
		queuePlay()
	})
	// anything above the section changing height moves it, so watch every page section
	const ro = new ResizeObserver(measure)
	;[scroller, ...flow.children].forEach((el) => ro.observe(el))
	wide.addEventListener('change', measure)
	window.addEventListener('load', measure)
	measure()
})()
