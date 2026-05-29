"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

type Accent = {
  a: string // primary glow
  b: string // secondary glow
  c: string // tertiary glow
  beam: string
}

// Per-route accent palettes — each page feels distinct but part of one system.
const ACCENTS: Record<string, Accent> = {
  "/": { a: "59,130,246", b: "139,92,246", c: "217,70,239", beam: "120,90,255" },
  "/projects": { a: "217,70,239", b: "139,92,246", c: "236,72,153", beam: "200,70,230" },
  "/writing": { a: "45,212,191", b: "56,189,248", c: "139,92,246", beam: "80,200,210" },
  "/about": { a: "96,165,250", b: "139,92,246", c: "192,132,252", beam: "120,140,255" },
  "/resume": { a: "251,191,36", b: "236,72,153", c: "139,92,246", beam: "230,150,90" },
}

function accentFor(path: string): Accent {
  if (path.startsWith("/projects")) return ACCENTS["/projects"]
  if (path.startsWith("/writing")) return ACCENTS["/writing"]
  if (path.startsWith("/about")) return ACCENTS["/about"]
  if (path.startsWith("/resume")) return ACCENTS["/resume"]
  return ACCENTS["/"]
}

export function SceneBackground() {
  const pathname = usePathname()
  const accent = accentFor(pathname)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // faint drifting starfield
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = 0
    let h = 0
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars: { x: number; y: number; r: number; t: number; s: number }[] = []

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.floor((w * h) / 11000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        t: Math.random() * Math.PI * 2,
        s: Math.random() * 0.02 + 0.004,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const st of stars) {
        st.t += st.s
        const tw = (Math.sin(st.t) + 1) / 2
        ctx.beginPath()
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.1 + tw * 0.5})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    if (reduce) {
      draw()
      cancelAnimationFrame(raf)
    } else {
      draw()
    }
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#050507]">
      {/* base radial wash that shifts per route */}
      <div
        className="absolute inset-0 transition-[background] duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% -10%, rgba(${accent.a},0.18), transparent 60%)`,
        }}
      />

      {/* grid */}
      <div className="grid-bg absolute inset-0" />

      {/* drifting starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* layered animated mesh glows */}
      <div
        className="animate-float-slow absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full blur-[130px] transition-[background] duration-1000"
        style={{ background: `rgba(${accent.a},0.20)` }}
      />
      <div
        className="animate-float-medium absolute right-0 top-1/4 h-[32rem] w-[32rem] rounded-full blur-[130px] transition-[background] duration-1000"
        style={{ background: `rgba(${accent.b},0.16)` }}
      />
      <div
        className="animate-glow-pulse absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full blur-[140px] transition-[background] duration-1000"
        style={{ background: `rgba(${accent.c},0.16)` }}
      />

      {/* slow rotating light beam */}
      <div className="absolute left-1/2 top-[-30%] h-[120vh] w-[120vh] origin-center">
        <div
          className="animate-beam absolute left-1/2 top-1/2 h-full w-[42%] -translate-x-1/2 -translate-y-1/2 blur-2xl"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(${accent.beam},0.12) 30deg, transparent 70deg)`,
          }}
        />
      </div>

      {/* film grain */}
      <div className="grain absolute inset-0 opacity-[0.04] mix-blend-overlay" />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]" />
    </div>
  )
}
