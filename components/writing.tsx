"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { StaggerGroup, StaggerItem } from "@/components/motion"

const posts = [
  {
    title: "Building reliable agents that don't hallucinate tools",
    excerpt:
      "Practical guardrails, schema validation, and retry strategies for production-grade tool-using agents.",
    date: "Mar 2025",
    readTime: "8 min read",
    tag: "AI Engineering",
  },
  {
    title: "Vector search at scale: lessons from production",
    excerpt:
      "What broke, what scaled, and how hybrid retrieval beat pure embeddings for real workloads.",
    date: "Jan 2025",
    readTime: "6 min read",
    tag: "Machine Learning",
  },
  {
    title: "What I learned shipping a startup solo",
    excerpt:
      "On scope, momentum, and the unglamorous discipline of finishing things by yourself.",
    date: "Nov 2024",
    readTime: "5 min read",
    tag: "Founder Notes",
  },
]

export function Writing() {
  return (
    <StaggerGroup className="mt-12 flex flex-col gap-4">
      {posts.map((post) => (
        <StaggerItem key={post.title}>
          <motion.a
            href="#"
            whileHover={{ x: 6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group glass flex items-center justify-between gap-6 rounded-2xl px-7 py-6 shadow-lg shadow-black/20 transition-[border-color,background] duration-300 hover:border-white/25 hover:bg-white/[0.07]"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3 text-xs text-white/50">
                <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 font-medium text-violet-200">
                  {post.tag}
                </span>
                <span className="font-mono">{post.date}</span>
                <span aria-hidden>·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="mt-2.5 text-balance text-xl font-semibold text-white">
                {post.title}
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-white/55">
                {post.excerpt}
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </motion.a>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
