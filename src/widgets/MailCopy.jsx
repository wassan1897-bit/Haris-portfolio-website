import { useEffect, useState } from 'react'
import './mail-copy.css'

// A mailto link does nothing on a computer with no email app set up, so a click also copies the address.
// Booking links (the popup cancels them) and the booking request itself (it carries a body) are left alone.
export default function MailCopy() {
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    let timer
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="mailto:"]')
      if (!a || e.defaultPrevented || /[?&]body=/.test(a.href)) return
      const address = decodeURIComponent(a.href.slice(7).split('?')[0])
      navigator.clipboard?.writeText(address).then(() => {
        setCopied(address)
        clearTimeout(timer)
        timer = setTimeout(() => setCopied(null), 2800)
      }, () => {})
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      clearTimeout(timer)
    }
  }, [])

  return <div className="mail-copied" role="status" data-shown={copied ? '' : undefined}>{copied && <>Email copied: <b>{copied}</b></>}</div>
}
