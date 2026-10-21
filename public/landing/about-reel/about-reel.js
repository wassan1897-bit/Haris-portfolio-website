/* Page 3, the showreel (see about-reel.css). On desktop it slides in sideways from About on the same cream
   (the screen before it lands, in step with about-h.js moving About out) with "Built by Haris." around the small
   card. Then the lights go down: the card grows to about three quarters of the screen, the page dims to a dark
   room lit in the colour of the project playing, and a control bar comes up under it (chapters, play and pause,
   time). Last, black bars close in from top and bottom, crop it to a thin strip and leave the page black.
   Positions are read on resize only; every scroll frame is arithmetic plus a handful of style writes. */
;(function () {
	const flow = document.getElementById('site-flow')
	const rl = document.getElementById('panel-reel')
	const header = document.getElementById('js-site-header')
	if (!flow || !rl) return

	const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
	const wide = window.matchMedia('(min-width: 1024px)')
	const small = window.matchMedia('(max-width: 767px)')
	const clamp = (v) => Math.min(1, Math.max(0, v))
	const lerp = (a, b, t) => a + (b - a) * t
	const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
	const pageTop = (el) => el.getBoundingClientRect().top - flow.getBoundingClientRect().top + flow.scrollTop

	let vh = 1
	let cine = false

	const sm = rl.querySelector('.rl__built--sm')
	const lg = rl.querySelector('.rl__built--lg')
	const card = rl.querySelector('.rl__card')
	const video = rl.querySelector('.rl__video')
	const barTop = rl.querySelector('.rl__bar--top')
	const barBot = rl.querySelector('.rl__bar--bot')
	const pin = rl.querySelector('.rl__pin')
	const room = rl.querySelector('.rl__room')
	const amb = rl.querySelector('.rl__amb')
	const ctrl = rl.querySelector('.rl__ctrl')
	const chapBtns = [...rl.querySelectorAll('.rl__chaps button')]
	const playBtn = rl.querySelector('.rl__play')
	const timeEl = rl.querySelector('.rl__time')
	// the reel's chapters: from this second, which button lights up and the colour of the room (Haris is warm)
	const CHAPTERS = [
		[0, 0, '#d6a878'],
		[3.1, 1, '#8fd46f'],
		[5.5, 2, '#f2b84b'],
		[7.95, 0, '#d6a878'],
		[10.5, 3, '#8fd8e6'],
		[12.9, 4, '#b9a4ff'],
		[15.3, 5, '#ff7a59'],
		[17.7, 1, '#8fd46f'],
		[20.1, 0, '#d6a878'],
	]
	const ACCENT = ['#d6a878', '#8fd46f', '#f2b84b', '#8fd8e6', '#b9a4ff', '#ff7a59']
	chapBtns.forEach((b, i) => b.style.setProperty('--c', ACCENT[i]))
	const smooth = (t) => t * t * (3 - 2 * t)
	// absolute, because a url() inside a custom property resolves against the stylesheet that uses it
	rl.style.setProperty('--poster', `url("${new URL(video.getAttribute('poster'), location.href).href}")`)
	let rlTop = 0
	let run = 1
	let s0 = 0.3
	let W = 1

	function measure() {
		vh = flow.clientHeight || window.innerHeight
		W = flow.clientWidth || window.innerWidth
		cine = motion && wide.matches
		rl.classList.toggle('is-cine', cine)
		rlTop = pageTop(rl)
		// one screen sliding in, then the reel's own run
		run = Math.max(1, rl.offsetHeight - vh - vh)
		// small card: about 30% of the screen width, like the reference
		s0 = Math.min(1, (W * 0.3) / (card.offsetWidth || 1440))
		if (!cine) {
			;[pin, card, sm, lg, video, barTop, barBot, room, ctrl].forEach((el) => el.removeAttribute('style'))
			rl.classList.remove('is-room')
		}
		update()
	}

	function update() {
		const st = flow.scrollTop
		let dark = false

		if (cine) {
			// sliding in from the right while About leaves to the left, on the same curve
			const b = clamp((st - rlTop) / vh)
			const eB = smooth(b)
			const dpr = window.devicePixelRatio || 1
			pin.style.transform = eB < 1 ? `translate3d(${Math.round(W * (1 - eB) * dpr) / dpr}px, 0, 0)` : ''
			pin.style.visibility = b > 0 ? '' : 'hidden'

			// then the lights go down: "Built by Haris." leaves as the card grows, the page dims to a dark room and the
			// controls come up under the screen; it plays big; the controls go and the bars close
			const p = clamp((st - rlTop - vh) / run)
			const built = 1 - inOut(clamp((p - 0.04) / 0.1))
			const grow = inOut(clamp((p - 0.06) / 0.2))
			const dim = inOut(clamp((p - 0.08) / 0.2))
			const ui = clamp((p - 0.22) / 0.06) * (1 - clamp((p - 0.76) / 0.04))
			room.style.opacity = dim.toFixed(3)
			ctrl.style.opacity = ui.toFixed(3)
			ctrl.style.transform = `translate3d(0, ${((1 - ui) * 12).toFixed(1)}px, 0)`
			rl.classList.toggle('is-room', ui > 0.5)
			const q = inOut(clamp((p - 0.8) / 0.16)) // the bars close

			sm.style.opacity = built.toFixed(3)
			sm.style.transform = `translate3d(0, ${((1 - built) * -18).toFixed(1)}px, 0)`
			lg.style.opacity = built.toFixed(3)
			lg.style.transform = `translate3d(0, ${((1 - built) * 26).toFixed(1)}px, 0)`

			// the bars: each covers up to half the screen; halfway in, their edges bow into the card, then flatten
			barTop.style.transform = `translate3d(0, ${((q - 1) * 100).toFixed(2)}%, 0)`
			barBot.style.transform = `translate3d(0, ${((1 - q) * 100).toFixed(2)}%, 0)`
			rl.style.setProperty('--rl-bulge', (Math.sin(Math.PI * clamp((q - 0.25) / 0.5)) * 0.9).toFixed(3))
			card.style.transform = `translate3d(0, ${(-0.031 * vh * grow).toFixed(1)}px, 0) scale(${lerp(s0, 1, grow).toFixed(4)})`
			video.style.opacity = q < 0.999 ? '1' : '0'

			// header text turns light once the room is dark
			dark = (dim > 0.5 || q > 0.12) && st < rlTop + vh + run + vh
			playing(b > 0 && q < 0.999)
		} else {
			playing(st + vh > rlTop && st < rlTop + rl.offsetHeight)
		}
		if (header) header.classList.toggle('site-header--on-dark3', dark)
	}

	// ---------------- the reel video ----------------
	let loaded = false
	let userPaused = false
	function playing(on) {
		if (!on) userPaused = false
		if (on && !loaded) {
			loaded = true
			// the card's size in device pixels picks the file: 1440p when it is shown big or on a sharp screen
			const px = (card.offsetWidth || 1000) * (window.devicePixelRatio || 1)
			video.src = small.matches ? video.dataset.mp4Small : px > 1500 && video.dataset.mp4Large ? video.dataset.mp4Large : video.dataset.mp4
		}
		if (on && !userPaused && document.visibilityState !== 'hidden') {
			if (video.paused) video.play().catch(() => {})
		} else if (!video.paused) video.pause()
	}
	document.addEventListener('visibilitychange', update)

	// ---------------- the controls ----------------
	const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
	let lit = -1
	function sync() {
		const t = video.currentTime || 0
		timeEl.textContent = `${mmss(t)} / ${mmss(video.duration || 25)}`
		let k = 0
		CHAPTERS.forEach((c, i) => t >= c[0] && (k = i))
		if (k !== lit) {
			lit = k
			amb.style.color = CHAPTERS[k][2]
			chapBtns.forEach((b, i) => b.setAttribute('aria-current', String(i === CHAPTERS[k][1])))
		}
		playBtn.classList.toggle('is-paused', video.paused)
		playBtn.setAttribute('aria-label', video.paused ? 'Play the showreel' : 'Pause the showreel')
	}
	;['timeupdate', 'play', 'pause', 'seeked', 'loadedmetadata'].forEach((e) => video.addEventListener(e, sync))
	chapBtns.forEach((b) =>
		b.addEventListener('click', () => {
			video.currentTime = Number(b.dataset.t)
			userPaused = false
			video.play().catch(() => {})
		}),
	)
	playBtn.addEventListener('click', () => {
		if (video.paused) {
			userPaused = false
			video.play().catch(() => {})
		} else {
			userPaused = true
			video.pause()
		}
	})
	sync()

	flow.addEventListener('scroll', update, { passive: true })
	const ro = new ResizeObserver(measure)
	;[flow, ...flow.children].forEach((el) => ro.observe(el))
	wide.addEventListener('change', measure)
	window.addEventListener('load', measure)
	if (document.fonts) document.fonts.ready.then(measure)
	measure()
})()
