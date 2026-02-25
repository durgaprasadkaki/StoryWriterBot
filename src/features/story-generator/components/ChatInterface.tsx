import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { asi1Service, type ASI1Message } from '@/shared/services/asi1Service'

interface ChatMessage extends ASI1Message {
  id: string
  timestamp: number
}

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  storyContent?: string
}

export function ChatInterface({
  isOpen,
  onClose,
  storyContent,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize chat with story context if available
  useEffect(() => {
    if (isOpen && messages.length === 0 && storyContent) {
      const initialMessage: ChatMessage = {
        id: '0',
        role: 'assistant',
        content: `I'm your story writing assistant! I can help you refine, expand, or modify your story. Here's what we're working with:\n\n${storyContent.substring(0, 200)}...\n\nWhat would you like to do next?`,
        timestamp: Date.now(),
      }
      setMessages([initialMessage])
    }
  }, [isOpen])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setError('')
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await asi1Service.sendChatMessage(
        input,
        conversationHistory
      )

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send message'
      )
      // Remove the failed user message
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50 w-96 max-h-screen flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Story Writing Assistant (ASI-1)
            </h3>
            <button
              onClick={onClose}
              className="rounded p-1 hover:bg-white/10 transition"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 p-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                        : 'bg-white/10 text-slate-100 border border-white/20'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="rounded-lg bg-white/10 px-3 py-2">
                    <Loader className="size-4 animate-spin text-indigo-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-200"
            >
              {error}
            </motion.div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-white/10 p-3 space-y-2"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your story..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              💡 Ask me to refine, expand, or modify your story
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
