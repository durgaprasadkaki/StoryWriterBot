import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  icon?: ReactNode
}

export function TextAreaField({ label, hint, id, icon, className, ...props }: TextAreaFieldProps) {
  const textAreaId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-4 text-slate-300">{icon}</span>}
        <textarea
          id={textAreaId}
          placeholder=" "
          className={cn(
            'peer min-h-32 w-full rounded-xl border border-white/20 bg-slate-900/40 px-3 pt-6 text-sm text-slate-100 outline-none transition placeholder:text-transparent focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20',
            icon ? 'pl-10' : 'pl-3',
            className,
          )}
          {...props}
        />
        <label
          htmlFor={textAreaId}
          className={cn(
            'pointer-events-none absolute top-4 text-sm text-slate-400 transition-all peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-indigo-300 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs',
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
