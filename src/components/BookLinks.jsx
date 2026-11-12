import { CALENDAR_URL, CONTACT_MAIL } from '../lib/site.js'
import { MailIcon } from './Icons.jsx'

// The two ways to set up a meeting, used wherever the site says "Book a meeting":
// the booking page opens in a new tab, the email opens a new message to Haris.
export function CalendarLink({ className, children = 'Book a meeting', arrow = false }) {
  return (
    <a className={className} href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
      {children}{arrow && <> <i aria-hidden="true">&rarr;</i></>}
    </a>
  )
}

export function EmailLink({ className, children = 'Email me', arrow = false }) {
  return (
    <a className={className} href={CONTACT_MAIL}>
      {children}{arrow && <> <i aria-hidden="true">&rarr;</i></>}
    </a>
  )
}

// top bars: the email is an icon button so both fit beside the logo on a phone
export function EmailIconLink({ size = 19 }) {
  return (
    <a className="icon-btn mail-icon" href={CONTACT_MAIL} aria-label="Email me" title="Email me"><MailIcon size={size} /></a>
  )
}
