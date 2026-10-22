/* Projects: the section is N screens tall and its stage stays pinned while you scroll through it.
   Each step down wipes the next screen up over the last; a mouse wheel moves exactly one step,
   trackpads, touch and keys scroll as usual and the screen changes as you pass each step.
   Only the clip on the screen in view plays, and only while the section is on screen. */
;(function () {
	const section = document.getElementById('panel-works')
	if (!section || !section.classList.contains('pj')) return
	const flow = document.getElementById('site-flow')
	if (!flow) return
	const header = document.getElementById('js-site-header')
	const screens = [...section.querySelectorAll('.pj-screen')]
	const N = screens.length
	const indexBtns = [...section.querySelectorAll('.pj-index [data-go]')]
	const pin = section.querySelector('.pj__pin')
	// "Entering the portfolio" (enter/enter.js) flies through an O into project 01 during the screen of
	// scrolling before this section lands; the stage is held in place behind it for that screen
	const enter = document.getElementById('panel-enter')

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const small = window.matchMedia('(max-width: 767px)')
	const saveData = !!(navigator.connection && navigator.connection.saveData)
	const autoplay = !reduceMotion && !saveData

	section.style.setProperty('--pj-n', N)

	// ---------- geometry (read once per resize, never during scroll) ----------
	let top = 0
	let vh = 1
	function measure() {
		top = section.offsetTop
		vh = flow.clientHeight || window.innerHeight
		update()
		syncVideos()
	}

	// ---------- which screen is up ----------
	let active = 0
	let inView = false
	let moveTimer = 0
	function go(i) {
		if (i === active) return
		active = i
		const apply = () => {
			section.classList.add('is-moving')
			clearTimeout(moveTimer)
			moveTimer = setTimeout(() => section.classList.remove('is-moving'), 900)
			screens.forEach((s, j) => {
				s.classList.toggle('is-in', j <= active)
				s.classList.toggle('is-active', j === active)
				s.toggleAttribute('inert', j !== active)
			})
			indexBtns.forEach((b) => b.setAttribute('aria-current', String(Number(b.dataset.go) === active)))
			syncVideos()
		}
		// the site-wide scroll style can take over the change (for example, cut it behind film bars)
		if (window.SiteScroll && window.SiteScroll.cut && section.classList.contains('is-seen')) window.SiteScroll.cut(apply, (screens[active].querySelector('.pj-case__meta') || {}).textContent || 'The projects')
		else apply()
	}
	screens.forEach((s, j) => j !== 0 && s.setAttribute('inert', ''))
	indexBtns.forEach((b) => b.setAttribute('aria-current', String(Number(b.dataset.go) === 0)))

	let ticking = false
	let hold = false // set while the page is carried out of or back into the section (below)
	function update() {
		ticking = false
		// a page opened in a hidden or background tab has no size yet; wait for a real one
		if (!(vh > 0)) return
		const w = flow.scrollTop - top
		// on screen while any part of the section is in the viewport (does not rely on the observer alone)
		const was = inView
		inView = w > -vh && w < N * vh
		// the screens' content fades in once the section is reached (also when the observer never reports)
		// content animates in once the page has landed (after the reel), and again on the next visit
		const flyIn = !!(enter && enter.classList.contains('is-cine'))
		if (w > -vh * (flyIn ? 0.6 : 0.12)) section.classList.add('is-seen')
		else if (w < -vh * 1.05) section.classList.remove('is-seen')
		const lift = flyIn && w < 0 && w > -vh
		section.classList.toggle('is-lifted', lift)
		pin.style.transform = lift ? `translate3d(0, ${w.toFixed(1)}px, 0)` : ''
		// a screen takes over once you are 40% of the way into its step
		const i = Math.min(N - 1, Math.max(0, Math.floor(w / vh + 0.6)))
		// while the page is carried out of (or back into) the section, the screen on show stays as it is
		if (!hold) go(i)
		if (was !== inView) syncVideos()
	}
	flow.addEventListener(
		'scroll',
		// straight from the scroll event: it is cheap, and animation frames can be paused in a background view
		() => update(),
		{ passive: true },
	)

	// The stage is pinned, so jumping the scroll position inside the section moves nothing on screen:
	// the wipe is the only motion. That keeps a step instant and the scroll position always in sync.
	function scrollToStep(i) {
		flow.scrollTo({ top: top + i * vh, behavior: 'instant' })
		go(i)
	}

	// ---------- scrolling down leaves the projects; the tabs open the others ----------
	// Scrolling down from any project carries the page straight on to Selected work, instead of stepping
	// through every project: the scroll position jumps to the stage's last step (the stage is pinned, so
	// nothing moves and the project on show stays), then glides one screen on, which slides the stage up
	// and away. Scrolling back up from Selected work does the reverse and lands on the project that was
	// on show. Scrolling up inside the section still steps back one project.
	const easeSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2
	function glideTo(to, dur, done) {
		const from = flow.scrollTop
		const t0 = performance.now()
		const step = (now) => {
			const k = reduceMotion ? 1 : Math.min(1, (now - t0) / dur)
			flow.scrollTop = Math.round(from + (to - from) * easeSine(k))
			if (k < 1) requestAnimationFrame(step)
			else done && done()
		}
		requestAnimationFrame(step)
	}
	function leaveDown() {
		locked = true
		hold = true
		flow.scrollTo({ top: top + (N - 1) * vh, behavior: 'instant' })
		glideTo(top + N * vh, 1100, () => {
			hold = false
			setTimeout(release, 120)
		})
	}
	function comeBack() {
		locked = true
		hold = true
		glideTo(top + (N - 1) * vh, 1000, () => {
			flow.scrollTo({ top: top + active * vh, behavior: 'instant' })
			hold = false
			setTimeout(release, 120)
		})
	}

	// ---------- one wheel notch, one project (upwards) ----------
	// While the stage is pinned, further wheel input is held until a move settles (and a trackpad's momentum
	// has died down). Past the first screen, upwards, the page scrolls on as normal to the intro above.
	let locked = false
	let lastWheel = 0
	function release() {
		if (performance.now() - lastWheel > 180) locked = false
		else setTimeout(release, 90)
	}
	flow.addEventListener(
		'wheel',
		(e) => {
			if (detail || e.ctrlKey || !e.deltaY) return
			const w = flow.scrollTop - top
			// just below the section, at the top of Selected work: up brings the projects back
			if (e.deltaY < 0 && w > (N - 1) * vh + 2 && w <= N * vh + 4) {
				lastWheel = performance.now()
				e.preventDefault()
				if (!locked) comeBack()
				return
			}
			if (w < -2 || w > (N - 1) * vh + 2) return
			lastWheel = performance.now()
			if (locked) {
				e.preventDefault()
				return
			}
			if (e.deltaY > 0) {
				e.preventDefault()
				leaveDown()
				return
			}
			const target = active + Math.sign(e.deltaY)
			if (target < 0 || target > N - 1) return
			e.preventDefault()
			locked = true
			scrollToStep(target)
			setTimeout(release, reduceMotion ? 120 : 650)
		},
		{ passive: false },
	)

	// the keys that page through the site step through the projects too
	const KEYS = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }
	document.addEventListener('keydown', (e) => {
		if (detail || e.altKey || e.ctrlKey || e.metaKey || !(e.key in KEYS)) return
		if (e.target.closest && e.target.closest('input, textarea, select, button, a, [contenteditable]')) return
		const w = flow.scrollTop - top
		if (w < -2 || w > (N - 1) * vh + 2) return
		const dirn = e.key === ' ' && e.shiftKey ? -1 : KEYS[e.key]
		if (dirn > 0) {
			e.preventDefault()
			if (!locked) leaveDown()
			return
		}
		const target = active + dirn
		if (target < 0 || target > N - 1) return
		e.preventDefault()
		scrollToStep(target)
	})

	indexBtns.forEach((b) => b.addEventListener('click', () => scrollToStep(Number(b.dataset.go))))

	// ---------- in view: start the intro, darken the header, run the clips ----------
	if ('IntersectionObserver' in window) {
		new IntersectionObserver(
			([e]) => {
				syncVideos()
			},
			{ root: flow, threshold: [0, 0.01, 0.25] },
		).observe(section)
		// warm up the first clip a screen before it is needed
		new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) prime(0)
			},
			{ root: flow, rootMargin: '100% 0px 100% 0px' },
		).observe(section)
		if (header) {
			new IntersectionObserver(([e]) => header.classList.toggle('site-header--on-dark', e.isIntersecting), {
				root: flow,
				rootMargin: '-1px 0px -96% 0px',
				threshold: 0,
			}).observe(section)
		}
	} else {
		inView = true
		section.classList.add('is-seen')
	}

	// ---------- the clips ----------
	function pick(v) {
		if (small.matches && v.dataset.mp4Small) return v.dataset.mp4Small
		if (v.dataset.webm && v.canPlayType('video/webm; codecs="vp9"')) return v.dataset.webm
		return v.dataset.mp4
	}
	function prime(i) {
		const v = screens[i] && screens[i].querySelector('video')
		if (!v || v.dataset.ready) return
		v.dataset.ready = '1'
		v.preload = 'auto'
		v.src = pick(v)
	}
	function syncVideos() {
		screens.forEach((s, j) => {
			const v = s.querySelector('video')
			if (!v) return
			if (Math.abs(j - active) <= 1 && inView) prime(j)
			const play = autoplay && inView && j === active && !detail && !pageHidden && !v.dataset.paused
			if (play) {
				if (v.paused) {
					if (!v.dataset.wasActive) v.currentTime = 0
					v.muted = true
					v.play().then(
						() => v.closest('.pj-case__frame').classList.remove('is-blocked'),
						() => blocked(v),
					)
				}
			} else if (!v.paused) v.pause()
			v.dataset.wasActive = j === active ? '1' : ''
		})
	}
	// if the browser refused to start a clip on its own, show a play button and retry on the first touch, click or key
	function blocked(v) {
		v.closest('.pj-case__frame').classList.add('is-blocked')
		const retry = () => {
			;['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => window.removeEventListener(t, retry, true))
			syncVideos()
		}
		;['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => window.addEventListener(t, retry, { capture: true, passive: true }))
	}
	// pause when the tab is put away; a tab that starts out hidden (opened in the background) still plays once shown
	let pageHidden = false
	document.addEventListener('visibilitychange', () => {
		pageHidden = document.visibilityState === 'hidden'
		syncVideos()
	})
	// a click on a clip pauses it, or plays it when motion is reduced
	section.querySelectorAll('.pj-case__video').forEach((v) => {
		v.addEventListener('click', () => {
			if (!v.dataset.ready) {
				v.dataset.ready = '1'
				v.src = pick(v)
			}
			if (v.paused) {
				delete v.dataset.paused
				v.muted = true
				v.play().then(() => v.closest('.pj-case__frame').classList.remove('is-blocked'), () => {})
			} else {
				v.dataset.paused = '1'
				v.pause()
			}
		})
	})

	// ---------- the case file ----------
	let detail = null
	let opener = null
	let closeTimer = 0
	function openDetail(panel, btn) {
		if (detail) return
		clearTimeout(closeTimer)
		detail = panel
		opener = btn
		panel.hidden = false
		panel.querySelector('.pj-detail__scroll').scrollTop = 0
		void panel.offsetWidth
		panel.classList.add('is-open')
		btn.setAttribute('aria-expanded', 'true')
		screens.forEach((s) => s.setAttribute('inert', ''))
		syncVideos()
		setTimeout(() => panel.querySelector('.pj-detail__close').focus({ preventScroll: true }), reduceMotion ? 0 : 450)
	}
	function closeDetail() {
		if (!detail) return
		const panel = detail
		detail = null
		panel.classList.remove('is-open')
		if (opener) opener.setAttribute('aria-expanded', 'false')
		screens.forEach((s, j) => s.toggleAttribute('inert', j !== active))
		closeTimer = setTimeout(() => (panel.hidden = true), reduceMotion ? 0 : 820)
		if (opener) opener.focus({ preventScroll: true })
		syncVideos()
	}
	section.querySelectorAll('.pj-case__view').forEach((btn) => {
		const panel = document.getElementById(btn.getAttribute('aria-controls'))
		if (panel) btn.addEventListener('click', () => openDetail(panel, btn))
	})
	section.querySelectorAll('.pj-detail__close, .pj-detail__back').forEach((b) => b.addEventListener('click', closeDetail))
	document.addEventListener('keydown', (e) => {
		if (!detail) return
		if (e.key === 'Escape') {
			e.preventDefault()
			closeDetail()
		} else if (e.key === 'Tab') {
			// keep focus inside the open case file
			const f = [...detail.querySelectorAll('a[href], button:not([disabled])')]
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
	})

	// ---------- start ----------
	measure()
	// anything above the section changing height moves it, so watch every page section
	const ro = new ResizeObserver(measure)
	;[flow, ...flow.children].forEach((el) => ro.observe(el))
	window.addEventListener('load', measure)
})()
