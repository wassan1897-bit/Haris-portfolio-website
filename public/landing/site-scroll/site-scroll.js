/* Site-wide scroll: one engine for every page boundary, and a switchable transition style on top of it.

   Boundaries are the scroll positions where a page lands (About, the portfolio intro, the projects, Selected work,
   the reviews). The screen of scrolling just before each one is its transition window.
   - The page never rests inside a window: a mouse-wheel notch or a paging key glides the whole step,
     and any other scroll that stops inside one is carried on in the direction it was going.
   - The active style draws the transition from the window's progress, so it moves exactly with the scroll.
   - Inside the projects, which step without scrolling, the style is played by SiteScroll.cut().
   Desktop with a mouse only; phones and tablets scroll freely. */
;(function () {
	const flow = document.getElementById('site-flow')
	if (!flow) return
	const root = document.documentElement
	const on = window.matchMedia('(min-width: 1024px) and (hover: hover)')
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
	const sine = (t) => -(Math.cos(Math.PI * t) - 1) / 2
	const pageTop = (el) => el.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop

	const PAGES = [
		// hero to About is one longer, softer glide (the text leaving and the slide in one move)
		['#about-land', '02 · About Haris', false, 1700],
		// About straight into "Entering the portfolio": one glide lands on PORTFOLIO risen, holds it for a beat
		// (the last number, ms) and then carries on by itself through the O into project 01, whose film plays
		['#ent-land', '03 · The portfolio', false, 1800, '#about-land', 600, 'sine'],
		['#panel-works', '04 · The projects', false, 1500, '#ent-land', 0, 'sine'],
		// free scroll through Selected work, then one glide into Client reviews (reviews/reel.js draws the transition)
		['#panel-scaling', '05 · Client reviews', false, 1500],
	]
		// a window starts a screen before its page, or at another page's landing (`from`)
		// `ease`: 'sine' is a gentler start and stop than the default cubic, for the long glides
		.map(([sel, label, bars = true, dur = 0, from = null, next = 0, ease = 'cubic']) => ({ el: document.querySelector(sel), label, bars, dur, next, ease, from: from && document.querySelector(from) }))
		.filter((p) => p.el)

	// ---------------- styles ----------------
	const STYLES = [
		['letterbox', 'Letterbox cut'],
		['off', 'Off'],
	]
	let mode = 'letterbox'
	try {
		const q = new URLSearchParams(location.search).get('scroll')
		const saved = localStorage.getItem('sx-mode')
		mode = [q, saved].find((m) => STYLES.some(([k]) => k === m)) || mode
	} catch (e) {}
	function setMode(m) {
		mode = m
		STYLES.forEach(([k]) => root.classList.toggle('sx-' + k, k === m))
		try {
			localStorage.setItem('sx-mode', m)
		} catch (e) {}
		if (picker) picker.value = m
		draw()
	}

	// ---------------- the letterbox ----------------
	const box = document.createElement('div')
	box.className = 'sx-box'
	box.setAttribute('aria-hidden', 'true')
	box.innerHTML = '<div class="sx-bar sx-bar--top"><span class="sx-label"></span></div><div class="sx-bar sx-bar--bot"><span class="sx-tc"></span></div>'
	document.body.appendChild(box)
	const barTop = box.querySelector('.sx-bar--top')
	const barBot = box.querySelector('.sx-bar--bot')
	const label = box.querySelector('.sx-label')
	const tc = box.querySelector('.sx-tc')

	// ---------------- the style picker (temporary, for trying the styles) ----------------
	const pick = document.createElement('label')
	pick.className = 'sx-pick'
	pick.innerHTML = '<span>Scroll style</span><select>' + STYLES.map(([k, n]) => `<option value="${k}">${n}</option>`).join('') + '</select>'
	// only shown when trying styles: about.html?scroll=letterbox (or off)
	if (new URLSearchParams(location.search).has('scroll')) document.body.appendChild(pick)
	const picker = pick.querySelector('select')
	picker.addEventListener('change', () => setMode(picker.value))

	// ---------------- windows ----------------
	let wins = [] // { from, to, label }
	let vh = 1
	function measure() {
		vh = flow.clientHeight || window.innerHeight
		wins = PAGES.map((p) => {
			const to = Math.round(pageTop(p.el))
			const from = p.from ? Math.round(pageTop(p.from)) : to - vh
			return { from: Math.max(0, from), to, label: p.label, bars: p.bars, dur: p.dur, next: p.next, ease: p.ease }
		})
		draw()
	}

	// closure of the bars: 0 open, 1 shut
	let cutC = 0
	function scrollClosure(st) {
		for (const w of wins) {
			if (st > w.from && st < w.to) {
				if (!w.bars) return { c: 0, w: null }
				const t = (st - w.from) / (w.to - w.from)
				return { c: t < 0.5 ? inOut(t / 0.5) : inOut((1 - t) / 0.5), w }
			}
		}
		return { c: 0, w: null }
	}
	let shownLabel = ''
	function draw() {
		const st = flow.scrollTop
		const { c: sc, w } = scrollClosure(st)
		const c = mode === 'letterbox' && on.matches && !reduce ? Math.max(sc, cutC) : 0
		const k = c * 0.985
		barTop.style.transform = `translate3d(0, ${((k - 1) * 100).toFixed(3)}%, 0)`
		barBot.style.transform = `translate3d(0, ${((1 - k) * 100).toFixed(3)}%, 0)`
		box.classList.toggle('is-on', c > 0.001)
		const text = w ? w.label : cutLabel
		if (text !== shownLabel) {
			label.textContent = text
			shownLabel = text
		}
		label.style.opacity = clamp((c - 0.35) / 0.3).toFixed(3)
		tc.style.opacity = label.style.opacity
		if (c > 0.35) tc.textContent = timecode(st)
	}
	const timecode = (st) => {
		const f = Math.floor(st / 4)
		const pad = (n) => String(n).padStart(2, '0')
		return `${pad(Math.floor(f / 1440))}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`
	}

	// ---------------- SiteScroll.cut: play the style for a change that does not scroll ----------------
	let cutLabel = ''
	let cutRaf = 0
	let cutPending = null
	let cutPhase = 0 // 0 idle, 1 closing, 2 opening
	function cut(apply, text) {
		if (mode !== 'letterbox' || !on.matches || reduce) return apply()
		cutLabel = text || cutLabel
		if (cutPhase === 1) {
			cutPending = apply
			return
		}
		cutPending = apply
		cutPhase = 1
		const c0 = cutC
		const tClose = 300 * (1 - c0)
		const tOpen = 460
		let t0 = performance.now()
		cancelAnimationFrame(cutRaf)
		const step = (now) => {
			if (cutPhase === 1) {
				const k = tClose ? Math.min(1, (now - t0) / tClose) : 1
				cutC = c0 + (1 - c0) * inOut(k)
				if (k >= 1) {
					const fn = cutPending
					cutPending = null
					if (fn) fn()
					cutPhase = 2
					t0 = now + 60 // a beat on black
				}
			} else {
				const k = Math.max(0, Math.min(1, (now - t0) / tOpen))
				cutC = 1 - inOut(k)
				if (k >= 1) {
					cutPhase = 0
					cutC = 0
					draw()
					return
				}
			}
			draw()
			cutRaf = requestAnimationFrame(step)
		}
		cutRaf = requestAnimationFrame(step)
	}
	window.SiteScroll = { cut, get mode() {
		return mode
	} }

	// ---------------- stepping: never rest inside a window ----------------
	let gliding = false
	let lastWheel = 0
	let glideRaf = 0
	let lastSt = flow.scrollTop
	let dir = 1
	let settle = 0
	let pointerDown = false

	// dur: how long a full window takes (default 1100ms); a part of a window takes a part of it
	// a window with `next`: having glided down onto it, wait that long, then glide the following window by itself
	let nextTimer = 0
	function enter(w, down) {
		clearTimeout(nextTimer)
		glide(down ? w.to : w.from, w.dur, w.ease === 'sine' ? sine : inOut, () => {
			if (!down || !w.next) return
			const i = wins.indexOf(w)
			const nx = wins[i + 1]
			if (!nx) return
			nextTimer = setTimeout(() => {
				if (gliding || Math.abs(flow.scrollTop - w.to) > 2 || document.visibilityState === 'hidden') return
				enter(nx, true)
			}, w.next)
		})
	}
	function glide(to, full = 0, ease = inOut, done = null) {
		const from = flow.scrollTop
		const dist = to - from
		cancelAnimationFrame(glideRaf)
		if (Math.abs(dist) < 1) return
		const dur = reduce ? 0 : 500 + ((full || 1100) - 500) * Math.min(1, Math.abs(dist) / vh)
		const t0 = performance.now()
		gliding = true
		const step = (now) => {
			const k = dur ? Math.min(1, (now - t0) / dur) : 1
			flow.scrollTop = Math.round(from + dist * ease(k))
			if (k < 1) glideRaf = requestAnimationFrame(step)
			else {
				release()
				if (done) done()
			}
		}
		glideRaf = requestAnimationFrame(step)
	}
	function release() {
		// keep swallowing trackpad momentum until it has died down
		if (performance.now() - lastWheel > 140) gliding = false
		else setTimeout(release, 70)
	}
	// the window a step of `reach` pixels in this direction would enter from here. Looking ahead by the
	// step itself means a notch that would land just inside a window glides the whole window at once,
	// instead of scrolling in a little, pausing, and then gliding the rest
	function stepWindow(st, down, reach = 0) {
		for (const w of wins) {
			if (down && st < w.to - 2 && st + reach >= w.from - 2) return w
			if (!down && st > w.from + 2 && st - reach <= w.to + 2) return w
		}
		return null
	}

	flow.addEventListener(
		'wheel',
		(e) => {
			// a section that handled this notch itself (the projects step) has the last word
			if (!on.matches || e.ctrlKey || !e.deltaY || e.defaultPrevented) return
			if (gliding) {
				lastWheel = performance.now()
				e.preventDefault()
				return
			}
			if (document.querySelector('.pj-detail.is-open')) return
			const down = e.deltaY > 0
			// a notch in lines or pages is a big step; in pixels it is what the browser would scroll
			const reach = e.deltaMode ? vh * 0.3 : Math.min(Math.abs(e.deltaY), vh * 0.5)
			const w = stepWindow(flow.scrollTop, down, reach)
			if (!w) return
			lastWheel = performance.now()
			e.preventDefault()
			enter(w, down)
		},
		{ passive: false },
	)

	document.addEventListener('keydown', (e) => {
		if (!on.matches || gliding || e.altKey || e.ctrlKey || e.metaKey) return
		if (e.target.closest && e.target.closest('input, textarea, select, button, a, [contenteditable]')) return
		// an open case file scrolls itself
		if (document.querySelector('.pj-detail.is-open')) return
		const k = e.key
		const down = k === 'PageDown' || k === 'ArrowDown' || (k === ' ' && !e.shiftKey)
		const up = k === 'PageUp' || k === 'ArrowUp' || (k === ' ' && e.shiftKey)
		if (!down && !up) return
		const w = stepWindow(flow.scrollTop, down, k === 'PageDown' || k === 'PageUp' || k === ' ' ? vh * 0.8 : 40)
		if (!w) return
		e.preventDefault()
		enter(w, down)
	})

	// going back up, a touch or a key cancels a pending carry-on (a downward wheel, or a trackpad's leftover
	// momentum, only agrees with it)
	window.addEventListener('wheel', (e) => e.deltaY < 0 && clearTimeout(nextTimer), { capture: true, passive: true })
	;['touchstart', 'keydown'].forEach((t) => window.addEventListener(t, () => clearTimeout(nextTimer), { capture: true, passive: true }))
	flow.addEventListener('pointerdown', () => (pointerDown = true))
	window.addEventListener('pointerup', () => {
		pointerDown = false
		armSettle()
	})
	function armSettle() {
		clearTimeout(settle)
		settle = setTimeout(() => {
			if (!on.matches || gliding || pointerDown) return
			const st = flow.scrollTop
			const w = wins.find((w) => st > w.from + 2 && st < w.to - 2)
			if (w) enter(w, dir > 0)
		}, 160)
	}

	flow.addEventListener(
		'scroll',
		() => {
			const st = flow.scrollTop
			if (st !== lastSt) dir = st > lastSt ? 1 : -1
			lastSt = st
			draw()
			if (!gliding) armSettle()
		},
		{ passive: true },
	)

	const ro = new ResizeObserver(measure)
	;[flow, ...flow.children].forEach((el) => ro.observe(el))
	window.addEventListener('load', measure)
	if (document.fonts) document.fonts.ready.then(measure)
	on.addEventListener('change', measure)
	setMode(mode)
	measure()
})()
