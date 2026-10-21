/* Client reviews, the reel (reel.css). One chapter per real Upwork review, then the Upwork record and
   "your project", playing in a loop while the section is on screen.

   A review chapter is directed like the project films:
     0.0 to 1.6 s   title card: the chapter, the price counting up, letterbox bars in
     1.0 to 2.8 s   the screenshot flies in from deep in the frame, out of a blur, over a glow of itself
     2.8 s          a light sweep crosses it, the client's review is outlined, five stars light one by one
     then           the client's words as subtitles (the key phrase lit), endorsements slide in, the camera drifts
     last 0.7 s     the card whips out sideways into the next chapter
   Every frame is computed from one clock (render(t)), so pausing, jumping and the progress bars always agree,
   and the reel can be recorded frame by frame. */
;(function () {
	const sec = document.getElementById('panel-scaling')
	if (!sec || !sec.classList.contains('rr')) return
	const flow = document.getElementById('site-flow')
	const frame = sec.querySelector('.rr__frame')
	const scene = sec.querySelector('.rr__scene')
	const sub = sec.querySelector('.rr__sub')
	const line = sec.querySelector('.rr__line')
	const who = sec.querySelector('.rr__who')
	const recText = sec.querySelector('.rr__rec-text')
	const tc = sec.querySelector('.rr__tc')
	const cut = sec.querySelector('.rr__cut')
	const playBtn = sec.querySelector('.rr__play')
	const chs = [...sec.querySelectorAll('.rr-ch')]
	// the chapter bar is hidden (reel.css): keep its buttons out of the tab order
	chs.forEach((li) => li.querySelector('button').setAttribute('tabindex', '-1'))
	sec.querySelector('.rr__play').setAttribute('tabindex', '-1')
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const small = window.matchMedia('(max-width: 767px)')
	const pad = (n) => String(n).padStart(2, '0')
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const lerp = (a, b, k) => a + (b - a) * k
	const outExpo = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k))
	const outCubic = (k) => 1 - Math.pow(1 - k, 3)
	const inCubic = (k) => k * k * k
	const inOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
	const esc = (w) => w.replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m])

	// ---------- the frame's extra layers: letterbox bars, stars, endorsements, grain ----------
	frame.insertAdjacentHTML(
		'beforeend',
		'<i class="rr__lb rr__lb--t"></i><i class="rr__lb rr__lb--b"></i><div class="rr__chips"></div><div class="rr__grain"></div>',
	)
	sub.insertAdjacentHTML('afterbegin', '<p class="rr__stars">' + '<i>★</i>'.repeat(5) + '</p>')
	const bars = [...frame.querySelectorAll('.rr__lb')]
	const chipsBox = frame.querySelector('.rr__chips')
	const stars = [...sub.querySelectorAll('.rr__stars i')]

	// ---------- the chapters ----------
	const T = { title: 1.6, flyA: 1.0, flyB: 2.8, subs: 3.0, out: 0.7, word: 0.09 }
	const reviews = chs.filter((li) => li.dataset.kind === 'review').length
	const chapters = chs.map((li, i) => {
		const d = li.dataset
		const label = li.querySelector('.rr-ch__lab').textContent
		if (d.kind !== 'review') return { li, kind: d.kind, label, dur: d.kind === 'record' ? 8 : 10 }
		const subs = JSON.parse(d.subs).map((text) => {
			// *key phrase* marks the words to light up
			let key = false
			const words = text.split(' ').map((w) => {
				const open = w.startsWith('*')
				if (open) key = true
				const k = key
				if (w.endsWith('*')) key = false
				return { w: w.replace(/\*/g, ''), key: k }
			})
			return { words, dur: Math.max(3, words.length * 0.34 + 1.2) }
		})
		const dur = T.subs + subs.reduce((a, s) => a + s.dur, 0) + T.out
		return { li, kind: 'review', n: i + 1, label, img: d.img, w: +d.w, h: +d.h, b0: +d.b0, b1: +d.b1, price: d.price, who: d.who, month: d.month, tags: JSON.parse(d.tags || '[]'), subs, dur }
	})

	let cur = -1
	let t = 0
	let el = {} // the current chapter's elements
	let subIndex = -1

	function karachi() {
		try {
			return new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Karachi' }).format(new Date()).toUpperCase()
		} catch (e) {
			return ''
		}
	}

	// place the screenshot so the client's review sits a little above the middle, above the subtitles
	let geo = null
	function layout(c) {
		if (!el.shot) return
		const fw = frame.clientWidth
		const fh = frame.clientHeight
		const block = c.b1 - c.b0
		const s = Math.min((fw * (small.matches ? 0.98 : 0.56)) / c.w, (fh * 0.46) / block)
		const mid = ((c.b0 + c.b1) / 2) * s
		Object.assign(el.shot.style, {
			width: c.w * s + 'px',
			left: (fw - c.w * s) / 2 + (small.matches || !c.tags.length ? 0 : -fw * 0.07) + 'px',
			top: fh * (small.matches ? 0.38 : 0.385) - mid + 'px',
			transformOrigin: `50% ${mid}px`,
		})
		el.hl.style.top = c.b0 * s - 6 + 'px'
		el.hl.style.height = block * s + 12 + 'px'
		geo = { fw, fh }
	}

	function go(i) {
		i = (i + chapters.length) % chapters.length
		const c = chapters[i]
		cur = i
		t = 0
		subIndex = -1
		el = {}
		scene.textContent = ''
		chipsBox.textContent = ''
		line.textContent = ''
		chs.forEach((li, j) => {
			li.classList.toggle('is-on', j === i)
			li.classList.toggle('is-done', j < i)
			li.style.setProperty('--p', 0)
			li.querySelector('button').setAttribute('aria-current', j === i ? 'true' : 'false')
		})
		const list = c.li.parentElement
		if (list.scrollWidth > list.clientWidth + 2) list.scrollTo({ left: c.li.offsetLeft - list.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
		frame.classList.toggle('is-card', c.kind !== 'review')
		sec.classList.toggle('is-review', c.kind === 'review')
		// the frame is decoration for the screenshots (the reviews are in the list for screen readers), but the
		// record and contact scenes hold real links
		if (c.kind === 'review') frame.setAttribute('aria-hidden', 'true')
		else frame.removeAttribute('aria-hidden')

		if (c.kind === 'review') {
			recText.textContent = `Client review ${pad(c.n)} · Upwork`
			tc.textContent = `${c.price} earned · ★ 5.0`
			who.textContent = `${c.who} · ${c.month}`
			scene.innerHTML = `
				<div class="rr-glow"></div>
				<div class="rr-title"><p class="rr-title__no">Client review ${pad(c.n)} / ${pad(reviews)}</p><p class="rr-title__price">${c.price}</p><p class="rr-title__lab">${esc(c.label)}</p></div>
				<div class="rr-shot"><img src="${c.img}" width="${c.w}" height="${c.h}" alt="" decoding="async" /><span class="rr-shot__hl"></span><span class="rr-shot__glint"></span></div>`
			el = {
				glow: scene.querySelector('.rr-glow'),
				title: scene.querySelector('.rr-title'),
				price: scene.querySelector('.rr-title__price'),
				shot: scene.querySelector('.rr-shot'),
				hl: scene.querySelector('.rr-shot__hl'),
				glint: scene.querySelector('.rr-shot__glint'),
				target: parseFloat(c.price.replace(/[^\d.]/g, '')) || 0,
			}
			chipsBox.innerHTML = c.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')
			el.chips = [...chipsBox.children]
			layout(c)
			const nx = chapters[(i + 1) % chapters.length]
			if (nx.img) new Image().src = nx.img
		} else {
			const tpl = document.getElementById(c.kind === 'record' ? 'rr-record' : 'rr-contact')
			scene.appendChild(tpl.content.cloneNode(true))
			recText.textContent = c.kind === 'record' ? 'Upwork record' : 'Your project'
			tc.textContent = c.kind === 'record' ? 'Top Rated Plus · 100%' : 'Karachi · ' + karachi()
			const clock = scene.querySelector('.rr-clock')
			if (clock) clock.textContent = karachi()
			// numbers that count up
			el.counts = [...scene.querySelectorAll('[data-count]')].map((b) => ({ b, to: +b.dataset.count, fmt: b.dataset.fmt || '' }))
		}
		if (!reduce) cut.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'ease-out' })
		render()
	}

	// ---------- one frame of the current chapter at time t ----------
	function render() {
		const c = chapters[cur]
		c.li.style.setProperty('--p', Math.min(1, t / c.dur).toFixed(4))
		if (c.kind !== 'review') {
			;(el.counts || []).forEach(({ b, to, fmt }) => {
				const v = Math.round(to * (reduce ? 1 : outCubic(clamp((t - 0.5) / 1.4))))
				b.textContent = fmt === 'k' ? `$${v}K+` : String(v)
			})
			bars.forEach((b) => (b.style.transform = 'scaleY(0)'))
			return
		}
		if (!geo) layout(c)
		const R = reduce
		const end = c.dur - T.out

		// letterbox bars close in for the title, then open
		const bar = R ? 0 : clamp(t / 0.5) * (1 - clamp((t - 1.5) / 0.6))
		bars.forEach((b) => (b.style.transform = `scaleY(${outCubic(bar).toFixed(3)})`))

		// title card: rises in, the price counts up, then it flies past the camera
		const tIn = R ? 1 : outExpo(clamp(t / 0.6))
		const tOut = R ? 1 : inCubic(clamp((t - 1.15) / 0.55))
		el.title.style.opacity = R ? 0 : (tIn * (1 - tOut)).toFixed(3)
		el.title.style.transform = `translate3d(0, ${lerp(24, 0, tIn).toFixed(1)}px, 0) scale(${lerp(1, 1.35, tOut).toFixed(3)})`
		el.title.style.filter = `blur(${(tOut * 8).toFixed(1)}px)`
		const count = R ? 1 : outCubic(clamp((t - 0.15) / 0.9))
		el.price.textContent = '$' + Math.round(el.target * count).toLocaleString('en-US')

		// the glow behind: a blurred copy of the screenshot, breathing in
		el.glow.style.opacity = (R ? 0.5 : 0.55 * outCubic(clamp((t - 0.6) / 1.4)) * (1 - inCubic(clamp((t - end) / T.out)))).toFixed(3)
		el.glow.style.transform = `translate3d(${lerp(-4, 4, clamp(t / c.dur)).toFixed(2)}%, 0, 0) scale(${lerp(1.25, 1, clamp(t / c.dur)).toFixed(3)})`

		// the screenshot: fly in, drift, whip out
		const f = R ? 1 : outExpo(clamp((t - T.flyA) / (T.flyB - T.flyA)))
		const d = clamp((t - T.flyB) / Math.max(1, end - T.flyB))
		const o = R ? 0 : inCubic(clamp((t - end) / T.out))
		const rx = lerp(64, 13, f) + lerp(0, -6, inOut(d))
		const rz = lerp(-11, -2.5, f) + lerp(0, 1.8, inOut(d))
		const z = lerp(-1100, 0, f)
		const ty = lerp(26, 0, f) + lerp(1.5, -1.5, inOut(d))
		const sc = lerp(1, 1.07, inOut(d))
		el.shot.style.opacity = R ? 1 : (clamp((t - T.flyA) / 0.45) * (1 - o)).toFixed(3)
		el.shot.style.transform = `translate3d(${(-o * 46).toFixed(2)}%, ${ty.toFixed(2)}%, ${z.toFixed(0)}px) rotateY(${(o * 28).toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`
		el.shot.style.filter = `blur(${((1 - f) * 7 + o * 12).toFixed(1)}px)`

		// the light sweep and the outline
		const g = clamp((t - (T.flyB - 0.2)) / 0.9)
		el.glint.style.transform = `translateX(${lerp(-120, 260, inOut(g)).toFixed(1)}%) skewX(-18deg)`
		el.glint.style.opacity = g > 0 && g < 1 ? '1' : '0'
		el.hl.style.opacity = (R ? 1 : clamp((t - T.flyB) / 0.5) * (1 - o)).toFixed(3)

		// five stars, one by one, and the client's name
		stars.forEach((s, k) => {
			const p = R ? 1 : outExpo(clamp((t - (T.flyB + 0.1 + k * 0.12)) / 0.4))
			s.style.opacity = (p * (1 - o)).toFixed(3)
			s.style.transform = `scale(${lerp(0.2, 1, p).toFixed(3)})`
		})
		who.style.opacity = (R ? 1 : clamp((t - T.subs) / 0.5) * (1 - o)).toFixed(3)

		// the endorsements slide in beside the card
		;(el.chips || []).forEach((chip, k) => {
			const p = R ? 1 : outExpo(clamp((t - (T.subs + 0.8 + k * 0.28)) / 0.7))
			chip.style.opacity = (p * (1 - o)).toFixed(3)
			chip.style.transform = `translate3d(${lerp(60, 0, p).toFixed(1)}px, 0, 0)`
		})

		// subtitles: which line, and how many of its words are up
		let at = T.subs
		let k = -1
		for (let j = 0; j < c.subs.length; j++) {
			if (t >= at) k = j
			if (t < at + c.subs[j].dur) break
			at += c.subs[j].dur
		}
		if (k < 0) {
			line.textContent = ''
			subIndex = -1
			return
		}
		if (k !== subIndex) {
			subIndex = k
			line.innerHTML = c.subs[k].words.map((x) => `<span class="${x.key ? 'is-key' : ''}">${esc(x.w)}</span>`).join(' ')
		}
		const begin = T.subs + c.subs.slice(0, k).reduce((a, s) => a + s.dur, 0)
		const spans = line.children
		for (let j = 0; j < spans.length; j++) {
			const p = R ? 1 : clamp((t - begin - j * T.word) / 0.22)
			spans[j].style.opacity = (p * (1 - o)).toFixed(3)
			spans[j].style.transform = `translate3d(0, ${lerp(0.35, 0, p).toFixed(3)}em, 0)`
		}
		line.style.opacity = (1 - o).toFixed(3)
	}

	// ---------- the clock ----------
	let inView = false
	let paused = false // with reduced motion the chapters still change, they just do not move
	let raf = 0
	let last = 0
	const running = () => inView && arrived && !paused && document.visibilityState !== 'hidden'
	function tick(now) {
		raf = 0
		if (!running()) return sync()
		t += Math.min(0.1, (now - last) / 1000)
		last = now
		if (t >= chapters[cur].dur) go(cur + 1)
		else render()
		raf = requestAnimationFrame(tick)
	}
	function sync() {
		sec.classList.toggle('is-running', running())
		sec.classList.toggle('is-paused', paused)
		playBtn.setAttribute('aria-pressed', String(paused))
		playBtn.setAttribute('aria-label', paused ? 'Play the reel' : 'Pause the reel')
		if (running() && !raf) {
			last = performance.now()
			raf = requestAnimationFrame(tick)
		}
	}

	chs.forEach((li, i) =>
		li.querySelector('button').addEventListener('click', () => {
			if (!reduce) paused = false
			go(i)
			sync()
		}),
	)
	playBtn.addEventListener('click', () => {
		paused = !paused
		sync()
	})
	sec.addEventListener('keydown', (e) => {
		if (!e.target.closest('.rr__chapters')) return
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
		e.preventDefault()
		go(cur + (e.key === 'ArrowRight' ? 1 : -1))
		chs[cur].querySelector('button').focus()
	})
	if ('IntersectionObserver' in window) {
		new IntersectionObserver(
			([e]) => {
				inView = e.isIntersecting
				sync()
			},
			{ root: flow, threshold: 0.35 },
		).observe(frame)
	} else inView = true
	document.addEventListener('visibilitychange', sync)
	window.addEventListener('resize', () => {
		geo = null
		if (cur >= 0 && chapters[cur].kind === 'review') layout(chapters[cur])
		render()
	})

	// ---------- arriving: the frame opens out of a line of light as the section scrolls in ----------
	// p runs from 0 (the section's top at the bottom of the screen) to 1 (landed). Selected work fades into the
	// dark, a line of light draws across the middle, the frame opens out of it like a projector screen, the
	// heading rises, then the chapters. The reel waits until it has landed and starts again from review 01
	// each time the section is entered from above.
	const head = sec.querySelector('.rr__head')
	const title = sec.querySelector('.rr__title')
	const lower = sec.querySelector('.rr__bar')
	const leaving = [...document.querySelectorAll('#panel-selected .sw__head, #panel-selected .sw__grid')]
	const beam = document.createElement('i')
	beam.className = 'rr__beam'
	beam.setAttribute('aria-hidden', 'true')
	frame.appendChild(beam)
	let arrived = reduce
	let fresh = true
	function arriving() {
		const vh = flow.clientHeight || window.innerHeight
		const top = sec.getBoundingClientRect().top - flow.getBoundingClientRect().top
		const p = reduce ? 1 : clamp(1 - top / vh)
		const open = outCubic(clamp((p - 0.38) / 0.52))
		const line = outCubic(clamp((p - 0.18) / 0.3))
		const rise = outCubic(clamp((p - 0.3) / 0.45))
		const tail = clamp((p - 0.78) / 0.22)
		frame.style.clipPath = open > 0.999 ? '' : `inset(${((1 - open) * 49.2).toFixed(2)}% 0 round 8px)`
		frame.style.transform = open > 0.999 ? '' : `scale(${lerp(0.9, 1, open).toFixed(4)})`
		frame.style.filter = open > 0.999 ? '' : `brightness(${lerp(0.35, 1, open).toFixed(3)})`
		beam.style.transform = `scaleX(${line.toFixed(4)})`
		beam.style.opacity = (line * (1 - inCubic(open))).toFixed(3)
		head.style.opacity = rise.toFixed(3)
		title.style.transform = rise > 0.999 ? '' : `translate3d(0, ${((1 - rise) * 0.7).toFixed(3)}em, 0)`
		title.style.clipPath = rise > 0.999 ? '' : `inset(0 0 ${((1 - rise) * 100).toFixed(2)}% 0)`
		lower.style.opacity = tail.toFixed(3)
		lower.style.transform = tail > 0.999 ? '' : `translate3d(0, ${((1 - tail) * 24).toFixed(1)}px, 0)`
		const dim = p > 0 ? (1 - 0.85 * clamp((p - 0.05) / 0.55)).toFixed(3) : ''
		leaving.forEach((n) => (n.style.opacity = dim))
		if (p < 0.3) fresh = true
		const now = p >= 0.9
		if (now && !arrived && fresh && !reduce) {
			fresh = false
			go(0)
		}
		if (now !== arrived) {
			arrived = now
			sync()
		}
	}
	flow.addEventListener('scroll', arriving, { passive: true })
	window.addEventListener('resize', arriving)

	// for recording a preview: pause, then show chapter i at second s
	window.__rrSeek = (i, s) => {
		paused = true
		sync()
		if (i !== cur) go(i)
		t = s
		render()
		return chapters[cur].dur
	}

	go(0)
	arriving()
	sync()
})()
