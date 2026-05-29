import { Hero } from "@/components/hero"
import { Experience } from "@/components/experience"

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-6xl px-6 pb-28">
        <Experience />
      </div>
    </>
  )
}
