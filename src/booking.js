// Booking popup: every "Book a meeting" button on every page opens it.
// With BOOKING_URL set, the popup shows Haris's live booking page (Google Calendar appointment schedule,
// Calendly or Cal.com): the visitor books a free slot, it lands on Haris's calendar, and both get an email.
// Without it, the visitor picks a weekday and a time and the request is sent to Haris by email.
import css from './booking.css?inline'

const EMAIL = 'hariswassan001@gmail.com'
const BOOKING_URL = '' // Haris's booking page link, e.g. https://calendar.google.com/calendar/appointments/schedules/...
const TIMES = ['10:00', '11:30', '14:00', '15:30', '17:00']

// each service needs its own flag to show its page inside another site
function embedUrl(link) {
	const u = new URL(link)
	if (u.hostname === 'calendar.google.com') u.searchParams.set('gv', 'true')
	else if (u.hostname.endsWith('calendly.com')) { u.searchParams.set('embed_type', 'Inline'); u.searchParams.set('embed_domain', location.hostname); u.searchParams.set('hide_gdpr_banner', '1') }
	else if (u.hostname.endsWith('cal.com')) u.searchParams.set('embed', 'true')
	return u.toString()
}

const style = document.createElement('style')
style.textContent = css
document.head.append(style)

const dlg = document.createElement('dialog')
dlg.className = 'bk'
dlg.setAttribute('aria-labelledby', 'bk-title')
dlg.innerHTML = `
	<div class="bk-head">
		<img src="/images/haris.webp" alt="" width="44" height="44" />
		<div><b id="bk-title">Book a meeting with Haris</b><small>30 minutes · times in your time zone</small></div>
		<button type="button" class="bk-x" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
	</div>
	<div class="bk-body">
		<div>
			<div class="bk-bar"><b class="bk-month" aria-live="polite"></b><span><button type="button" class="bk-prev" aria-label="Previous month">&lsaquo;</button><button type="button" class="bk-next" aria-label="Next month">&rsaquo;</button></span></div>
			<div class="bk-grid"></div>
		</div>
		<div class="bk-slots"><small class="bk-day"></small><div class="bk-times"></div></div>
	</div>
	<div class="bk-foot">
		<label for="bk-note">What do you want to build? <span style="font-weight:400;color:#5b6475">(optional)</span></label>
		<textarea id="bk-note" maxlength="600" placeholder="We want more qualified pipeline from inbound demand"></textarea>
		<div class="bk-row"><a class="bk-go" href="#" aria-disabled="true">Request this time</a><span class="bk-pick">Pick a day and a time.</span></div>
		<p class="bk-note">Your own email app sends the request. Nothing is stored on this site. <a href="/privacy.html">Privacy</a></p>
		<p class="bk-done" hidden>Your email app is opening with the request. If it doesn't, email <a href="mailto:${EMAIL}">${EMAIL}</a> with the time you picked.</p>
	</div>
	<div class="bk-live" hidden>
		<div class="bk-frame"></div>
		<p class="bk-alt">Prefer email? Write to <a href="mailto:${EMAIL}">${EMAIL}</a> · <a class="bk-tab" href="#" target="_blank" rel="noopener">Open the calendar in a new tab</a></p>
	</div>`
document.body.append(dlg)

if (BOOKING_URL) {
	dlg.classList.add('bk--live')
	dlg.querySelector('.bk-body').hidden = true
	dlg.querySelector('.bk-foot').hidden = true
	dlg.querySelector('.bk-live').hidden = false
	dlg.querySelector('.bk-tab').href = BOOKING_URL
	dlg.querySelector('#bk-title + small').textContent = 'Pick a free time. It goes straight onto Haris\'s calendar.'
}
// the booking page loads the first time the popup opens, not with every page
function loadLive() {
	const box = dlg.querySelector('.bk-frame')
	if (!BOOKING_URL || box.firstChild) return
	const f = document.createElement('iframe')
	f.src = embedUrl(BOOKING_URL)
	f.title = 'Book a meeting with Haris'
	f.loading = 'eager'
	box.append(f)
}

