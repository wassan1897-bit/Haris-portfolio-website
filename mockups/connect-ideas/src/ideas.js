// Concept overlays mapped into the live room for the mockup captures only.
;(function () {
	const S = '/mockups/connect-redesign/samples/'
	// rect (w x h) -> screen quad [TL, TR, BR, BL], as a CSS matrix3d
	function quad(w, h, q) {
		const src = [[0, 0], [w, 0], [w, h], [0, h]]
		const A = []
		const B = []
		for (let i = 0; i < 4; i++) {
			const [x, y] = src[i]
			const [u, v] = q[i]
			A.push([x, y, 1, 0, 0, 0, -u * x, -u * y])
			B.push(u)
			A.push([0, 0, 0, x, y, 1, -v * x, -v * y])
			B.push(v)
		}
		// gaussian elimination
		for (let c = 0; c < 8; c++) {
			let p = c
			for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
			;[A[c], A[p]] = [A[p], A[c]]
			;[B[c], B[p]] = [B[p], B[c]]
			for (let r = 0; r < 8; r++) {
				if (r === c) continue
				const f = A[r][c] / A[c][c]
				for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]
				B[r] -= f * B[c]
			}
		}
		const [a, b, c2, d, e, f, g, hh] = B.map((v, i) => v / A[i][i])
		return `matrix3d(${a},${d},0,${g},${b},${e},0,${hh},0,0,1,0,${c2},${f},0,1)`
	}
	function place(el, w, h, worldCorners) {
		const pts = window.__ws.project(worldCorners)
		el.classList.add('ix-quad')
		el.style.transform = quad(w, h, pts)
		document.body.appendChild(el)
		return el
	}
	const html = (s) => {
		const t = document.createElement('template')
		t.innerHTML = s.trim()
		return t.content.firstChild
	}

	// the right-hand monitor's screen in world space (see the monitor build in workspace.js)
	function screenCorners() {
		const C = [0.3975, 1.2425, 0.3615]
		const R = [0.9759, 0, 0.2182]
		const hw = 0.3175
		const hh = 0.1825
		const at = (sx, sy) => [C[0] + R[0] * hw * sx, C[1] + hh * sy, C[2] + R[2] * hw * sx]
		return [at(-1, 1), at(1, 1), at(1, -1), at(-1, -1)]
	}
	// a flat sheet lying on the desk: centre x/z, width/depth in metres, turned by deg
	const DESK = 0.7735
	function deskCorners(cx, cz, w, d, deg) {
		const a = (deg * Math.PI) / 180
		const c = Math.cos(a)
		const s = Math.sin(a)
		const at = (u, v) => [cx + u * c - v * s, DESK, cz + u * s + v * c]
		return [at(-w / 2, -d / 2), at(w / 2, -d / 2), at(w / 2, d / 2), at(-w / 2, d / 2)]
	}

	const screenUI = () => `
		<div class="ix-screen">
			<div class="ix-menubar"><b>Haris</b><span>New message &nbsp;&middot;&nbsp; Client reviews</span><span>12:24 PM</span></div>
			<div class="ix-desk">
				<div class="ix-win ix-mail">
					<div class="ix-win__bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span>New message</span></div>
					<div class="ix-field"><small>To</small><span class="ix-chip"><img src="/landing/assets/img/haris-hero-wall.webp" alt="">Haris &lt;hello@autoany.io&gt;</span></div>
					<div class="ix-field"><small>Subject</small><b>A project for us<span class="ix-caret"></span></b></div>
					<div class="ix-body">
						<p><em>The problem:</em></p>
						<p><em>The constraint:</em></p>
						<p><em>The timeline:</em></p>
					</div>
					<div class="ix-send"><b>Send &rarr;</b><small>You get an honest read before any build starts.</small></div>
				</div>
				<div class="ix-win ix-reviews">
					<div class="ix-win__bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span>Client reviews from Upwork</span></div>
					<div class="ix-reviews__list">
						<div class="ix-rev on"><img src="${S}review-03.png" alt=""><small><span>Sample client</span><span>Contract title</span></small></div>
						<div class="ix-rev"><img src="${S}review-01.png" alt=""><small><span>Sample client</span><span>Contract title</span></small></div>
						<div class="ix-rev"><img src="${S}review-02.png" alt=""><small><span>Sample client</span><span>Contract title</span></small></div>
					</div>
				</div>
				<span class="ix-back">&larr; Back to the room</span>
			</div>
		</div>`

	const slip = (n, client) => `<div class="ix-slip"><img src="${S}review-0${n}.png" alt=""><p>${client}<small>Upwork</small></p></div>`

	window.__ideas = {
		screen() {
			place(html(screenUI()), 1270, 730, screenCorners())
		},
		desk() {
			// reviews printed out and left on the desk: a fan on the left, two on the right
			const slips = [
				[-1.06, 0.62, 0.34, 0.15, 14, 1, 'brightness(1) sepia(0.12)'],
				[-1.02, 0.76, 0.34, 0.16, -6, 3, 'brightness(1.02) sepia(0.1)'],
				[-0.98, 0.88, 0.34, 0.13, 4, 2, 'brightness(0.96) sepia(0.14)'],
				[0.68, 0.36, 0.3, 0.11, -9, 4, 'brightness(0.62) sepia(0.2)'],
			]
			slips.forEach(([x, z, w, d, deg, n, filter]) => {
				const el = html(slip(n, 'Sample client'))
				el.style.filter = `${filter} drop-shadow(0 6px 6px rgb(0 0 0 / 0.45))`
				// sheet aspect follows the screenshot: 760 wide
				const h = Math.round((760 * d) / w)
				el.style.height = h + 'px'
				el.style.overflow = 'hidden'
				place(el, 796, h, deskCorners(x, z, w, d, deg))
			})
			// the card to write on, front right, past the mouse and the mug
			const card = html(`<div class="ix-card" style="position:relative"><h4>Write to Haris</h4><ol><li><b>1</b>The problem</li><li><b>2</b>The constraint</li><li><b>3</b>The timeline</li><li><b>@</b>Your email</li></ol><span class="stamp">Send</span></div>`)
			card.style.filter = 'brightness(0.6) sepia(0.2) drop-shadow(0 8px 8px rgb(0 0 0 / 0.5))'
			place(card, 900, 600, deskCorners(0.74, 0.8, 0.33, 0.22, -7))
			document.body.appendChild(html(`<p class="ix-caption"><b>Left on his desk</b>Reviews from 33 Upwork contracts. Pick one up to read it, or write on the card to start.</p>`))
		},
		deskRead() {
			window.__ideas.desk()
			document.querySelector('.ix-caption').remove()
			document.body.appendChild(html(`<div class="ix-dim"></div>`))
			document.body.appendChild(html(`<div class="ix-held"><img src="${S}review-03.png" alt=""><p>Sample client<small>Contract title, Upwork</small></p></div>`))
			document.body.appendChild(html(`<div class="ix-hint"><span>&larr; Previous</span><span>Put it back</span><span>Next &rarr;</span></div>`))
		},
	}
})()
