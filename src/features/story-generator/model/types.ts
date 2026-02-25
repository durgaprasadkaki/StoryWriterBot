export interface StoryOptions {
  title: string
  premise: string
  genre: string
  tone: string
  audience: string
  length: 'short' | 'medium' | 'long'
  pointOfView: string
  includeTwist: boolean
  includeDialogue: boolean
}

export interface StoryHistoryItem {
  id: string
  createdAt: string
  options: StoryOptions
  content: string
  snippet: string
}
