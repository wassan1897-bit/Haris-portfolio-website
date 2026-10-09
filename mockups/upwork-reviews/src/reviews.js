// Upwork review placements, injected into the live Connect section for the mockup captures only.
// Every review here is placeholder text: the real wording, names and photos come from Haris's Upwork profile.
;(function () {
	const UP = './assets/img/tools/upwork.png'
	const stars = '<span class="rv-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><b>5.0</b>'
	const sample = '<span class="rv-sample">Sample</span>'
	const REVIEWS = [
		['Client name', 'Company, Country', 'CN', 'Project title from Upwork'],
		['Client name', 'Company, Country', 'CL', 'Project title from Upwork'],
		['Client name', 'Company, Country', 'CA', 'Project title from Upwork'],
		['Client name', 'Company, Country', 'CB', 'Project title from Upwork'],
	]
	const QUOTE = 'The client’s review from Upwork goes here: two or three lines about the result Haris delivered and what working together was like.'
	const who = ([name, co, ini]) => `<div class="rv-who"><span class="rv-avatar">${ini}</span><div><b>${name}</b><small>${co}</small></div></div>`
	const s = () => document.getElementById('panel-scaling')

	window.__rv = {
		// A: a strip of review cards between the bento and the closing line
		strip() {
			const cards = REVIEWS.map(
				(r) => `<article class="rv-card"><div class="rv-card__top"><span>${stars}</span><span>Month Year</span></div>
				<p class="rv-job">${r[3]}</p><p class="rv-quote">${QUOTE}</p>${who(r)}</article>`,
			).join('')
			const el = document.createElement('section')
			el.className = 'rv-strip'
			el.innerHTML = `<div class="rv-strip__head"><div class="rv-strip__title"><img src="${UP}" alt="">What clients say on Upwork${sample}</div>
				<div class="rv-strip__badges"><span class="rv-badge"><i></i>100% Job Success</span><span class="rv-badge rv-badge--pink"><i></i>Top Rated Plus</span><span class="rv-badge">33 jobs</span></div></div>
				<div class="rv-track">${cards}</div>`
			s().querySelector('.scaling__bento').after(el)
		},
		// B: the Upwork card in the bento shows client reviews, one at a time
		carousel() {
			const card = s().querySelector('.scaling-card--quote')
			card.style.position = 'relative'
			const r = REVIEWS[0]
			card.insertAdjacentHTML(
				'beforeend',
				`<div class="rv-carousel">
				<div class="rv-carousel__head"><span class="rv-carousel__brand"><img src="${UP}" alt="">UPWORK${sample}</span><span>${stars}</span></div>
				<div class="rv-carousel__badges"><span class="rv-badge"><i></i>100% Job Success</span><span class="rv-badge rv-badge--pink"><i></i>Top Rated Plus</span></div>
				<p class="rv-quote">“${QUOTE}”</p>
				<div class="rv-carousel__foot">${who(r)}<div style="display:grid;gap:10px;justify-items:end"><div class="rv-arrows"><span>&larr;</span><span>&rarr;</span></div><div class="rv-dots"><i class="on"></i><i></i><i></i><i></i><i></i></div></div></div>
				</div>`,
			)
		},
		// C: its own screen: the real profile numbers, then the reviews as they appear on Upwork
		wall() {
			const shot = (r, feature) => `<article class="rv-shot${feature ? ' rv-shot--feature' : ''}"><img class="rv-shot__src" src="${UP}" alt="">
				<div class="rv-shot__meta"><span>${stars}</span></div><p class="rv-shot__job">${r[3]}</p>
				<p class="rv-quote">${feature ? '“' + QUOTE + '”' : QUOTE}</p>${feature ? '<div class="rv-shot__image">Screenshot of the review on Upwork<br>(or the client’s photo and logo)</div>' : ''}${who(r)}</article>`
			const el = document.createElement('section')
			el.className = 'rv-wall'
			el.innerHTML = `<div class="rv-wall__head"><div><p class="rv-wall__eyebrow">Client reviews${sample}</p><h2 class="rv-wall__title">What clients say</h2></div>
				<div class="rv-wall__stats"><div><b>100%</b><small>Job Success</small></div><div><b>Top Rated Plus</b><small>Upwork badge</small></div><div><b>33</b><small>jobs completed</small></div><div><b>633</b><small>hours worked</small></div></div></div>
				<div class="rv-wall__grid">${shot(REVIEWS[0], true)}${shot(REVIEWS[1])}${shot(REVIEWS[2])}${shot(REVIEWS[3])}${shot(REVIEWS[1])}</div>
				<div class="rv-wall__foot"><span>Every review is from a completed Upwork contract.</span><a><img src="${UP}" alt="" width="20" height="20" style="border-radius:5px">See all reviews on Upwork</a></div>`
			document.body.appendChild(el)
		},
	}
})()
