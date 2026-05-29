"use client"

import { motion } from "framer-motion"
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion"

const experience = [
  { role: "Founder & AI Engineer", org: "Stealth Startup", period: "2024 — Present" },
  { role: "Machine Learning Engineer", org: "Algoverse Research", period: "2023 — 2024" },
  { role: "Software Engineer Intern", org: "Ruangguru", period: "Jun 2023 — Aug 2023" },
  { role: "Research Assistant", org: "Robotics & Autonomy Lab", period: "2022 — 2023" },
]

const achievements = [
  { title: "10x Hackathon Wins", detail: "NexHacks, CalHacks, AWS, and more" },
  { title: "Full-ride Scholarship", detail: "Computer Engineering" },
  { title: "Best AI Project", detail: "National Tech Competition" },
  { title: "Cloud & ML Certified", detail: "AWS · TensorFlow Developer" },
]

export function Experience() {
  return (
    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
      {/* Experience timeline */}
      <div>
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-white">Experience</h2>
        </Reveal>
        <StaggerGroup className="mt-10 space-y-2">
          {experience.map((item, i) => (
            <StaggerItem key={item.role}>
              <div className="relative pl-8">
                <span className="absolute left-0 top-3 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_12px] shadow-violet-500" />
                {i !== experience.length - 1 && (
                  <span className="absolute left-[5px] top-6 h-full w-px bg-white/10" />
                )}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-black/20 transition-colors hover:bg-white/[0.07]"
                >
                  <h3 className="text-base font-semibold text-white">{item.role}</h3>
                  <p className="mt-1 text-sm text-white/60">{item.org}</p>
                  <p className="mt-2 font-mono text-xs text-white/40">{item.period}</p>
                </motion.div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      {/* Achievements */}
      <div>
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-white">Achievements</h2>
        </Reveal>
        <StaggerGroup className="mt-10 space-y-2">
          {achievements.map((item, i) => (
            <StaggerItem key={item.title}>
              <div className="relative pl-8">
                <span className="absolute left-0 top-3 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_12px] shadow-violet-500" />
                {i !== achievements.length - 1 && (
                  <span className="absolute left-[5px] top-6 h-full w-px bg-white/10" />
                )}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="glass rounded-2xl p-5 shadow-lg shadow-black/20 transition-colors hover:bg-white/[0.07]"
                >
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{item.detail}</p>
                </motion.div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </div>
  )
}
