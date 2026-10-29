import { useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import ScrollManager from './components/ScrollManager.jsx'
import { useLinkInterceptor } from './hooks/useLinkInterceptor.js'
import { BareContext } from './lib/bare.js'
import FullLayout from './layouts/FullLayout.jsx'
import SlimLayout from './layouts/SlimLayout.jsx'
import Home from './pages/home/Home.jsx'
import Resume from './pages/Resume.jsx'
import Reviews from './pages/Reviews.jsx'
import Faq from './pages/Faq.jsx'
import Privacy from './pages/Privacy.jsx'
import Projects from './pages/Projects.jsx'
import WorkCase from './pages/WorkCase.jsx'
import NotFound from './pages/NotFound.jsx'
import { CATEGORIES } from './data/projects.js'
import { WORK } from './data/work.js'
import { BookingProvider } from './widgets/Booking.jsx'
import AssistantWidget from './widgets/AssistantWidget.jsx'
import MailCopy from './widgets/MailCopy.jsx'

// Old links end in .html (/resume.html, /work/signal-engine.html, /index.html); send them to the clean route.
function Root() {
  const { pathname, search, hash } = useLocation()
  const [bare, setBare] = useState(false)
  useLinkInterceptor()
  if (pathname.endsWith('.html')) return <Navigate replace to={(pathname.replace(/(index)?\.html$/, '') || '/') + search + hash} />
  return (
    <BareContext.Provider value={setBare}>
      <BookingProvider>
        <Outlet />
        <ScrollManager />
        <AssistantWidget hidden={bare} />
        <MailCopy />
      </BookingProvider>
    </BareContext.Provider>
  )
}

function ProjectsRoute() {
  const { category } = useParams()
  if (category !== 'all' && !CATEGORIES.some((c) => c.slug === category)) return <NotFound />
  return <FullLayout><Projects category={category} /></FullLayout>
}

function WorkRoute() {
  const { slug } = useParams()
  const work = WORK.find((w) => w.slug === slug)
  if (!work) return <NotFound />
  return <FullLayout footer="minimal"><WorkCase work={work} /></FullLayout>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Root />}>
        <Route index element={<FullLayout><Home /></FullLayout>} />
        <Route path="resume" element={<FullLayout><Resume /></FullLayout>} />
        <Route path="projects" element={<Navigate replace to="/projects/all" />} />
        <Route path="projects/:category" element={<ProjectsRoute />} />
        <Route path="work/:slug" element={<WorkRoute />} />
        <Route path="reviews" element={<SlimLayout icons><Reviews /></SlimLayout>} />
        <Route path="faq" element={<SlimLayout><Faq /></SlimLayout>} />
        <Route path="privacy" element={<SlimLayout><Privacy /></SlimLayout>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
