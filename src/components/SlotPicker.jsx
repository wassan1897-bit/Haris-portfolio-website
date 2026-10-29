import { TIMES, WEEKDAYS } from '../lib/booking.js'

// the month grid: weekday names, blanks before the 1st, closed days as plain numbers, open days as buttons
export function MonthGrid({ picker, className, id }) {
  const { view, day, isOpen, pickDay } = picker
  const lead = (view.getDay() + 6) % 7
  const n = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const days = []
  for (let k = 1; k <= n; k++) {
    const d = new Date(view.getFullYear(), view.getMonth(), k)
    days.push(isOpen(d) ? (
      <button key={k} type="button" aria-label={d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} aria-pressed={d.getTime() === day.getTime()} onClick={() => pickDay(d)}>{k}</button>
    ) : <i key={k}>{k}</i>)
  }
  return (
    <div className={className} id={id}>
      {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
      {Array.from({ length: lead }, (_, i) => <i key={`b${i}`} />)}
      {days}
    </div>
  )
}

export function SlotTimes({ picker, className, id }) {
  return (
    <div className={className} id={id}>
      {TIMES.map((t) => <button key={t} type="button" aria-pressed={t === picker.time} onClick={() => picker.pickTime(t)}>{t}</button>)}
    </div>
  )
}

export const monthTitle = (view) => view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
