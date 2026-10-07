/* Hero: entrance animation, global-header handoff, and in-page links */
;(function () {
	const hero = document.getElementById('panel-hero')
	if (!hero) return

	// The intro page hands off under a cream wipe; read this before app.js removes it
	const receiveWipe = document.getElementById('intro-receive-wipe')
	const fromIntro = !!receiveWipe && receiveWipe.style.display === 'block'

	function reveal() {
		hero.setAttribute('data-enter', 'done')
	}

	const wait = (ms) => new Promise((r) => setTimeout(r, ms))

	// Opening-shot framing for haris-hero-wall.webp (941x1672). Landmarks are source pixels:
	// hat top 250, brow 360, glasses start x 580, face centre (700, 560), chin 830.
	// The shot sits between letterbox bars, so it aims at the band from 13% to 86% of the screen.
	const IMG_W = 941
	const IMG_H = 1672

	// Desktop: photo sized so the face fits between the bars and the eyes clear the title,
	// anchored to the right edge, its left edge fading into the dark behind the title
	function desktopFrame(w, h, titleRight) {
		const fitBand = (0.73 * h) / (830 - 360)
		const eyesClear = (w - titleRight - 20) / (IMG_W - 580)
		const coverH = (h / IMG_H) * 1.02
		const fs = Math.max(Math.min(fitBand, eyesClear), fitBand * 0.6, coverH)
		const width = IMG_W * fs
		const height = IMG_H * fs
		// Centre the brow-to-chin band (360 to 830) between the bars. At full size this is the framing
		// approved on 2026-10-05: band top on the top bar, chin on the bottom bar.
		const top = Math.min(Math.max(0.495 * h - 595 * fs, h - height), 0)
		return {
			top,
			left: w - width,
			width,
			height,
			transformOrigin: `${(700 / IMG_W) * 100}% ${(560 / IMG_H) * 100}%`,
		}
	}

	// Phone: the full-height panel already shows the whole head; keep the face inside the right edge
	function phoneFrame(w, h) {
		const s = Math.max(w / IMG_W, h / IMG_H)
		const visW = w / s
		const spareX = IMG_W * s - w
		const left = spareX > 0 ? Math.min(Math.max(700 - visW / 2, 0), IMG_W - visW) : 0
		const posX = spareX > 0 ? ((left * s) / spareX) * 100 : 50
		return {
			objectPosition: `${posX}% 50%`,
			transformOrigin: `${((700 - left) / visW) * 100}% ${(540 / IMG_H) * 100}%`,
		}
	}

	async function playEntrance() {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (typeof gsap === 'undefined' || reduceMotion) {
			reveal()
			return
		}

		const desktop = window.matchMedia('(min-width: 768px)').matches
		// blur filters are costly to animate on weak CPUs and GPUs; low-power machines get the same moves without blur
		const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4
		const blur = (px) => (lowPower ? 'none' : `blur(${px}px)`)
		const q = (s) => hero.querySelector(s)
		const qa = (s) => [...hero.querySelectorAll(s)]

		const panel = q('.ph-panel')
		const panelImg = q('.ph-panel img')
		const shade = q('.ph-shade')
		const bars = qa('.ph-bar')
		const photoLayer = q('.ph-titles--photo')
		const photoTitle = q('.ph-titles--photo .ph-title')
		const whiteLayer = q('.ph-titles--white')
		const whiteTitle = q('.ph-titles--white .ph-title')
		const rail = q('.ph-rail')
		const railParts = qa('.ph-rail > *')
		const subParts = qa('.ph-sub > :not(.ph-ledger):not(.ph-logos)')
		const stats = qa('.ph-stat')
		const statNums = qa('.ph-stat b')
		const statLabels = qa('.ph-stat small')
		const logos = q('.ph-logos')
		const top = q('.ph-top')
		const slideLine = q('.ph-slide i')
		const slideNum = q('.ph-slide span')

		// The opening shot needs the real font and the decoded photo, otherwise frame one is wrong
		await Promise.race([Promise.all([document.fonts.ready, panelImg.decode().catch(() => {})]), wait(1500)])
		if (hero.getAttribute('data-enter') === 'done') return // safety reveal already fired

		const tl = gsap.timeline({ delay: fromIntro ? 0.5 : 0.2, defaults: { ease: 'power3.out' } })

		// Any scroll, click or key fast-forwards the rest instead of making people wait
		const skipEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown']
		const fastForward = () => tl.timeScale(4)
		skipEvents.forEach((ev) => window.addEventListener(ev, fastForward, { passive: true, once: true }))
		const done = () => skipEvents.forEach((ev) => window.removeEventListener(ev, fastForward))

		gsap.set(bars, { scaleY: 1 })
		gsap.set(shade, { opacity: 1 })
		gsap.set(rail, { borderRightColor: 'rgba(236, 236, 236, 0)' })
		gsap.set(railParts, { opacity: 0, x: -14 })
		gsap.set(subParts, { opacity: 0, y: 18 })
		gsap.set(top, { opacity: 0, y: -14 })
		gsap.set(slideNum, { opacity: 0 })
		gsap.set(slideLine, { scaleY: 0 })
		gsap.set(statNums, { opacity: 0, y: 16 })
		gsap.set(statLabels, { opacity: 0, y: 10 })
		gsap.set(stats, { '--ph-rule': 0 })
		if (logos) gsap.set(logos, { clipPath: 'inset(0% 100% 0% 0%)', filter: blur(8), opacity: 0 })

		// Stat ledger and tool strip: numbers count up, dividers draw down, labels rise,
		// then the logo strip wipes in from the left while it is already scrolling
		const format = (n, suffix) => Math.round(n).toLocaleString('en-US') + suffix
		function settleLedger(at) {
			tl.to(statNums, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, at)
			statNums.forEach((el, i) => {
				const target = Number(el.dataset.count)
				if (!target) return
				const suffix = el.dataset.suffix || ''
				const counter = { v: 0 }
				el.textContent = format(0, suffix)
				tl.to(
					counter,
					{ v: target, duration: 1.5, ease: 'power2.out', onUpdate: () => (el.textContent = format(counter.v, suffix)) },
					at + i * 0.12,
				)
			})
			tl.to(stats, { '--ph-rule': 1, duration: 0.8, stagger: 0.12, ease: 'power3.inOut' }, at + 0.1)
			tl.to(statLabels, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, at + 0.25)
			if (logos) {
				tl.to(logos, { clipPath: 'inset(0% 0% 0% 0%)', filter: blur(0), opacity: 1, duration: 1.3, ease: 'power3.inOut' }, at + 0.55)
			}
		}
		function clearLedger() {
			statNums.forEach((el) => {
				if (el.dataset.count) el.textContent = format(Number(el.dataset.count), el.dataset.suffix || '')
			})
			gsap.set([...statNums, ...statLabels], { clearProps: 'transform' })
			gsap.set(stats, { clearProps: '--ph-rule' })
			if (logos) gsap.set(logos, { clearProps: 'clipPath,filter,opacity' })
		}

		if (desktop) {
			// Shot 1: the portrait fills the frame, darkened, behind letterbox bars, with a slow push in.
			// Only clip-path and transform move from here on: animating left/top/width/height made
			// every frame a layout shift (CLS 0.37).
			const panelClip = (bottom, left, radius) => `inset(0% 0% ${bottom}px ${left}% round 0px 0px 0px ${radius}px)`
			gsap.set(panel, { clipPath: panelClip(0, 0, 0) })
			// Measure where the title ends before its letter-spacing is changed for the reveal
			const heroBox = hero.getBoundingClientRect()
			const titleRight = whiteTitle.getBoundingClientRect().right - heroBox.left
			const frame = desktopFrame(heroBox.width, heroBox.height, titleRight)
			// The photo keeps its resting box; a translate and scale from that box's top-left corner
			// puts it on the opening frame. The push-in scales about his face, so x, y and scale all
			// move in step with the push amount m.
			const rest = { left: panelImg.offsetLeft, top: panelImg.offsetTop, width: panelImg.offsetWidth }
			const fit = frame.width / rest.width
			const faceX = frame.left + (700 / IMG_W) * frame.width
			const faceY = frame.top + (560 / IMG_W) * frame.width
			const framed = (m) => ({
				x: faceX + m * (frame.left - faceX) - rest.left,
				y: faceY + m * (frame.top - faceY) - rest.top,
				scale: m * fit,
			})
			panelImg.classList.add('is-fit')
			gsap.set(panelImg, { '--ph-fade': '42%', transformOrigin: '0px 0px', ...framed(1.06) })
			gsap.set(whiteLayer, { clipPath: 'inset(0% 0% 0px 0% round 0px 0px 0px 0px)' })
			gsap.set(photoLayer, { autoAlpha: 0 })

			// Shot 2: the title resolves letter by letter out of a blur while its tracking tightens
			const split = typeof SplitType !== 'undefined' ? new SplitType(whiteTitle, { types: 'chars' }) : null
			const chars = split ? split.chars : [whiteTitle]
			gsap.set(chars, { opacity: 0, y: 34, filter: blur(14) })
			gsap.set(whiteTitle, { letterSpacing: '0.04em' })
			reveal()

			tl.to(panelImg, { ...framed(1.02), duration: 2.0, ease: 'power2.out' }, 0)
			tl.to(whiteTitle, { letterSpacing: '-0.03em', duration: 1.9, ease: 'power2.out' }, 0.1)
			tl.to(chars, { opacity: 1, y: 0, filter: blur(0), duration: 1.0, stagger: 0.04 }, 0.2)

			// Swap the split letters back for plain text and bring in the photo-filled copy underneath.
			// Both copies sit on the same glyphs, so this swap is invisible.
			tl.call(
				() => {
					if (split) split.revert()
					gsap.set(whiteTitle, { clearProps: 'letterSpacing' })
					gsap.set(photoLayer, { autoAlpha: 1 })
				},
				null,
				1.95,
			)

			// Shot 3: the portrait pulls back into its panel. As its edge sweeps right, every letter
			// it leaves turns from white-on-photo into photo-in-letter.
			const move = { duration: 1.3, ease: 'expo.inOut' }
			tl.to(panel, { clipPath: panelClip(52, 62, 10), ...move }, 2.0)
			tl.to(whiteLayer, { clipPath: 'inset(0% 0% 52px 62% round 0px 0px 0px 10px)', ...move }, 2.0)
			// Settle from the face-sized photo into the final panel; its right edge stays on the screen edge
			tl.to(panelImg, { x: 0, y: 0, scale: 1, '--ph-fade': '0%', ...move }, 2.0)
			tl.to(shade, { opacity: 0, duration: 1.2, ease: 'power2.inOut' }, 2.0)
			tl.to(bars, { scaleY: 0, duration: 1.1, ease: 'power3.inOut' }, 2.05)

			// Shot 4: the interface settles in
			tl.to(rail, { borderRightColor: 'rgba(236, 236, 236, 1)', duration: 0.8, ease: 'power2.out' }, 2.7)
			tl.to(railParts, { opacity: 1, x: 0, duration: 0.9, stagger: 0.08 }, 2.75)
			tl.to(top, { opacity: 1, y: 0, duration: 0.8 }, 2.85)
			tl.to(subParts, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 2.9)
			settleLedger(3.05)
			tl.to(slideLine, { scaleY: 1, duration: 0.8, ease: 'power3.inOut' }, 3.0)
			tl.to(slideNum, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 3.2)

			tl.eventCallback('onComplete', () => {
				done()
				gsap.set(panel, { clearProps: 'clipPath' })
				gsap.set(whiteLayer, { clearProps: 'clipPath' })
				gsap.set(photoLayer, { clearProps: 'opacity,visibility' })
				panelImg.classList.remove('is-fit')
				gsap.set(panelImg, { clearProps: 'transform,transformOrigin,--ph-fade' })
				gsap.set([...railParts, ...subParts, top, slideLine], { clearProps: 'transform' })
				gsap.set(rail, { clearProps: 'borderRightColor' })
				gsap.set([shade, ...bars], { clearProps: 'all' })
				clearLedger()
			})
		} else {
			// Phone: full-height portrait behind letterbox bars, which then collapses to make room for the title.
			// The panel keeps its height; the photo and its shade spill past it over the still-hidden
			// title, then shrink back. Growing the panel itself pushed the text below it (layout shifts).
			const panelHeight = panel.getBoundingClientRect().height
			gsap.set(panel, { overflow: 'visible' })
			gsap.set([panelImg, shade], { height: window.innerHeight, bottom: 'auto' })
			gsap.set(panelImg, { scale: 1.06, ...phoneFrame(window.innerWidth, window.innerHeight) })
			gsap.set(photoTitle, { clipPath: 'inset(0% 0% 100% 0%)', y: 50 })
			reveal()

			tl.to(panelImg, { scale: 1.02, duration: 1.6, ease: 'power2.out' }, 0)
			tl.to([panelImg, shade], { height: panelHeight, duration: 1.2, ease: 'expo.inOut' }, 0.9)
			tl.to(panelImg, { scale: 1, objectPosition: '50% 30%', duration: 1.3, ease: 'power3.inOut' }, 0.9)
			tl.to(shade, { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 0.9)
			tl.to(bars, { scaleY: 0, duration: 1.0, ease: 'power3.inOut' }, 0.95)
			tl.to(photoTitle, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.1, ease: 'power4.out' }, 1.5)
			tl.to(railParts, { opacity: 1, x: 0, duration: 0.8, stagger: 0.08 }, 1.6)
			tl.to(subParts, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.8)
			settleLedger(1.95)

			tl.eventCallback('onComplete', () => {
				done()
				gsap.set(panel, { clearProps: 'overflow' })
				gsap.set(photoTitle, { clearProps: 'clipPath,transform' })
				gsap.set(panelImg, { clearProps: 'transform,objectPosition,height,bottom' })
				gsap.set([...railParts, ...subParts], { clearProps: 'transform' })
				gsap.set(rail, { clearProps: 'borderRightColor' })
				gsap.set([shade, ...bars], { clearProps: 'all' })
				clearLedger()
			})
		}
	}

	function initHero() {
		const flow = document.getElementById('site-flow')
		const header = document.getElementById('js-site-header')

		// Never leave the hero hidden if anything above fails
		playEntrance().catch(reveal)
		setTimeout(reveal, 4000)

		// Global header stays hidden while the hero sits under the top of the viewport.
		// The strip starts 1px down so landing exactly on the next panel counts as leaving the hero.
		// pause the endless logo strip while the hero is scrolled away
		if (flow && 'IntersectionObserver' in window) {
			new IntersectionObserver(([entry]) => hero.classList.toggle('is-offscreen', entry.intersectionRatio === 0), {
				root: flow,
				rootMargin: '-1px 0px -1px 0px',
				threshold: 0,
			}).observe(hero)
		}

		if (header && flow && 'IntersectionObserver' in window) {
			const io = new IntersectionObserver(
				([entry]) => header.classList.toggle('site-header--over-hero', entry.intersectionRatio > 0),
				{ root: flow, rootMargin: '-1px 0px -90% 0px', threshold: 0 },
			)
			io.observe(hero)
		} else if (header) {
			header.classList.remove('site-header--over-hero')
		}

		// In-page links scroll the flow container
		hero.querySelectorAll('[data-hero-scroll]').forEach((link) => {
			link.addEventListener('click', (e) => {
				const target = document.querySelector(link.getAttribute('data-hero-scroll'))
				if (!target) return
				e.preventDefault()
				target.scrollIntoView({ behavior: 'smooth', block: 'start' })
			})
		})

		// The rail's menu icon opens the site menu (the open header shows itself over the hero)
		const burger = hero.querySelector('.ph-burger')
		const menuBtn = document.getElementById('js-menu-btn')
		if (burger && menuBtn) burger.addEventListener('click', () => menuBtn.click())
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHero)
	else initHero()
})()
