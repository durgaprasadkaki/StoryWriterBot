import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  icon?: ReactNode
}

export function Field({ label, hint, id, icon, className, ...props }: FieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          placeholder=" "
          className={cn(
            'peer h-12 w-full rounded-xl border border-white/20 bg-slate-900/40 px-3 pt-4 text-sm text-slate-100 outline-none transition placeholder:text-transparent focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20',
            icon ? 'pl-10' : 'pl-3',
            className,
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm text-slate-400 transition-all peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-indigo-300 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs',
            icon ? 'left-10' : 'left-3',
          )}
        >
          {label}
        </label>
      </div>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
