// app/preload-resources.ts
'use client'

export function PreloadResources() {
  return (
    <link 
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css"
      crossOrigin="anonymous"
    />
  )
}