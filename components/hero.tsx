"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Linkedin, Instagram, Twitter, Mail, ArrowUpRight } from "lucide-react"

const socials = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "X", href: "https://x.com", icon: Twitter },
  { label: "Email", href: "mailto:hello@wahyu.dev", icon: Mail },
]

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 pt-28 pb-16">
      <div className="w-full max-w-xl">
        {/* Left content — the samurai 3D scene is the background visual */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/75"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400" />
            Available for new projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-white">Hi, I&apos;m </span>
            <span className="text-gradient">Wahyu.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/65"
          >
            AI Engineer, software developer, and founder. I design and build
            intelligent products — from machine learning systems to polished
            full-stack experiences.
          </motion.p>

          {/* socials */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="mt-8 flex items-center gap-3"
          >
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="glass flex h-11 w-11 items-center justify-center rounded-xl text-white/70 transition-all hover:-translate-y-0.5 hover:text-white hover:ring-1 hover:ring-white/30"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
            >
              View Projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/resume"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:ring-1 hover:ring-white/30"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
