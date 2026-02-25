import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Field } from '@/shared/components/ui/Field'
import { SelectField } from '@/shared/components/ui/SelectField'
import { TextAreaField } from '@/shared/components/ui/TextAreaField'
import { BookOpenText, Drama, Eye, Languages, PenLine, Sparkles, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  audienceOptions,
  genreOptions,
  lengthOptions,
  pointOfViewOptions,
  toneOptions,
} from '../model/constants'
import type { StoryOptions } from '../model/types'

interface StoryFormProps {
  value: StoryOptions
  isGenerating: boolean
  onChange: (updater: (prev: StoryOptions) => StoryOptions) => void
  onGenerate: () => void
}

export function StoryForm({ value, isGenerating, onChange, onGenerate }: StoryFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <Card
        title="Story Controls"
        subtitle="Set your creative direction, powered by ASI-1 AI."
      >
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2">
          <Zap className="size-4 text-indigo-400" />
          <span className="text-xs text-indigo-200">Enhanced by ASI-1 API • Advanced story generation</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Story Title"
            icon={<PenLine className="size-4" />}
            value={value.title}
            onChange={(event) => onChange((prev) => ({ ...prev, title: event.target.value }))}
          />
          <SelectField
            label="Genre"
            icon={<Drama className="size-4" />}
            value={value.genre}
            options={genreOptions.map((item) => ({ label: item, value: item }))}
            onChange={(event) => onChange((prev) => ({ ...prev, genre: event.target.value }))}
          />
          <SelectField
            label="Tone"
            icon={<Sparkles className="size-4" />}
            value={value.tone}
            options={toneOptions.map((item) => ({ label: item, value: item }))}
            onChange={(event) => onChange((prev) => ({ ...prev, tone: event.target.value }))}
          />
          <SelectField
            label="Audience"
            icon={<Target className="size-4" />}
            value={value.audience}
            options={audienceOptions.map((item) => ({ label: item, value: item }))}
            onChange={(event) => onChange((prev) => ({ ...prev, audience: event.target.value }))}
          />
          <SelectField
            label="Length"
            icon={<BookOpenText className="size-4" />}
            value={value.length}
            options={lengthOptions.map((item) => ({ label: item.label, value: item.value }))}
            onChange={(event) => onChange((prev) => ({ ...prev, length: event.target.value as StoryOptions['length'] }))}
          />
          <SelectField
            label="Point of View"
            icon={<Eye className="size-4" />}
            value={value.pointOfView}
            options={pointOfViewOptions.map((item) => ({ label: item, value: item }))}
            onChange={(event) => onChange((prev) => ({ ...prev, pointOfView: event.target.value }))}
          />
        </div>

        <TextAreaField
          label="Premise"
          icon={<Languages className="size-4" />}
          hint="One or two sentences are enough"
          value={value.premise}
          onChange={(event) => onChange((prev) => ({ ...prev, premise: event.target.value }))}
        />

        <div className="flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">
            <input
              type="checkbox"
              checked={value.includeTwist}
              className="accent-indigo-400"
              onChange={(event) =>
                onChange((prev) => ({ ...prev, includeTwist: event.target.checked }))
              }
            />
            Include plot twist
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">
            <input
              type="checkbox"
              checked={value.includeDialogue}
              className="accent-indigo-400"
              onChange={(event) =>
                onChange((prev) => ({ ...prev, includeDialogue: event.target.checked }))
              }
            />
            Include dialogue
          </label>
        </div>

        <div className="flex justify-start">
          <Button onClick={onGenerate} disabled={isGenerating || !value.title.trim() || !value.premise.trim()}>
            {isGenerating ? 'ASI-1 is generating...' : 'Generate with ASI-1'}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
