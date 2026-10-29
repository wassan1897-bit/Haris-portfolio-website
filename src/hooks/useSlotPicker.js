import { useState } from 'react'
import { bookingWindow } from '../lib/booking.js'

// a month view, a picked weekday and a picked time; `when` is the pick written out for the email
export function useSlotPicker() {
  const [win] = useState(bookingWindow)
  const [view, setView] = useState(win.view)
  const [day, setDay] = useState(win.day)
  const [time, setTime] = useState(null)

  const step = (n) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1))
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const when = time ? `${day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, ${time} (${tz})` : ''

  return {
    view,
    day,
    time,
    when,
    isOpen: win.isOpen,
    canPrev: view > win.first,
    canNext: new Date(view.getFullYear(), view.getMonth() + 1, 1) <= win.last,
    prev: () => step(-1),
    next: () => step(1),
    pickDay: (d) => { setDay(d); setTime(null) },
    pickTime: setTime,
  }
}
