/* Selected work case files: "View project →" on a row opens that project's case file, the same results board and
   cinematic intro as the projects above (projects/case-board.js builds the board from the panel's data). The panels
   sit outside the page scroller in .sw-cases, fixed over the screen, so they open from wherever the row is.
   Close, "Back to selected work" or Escape closes; focus stays inside while it is open. */
;(function () {
	const sw = document.getElementById('panel-selected')
	const host = document.querySelector('.sw-cases')
	if (!sw || !host) return
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	let open = null
	let opener = null
	let closeTimer = 0
	let resume = []

	function show(panel, from) {
		if (open) return
		clearTimeout(closeTimer)
		open = panel
		opener = from
		panel.hidden = false
		panel.querySelector('.pj-detail__scroll').scrollTop = 0
		void panel.offsetWidth
		panel.classList.add('is-open')
		document.documentElement.classList.add('sw-case-open')
		document.dispatchEvent(new CustomEvent('swcase', { detail: { open: true } }))
		// the row clips behind it keep quiet while a case file is open
		resume = [...sw.querySelectorAll('.sw__video')].filter((v) => !v.paused)
		resume.forEach((v) => v.pause())
		setTimeout(() => panel.querySelector('.pj-detail__close').focus({ preventScroll: true }), reduce ? 0 : 450)
	}
	function hide() {
		if (!open) return
		const panel = open
		open = null
		panel.classList.remove('is-open')
		document.documentElement.classList.remove('sw-case-open')
		document.dispatchEvent(new CustomEvent('swcase', { detail: { open: false } }))
		closeTimer = setTimeout(() => (panel.hidden = true), reduce ? 0 : 820)
		resume.forEach((v) => v.play().catch(() => {}))
		resume = []
		if (opener && opener.isConnected) opener.focus({ preventScroll: true })
	}

	// other parts of the page can open a case file through this
	window.SWCases = {
		open(id, from) {
			const panel = document.getElementById(id)
			if (panel && panel.closest('.sw-cases')) show(panel, from || null)
		},
	}

	// "View project →" opens the case file; a click anywhere else on the row still plays its clip (selected.js)
	sw.querySelectorAll('.sw-item').forEach((it) => {
		const panel = document.getElementById('sw-detail-' + String(Number(it.dataset.i) + 1).padStart(2, '0'))
		const go = it.querySelector('.sw-item__go')
		const a = it.querySelector('a')
		if (!panel || !go || !a) return
		go.addEventListener('click', (e) => {
			e.preventDefault()
			show(panel, a)
		})
		// from the keyboard the row link opens the case file too (Enter on the link would otherwise only play the clip)
		a.setAttribute('aria-haspopup', 'dialog')
		a.addEventListener('keydown', (e) => {
			if (e.key !== 'Enter' || e.altKey || e.ctrlKey || e.metaKey) return
			e.preventDefault()
			show(panel, a)
		})
	})
	host.querySelectorAll('.pj-detail__close, .pj-detail__back').forEach((b) => b.addEventListener('click', hide))

	document.addEventListener('keydown', (e) => {
		if (!open) return
		if (e.key === 'Escape') {
			e.preventDefault()
			hide()
		} else if (e.key === 'Tab') {
			const f = [...open.querySelectorAll('a[href], button:not([disabled])')].filter((el) => el.offsetParent !== null)
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
})()
