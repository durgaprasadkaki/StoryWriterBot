import type { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const variantClassMap: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-glow hover:brightness-110',
    secondary:
      'bg-white/10 text-slate-100 border border-white/20 hover:bg-white/20',
    ghost:
      'bg-transparent text-slate-200 border border-white/20 hover:bg-white/10',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.16 }}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60',
        variantClassMap[variant],
        className,
      )}
      {...(props as any)}
    />
  )
}
