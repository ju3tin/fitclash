// app/preload-resources.ts
'use client'

export function PreloadResources() {
  return (
    <link 
      rel="preload"
      href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css"
      as="style"
      crossOrigin="anonymous"
      type="text/css"
      onLoad={() => {
        console.log('Font Awesome CSS loaded')
      }}
    />
  )
}