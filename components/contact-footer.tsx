"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Instagram, Twitter, Mail, Download, ArrowUpRight, FileText } from "lucide-react"
import { Reveal } from "@/components/motion"

const ease = [0.22, 1, 0.36, 1] as const

const socials = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "X", href: "https://x.com", icon: Twitter },
  { label: "Email", href: "mailto:hello@wahyu.dev", icon: Mail },
]

const highlights = [
  { label: "Years building", value: "5+" },
  { label: "Projects shipped", value: "30+" },
  { label: "Hackathon wins", value: "10x" },
]

export function ContactFooter() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-36 pb-20">
      {/* quick resume highlights */}
      <div className="mb-10 grid grid-cols-3 gap-4">
        {highlights.map((h, i) => (
          <motion.div
            key={h.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease }}
            className="glass rounded-2xl p-5 text-center shadow-lg shadow-black/20"
          >
            <p className="text-gradient text-3xl font-bold sm:text-4xl">{h.value}</p>
            <p className="mt-1 text-xs text-white/55 sm:text-sm">{h.label}</p>
          </motion.div>
        ))}
      </div>

      {/* main CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease }}
        className="glass-strong relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center shadow-2xl shadow-black/40 sm:px-16"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/25 blur-[110px] animate-glow-pulse" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-fuchsia-600/20 blur-[110px] animate-glow-pulse [animation-delay:2s]" />

        <p className="relative text-sm font-medium uppercase tracking-[0.22em] text-violet-300/70">
          Resume · Let&apos;s build
        </p>
        <h1 className="relative mt-4 text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Have a project in mind?
        </h1>
        <p className="relative mx-auto mt-5 max-w-xl text-pretty text-lg text-white/60">
          I&apos;m always open to interesting collaborations, founding
          opportunities, and conversations about AI. Grab my resume or reach out
          directly.
        </p>

        <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href="/resume.pdf"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </motion.a>
          <motion.a
            href="mailto:hello@wahyu.dev"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:ring-1 hover:ring-white/30"
          >
            Contact Me
            <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </div>

        <div className="relative mt-8 inline-flex items-center gap-2 text-xs text-white/45">
          <FileText className="h-3.5 w-3.5" />
          PDF · Updated 2025
        </div>
      </motion.div>

      <Reveal className="mt-16">
        <footer className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/45">
            © {new Date().getFullYear()} Wahyu Maulana. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </footer>
      </Reveal>
    </div>
  )
}
