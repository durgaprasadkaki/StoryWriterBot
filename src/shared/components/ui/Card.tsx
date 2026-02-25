import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function Card({ title, subtitle, children, className }: CardProps) {
  return (
    <section className={cn('glass-card p-5 md:p-6', className)}>
      {(title || subtitle) && (
        <header className="mb-5">
          {title && <h2 className="text-lg font-semibold text-slate-50 md:text-xl">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-slate-300">{subtitle}</p>}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  )
}