const $ = (s) => dlg.querySelector(s)
const grid = $('.bk-grid'), month = $('.bk-month'), prev = $('.bk-prev'), next = $('.bk-next')
const dayLabel = $('.bk-day'), times = $('.bk-times'), note = $('#bk-note'), go = $('.bk-go'), pick = $('.bk-pick'), done = $('.bk-done')

// weekdays from tomorrow, two months ahead
const today = new Date()
today.setHours(0, 0, 0, 0)
const first = new Date(today.getFullYear(), today.getMonth(), 1)
const last = new Date(today.getTime() + 60 * 864e5)
const isOpen = (d) => d > today && d <= last && d.getDay() > 0 && d.getDay() < 6
let view = new Date(first)
let day = null, time = null
// near the end of a month, open on the next one so the calendar isn't nearly empty
let left = 0
for (let d = new Date(today); d.getMonth() === today.getMonth(); d.setDate(d.getDate() + 1)) if (isOpen(d)) left++
if (left < 5) view = new Date(today.getFullYear(), today.getMonth() + 1, 1)
for (let d = new Date(Math.max(today, view)); !day; d.setDate(d.getDate() + 1)) if (isOpen(d)) day = new Date(d)

function update() {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
	const when = time ? `${day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, ${time} (${tz})` : ''
	go.setAttribute('aria-disabled', String(!time))
	pick.textContent = time ? when : 'Pick a day and a time.'
	const body = `Hi Haris,\n\nI'd like to book a meeting.\n\nTime: ${when}${note.value.trim() ? `\n\nWhat I want to build: ${note.value.trim()}` : ''}\n`
	go.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Book a meeting')}&body=${encodeURIComponent(body)}`
}

function drawTimes() {
	dayLabel.textContent = day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
	times.innerHTML = ''
	for (const t of TIMES) {
		const b = document.createElement('button')
		b.type = 'button'
		b.textContent = t
		b.setAttribute('aria-pressed', String(t === time))
		b.addEventListener('click', () => { time = t; drawTimes(); update() })
		times.append(b)
	}
}

function drawMonth() {
	month.textContent = view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
	prev.disabled = view <= first
	next.disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > last
	grid.innerHTML = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((w) => `<span>${w}</span>`).join('')
	for (let i = 0, lead = (view.getDay() + 6) % 7; i < lead; i++) grid.append(document.createElement('i'))
	const n = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
	for (let k = 1; k <= n; k++) {
		const d = new Date(view.getFullYear(), view.getMonth(), k)
		if (!isOpen(d)) {
			const i = document.createElement('i')
			i.textContent = k
			grid.append(i)
			continue
		}
		const b = document.createElement('button')
		b.type = 'button'
		b.textContent = k
		b.setAttribute('aria-label', d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))
		b.setAttribute('aria-pressed', String(d.getTime() === day.getTime()))
		b.addEventListener('click', () => { day = d; time = null; drawMonth(); drawTimes(); update() })
		grid.append(b)
	}
}

prev.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); drawMonth() })
next.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); drawMonth() })
note.addEventListener('input', update)
go.addEventListener('click', () => { if (time) done.hidden = false })
$('.bk-x').addEventListener('click', () => dlg.close())
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close() }) // a click on the dimmed backdrop

drawMonth()
drawTimes()
update()

export function openBooking() {
	done.hidden = true
	loadLive()
	if (!dlg.open) dlg.showModal()
}

// Any "Book a meeting" link opens the popup: links to #book, and the old email links.
// The calendar section on the home page keeps its own buttons.
document.addEventListener('click', (e) => {
	const a = e.target.closest?.('a')
	if (!a || a.id === 'cal-go' || a.id === 'close-book' || a.closest('.bk')) return
	const href = a.getAttribute('href') || ''
	const isBook = href === '#book' || href === '/#book' || (href.startsWith('mailto:') && /subject=Book(%20| )a(%20| )(meeting|call)/i.test(href))
	if (!isBook || e.ctrlKey || e.metaKey || e.shiftKey) return
	e.preventDefault()
	openBooking()
})
