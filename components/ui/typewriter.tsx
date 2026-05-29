"use client"

import { useEffect, useState } from "react"

interface TypewriterProps {
  strings: string[]
  pauseTime?: number
  typingSpeed?: number
  deletingSpeed?: number
  className?: string
}

export function Typewriter({
  strings,
  pauseTime = 2000,
  typingSpeed = 100,
  deletingSpeed = 50,
  className = "",
}: TypewriterProps) {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleTyping = () => {
      const i = loopNum % strings.length
      const fullText = strings[i]

      if (isDeleting) {
        setText((prev) => fullText.substring(0, prev.length - 1))
      } else {
        setText((prev) => fullText.substring(0, prev.length + 1))
      }

      if (!isDeleting && text === fullText) {
        timer = setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && text === "") {
        setIsDeleting(false)
        setLoopNum((prev) => prev + 1)
        timer = setTimeout(handleTyping, typingSpeed)
      } else {
        timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed)
      }
    }

    // Start typing
    timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, strings, pauseTime, typingSpeed, deletingSpeed])

  return (
    <span className={`inline-block ${className}`}>
      {text}
      <span className="ml-[2px] animate-pulse border-r-2 border-white/70"></span>
    </span>
  )
}
