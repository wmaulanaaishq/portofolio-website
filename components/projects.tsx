"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Github, ArrowUpRight } from "lucide-react"
import { StaggerGroup, StaggerItem } from "@/components/motion"

const projects = [
  {
    title: "Synapse Search",
    image: "/projects/neural-search.png",
    description:
      "A neural semantic search engine with vector embeddings and hybrid retrieval, serving sub-100ms queries over millions of documents.",
    stack: ["Next.js", "Python", "pgvector", "OpenAI"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "Orchestra",
    image: "/projects/agent-platform.png",
    description:
      "An autonomous agent orchestration platform that plans, routes, and executes multi-step tasks across tools with full observability.",
    stack: ["TypeScript", "AI SDK", "Redis", "Postgres"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "VisionKit",
    image: "/projects/vision-robotics.png",
    description:
      "A real-time computer-vision pipeline for robotics — object detection, depth fusion, and ROS2 control from sim to hardware.",
    stack: ["ROS2", "PyTorch", "YOLO", "OpenCV"],
    github: "https://github.com",
    demo: "https://example.com",
  },
]

export function Projects() {
  return (
    <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <StaggerItem key={p.title} className="h-full">
          <motion.article
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group glass relative flex h-full flex-col overflow-hidden rounded-3xl shadow-xl shadow-black/30 transition-[box-shadow,border-color] duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-black/50"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={p.image || "/placeholder.svg"}
                alt={`${p.title} preview`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/30 to-transparent" />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-white/60">
                {p.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-transform hover:scale-105"
                >
                  Live demo
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} on GitHub`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:text-white"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.article>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
