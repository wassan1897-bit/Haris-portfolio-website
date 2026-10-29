import { Link } from 'react-router-dom'
import FlowCanvas from '../../components/FlowCanvas.jsx'
import { MonthGrid, SlotTimes, monthTitle } from '../../components/SlotPicker.jsx'
import { useSlotPicker } from '../../hooks/useSlotPicker.js'
import { BOOK_MAIL } from '../../lib/site.js'

// Booking calendar: works through email until a Cal.com / Calendly link replaces it.
// The pick goes into the "Book a meeting" email; these two buttons skip the popup.
export default function Close() {
  const picker = useSlotPicker()
  const mail = picker.when ? `${BOOK_MAIL}&body=${encodeURIComponent(picker.when)}` : BOOK_MAIL
  return (
    <section className="close" id="book" aria-labelledby="close-title">
      <div className="wrap">
        <div>
          <h2 id="close-title">If you're serious about building a revenue engine, let's talk.</h2>
          <p>Muhammad Haris is the engineer you bring in when you want AI in your revenue engine to produce pipeline, not a demo.</p>
          <div className="ctas">
            <a className="btn" id="close-book" href={mail}>Book a meeting <i aria-hidden="true">&rarr;</i></a>
            <Link className="btn btn--line" to="/resume">Resume <i aria-hidden="true">&rarr;</i></Link>
          </div>
        </div>
        <div className="cal" role="group" aria-label="Book a meeting">
          <div className="cal-head"><img src="/images/haris.webp" alt="" width="40" height="40" loading="lazy" /><b>Book a meeting</b><small>Muhammad Haris</small></div>
          <div>
            <div className="cal-bar">
              <b id="cal-title" aria-live="polite">{monthTitle(picker.view)}</b>
              <span>
                <button type="button" id="cal-prev" aria-label="Previous month" disabled={!picker.canPrev} onClick={picker.prev}>&lsaquo;</button>
                <button type="button" id="cal-next" aria-label="Next month" disabled={!picker.canNext} onClick={picker.next}>&rsaquo;</button>
              </span>
            </div>
            <MonthGrid picker={picker} className="cal-grid" id="cal-grid" />
          </div>
          <div className="cal-slots">
            <small id="cal-day">{picker.day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</small>
            <SlotTimes picker={picker} id="cal-times" />
            <a className="cal-go" id="cal-go" href={mail} aria-disabled={!picker.time}>Book a meeting</a>
          </div>
        </div>
      </div>
      <FlowCanvas />
    </section>
  )
}
