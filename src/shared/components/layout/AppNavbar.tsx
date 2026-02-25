import { useState } from 'react'
import { ChevronDown, LogOut, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'

interface AppNavbarProps {
  userName: string
  onLogout: () => void
}

export function AppNavbar({ userName, onLogout }: AppNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-fuchsia-300" />
          <h1 className="text-lg font-semibold tracking-tight text-transparent bg-gradient-to-r from-fuchsia-300 via-indigo-300 to-cyan-300 bg-clip-text">
            StoryWriterBot
          </h1>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10"
          >
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
            <span className="hidden md:inline">{userName}</span>
            <ChevronDown className="size-4 text-slate-300" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/15 bg-slate-900/95 p-2 shadow-2xl"
              >
                <p className="px-3 py-2 text-xs text-slate-400">Signed in as {userName}</p>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="w-full justify-start border-white/10 text-slate-200"
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
