import { useEffect, useRef } from 'react'

// the 15 line paths of /images/pipeline-texture.svg, one 360 x 240 tile
const SEG = [
  [[30, 30], [105, 30]], [[30, 150], [105, 150]], [[30, 210], [105, 210]], [[105, 90], [180, 90]],
  [[105, 90], [105, 120], [142, 120], [142, 150]], [[105, 150], [180, 150]], [[180, 150], [255, 150]],
  [[180, 150], [180, 180], [217, 180], [217, 210]], [[180, 210], [255, 210]], [[255, 30], [330, 30]],
  [[255, 30], [255, 60], [292, 60], [292, 90]], [[255, 90], [330, 90]], [[255, 150], [330, 150]],
  [[255, 210], [330, 210]], [[330, 90], [330, 120], [367, 120], [367, 150]],
]
const TRAIL = 54

// a point on a pulse's chain of routes, d pixels from its start
function at(chain, d) {
  for (const r of chain) {
    if (d <= r.len) {
      let i = 1
      while (i < r.cum.length - 1 && r.cum[i] < d) i++
      const t = (d - r.cum[i - 1]) / (r.cum[i] - r.cum[i - 1] || 1)
      return [r.pts[i - 1][0] + (r.pts[i][0] - r.pts[i - 1][0]) * t, r.pts[i - 1][1] + (r.pts[i][1] - r.pts[i - 1][1]) * t]
    }
    d -= r.len
  }
  const r = chain[chain.length - 1]
  return r.pts[r.pts.length - 1]
}

// every corner of the chain between two distances, so the trail bends with the line
function corners(chain, a, b) {
  const out = []
  let base = 0
  for (const r of chain) {
    for (let i = 0; i < r.pts.length; i++) {
      const d = base + r.cum[i]
      if (d > a && d < b) out.push(r.pts[i])
    }
    base += r.len
  }
  return out
}

const total = (chain) => chain.reduce((s, r) => s + r.len, 0)

// Light pulses travel along the same network lines as the band's texture, branch at the joints, and leave
// a soft ring on the node where they stop. They only run while the band is on screen.
function animate(cv, band) {
  const ctx = cv.getContext('2d')
  let W = 0, H = 0, routes = [], byStart = new Map(), pulses = [], rings = [], running = false, last = 0

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = band.clientWidth
    H = band.clientHeight
    cv.width = W * dpr
    cv.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    routes = []
    byStart = new Map()
    for (let tx = 0; tx * 360 < W + 360; tx++) {
      for (let ty = 0; ty * 240 < H; ty++) {
        for (const s of SEG) {
          const pts = s.map(([x, y]) => [x + tx * 360, y + ty * 240])
          const cum = [0]
          for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
          const r = { pts, cum, len: cum[cum.length - 1] }
          routes.push(r)
          const k = pts[0].join()
          if (!byStart.has(k)) byStart.set(k, [])
          byStart.get(k).push(r)
        }
      }
    }
    // start with some pulses already on their way, so the band is alive the moment it shows
    pulses = Array.from({ length: Math.round((W * H) / 104000) }, () => {
      const r = routes[(Math.random() * routes.length) | 0]
      return { chain: [r], d: Math.random() * r.len, v: 70 + Math.random() * 60, done: false }
    })
  }

  function frame(now) {
    if (!running) return
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    ctx.clearRect(0, 0, W, H)
    if (pulses.length < Math.round((W * H) / 52000) && Math.random() < 0.08) {
      pulses.push({ chain: [routes[(Math.random() * routes.length) | 0]], d: 0, v: 70 + Math.random() * 60, done: false })
    }
    for (const p of pulses) {
      p.d += p.v * dt
      if (!p.done && p.d >= total(p.chain)) {
        const end = p.chain[p.chain.length - 1].pts.at(-1)
        const next = byStart.get(end.join())
        if (next && p.chain.length < 6) p.chain.push(next[(Math.random() * next.length) | 0])
        else {
          p.done = true
          rings.push({ x: end[0], y: end[1], t: 0 })
        }
      }
      const L = total(p.chain)
      const head = Math.min(p.d, L)
      const tail = Math.max(0, Math.min(p.d - TRAIL, L))
      if (tail >= L) { p.dead = true; continue }
      const h = at(p.chain, head), t = at(p.chain, tail)
      const g = ctx.createLinearGradient(t[0], t[1], h[0], h[1])
      g.addColorStop(0, 'rgba(226, 204, 165, 0)')
      g.addColorStop(1, 'rgba(236, 218, 186, .9)')
      ctx.strokeStyle = g
      ctx.lineWidth = 1.8
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(t[0], t[1])
      for (const c of corners(p.chain, tail, head)) ctx.lineTo(c[0], c[1])
      ctx.lineTo(h[0], h[1])
      ctx.stroke()
      if (!p.done) {
        ctx.fillStyle = '#f3e9d6'
        ctx.beginPath()
        ctx.arc(h[0], h[1], 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    pulses = pulses.filter((p) => !p.dead)
    for (const r of rings) {
      r.t += dt
      const k = r.t / 0.9
      ctx.strokeStyle = `rgba(226, 204, 165, ${0.7 * (1 - k)})`
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.arc(r.x, r.y, 3 + 13 * k, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = `rgba(245, 235, 214, ${1 - k})`
      ctx.beginPath()
      ctx.arc(r.x, r.y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    rings = rings.filter((r) => r.t < 0.9)
    requestAnimationFrame(frame)
  }

  build()
  const ro = new ResizeObserver(build)
  ro.observe(band)
  let seen = false
  const toggle = () => {
    const on = seen && !document.hidden
    if (on && !running) { running = true; last = performance.now(); requestAnimationFrame(frame) }
    if (!on) running = false
  }
  const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; toggle() })
  io.observe(band)
  document.addEventListener('visibilitychange', toggle)
  return () => {
    running = false
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', toggle)
  }
}

const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// the last child of a band (.hero, .why, .close); still with reduced motion
export default function FlowCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    if (still()) return
    return animate(ref.current, ref.current.parentElement)
  }, [])
  return still() ? null : <canvas className="flow" aria-hidden="true" ref={ref} />
}
