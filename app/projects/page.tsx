import type { Metadata } from "next"
import { PageHeader } from "@/components/layout/page-header"
import { Projects } from "@/components/sections/projects"

export const metadata: Metadata = {
  title: "Projects — Wahyu Maulana",
  description: "Selected projects across AI, machine learning, and full-stack engineering.",
}

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-36 pb-28">
      <PageHeader
        eyebrow="Selected work"
        title="Projects"
        subtitle="A few things I've designed, engineered, and shipped end to end."
      />
      <Projects />
    </section>
  )
}
