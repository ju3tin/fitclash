// app/preload-resources.ts
'use client'

import ReactDOM from 'react-dom/client'

export function PreloadResources() {
  ReactDOM.preload('https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css', { as: 'style' })

  return null
}