import { Suspense } from 'react'

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <section>{children}</section>
    </Suspense>
  )
}
