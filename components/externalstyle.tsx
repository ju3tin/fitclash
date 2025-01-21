// app/preload-resources.ts
'use client'
import { useEffect, useState } from 'react'

export function PreloadResources() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <link 
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css"
      crossOrigin="anonymous"
    />
  )
}