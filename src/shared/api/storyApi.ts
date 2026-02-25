import type { StoryOptions } from '@/features/story-generator/model/types'

export interface GenerateStoryRequest {
  options: StoryOptions
}

export interface GenerateStoryResponse {
  content: string
  provider: 'api'
}

export async function generateStoryFromApi(options: StoryOptions): Promise<GenerateStoryResponse> {
  const baseUrl = import.meta.env.VITE_STORYWRITER_API_URL

  if (!baseUrl) {
    throw new Error('API URL is not configured. Set VITE_STORYWRITER_API_URL in your .env file.')
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/story/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ options } satisfies GenerateStoryRequest),
  })

  if (!response.ok) {
    throw new Error(`Story API failed with status ${response.status}`)
  }

  const data = (await response.json()) as GenerateStoryResponse
  if (!data?.content) {
    throw new Error('Story API returned an invalid response payload.')
  }

  return data
}
