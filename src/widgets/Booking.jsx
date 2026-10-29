// Booking popup: every "Book a meeting" button on every page opens it.
// With BOOKING_URL set, the popup shows Haris's live booking page (Google Calendar appointment schedule,
// Calendly or Cal.com): the visitor books a free slot, it lands on Haris's calendar, and both get an email.
// Without it, the visitor picks a weekday and a time and the request is sent to Haris by email.
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MonthGrid, SlotTimes, monthTitle } from '../components/SlotPicker.jsx'
import { useSlotPicker } from '../hooks/useSlotPicker.js'
import { EMAIL } from '../lib/site.js'
import './booking.css'

const BOOKING_URL = '' // Haris's booking page link, e.g. https://calendar.google.com/calendar/appointments/schedules/...

// each service needs its own flag to show its page inside another site
function embedUrl(link) {
  const u = new URL(link)
  if (u.hostname === 'calendar.google.com') u.searchParams.set('gv', 'true')
  else if (u.hostname.endsWith('calendly.com')) { u.searchParams.set('embed_type', 'Inline'); u.searchParams.set('embed_domain', location.hostname); u.searchParams.set('hide_gdpr_banner', '1') }
  else if (u.hostname.endsWith('cal.com')) u.searchParams.set('embed', 'true')
  return u.toString()
}

// links to #book, and the old "Book a meeting" email links
function isBookingLink(a) {
  if (a.id === 'cal-go' || a.id === 'close-book' || a.closest('.bk')) return false
  const href = a.getAttribute('href') || ''
  return href === '#book' || href === '/#book' || (href.startsWith('mailto:') && /subject=Book(%20| )a(%20| )(meeting|call)/i.test(href))
}

function BookingDialog({ dialog, live }) {
  const picker = useSlotPicker()
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  const close = () => dialog.current.close()

  const { day, time, when } = picker
  const body = `Hi Haris,\n\nI'd like to book a meeting.\n\nTime: ${when}${note.trim() ? `\n\nWhat I want to build: ${note.trim()}` : ''}\n`
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent('Book a meeting')}&body=${encodeURIComponent(body)}`

  useEffect(() => {
    const d = dialog.current
    const reset = () => setDone(false)
    d.addEventListener('close', reset)
    return () => d.removeEventListener('close', reset)
  }, [dialog])

  return (
    <dialog className={'bk' + (BOOKING_URL ? ' bk--live' : '')} aria-labelledby="bk-title" ref={dialog} onClick={(e) => { if (e.target === e.currentTarget) close() }}>
      <div className="bk-head">
        <img src="/images/haris.webp" alt="" width="44" height="44" />
        <div><b id="bk-title">Book a meeting with Haris</b><small>{BOOKING_URL ? "Pick a free time. It goes straight onto Haris's calendar." : '30 minutes · times in your time zone'}</small></div>
        <button type="button" className="bk-x" aria-label="Close" onClick={close}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      </div>
      <div className="bk-body" hidden={!!BOOKING_URL}>
        <div>
          <div className="bk-bar">
            <b className="bk-month" aria-live="polite">{monthTitle(picker.view)}</b>
            <span>
              <button type="button" className="bk-prev" aria-label="Previous month" disabled={!picker.canPrev} onClick={picker.prev}>&lsaquo;</button>
              <button type="button" className="bk-next" aria-label="Next month" disabled={!picker.canNext} onClick={picker.next}>&rsaquo;</button>
            </span>
          </div>
          <MonthGrid picker={picker} className="bk-grid" />
        </div>
        <div className="bk-slots">
          <small className="bk-day">{day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</small>
          <SlotTimes picker={picker} className="bk-times" />
        </div>
      </div>
      <div className="bk-foot" hidden={!!BOOKING_URL}>
        <label htmlFor="bk-note">What do you want to build? <span style={{ fontWeight: 400, color: '#5b6475' }}>(optional)</span></label>
        <textarea id="bk-note" maxLength={600} placeholder="We want more qualified pipeline from inbound demand" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="bk-row"><a className="bk-go" href={href} aria-disabled={!time} onClick={() => { if (time) setDone(true) }}>Request this time</a><span className="bk-pick">{time ? when : 'Pick a day and a time.'}</span></div>
        <p className="bk-note">Your own email app sends the request. Nothing is stored on this site. <Link to="/privacy">Privacy</Link></p>
        <p className="bk-done" hidden={!done}>Your email app is opening with the request. If it doesn't, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with the time you picked.</p>
      </div>
      {BOOKING_URL && (
        <div className="bk-live">
          {/* the booking page loads the first time the popup opens, not with every page */}
          <div className="bk-frame">{live && <iframe src={embedUrl(BOOKING_URL)} title="Book a meeting with Haris" loading="eager" />}</div>
          <p className="bk-alt">Prefer email? Write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · <a className="bk-tab" href={BOOKING_URL} target="_blank" rel="noopener">Open the calendar in a new tab</a></p>
        </div>
      )}
    </dialog>
  )
}

// Any "Book a meeting" link opens the popup. The calendar section on the home page keeps its own buttons.
export function BookingProvider({ children }) {
  const dialog = useRef(null)
  const [live, setLive] = useState(false)
  const { pathname } = useLocation()

  const open = useCallback(() => {
    setLive(true)
    if (!dialog.current.open) dialog.current.showModal()
  }, [])

  useEffect(() => {
    // capture phase, so the click is claimed before the app's link handling sees it
    const onClick = (e) => {
      const a = e.target.closest?.('a')
      if (!a || !isBookingLink(a) || e.ctrlKey || e.metaKey || e.shiftKey) return
      e.preventDefault()
      open()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [open])

  // a link inside the popup (Privacy) leaves the page, so the popup goes with it
  useEffect(() => { if (dialog.current.open) dialog.current.close() }, [pathname])

  return (
    <>
      {children}
      <BookingDialog dialog={dialog} live={live} />
    </>
  )
}
