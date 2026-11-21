export const SITE = 'Muhammad Haris, AI GTM Engineer'
export const SITE_URL = 'https://www.meetmuhammadharis.com'
export const DESCRIPTION = 'I build the AI systems behind every stage of the revenue engine, from signal to retention.'
export const EMAIL = 'muhammadharis.builds@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/muhammadharisai'
export const GITHUB = 'https://github.com/Haris001-bit'
export const RESUME_PDF = '/Muhammad-Haris-AI-GTM-Engineer-Resume.pdf'
// links with this subject open the booking popup instead of the email app
export const BOOK_MAIL = `mailto:${EMAIL}?subject=Book%20a%20meeting`
// every "Book a meeting" spot offers both: Haris's Google booking page (new tab) and a plain email.
// The email subject avoids "Book a…", which the booking popup would catch.
export const CALENDAR_URL = 'https://calendar.app.google/rggLDm7cdPdoeNsC9'
// "Email me" opens Gmail compose in a new tab. mailto: does nothing when no desktop mail app is set.
export const CONTACT_MAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent('Meeting request')}`
