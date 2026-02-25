import type { StoryOptions } from './types'

export const genreOptions = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Romance',
  'Thriller',
  'Historical Fiction',
]

export const toneOptions = [
  'Hopeful',
  'Dark',
  'Whimsical',
  'Epic',
  'Suspenseful',
  'Heartwarming',
]

export const audienceOptions = ['Kids', 'Teens', 'Young Adults', 'Adults']

export const pointOfViewOptions = ['First Person', 'Third Person Limited', 'Third Person Omniscient']

export const lengthOptions: Array<{ label: string; value: StoryOptions['length'] }> = [
  { label: 'Short (~3 paragraphs)', value: 'short' },
  { label: 'Medium (~5 paragraphs)', value: 'medium' },
  { label: 'Long (~7 paragraphs)', value: 'long' },
]

export const defaultStoryOptions: StoryOptions = {
  title: 'The Last Lantern Keeper',
  premise:
    'An apprentice discovers that the city lights hide messages from forgotten travelers.',
  genre: genreOptions[0],
  tone: toneOptions[0],
  audience: audienceOptions[2],
  length: 'medium',
  pointOfView: pointOfViewOptions[1],
  includeTwist: true,
  includeDialogue: true,
}
