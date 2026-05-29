import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Writing } from "@/components/writing"

export const metadata: Metadata = {
  title: "Writing — Wahyu Maulana",
  description: "Notes on AI, engineering, and building products.",
}

export default function WritingPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-36 pb-28">
      <PageHeader
        eyebrow="Notes"
        title="Writing"
        subtitle="Thoughts on AI, engineering, and building products."
      />
      <Writing />
    </section>
  )
}
