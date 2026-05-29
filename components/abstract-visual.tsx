"use client"

import { useEffect, useRef } from "react"

type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: number }
type Orbiter = { radius: number; angle: number; speed: number; size: number; hue: number }

export function AbstractVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let raf = 0
    let t = 0
    let nodes: Node[] = []
    let orbiters: Orbiter[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(28, Math.floor((width * height) / 18000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.6,
        hue: [222, 270, 320][Math.floor(Math.random() * 3)],
      }))

      orbiters = [
        { radius: 0.3, angle: 0, speed: 0.012, size: 4, hue: 222 },
        { radius: 0.3, angle: Math.PI, speed: 0.012, size: 3, hue: 270 },
        { radius: 0.42, angle: 1, speed: -0.008, size: 5, hue: 320 },
        { radius: 0.42, angle: 1 + Math.PI, speed: -0.008, size: 3, hue: 290 },
        { radius: 0.2, angle: 2, speed: 0.02, size: 3, hue: 250 },
      ]
    }

    const draw = () => {
      t += 1
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2
      const minDim = Math.min(width, height)

      // orbit rings
      for (const ring of [0.2, 0.3, 0.42]) {
        ctx.beginPath()
        ctx.ellipse(cx, cy, minDim * ring, minDim * ring * 0.62, -0.5, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255,255,255,0.07)"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // connecting node network
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j]
          const dist = Math.hypot(p.x - q.x, p.y - q.y)
          if (dist < 110) {
            ctx.strokeStyle = `hsla(${p.hue},90%,72%,${(1 - dist / 110) * 0.16})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }
      for (const p of nodes) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},95%,78%,0.85)`
        ctx.shadowColor = `hsla(${p.hue},95%,70%,0.9)`
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // orbiting glow trails
      for (const o of orbiters) {
        o.angle += o.speed
        const rx = minDim * o.radius
        const ry = minDim * o.radius * 0.62
        // trail
        for (let k = 0; k < 14; k++) {
          const a = o.angle - k * 0.05 * Math.sign(o.speed || 1)
          const x = cx + Math.cos(a) * rx * Math.cos(-0.5) - Math.sin(a) * ry * Math.sin(-0.5)
          const y = cy + Math.cos(a) * rx * Math.sin(-0.5) + Math.sin(a) * ry * Math.cos(-0.5)
          ctx.beginPath()
          ctx.arc(x, y, o.size * (1 - k / 16), 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${o.hue},95%,72%,${0.5 * (1 - k / 14)})`
          ctx.fill()
        }
        const x = cx + Math.cos(o.angle) * rx * Math.cos(-0.5) - Math.sin(o.angle) * ry * Math.sin(-0.5)
        const y = cy + Math.cos(o.angle) * rx * Math.sin(-0.5) + Math.sin(o.angle) * ry * Math.cos(-0.5)
        ctx.beginPath()
        ctx.arc(x, y, o.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${o.hue},98%,80%,0.95)`
        ctx.shadowColor = `hsla(${o.hue},98%,72%,1)`
        ctx.shadowBlur = 16
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // pulsing core
      const pulse = (Math.sin(t * 0.03) + 1) / 2
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 + pulse * 18)
      grad.addColorStop(0, "rgba(196,181,253,0.55)")
      grad.addColorStop(0.5, "rgba(139,92,246,0.2)")
      grad.addColorStop(1, "rgba(139,92,246,0)")
      ctx.beginPath()
      ctx.arc(cx, cy, 60 + pulse * 18, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -inset-10 -z-10">
        <div className="absolute left-1/4 top-1/4 h-56 w-56 rounded-full bg-blue-600/30 blur-[90px] animate-glow-pulse" />
        <div className="absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-fuchsia-600/25 blur-[90px] animate-glow-pulse [animation-delay:1.5s]" />
        <div className="absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-violet-600/25 blur-[90px] animate-glow-pulse [animation-delay:3s]" />
      </div>

      {/* ring frames */}
      <div className="absolute inset-4 rounded-full border border-white/10" />
      <div className="absolute inset-16 rounded-full border border-white/5" />

      {/* floating data shards */}
      <div className="animate-float-slow absolute left-2 top-10 h-16 w-16 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md" />
      <div className="animate-float-medium absolute bottom-12 right-4 h-20 w-20 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/5 backdrop-blur-md [animation-delay:1s]" />
      <div className="animate-float-slow absolute bottom-24 left-8 h-10 w-10 rounded-xl border border-blue-400/20 bg-blue-500/5 backdrop-blur-md [animation-delay:2s]" />

      <canvas ref={canvasRef} className="relative h-full w-full" aria-hidden="true" />
    </div>
  )
}
