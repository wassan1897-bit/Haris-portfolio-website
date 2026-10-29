import { useEffect, useState } from 'react'

// true while the element is on screen
export function useInView(ref, options) {
  const [inView, setInView] = useState(false)
  const threshold = options?.threshold
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), threshold === undefined ? undefined : { threshold })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, threshold])
  return inView
}
