/* Page 2, About Haris (see about-h.css). Two screens of scrolling on desktop, every frame taken from the scroll
   position, so it plays the same both ways:
   - hero to About (first screen): the hero's title, then its line, numbers and logos, slide up out of their own
     windows, like titles leaving through a mask; the rail and the top links fade. A copy of the photo panel, in
     exactly the same place, takes over: it grows to the full height and widens to the left over two thirds of the
     screen, his studio backdrop carried across while he settles at a natural size on the right. The dark column
     drops in like a curtain; the monogram draws in, and every line of copy rises out of its own mask in turn.
   - About to the portfolio intro (second screen): the page carries on sideways in layers, the column's text a little
     faster and his photo a little slower than the page, onto the dark of enter/enter.js.
   Positions and line breaks are read on resize only. */
;(function () {
	const flow = document.getElementById('site-flow')
	const hx = document.getElementById('panel-about')
	const hero = document.getElementById('panel-hero')
	const header = document.getElementById('js-site-header')
	if (!flow || !hx || !hero || !hx.classList.contains('hx')) return

	const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const wide = window.matchMedia('(min-width: 1024px)')
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const lerp = (a, b, t) => a + (b - a) * t
	const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
	const out = (t) => 1 - Math.pow(1 - t, 3)
	const smooth = (t) => t * t * (3 - 2 * t)
	// snap to whole device pixels: anything in between draws text and the photo slightly soft
	const px = (v) => Math.round(v * (window.devicePixelRatio || 1)) / (window.devicePixelRatio || 1)

	const exitTitle = hero.querySelector('.ph-exit--title')
	const exitSub = hero.querySelector('.ph-exit--sub')
	const exitFade = [...hero.querySelectorAll('.ph-exit--rail, .ph-exit--top')]
	const heroTitle = hero.querySelector('.ph-titles--white .ph-title')
	const heroSub = hero.querySelector('.ph-sub')
	const track = hx.querySelector('.hx__track')
	const pin = hx.querySelector('.hx__pin')
	const frame = hx.querySelector('.hx__photo')
	const img = frame.querySelector('img')
	const side = hx.querySelector('.hx__side')
	const panel = hx.querySelector('.hx__panel')
	const facts = [...hx.querySelectorAll('.hx__facts > div')]
	const who = hx.querySelector('.hx__who')
	const links = [...hx.querySelectorAll('.hx__links a')]
	const foot = hx.querySelector('.hx__foot')
	const IMG_W = 941 // the hero's photo, a crop of the original (x 32 to 608 of 768)
	const IMG_H = 1672
	const FULL_W = 768 // About uses the whole original, so nothing of him is cut off
	const FULL_H = 1024
	const CROP_X = 32
	const CROP_W = 576
	const SWAP = 0.42 // the hero's text is gone by here; the photo copy takes over
	const items = header
		? [
				['l', '.site-header__logo'],
				['c', '.site-header__toggle'],
				['r', '.site-header__actions'],
			]
				.map(([k, s]) => ({ k, el: header.querySelector(s), x: -1 }))
				.filter((it) => it.el)
		: []

	// ---------------- lines: each block of copy is split into lines that rise out of their own mask ----------------
	// words are split once; the lines are regrouped on every resize, because they wrap differently
	const blocks = [
		{ el: who.querySelector('b'), group: 'who' },
		{ el: who.querySelector('i'), group: 'who' },
		{ el: hx.querySelector('.hx__h'), group: 'h' },
		{ el: panel.querySelector('.hx__plab'), group: 'plab' },
		// the rest of the column in reading order: paragraphs, the second label, the list items
		...[...panel.querySelectorAll('p:not(.hx__plab), .hx__plab--gap, .hx__build li')].map((el) => ({ el, group: 'p' })),
	].filter((b) => b.el)
	blocks.forEach((b) => {
		const words = []
		;[...b.el.childNodes].forEach((n) => {
			if (n.nodeType === 3) {
				n.textContent.split(/\s+/).forEach((t) => {
					if (!t) return
					const w = document.createElement('span')
					w.className = 'hx-w'
					w.textContent = t
					words.push(w)
				})
			} else {
				const w = document.createElement('span')
				w.className = 'hx-w'
				w.appendChild(n.cloneNode(true))
				words.push(w)
			}
		})
		b.words = words
		b.lines = []
		inline(b)
	})
	function inline(b) {
		b.el.textContent = ''
		b.words.forEach((w, i) => {
			if (i) b.el.appendChild(document.createTextNode(' '))
			b.el.appendChild(w)
		})
		b.lines = []
	}
	function split(b) {
		inline(b)
		const rows = []
		b.words.forEach((w) => {
			const top = w.offsetTop
			const row = rows[rows.length - 1]
			if (row && Math.abs(row.top - top) < 4) row.words.push(w)
			else rows.push({ top, words: [w] })
		})
		b.el.textContent = ''
		b.lines = rows.map((r) => {
			const ln = document.createElement('span')
			ln.className = 'hx-ln'
			const li = document.createElement('span')
			li.className = 'hx-li'
			r.words.forEach((w, i) => {
				if (i) li.appendChild(document.createTextNode(' '))
				li.appendChild(w)
			})
			ln.appendChild(li)
			b.el.appendChild(ln)
			return li
		})
	}
	const linesOf = (group) => blocks.filter((b) => b.group === group).flatMap((b) => b.lines)

	let cine = false
	let vh = 1
	let W = 1
	let hh = 1
	let x0 = 0 // the photo panel's left edge in the hero
	let L = 1 // the photo panel's left edge on About (a third of the screen)
	let gap = 52 // the hero's strip under the photo
	let from = [0, 0, 1] // the portrait as the hero lays it out (x, y, width)
	let to = [0, 0, 1] // and where it settles on About
	let tWin = [0, 1] // the hero title's window, and its line and numbers' window (hero coordinates)
	let sWin = [0, 1]
	let last = -1

	function clearHero() {
		;[exitTitle, exitSub, ...exitFade].forEach((el) => el && el.removeAttribute('style'))
		hero.classList.remove('is-covered')
	}
	function clearHeader() {
		if (!header) return
		items.forEach((it) => header.classList.remove('site-header--hx-' + it.k))
	}

	function measure() {
		cine = motion && wide.matches
		hx.classList.toggle('is-cine', cine)
		if (!cine) {
			blocks.forEach(inline)
			;[pin, frame, img, track, side, panel, who, foot, ...facts, ...links].forEach((el) => el.removeAttribute('style'))
			hx.classList.remove('is-on', 'is-landed')
			clearHero()
			clearHeader()
			window.__heroHeaderEnd = 0
			return
		}
		vh = flow.clientHeight || window.innerHeight
		W = hero.offsetWidth || flow.clientWidth
		hh = hero.offsetHeight || vh
		const cs = getComputedStyle(hero)
		const left = parseFloat(cs.getPropertyValue('--ph-panel-left')) || 62
		gap = parseFloat(cs.getPropertyValue('--ph-panel-bottom')) || 0
		x0 = (W * left) / 100
		L = Math.round(W / 3)

		// the portrait exactly as the hero lays it out (hero.css: cover at 50% 30% in the panel)
		const panelW = W - x0
		const wImg = Math.max(panelW, ((hh - gap) * IMG_W) / IMG_H)
		const hImg = (wImg * IMG_H) / IMG_W
		// the whole original, placed so its hero crop sits exactly on the hero's photo
		const k = wImg / CROP_W
		from = [x0 + (panelW - wImg) / 2 - CROP_X * k, (hh - gap - hImg) * 0.3, FULL_W * k]
		// on About he sits flush with the right edge, a little taller than the screen, in the room the dark column
		// leaves (it may cover his shoulder, never his face). On narrow or tall screens he is scaled down to that
		// room instead, a little below the top, and his lower edge fades into the backdrop.
		const pw = Math.round(Math.min(430, Math.max(330, W * 0.27)))
		// the whole photo flush with the right edge, so both shoulders are in; his face (from 28% across the photo)
		// stays clear of the column
		const open = L + pw
		let hL = vh * 1.06
		let wL = (hL * FULL_W) / FULL_H
		let x = W - wL
		if (x + wL * 0.28 < open + 12) {
			wL = (W - open - 12) / 0.72
			hL = (wL * FULL_H) / FULL_W
			x = W - wL
		}
		const top = hL >= vh ? -0.02 * vh : Math.min(vh * 0.06, vh - hL)
		to = [x, top, wL]
		Object.assign(img.style, { width: wL + 'px', height: hL + 'px' })
		img.style.setProperty('--hx-bf', top + hL < vh + 2 ? '84%' : '100%')
		Object.assign(side.style, { width: L + 'px' })
		Object.assign(panel.style, { left: L + 'px', width: pw + 'px' })

		// the hero's text windows (offsets ignore the transforms the exit puts on them)
		if (heroTitle) tWin = [heroTitle.offsetTop, heroTitle.offsetTop + heroTitle.offsetHeight]
		if (heroSub) sWin = [heroSub.offsetTop, heroSub.offsetTop + heroSub.offsetHeight]

		blocks.forEach(split)

		items.forEach((it) => {
			const r = it.el.getBoundingClientRect()
			it.x = r.left + r.width / 2
		})
		window.__heroHeaderEnd = vh * 0.38 + 60
		last = -1
		update()
	}

	// one block of the hero leaves upward through a fixed window: it moves up by d and is clipped to where it was
	function leave(el, win, t) {
		const pad = 16
		const d = inOut(t) * (win[1] - win[0] + pad * 2)
		const top = Math.max(0, win[0] - pad + d)
		const bottom = Math.max(0, hh - win[1] - pad - d)
		el.style.transform = `translate3d(0, ${(-d).toFixed(1)}px, 0)`
		el.style.clipPath = `inset(${top.toFixed(1)}px 0 ${bottom.toFixed(1)}px 0)`
	}
	// lines rising out of their masks, one after another, starting at e = at
	function rise(lines, e, at, step, dur) {
		lines.forEach((li, i) => {
			const t = out(clamp((e - at - i * step) / dur))
			li.style.transform = t < 1 ? `translate3d(0, ${((1 - t) * 108).toFixed(2)}%, 0)` : ''
		})
	}

	function update() {
		if (!cine) return
		const st = flow.scrollTop
		if (st === last) return
		last = st

		const p = clamp(st / vh) // hero to About
		const b = clamp((st - vh) / vh) // About on to the reel
		const eB = smooth(b)

		// ---- the hero's text leaves through its windows: the title first, then the rest ----
		if (p > 0) {
			leave(exitTitle, tWin, clamp(p / 0.34))
			leave(exitSub, sWin, clamp((p - 0.05) / 0.33))
			const of = (1 - clamp(p / 0.25)).toFixed(3)
			exitFade.forEach((el) => (el.style.opacity = of))
		} else clearHero()

		// ---- the photo panel takes over, grows to full height and widens to the left ----
		const on = p >= SWAP
		hx.classList.toggle('is-on', on)
		hero.classList.toggle('is-covered', on)
		hero.classList.toggle('is-offscreen', on)
		const e = clamp((p - SWAP) / (1 - SWAP)) // the arrival, 0 to 1
		const g = inOut(clamp(e / 0.38))
		const e1 = inOut(clamp(e / 0.72)) // the widening finishes early; the copy settles after it
		const cut = Math.max(0, vh - (hh - gap)) * (1 - g)
		const lft = lerp(x0, L, e1)
		frame.style.clipPath = `inset(0 0 ${cut.toFixed(1)}px ${px(lft)}px round 0 0 0 ${(10 * (1 - g)).toFixed(1)}px)`
		const s = lerp(from[2] / to[2], 1, e1)
		img.style.transform = `translate3d(${px(lerp(from[0], to[0], e1) + W * 0.1 * eB)}px, ${lerp(from[1], to[1], e1).toFixed(1)}px, 0) scale(${s.toFixed(4)})`
		img.style.setProperty('--hx-m', (1 - e1).toFixed(3))
		track.style.transform = eB > 0 ? `translate3d(${px(-W * eB)}px, 0, 0)` : ''
		// About leaves sideways onto the dark of the portfolio intro, not onto the white page behind it: the pin goes
		// dark, and the page itself carries its own white so the column it slides away keeps its colour
		pin.style.backgroundColor = b > 0 ? '#0a0a0a' : ''
		track.style.backgroundColor = b > 0 ? '#fff' : ''

		// ---- the dark column drops in like a curtain, only where the photo panel has opened ----
		const w = inOut(clamp((e - 0.3) / 0.4))
		panel.style.clipPath = `inset(0 0 ${((1 - w) * 100).toFixed(2)}% ${px(Math.max(0, lft - L))}px)`
		// on the way to the reel its text runs ahead of the page and slides out under the column's edge
		panel.style.setProperty('--hx-px', eB > 0 ? px(-W * 0.12 * eB) + 'px' : '0px')

		// ---- the copy: every line rises out of its own mask, then the facts and the links ----
		rise(linesOf('who'), e, 0.48, 0.05, 0.26)
		rise(linesOf('h'), e, 0.54, 0.05, 0.3)
		rise(linesOf('plab'), e, 0.56, 0, 0.24)
		const pl = linesOf('p')
		rise(pl, e, 0.6, Math.min(0.025, 0.22 / Math.max(1, pl.length - 1)), 0.18)
		facts.forEach((f, i) => {
			const t = out(clamp((e - 0.66 - i * 0.04) / 0.2))
			f.style.opacity = t.toFixed(3)
			f.style.transform = t < 1 ? `translate3d(0, ${px((1 - t) * 14)}px, 0)` : ''
		})
		links.forEach((a, i) => {
			const t = out(clamp((e - 0.72 - i * 0.04) / 0.2))
			a.style.opacity = t.toFixed(3)
			a.style.transform = t < 1 ? `translate3d(0, ${px((1 - t) * 18)}px, 0)` : ''
		})
		foot.style.opacity = clamp((e - 0.84) / 0.16).toFixed(3)

		hx.classList.toggle('is-landed', e >= 0.999 && b < 0.999)

		if (header) {
			header.classList.toggle('site-header--over-hero', p < 0.38)
			const dl = lft - W * eB
			const dr = W - W * eB
			items.forEach((it) => header.classList.toggle('site-header--hx-' + it.k, st > 0.5 && b < 1 && it.x > dl && it.x < dr))
		}
	}

	flow.addEventListener('scroll', update, { passive: true })
	const ro = new ResizeObserver(measure)
	;[flow, ...flow.children].forEach((el) => ro.observe(el))
	wide.addEventListener('change', measure)
	window.addEventListener('load', measure)
	if (document.fonts) document.fonts.ready.then(measure)
	measure()
})()
