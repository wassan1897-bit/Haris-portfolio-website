import SlimTopbar from '../components/SlimTopbar.jsx'
import { useStylesheet } from '../hooks/useStylesheet.js'
import css from '../styles/slim.css?inline'

// the page renders its own footer: each one links to different pages
export default function SlimLayout({ icons = false, children }) {
  useStylesheet(css, 1)
  return (
    <>
      <SlimTopbar icons={icons} />
      {children}
    </>
  )
}
