import { useEffect, useMemo, useState } from 'react'
import { storyHistoryKeyForUser } from '@/shared/constants/storageKeys'
import { loadFromStorage, saveToStorage } from '@/shared/lib/storage'
import {
  clearStoryHistory,
  deleteStoryHistoryItem,
  fetchStoryHistory,
  saveStoryHistoryItem,
} from '@/shared/api/storyHistoryApi'
import { defaultStoryOptions } from '../model/constants'
import type { StoryHistoryItem, StoryOptions } from '../model/types'
import { asi1Service, type StoryGenerationRequest } from '@/shared/services/asi1Service'
import { generateStory as generateStoryLocally } from '../services/storyComposer'

function toSnippet(content: string) {
  const condensed = content.replace(/\s+/g, ' ').trim()
  return condensed.length > 120 ? `${condensed.slice(0, 120)}...` : condensed
}

export function useStoryGenerator(userId: string) {
  const historyStorageKey = useMemo(() => storyHistoryKeyForUser(userId), [userId])
  const [options, setOptions] = useState<StoryOptions>(defaultStoryOptions)
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<StoryHistoryItem[]>(() =>
    loadFromStorage<StoryHistoryItem[]>(historyStorageKey, []),
  )

  useEffect(() => {
    const localHistory = loadFromStorage<StoryHistoryItem[]>(historyStorageKey, [])
    setHistory(localHistory)
    setContent('')
    setOptions(defaultStoryOptions)

    let cancelled = false

    async function syncHistoryFromBackend() {
      try {
        const remoteHistory = await fetchStoryHistory(userId)
        if (cancelled) return
        setHistory(remoteHistory)
        saveToStorage(historyStorageKey, remoteHistory)
      } catch {
        if (cancelled) return
        setHistory(localHistory)
      }
    }

    void syncHistoryFromBackend()

    return () => {
      cancelled = true
    }
  }, [historyStorageKey, userId])

  const hasStory = content.trim().length > 0

  const historyCountLabel = useMemo(() => `${history.length} saved draft${history.length === 1 ? '' : 's'}`, [history.length])

  async function onGenerate() {
    setIsGenerating(true)
    try {
      // Build ASI-1 story request
      const request: StoryGenerationRequest = {
        prompt: options.premise,
        genre: options.genre,
        tone: options.tone,
        length: options.length as 'short' | 'medium' | 'long',
        themes: options.includeTwist
          ? ['plot twist']
          : undefined,
      }

      // Generate story using ASI-1
      const response = await asi1Service.generateStory(request)
      
      const nextContent = response.story
      setContent(nextContent)

      const item: StoryHistoryItem = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        options,
        content: nextContent,
        snippet: toSnippet(nextContent),
      }
      const nextHistory = [item, ...history].slice(0, 15)
      setHistory(nextHistory)
      saveToStorage(historyStorageKey, nextHistory)

      try {
        const savedItem = await saveStoryHistoryItem({
          userId,
          options,
          content: nextContent,
          snippet: item.snippet,
        })
        const syncedHistory = [savedItem, ...nextHistory.filter((entry) => entry.id !== item.id)].slice(0, 15)
        setHistory(syncedHistory)
        saveToStorage(historyStorageKey, syncedHistory)
      } catch (persistError) {
        console.error('Failed to persist generated story to backend:', persistError)
      }
    } catch (error) {
      console.error('Story generation failed:', error)

      try {
        const fallbackStory = await generateStoryLocally(options)
        const fallbackNote = error instanceof Error
          ? `\n\n[Fallback mode] AI backend unavailable: ${error.message}`
          : '\n\n[Fallback mode] AI backend unavailable.'
        const nextContent = `${fallbackStory}${fallbackNote}`
        setContent(nextContent)

        const item: StoryHistoryItem = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          options,
          content: nextContent,
          snippet: toSnippet(nextContent),
        }
        const nextHistory = [item, ...history].slice(0, 15)
        setHistory(nextHistory)
        saveToStorage(historyStorageKey, nextHistory)

        try {
          const savedItem = await saveStoryHistoryItem({
            userId,
            options,
            content: nextContent,
            snippet: item.snippet,
          })
          const syncedHistory = [savedItem, ...nextHistory.filter((entry) => entry.id !== item.id)].slice(0, 15)
          setHistory(syncedHistory)
          saveToStorage(historyStorageKey, syncedHistory)
        } catch (persistError) {
          console.error('Failed to persist fallback story to backend:', persistError)
        }
      } catch (fallbackError) {
        setContent(
          `Error: Failed to generate story. ${fallbackError instanceof Error ? fallbackError.message : 'Please try again.'}`,
        )
      }
    } finally {
      setIsGenerating(false)
    }
  }

  function onLoadHistory(item: StoryHistoryItem) {
    setOptions(item.options)
    setContent(item.content)
  }

  function onClearHistory() {
    setHistory([])
    saveToStorage(historyStorageKey, [])
    void clearStoryHistory(userId).catch((clearError) => {
      console.error('Failed to clear backend story history:', clearError)
    })
  }

  function onDeleteHistoryItem(id: string) {
    const nextHistory = history.filter((item) => item.id !== id)
    setHistory(nextHistory)
    saveToStorage(historyStorageKey, nextHistory)
    void deleteStoryHistoryItem(userId, id).catch((deleteError) => {
      console.error('Failed to delete backend story history item:', deleteError)
    })
  }

  return {
    options,
    setOptions,
    content,
    isGenerating,
    hasStory,
    history,
    historyCountLabel,
    onGenerate,
    onLoadHistory,
    onClearHistory,
    onDeleteHistoryItem,
  }
}
