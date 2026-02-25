import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { formatDate } from '@/shared/lib/formatDate'
import { motion } from 'framer-motion'
import type { StoryHistoryItem } from '../model/types'

interface StoryHistoryProps {
  history: StoryHistoryItem[]
  countLabel: string
  onLoad: (item: StoryHistoryItem) => void
  onDelete: (id: string) => void
  onClear: () => void
}

export function StoryHistory({ history, countLabel, onLoad, onDelete, onClear }: StoryHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card
      title="Story History"
      subtitle={countLabel}
      >
      {history.length > 0 ? (
        <>
          <div className="custom-scrollbar grid max-h-[340px] gap-3 overflow-y-auto pr-1">
            {history.map((item) => (
              <article key={item.id} className="rounded-xl border border-white/15 bg-white/5 p-4 transition hover:bg-white/10">
                <div>
                  <h3 className="m-0 text-sm font-semibold text-slate-100">{item.options.title}</h3>
                  <p className="mb-2 mt-2 text-sm text-slate-300">{item.snippet}</p>
                  <small className="text-xs text-slate-400">{formatDate(item.createdAt)}</small>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={() => onLoad(item)}>Load</Button>
                  <Button variant="ghost" onClick={() => onDelete(item.id)}>Delete</Button>
                </div>
              </article>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClear}>Clear History</Button>
          </div>
        </>
      ) : (
        <p className="m-0 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-5 text-sm text-slate-300">No stories yet. Generate one to build your archive.</p>
      )}
      </Card>
    </motion.div>
  )
}
