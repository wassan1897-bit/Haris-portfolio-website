import { useEffect, useRef } from 'react'

// the signal engine video plays only while it is on screen; with reduced motion it stays on the poster
function EngineVideo() {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    v.muted = true
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video id="engine-video" ref={ref} muted loop playsInline preload="metadata" poster="/media/signal-engine/poster.webp" width="1080" height="1080" aria-label="Finding buyers at the exact moment they need help: the engine produced a 51-lead pipeline in its first four days">
      <source src="/media/signal-engine/clip.webm" type="video/webm" />
      <source src="/media/signal-engine/clip.mp4" type="video/mp4" />
    </video>
  )
}

export default function Engine() {
  return (
    <section className="engine" aria-labelledby="engine-title">
      <div className="in">
        <div className="slot"><EngineVideo /></div>
        <div>
          <h2 id="engine-title">If it can't run unattended, it isn't finished.</h2>
          <p>I'm not an automation person who picked up some AI, and I'm not an AI researcher who has never sat in a pipeline review. I'm not an agency, and I don't hand work to juniors.</p>
          <p>The person you talk to is the person who builds it, and the person who answers when it needs attention.</p>
          <h3>Point of view, in my own words</h3>
          <ul>
            <li>Cheap sources first. Expensive ones only when they earn it.</li>
            <li>No agent talks to a prospect without a guardrail.</li>
            <li>The best outbound looks like value arriving before the pitch.</li>
            <li>Pipeline is pipeline. Revenue is revenue. I never confuse the two in a report.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
