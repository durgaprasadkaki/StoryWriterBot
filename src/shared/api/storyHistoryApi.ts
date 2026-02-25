import type { StoryHistoryItem, StoryOptions } from '@/features/story-generator/model/types'

interface StoryListResponse {
  stories: StoryHistoryItem[]
}

interface StoryCreateResponse {
  story: StoryHistoryItem
}

function getBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_ASI1_PROXY_URL?.trim()
  return configuredBaseUrl ? configuredBaseUrl.replace(/\/$/, '') : ''
}

function getEndpoint(path: string) {
  return `${getBaseUrl()}${path}`
}

export async function fetchStoryHistory(userId: string): Promise<StoryHistoryItem[]> {
  const response = await fetch(getEndpoint(`/api/stories?userId=${encodeURIComponent(userId)}`))

  if (!response.ok) {
    throw new Error(`Failed to fetch story history: ${response.status}`)
  }

  const data = (await response.json()) as StoryListResponse
  return Array.isArray(data.stories) ? data.stories : []
}

export async function saveStoryHistoryItem(input: {
  userId: string
  options: StoryOptions
  content: string
  snippet: string
}): Promise<StoryHistoryItem> {
  const response = await fetch(getEndpoint('/api/stories'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to save story history: ${response.status}`)
  }

  const data = (await response.json()) as StoryCreateResponse
  if (!data.story) {
    throw new Error('Invalid story save response')
  }

  return data.story
}

export async function deleteStoryHistoryItem(userId: string, id: string): Promise<void> {
  const response = await fetch(
    getEndpoint(`/api/stories/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`),
    {
      method: 'DELETE',
    },
  )

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete story history item: ${response.status}`)
  }
}

export async function clearStoryHistory(userId: string): Promise<void> {
  const response = await fetch(getEndpoint(`/api/stories?userId=${encodeURIComponent(userId)}`), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to clear story history: ${response.status}`)
  }
}
