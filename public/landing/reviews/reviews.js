/* Client reviews: cards slide along the wall on their own, the one in the middle opens across the
   wall for a few seconds, closes, and the next slides in. Pause, the arrow keys, Escape and a click
   on any card take over. Everything runs only while the section is on screen. */
;(function () {
	const section = document.getElementById('panel-scaling')
	if (!section || !section.classList.contains('rv')) return
	const flow = document.getElementById('site-flow')
	const stage = section.querySelector('.rv__stage')
	const items = [...section.querySelectorAll('.rv-item')]
	const N = items.length
	if (!N) return

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const wide = window.matchMedia('(min-width: 1024px) and (min-aspect-ratio: 5/4)')
	// timings, ms: slide to the next card, rest on it, hold it open, close it
	const T = { slide: 900, rest: 1700, hold: 7000, close: 600 }
	const $ = (s) => section.querySelector(s)
	const ui = {
		num: $('[data-rv-num]'),
		total: $('[data-rv-total]'),
		next: $('.rv-next'),
		nextText: $('[data-rv-next]'),
		bar: $('.rv-next b'),
		play: $('[data-rv-play]'),
		expand: $('[data-rv-expand]'),
		close: $('[data-rv-close]'),
		shot: $('.rv-shot'),
		date: $('[data-rv-date]'),
		times: [...section.querySelectorAll('[data-rv-time]')],
	}
	const pad = (n) => String(n).padStart(2, '0')
	const mod = (a, m) => ((a % m) + m) % m
	ui.total.textContent = pad(N)

	// ---------- fit the 1440 x 900 stage to the screen (desktop only) ----------
	let k = 1
	function fit() {
		k = wide.matches ? Math.min(section.clientWidth / 1440, section.clientHeight / 900) : 1
		stage.style.setProperty('--k', k)
	}
	fit()
	new ResizeObserver(fit).observe(section)

	// ---------- the cards: real ones plus quiet copies, so the wall is always full ----------
	const cards = items.map((it) => it.querySelector('.rv-card'))
	const M = N * Math.ceil(9 / N)
	const clones = $('.rv__clones')
	const slots = []
	for (let j = 0; j < M; j++) {
		let el = cards[j]
		if (j >= N) {
			el = cards[j % N].cloneNode(true)
			el.classList.add('rv-card--clone')
			el.tabIndex = -1
			el.removeAttribute('aria-controls')
			el.removeAttribute('aria-expanded')
			el.removeAttribute('aria-label')
			el.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'))
			clones.appendChild(el)
		}
		el.dataset.v = j
		slots.push({ el, pos: null })
	}
	let v = 0 // which virtual card is in the middle
	const current = () => mod(v, N)
	const offset = (j) => {
		let d = mod(j - v, M)
		if (d > M / 2) d -= M
		return d
	}
	function layout(animate) {
		slots.forEach((s, j) => {
			const d = offset(j)
			// a card that wraps from one end of the wall to the other jumps there unseen
			s.el.classList.toggle('no-anim', !animate || reduceMotion || (s.pos !== null && Math.abs(d - s.pos) > M / 2))
			s.el.style.setProperty('--pos', d)
			s.el.style.setProperty('--dir', Math.sign(d))
			s.el.classList.toggle('is-center', d === 0)
			s.pos = d
		})
		requestAnimationFrame(() => requestAnimationFrame(() => slots.forEach((s) => s.el.classList.remove('no-anim'))))
		labels()
	}
	function labels() {
		ui.num.textContent = pad(current() + 1)
		const it = items[current()]
		ui.expand.setAttribute('aria-label', isOpen ? (it.dataset.full ? 'View the full screenshot' : 'Close') : 'Open this card')
	}

	// ---------- open and close ----------
	let isOpen = false
	function open(focus) {
		if (isOpen) return
		isOpen = true
		const i = current()
		const item = items[i]
		section.classList.add('is-open')
		item.classList.add('is-open')
		cards[i].setAttribute('aria-expanded', 'true')
		labels()
		// the screenshot grows out of the card's own picture (FLIP, transform and opacity only)
		const media = item.querySelector('.rv-detail__media')
		const from = slots[mod(v, M)].el.querySelector('.rv-card__art, .rv-card__stat, .rv-card__empty')
		if (media && from && !reduceMotion && media.animate) {
			const a = from.getBoundingClientRect()
			const b = media.getBoundingClientRect()
			if (a.width && b.width) {
				media.animate(
					[
						{ transform: `translate(${(a.left - b.left) / k}px, ${(a.top - b.top) / k}px) scale(${a.width / b.width}, ${a.height / b.height})`, opacity: 0 },
						{ opacity: 1, offset: 0.35 },
						{ transform: 'none', opacity: 1 },
					],
					{ duration: 950, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
				)
			}
		}
		if (focus) ui.close.focus({ preventScroll: true })
	}
	function close() {
		if (!isOpen) return
		isOpen = false
		section.classList.remove('is-open')
		items.forEach((it) => it.classList.remove('is-open'))
		cards.forEach((c) => c.setAttribute('aria-expanded', 'false'))
		stopProgress()
		labels()
	}
	function go(step) {
		v += step
		layout(true)
	}

	// ---------- autoplay ----------
	let playing = !reduceMotion // what the visitor wants
	let active = false // on screen and the tab is visible
	let timer = 0
	let phase = null
	let phaseEnd = 0
	let holdLeft = 0
	function setPhase(name, ms, fn) {
		clearTimeout(timer)
		phase = name
		phaseEnd = performance.now() + ms
		timer = setTimeout(() => {
			phase = null
			fn()
		}, ms)
	}
	function tick() {
		if (!playing || !active) return
		if (isOpen) hold(holdLeft || T.hold)
		else
			setPhase('rest', T.rest, () => {
				open(false)
				hold(T.hold)
			})
	}
	function hold(ms) {
		holdLeft = 0
		runProgress(ms)
		setPhase('hold', ms, () => {
			close()
			setPhase('close', T.close, () => {
				go(1)
				setPhase('slide', T.slide, tick)
			})
		})
	}
	function halt() {
		if (phase === 'hold') holdLeft = Math.max(500, phaseEnd - performance.now())
		clearTimeout(timer)
		phase = null
		freezeProgress()
	}
	function setPlaying(on) {
		playing = on
		section.classList.toggle('is-paused', !on)
		ui.play.setAttribute('aria-label', on ? 'Pause the slideshow' : 'Play the slideshow')
		if (on) tick()
		else halt()
	}
	// any hands-on use pauses the slideshow, so it never moves under the visitor
	const takeOver = () => playing && setPlaying(false)

	// the bar and the seconds count down to the next card
	let countdown = 0
	function runProgress(ms) {
		const bar = ui.bar
		bar.style.transition = 'none'
		bar.style.transform = `scaleX(${1 - ms / T.hold})`
		void bar.offsetWidth
		bar.style.transition = `transform ${ms}ms linear`
		bar.style.transform = 'scaleX(1)'
		ui.next.classList.add('is-on')
		const end = performance.now() + ms
		const show = () => (ui.nextText.textContent = `Next in ${Math.max(1, Math.ceil((end - performance.now()) / 1000))}s`)
		show()
		clearInterval(countdown)
		countdown = setInterval(show, 250)
	}
	function freezeProgress() {
		clearInterval(countdown)
		const m = getComputedStyle(ui.bar).transform
		ui.bar.style.transition = 'none'
		ui.bar.style.transform = m === 'none' ? 'scaleX(0)' : m
		if (isOpen) ui.nextText.textContent = 'Paused'
	}
	function stopProgress() {
		clearInterval(countdown)
		ui.next.classList.remove('is-on')
	}

	// ---------- controls ----------
	let userTimer = 0
	function step(s, thenOpen) {
		const wasOpen = isOpen
		if (wasOpen) close()
		clearTimeout(userTimer)
		userTimer = setTimeout(
			() => {
				go(s)
				if (wasOpen || thenOpen) userTimer = setTimeout(() => open(thenOpen === 'focus'), reduceMotion ? 0 : T.slide)
			},
			wasOpen && !reduceMotion ? 380 : 0,
		)
	}
	stage.addEventListener('click', (e) => {
		const card = e.target.closest('.rv-card')
		if (!card) return
		takeOver()
		const d = offset(+card.dataset.v)
		if (d === 0) isOpen ? close() : open(true)
		else step(d, 'focus')
	})
	ui.close.addEventListener('click', () => {
		takeOver()
		close()
		cards[current()].focus({ preventScroll: true })
	})
	ui.play.addEventListener('click', () => setPlaying(!playing))
	ui.expand.addEventListener('click', () => {
		takeOver()
		if (!isOpen) return open(true)
		const src = items[current()].dataset.full
		if (!src || typeof ui.shot.showModal !== 'function') return close()
		const img = ui.shot.querySelector('img')
		img.src = src
		img.alt = items[current()].querySelector('.rv-detail__media img')?.alt || ''
		ui.shot.showModal()
	})
	ui.shot.querySelector('.rv-shot__close').addEventListener('click', () => ui.shot.close())
	ui.shot.addEventListener('click', (e) => e.target === ui.shot && ui.shot.close())

	let inView = false
	window.addEventListener('keydown', (e) => {
		if (!inView || ui.shot.open || e.target.closest('input, textarea, select, [contenteditable]')) return
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			takeOver()
			step(e.key === 'ArrowRight' ? 1 : -1)
		} else if (e.key === 'Escape' && isOpen) {
			takeOver()
			close()
		} else return
		e.preventDefault()
	})

	// ---------- Karachi date and time ----------
	let clockTimer = 0
	function clock() {
		const now = new Date()
		const part = (o) => now.toLocaleString('en-GB', { timeZone: 'Asia/Karachi', ...o })
		try {
			ui.date.textContent = `${part({ weekday: 'long' })}, ${part({ day: 'numeric' })} ${part({ month: 'short' })}`
			const t = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Karachi' })
			ui.times.forEach((el) => (el.textContent = t))
		} catch (err) {}
	}
	clock()

	// ---------- run only while the section is on screen ----------
	function setActive(on) {
		if (on === active) return
		active = on
		clearInterval(clockTimer)
		if (on) {
			clock()
			clockTimer = setInterval(clock, 30000)
			tick()
		} else halt()
	}
	let ratio = 0
	new IntersectionObserver(
		([entry]) => {
			ratio = entry.intersectionRatio
			inView = ratio > 0.5
			setActive(inView && !document.hidden)
		},
		{ root: flow || null, threshold: [0, 0.5, 0.75] },
	).observe(section)
	document.addEventListener('visibilitychange', () => setActive(inView && !document.hidden))

	setPlaying(playing)
	layout(false)
})()
