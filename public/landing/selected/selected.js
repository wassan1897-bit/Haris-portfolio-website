/* Selected work: the name nearest the middle of the screen is the active one, and the sticky frame shows
   its picture. Hovering a name sends a picture card and a VIEW circle after the cursor.
   Everything is transform and opacity, and the cursor work runs only while the pointer is over it. */
;(function () {
	const flow = document.getElementById('site-flow')
	if (!flow) return
	const header = document.getElementById('js-site-header')
	const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const pad = (n) => String(n + 1).padStart(2, '0')
	// position of an element inside the scrolling page
	const pageTop = (el) => el.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop

	// ---------------- selected work ----------------
	const sw = document.getElementById('panel-selected')
	if (sw) {
		const items = [...sw.querySelectorAll('.sw-item')]
		const shots = [...sw.querySelectorAll('.sw__shot')]
		const floats = [...sw.querySelectorAll('.sw__float .pic')]
		const now = sw.querySelector('.sw__now')
		const tag = sw.querySelector('.sw__tag')
		const bar = sw.querySelector('.sw__bar i')
		const big = sw.querySelector('.sw__big')
		const float = sw.querySelector('.sw__float')
		const cursor = sw.querySelector('.sw-cursor')
		const pause = sw.querySelector('.sw__pause')

		// hover-card state (used by the scroll handler too)
		let tx = 0,
			ty = 0,
			x = 0,
			y = 0,
			cx = 0,
			cy = 0,
			raf = 0,
			hover = -1,
			scrolled = false,
			sx = -1,
			sy = -1,
			under = -1
		let mids = []
		let active = -1
		// a shot can hold a clip: it plays only while its row is the active one and the section is on screen
		const small = window.matchMedia('(max-width: 767px)')
		let seen = false
		function clips() {
			shots.forEach((s, j) => {
				const v = s.querySelector('video')
				if (!v) return
				const on = seen && j === active && !reduce && document.visibilityState !== 'hidden'
				if (on) {
					if (!v.src) v.src = small.matches ? v.dataset.mp4Small : v.canPlayType('video/webm; codecs="vp9"') ? v.dataset.webm : v.dataset.mp4
					if (v.paused) v.play().catch(() => {})
				} else if (!v.paused) v.pause()
			})
		}
		new IntersectionObserver(([e]) => {
			seen = e.isIntersecting
			clips()
		}, { root: flow }).observe(sw)
		document.addEventListener('visibilitychange', clips)
		function setActive(i) {
			if (i === active) return
			active = i
			items.forEach((it, j) => it.classList.toggle('is-active', j === i))
			shots.forEach((s, j) => s.classList.toggle('is-on', j === i))
			clips()
			now.textContent = pad(i)
			tag.textContent = items[i].dataset.tag
			bar.style.transform = `scaleX(${(i + 1) / items.length})`
		}
		// a clicked row holds the frame until the page has scrolled on a little way
		let pinned = -1
		let pinnedAt = 0
		function onScroll() {
			// the card is placed inside the section, so a scroll would carry it off with the page: it steps aside
			// until the pointer itself moves again
			scrolled = true
			if (hover >= 0) endHover()
			if (pinned >= 0) {
				if (Math.abs(flow.scrollTop - pinnedAt) < 160) return
				pinned = -1
				sw.classList.remove('is-picked')
			}
			const mid = flow.scrollTop + flow.clientHeight / 2
			let best = 0
			let bestD = Infinity
			mids.forEach((m, j) => {
				const d = Math.abs(m - mid)
				if (d < bestD) {
					bestD = d
					best = j
				}
			})
			setActive(best)
		}
		function measure() {
			mids = items.map((it) => pageTop(it) + it.offsetHeight / 2)
			onScroll()
		}
		flow.addEventListener('scroll', onScroll, { passive: true })
		const ro = new ResizeObserver(measure)
		;[...flow.children].forEach((el) => ro.observe(el))
		window.addEventListener('load', measure)
		measure()

		// the picture card and the VIEW circle trail the cursor (state declared above); the card leans into the movement
		function loop() {
			x += (tx - x) * 0.14
			y += (ty - y) * 0.14
			cx += (tx - cx) * 0.32
			cy += (ty - cy) * 0.32
			const lean = Math.max(-10, Math.min(10, (tx - x) * 0.06))
			float.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${lean}deg)`
			cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(1)`
			raf = hover >= 0 || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(loop) : 0
		}
		function aim(e) {
			const r = sw.getBoundingClientRect()
			tx = e.clientX - r.left
			ty = e.clientY - r.top
		}
		function startHover(i, e) {
			aim(e)
			if (hover < 0) {
				x = cx = tx
				y = cy = ty
			}
			if (hover >= 0 && hover !== i) items[hover].classList.remove('is-hover')
			hover = i
			items[i].classList.add('is-hover')
			sw.classList.add('is-hovering')
			floats.forEach((f, j) => f.classList.toggle('is-on', j === i))
			big.textContent = pad(i)
			cursor.textContent = shots[i] && shots[i].querySelector('video') ? 'PLAY' : 'VIEW'
			if (!raf) raf = requestAnimationFrame(loop)
		}
		function endHover() {
			if (hover >= 0) items[hover].classList.remove('is-hover')
			hover = -1
			sw.classList.remove('is-hovering')
		}
		// after a scroll the browser reports the row that slid under a still pointer as entered; that is not a
		// hover, so the card waits for the pointer to really move
		const moved = (e) => {
			const m = !scrolled || e.screenX !== sx || e.screenY !== sy
			sx = e.screenX
			sy = e.screenY
			if (m) scrolled = false
			return m
		}
		items.forEach((it, i) => {
			const a = it.querySelector('a')
			a.addEventListener('pointerenter', (e) => {
				under = i
				if (!fine.matches || reduce || !moved(e)) return
				startHover(i, e)
			})
			a.addEventListener('pointerleave', () => {
				if (under === i) under = -1
				if (hover === i) endHover()
			})
			// a click on the row plays its clip in the frame on the right, from the start; "View project" still goes
			// to the project
			a.addEventListener('click', (e) => {
				if (e.target.closest('.sw-item__go')) return
				e.preventDefault()
				pinned = i
				pinnedAt = flow.scrollTop
				sw.classList.add('is-picked')
				setActive(i)
				const v = shots[i] && shots[i].querySelector('video')
				if (v) {
					if (!v.src) v.src = small.matches ? v.dataset.mp4Small : v.canPlayType('video/webm; codecs="vp9"') ? v.dataset.webm : v.dataset.mp4
					v.currentTime = 0
					v.play().catch(() => {})
				}
				shots[i] && shots[i].animate([{ transform: 'scale(1.06)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' })
			})
		})
		sw.addEventListener('pointermove', (e) => {
			if (!moved(e)) return
			if (hover >= 0) aim(e)
			else if (under >= 0 && fine.matches && !reduce) startHover(under, e)
		})
		pause.addEventListener('click', () => {
			const paused = !sw.classList.contains('is-paused')
			sw.classList.toggle('is-paused', paused)
			pause.setAttribute('aria-pressed', String(paused))
		})
	}

	// ---------------- the site header over these dark screens ----------------
	if (header && 'IntersectionObserver' in window) {
		const under = new Set()
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)))
				header.classList.toggle('site-header--on-dark2', under.size > 0)
			},
			{ root: flow, rootMargin: '-1px 0px -96% 0px', threshold: 0 },
		)
		;[sw, document.getElementById('panel-scaling'), document.getElementById('panel-contact')].forEach((s) => s && io.observe(s))
	}
})()
