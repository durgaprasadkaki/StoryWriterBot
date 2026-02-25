import { generateStoryFromApi } from '@/shared/api/storyApi'
import type { StoryOptions } from '../model/types'
import { generateStory as generateStoryLocally } from './storyComposer'

export type StoryProvider = 'local' | 'api'

export interface StoryGenerationResult {
  content: string
  provider: StoryProvider
}

export async function generateStoryDraft(
  options: StoryOptions,
  provider: StoryProvider,
): Promise<StoryGenerationResult> {
  if (provider === 'api') {
    const apiResult = await generateStoryFromApi(options)
    return { content: apiResult.content, provider: 'api' }
  }

  const content = await generateStoryLocally(options)
  return { content, provider: 'local' }
}
