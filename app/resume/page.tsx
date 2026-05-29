import type { Metadata } from "next"
import { ContactFooter } from "@/components/contact-footer"

export const metadata: Metadata = {
  title: "Resume — Wahyu Maulana",
  description: "Download my resume or get in touch about AI, engineering, and founding opportunities.",
}

export default function ResumePage() {
  return <ContactFooter />
}
