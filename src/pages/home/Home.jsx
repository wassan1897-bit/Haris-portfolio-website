import { usePageMeta } from '../../hooks/usePageMeta.js'
import { useStylesheet } from '../../hooks/useStylesheet.js'
import css from '../../styles/pages/home.css?inline'
import Hero from './Hero.jsx'
import Logos from './Logos.jsx'
import Intro from './Intro.jsx'
import Quote from './Quote.jsx'
import Why from './Why.jsx'
import Engine from './Engine.jsx'
import Process from './Process.jsx'
import Close from './Close.jsx'

export default function Home() {
  usePageMeta(null)
  useStylesheet(css, 2)
  return (
    <>
      <Hero />
      <Logos />
      <Intro />
      <Quote />
      <Why />
      <Engine />
      <Process />
      <Close />
    </>
  )
}
