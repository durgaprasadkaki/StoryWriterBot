import { useState } from 'react'
import { StoryForm } from './StoryForm'
import { StoryHistory } from './StoryHistory'
import { StoryPreview } from './StoryPreview'
import { ChatInterface } from './ChatInterface'
import { useStoryGenerator } from '../hooks/useStoryGenerator'
import { Button } from '@/shared/components/ui/Button'
import { AppNavbar } from '@/shared/components/layout/AppNavbar'
import { FloatingShapes } from '@/shared/components/layout/FloatingShapes'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface StoryWorkspaceProps {
  userId: string
  userName: string
  onLogout: () => void
}

export function StoryWorkspace({ userId, userName, onLogout }: StoryWorkspaceProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const {
    options,
    setOptions,
    content,
    isGenerating,
    history,
    historyCountLabel,
    onGenerate,
    onLoadHistory,
    onClearHistory,
    onDeleteHistoryItem,
  } = useStoryGenerator(userId)

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingShapes />
      <AppNavbar userName={userName} onLogout={onLogout} />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-10 pt-24 md:px-6"
      >
        <section className="glass-card p-6 md:p-8">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-slate-200">
            AI Writing Workspace • Powered by ASI-1
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-transparent md:text-5xl bg-gradient-to-r from-fuchsia-300 via-indigo-200 to-cyan-200 bg-clip-text">
            Write premium stories in seconds.
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
            Generate compelling drafts with ASI-1 AI, refine them interactively, and manage your creative history in a modern editor-style interface.
          </p>
          <div className="mt-5 flex gap-3">
            <Button onClick={onGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Story'}
            </Button>
            {content && (
              <Button
                onClick={() => setIsChatOpen(!isChatOpen)}
                variant="secondary"
              >
                <MessageCircle className="size-4" />
                {isChatOpen ? 'Hide' : 'Refine'} with AI
              </Button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <StoryForm
            value={options}
            isGenerating={isGenerating}
            onChange={setOptions}
            onGenerate={onGenerate}
          />
          <StoryPreview content={content} isGenerating={isGenerating} />
        </div>

        <StoryHistory
          history={history}
          countLabel={historyCountLabel}
          onLoad={onLoadHistory}
          onDelete={onDeleteHistoryItem}
          onClear={onClearHistory}
        />
      </motion.section>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        storyContent={content}
      />
    </main>
  )
}
