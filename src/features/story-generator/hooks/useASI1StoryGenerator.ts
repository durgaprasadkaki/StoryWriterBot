import { useState, useCallback } from 'react'
import {
  asi1Service,
  type StoryGenerationRequest,
  type StoryGenerationResponse,
} from '@/shared/services/asi1Service'

interface UseASI1StoryGeneratorReturn {
  generateStory: (request: StoryGenerationRequest) => Promise<void>
  story: string
  isGenerating: boolean
  error: string
  title: string
  estimatedTokens: number
}

/**
 * Hook for ASI-1 powered story generation
 * Integrates with localStorage for history
 */
export function useASI1StoryGenerator(
  userId: string
): UseASI1StoryGeneratorReturn {
  const [story, setStory] = useState('')
  const [title, setTitle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [estimatedTokens, setEstimatedTokens] = useState(0)

  const generateStory = useCallback(
    async (request: StoryGenerationRequest) => {
      setIsGenerating(true)
      setError('')
      setStory('')
      setTitle('')

      try {
        const response: StoryGenerationResponse =
          await asi1Service.generateStory(request)

        setStory(response.story)
        setTitle(response.title || 'Untitled Story')
        setEstimatedTokens(
          (response.metadata?.tokens as number) || 0
        )

        // Save to user's history
        saveToHistory(
          userId,
          request,
          response
        )
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate story'
        setError(errorMessage)
        console.error('Story generation error:', err)
      } finally {
        setIsGenerating(false)
      }
    },
    [userId]
  )

  return {
    generateStory,
    story,
    isGenerating,
    error,
    title,
    estimatedTokens,
  }
}

/**
 * Save generated story to user's localStorage history
 */
function saveToHistory(
  userId: string,
  request: StoryGenerationRequest,
  response: StoryGenerationResponse
): void {
  try {
    const historyKey = `storywriterbot.history.v1.${userId}`
    const existingHistory = JSON.parse(
      localStorage.getItem(historyKey) || '[]'
    )

    const newEntry = {
      id: Date.now().toString(),
      title: response.title || request.prompt.substring(0, 50),
      story: response.story,
      prompt: request.prompt,
      genre: request.genre,
      tone: request.tone,
      themes: request.themes || [],
      generatedAt: new Date().toISOString(),
      source: 'asi-1',
      tokenCost: response.metadata?.tokens || 0,
    }

    const updatedHistory = [newEntry, ...existingHistory].slice(0, 50) // Keep last 50
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory))
  } catch (err) {
    console.error('Failed to save story to history:', err)
  }
}
