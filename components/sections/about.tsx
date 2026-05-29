"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const ease = [0.22, 1, 0.36, 1] as const

const skills = [
  "Machine Learning",
  "AI Engineering",
  "Full-Stack Development",
  "LLMs & Agents",
  "Computer Vision",
  "Robotics",
  "Product & Startups",
  "Creative Technology",
]

export function About() {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Photo card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease }}
        className="relative mx-auto w-full max-w-sm"
      >
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-600/25 via-violet-600/20 to-fuchsia-600/25 blur-2xl" />
        <div className="glass overflow-hidden rounded-3xl p-2 shadow-2xl shadow-black/40">
          <Image
            src="/portrait.jpeg"
            alt="Portrait of Wahyu Maulana"
            width={640}
            height={800}
            className="h-auto w-full rounded-2xl object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Text */}
      <div>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-sm font-medium uppercase tracking-[0.22em] text-violet-300/70"
        >
          About
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 0.08, ease }}
          className="mt-3 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Wahyu Maulana
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
          className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-white/65"
        >
          <p>
            I&apos;m an AI engineer, software developer, and founder who loves
            building things at the intersection of machine learning and great
            product design. I&apos;m driven by turning ambitious ideas into
            real, working systems.
          </p>
          <p>
            My work spans intelligent agents, computer vision, and full-stack
            platforms. When I&apos;m not shipping, I&apos;m writing about what I
            learn and exploring the frontier of creative technology and
            startups.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease }}
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/75 transition-colors hover:border-white/25 hover:text-white"
            >
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
