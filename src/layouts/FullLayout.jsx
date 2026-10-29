import Topbar from '../components/Topbar.jsx'
import EndFooter from '../components/EndFooter.jsx'
import MinimalFooter from '../components/MinimalFooter.jsx'
import { useStylesheet } from '../hooks/useStylesheet.js'
import css from '../styles/chrome.css?inline'

export default function FullLayout({ footer = 'end', children }) {
  useStylesheet(css, 1)
  return (
    <>
      <Topbar />
      {children}
      {footer === 'end' ? <EndFooter /> : <MinimalFooter />}
    </>
  )
}
