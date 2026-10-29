export const TIMES = ['10:00', '11:30', '14:00', '15:30', '17:00']
export const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

// Weekdays from tomorrow, two months ahead. Near the end of a month the calendar opens on the next one
// so it isn't nearly empty.
export function bookingWindow() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const first = new Date(today.getFullYear(), today.getMonth(), 1)
  const last = new Date(today.getTime() + 60 * 864e5)
  const isOpen = (d) => d > today && d <= last && d.getDay() > 0 && d.getDay() < 6
  let view = first
  let left = 0
  for (let d = new Date(today); d.getMonth() === today.getMonth(); d.setDate(d.getDate() + 1)) if (isOpen(d)) left++
  if (left < 5) view = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  let day = null
  for (let d = new Date(Math.max(today, view)); !day; d.setDate(d.getDate() + 1)) if (isOpen(d)) day = new Date(d)
  return { first, last, isOpen, view, day }
}
