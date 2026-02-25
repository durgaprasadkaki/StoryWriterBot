import { useState } from 'react'
import { Copy, Download, LoaderCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'

interface StoryPreviewProps {
  content: string
  isGenerating: boolean
}

export function StoryPreview({ content, isGenerating }: StoryPreviewProps) {
  const [isCopied, setIsCopied] = useState(false)

  async function copyToClipboard() {
    await navigator.clipboard.writeText(content)
    setIsCopied(true)
    window.setTimeout(() => setIsCopied(false), 1200)
  }

  async function downloadAsPdf() {
    if (!content.trim()) return
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const wrapped = pdf.splitTextToSize(content, 520)
    pdf.setFont('times', 'normal')
    pdf.setFontSize(12)
    pdf.text(wrapped, 40, 50)
    pdf.save('storywriterbot-draft.pdf')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card
      title="Generated Draft"
      subtitle="Modern editor preview with export actions."
      >
      {isGenerating ? (
        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-slate-200" role="status" aria-live="polite">
          <LoaderCircle className="size-4 animate-spin text-indigo-300" />
          <p className="m-0 text-sm">AI writer is generating your draft...</p>
        </div>
      ) : content ? (
        <>
          <pre className="custom-scrollbar max-h-[470px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm leading-7 text-slate-100">
            {content}
          </pre>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={copyToClipboard}>
              <Copy className="size-4" />
              {isCopied ? 'Copied!' : 'Copy Story'}
            </Button>
            <Button variant="primary" onClick={downloadAsPdf}>
              <Download className="size-4" />
              Download PDF
            </Button>
          </div>
        </>
      ) : (
        <p className="m-0 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-5 text-sm text-slate-300">Your story draft will appear here after generation.</p>
      )}
      </Card>
    </motion.div>
  )
}
