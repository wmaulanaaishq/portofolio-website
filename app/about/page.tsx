import type { Metadata } from "next"
import { About } from "@/components/about"
import { Experience } from "@/components/experience"

export const metadata: Metadata = {
  title: "About — Wahyu Maulana",
  description: "AI engineer, software developer, and founder. Experience and achievements.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-36 pb-28">
      <About />
      <div className="mt-28">
        <Experience />
      </div>
    </div>
  )
}
