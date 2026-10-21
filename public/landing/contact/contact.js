/* Contact, the last screen (contact.css). Everything here follows the scroll position, so it plays forwards and
   backwards with the wheel or a finger:
     the section scrolling in   the heading's letters fly in from scattered, tilted, blurred positions and lock
     once it is pinned          the copy, the buttons and the status rise in
     the last part              the footer comes up from the bottom, the content makes room for it
   The busywork in the background runs on its own clock while the section is on screen: each item surfaces out of
   a blur, comes into focus, is struck through and fades (it has been automated). */
;(function () {
	const sec = document.getElementById('panel-contact')
	const flow = document.getElementById('site-flow')
	if (!sec || !flow) return
	const title = sec.querySelector('.ct__title')
	const tasksBox = sec.querySelector('.ct__tasks')
	const ins = [...sec.querySelectorAll('.ct__in')]
	const foot = sec.querySelector('.ct__foot')
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const small = window.matchMedia('(max-width: 767px)')
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const lerp = (a, b, k) => a + (b - a) * k
	const io = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
	const out = (k) => 1 - Math.pow(1 - k, 3)
	let seed = 21
	const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647

	// ---------- the heading, split into letters (the h2 keeps its aria-label) ----------
	const text = title.textContent.trim()
	title.textContent = ''
	const letters = [...text].map((ch) => {
		const b = document.createElement('b')
		b.setAttribute('aria-hidden', 'true')
		b.textContent = ch === ' ' ? ' ' : ch
		if (ch === ' ') b.className = 'ct__sp'
		if (ch === '.') b.className = 'ct__dot'
		title.appendChild(b)
		// offsets in fractions of the screen, so they scale with it
		return { b, x: rnd() - 0.5, y: 0.25 + rnd() * 0.5, r: (rnd() - 0.5) * 140, d: rnd() }
	})

	// ---------- the busywork ----------
	const TASKS = ['Missed call, 9:42 PM', 'Ticket #4821', 'Re: Re: Fwd: invoice', 'Follow up with the lead?', 'Update the CRM', 'Copy, paste, repeat', 'Weekly report, again', 'Who replied to this?', 'Book the appointment', 'Chase the payment', 'Is the area covered?', 'Out of office', 'Sort the inbox', 'Call back tomorrow']
	// where each one sits, as fractions of the stage: clear of the heading and the copy in the middle
	const SPOTS = [[0.05, 0.12], [0.69, 0.14], [0.33, 0.09], [0.78, 0.59], [0.03, 0.59], [0.65, 0.86], [0.07, 0.83], [0.4, 0.92], [0.81, 0.23], [0.17, 0.21], [0.79, 0.74], [0.52, 0.2], [0.22, 0.91], [0.03, 0.72]]
	const tasks = TASKS.map((txt, i) => {
		const s = document.createElement('span')
		s.className = 'ct__task'
		s.innerHTML = txt + '<s></s>'
		tasksBox.appendChild(s)
		return { s, line: s.querySelector('s'), at: i * 0.42 + rnd() * 0.3, z: 0.55 + rnd() * 0.7, x: SPOTS[i][0], y: SPOTS[i][1] }
	})

	// ---------- scroll ----------
	let vh = 1
	let top = 0
	let run = 1
	let W = 1
	function measure() {
		vh = flow.clientHeight || window.innerHeight
		W = sec.clientWidth || window.innerWidth
		top = sec.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop
		run = Math.max(1, sec.offsetHeight - vh)
		draw()
	}
	let landed = 0
	function draw() {
		const st = flow.scrollTop
		// a: the section scrolling in (0 when its top is at the bottom of the screen, 1 when it is pinned)
		const a = reduce ? 1 : clamp((st - (top - vh)) / vh)
		// b: progress through the pinned part
		const b = reduce ? 0.5 : clamp((st - top) / run)
		landed = a
		letters.forEach((L) => {
			const k = reduce ? 1 : io(clamp((a - 0.25 - L.d * 0.2) / 0.55 + b * 2))
			L.b.style.transform = k >= 1 ? '' : `translate3d(${(L.x * W * 0.5 * (1 - k)).toFixed(1)}px, ${(L.y * vh * (1 - k)).toFixed(1)}px, 0) rotate(${(L.r * (1 - k)).toFixed(1)}deg)`
			L.b.style.filter = k > 0.97 ? '' : `blur(${((1 - k) * 10).toFixed(1)}px)`
			L.b.style.opacity = clamp(0.25 + k * 1.2).toFixed(3)
		})
		// the footer: the last 40% of the pinned part
		const f = reduce ? clamp((b - 0.6) / 0.4) : io(clamp((b - 0.6) / 0.4))
		const lift = f * Math.min(vh * 0.12, 110)
		foot.style.transform = `translate3d(0, ${((1 - f) * 100).toFixed(2)}%, 0)`
		title.style.transform = lift ? `translate3d(0, ${(-lift).toFixed(1)}px, 0)` : ''
		ins.forEach((el, i) => {
			const k = reduce ? 1 : out(clamp((a - 0.82 - i * 0.05) / 0.18 + b * 3))
			el.style.opacity = k.toFixed(3)
			el.style.transform = `translate(-50%, ${((1 - k) * 30 - lift).toFixed(1)}px)`
		})
		tasksBox.style.opacity = (clamp((a - 0.6) / 0.4) * (1 - f)).toFixed(3)
		setRunning(a > 0.05 && document.visibilityState !== 'hidden')
	}
	flow.addEventListener('scroll', draw, { passive: true })

	// ---------- the busywork's own clock ----------
	let raf = 0
	let t = 0
	let last = 0
	function frame(now) {
		raf = 0
		t += Math.min(0.1, (now - last) / 1000)
		last = now
		const cyc = 6.5
		tasks.forEach((T) => {
			const u = ((((t - T.at) % cyc) + cyc) % cyc) / cyc
			const vis = t < T.at ? 0 : Math.sin(Math.PI * clamp(u / 0.85))
			const focus = clamp(u / 0.35)
			T.s.style.opacity = (vis * lerp(0.22, 0.5, T.z - 0.55)).toFixed(3)
			T.s.style.filter = `blur(${lerp(9, 1.2, focus * (T.z > 0.9 ? 1 : 0.7)).toFixed(1)}px)`
			T.s.style.transform = `translate3d(${(T.x * W).toFixed(1)}px, ${(T.y * vh - u * 40).toFixed(1)}px, 0) scale(${(small.matches ? T.z * 0.8 : T.z).toFixed(2)})`
			T.line.style.transform = `scaleX(${out(clamp((u - 0.4) / 0.18)).toFixed(3)})`
		})
		if (running) raf = requestAnimationFrame(frame)
	}
	let running = false
	function setRunning(on) {
		if (reduce) on = false
		if (on === running) return
		running = on
		if (on && !raf) {
			last = performance.now()
			raf = requestAnimationFrame(frame)
		}
	}
	if (reduce) {
		// still: a few of the tasks, already struck through
		tasks.forEach((T, i) => {
			T.s.style.opacity = i % 3 ? 0 : 0.3
			T.s.style.transform = `translate3d(${(T.x * (sec.clientWidth || 1000)).toFixed(0)}px, ${(T.y * window.innerHeight).toFixed(0)}px, 0)`
			T.line.style.transform = 'none'
		})
	}
	document.addEventListener('visibilitychange', draw)

	// ---------- the live time and back to top ----------
	const time = sec.querySelector('[data-ct-time]')
	function tick() {
		try {
			time.textContent = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Karachi' }).format(new Date()).toUpperCase()
		} catch (e) {}
	}
	tick()
	setInterval(tick, 30000)
	sec.querySelector('[data-ct-top]').addEventListener('click', (e) => {
		e.preventDefault()
		flow.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
	})

	const ro = new ResizeObserver(measure)
	;[flow, ...flow.children].forEach((el) => ro.observe(el))
	window.addEventListener('load', measure)
	measure()
	// for previews: draw at a given task-clock time
	window.__ctSeek = (s) => {
		t = s
		last = performance.now()
		frame(last)
	}
})()
