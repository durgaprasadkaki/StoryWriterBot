import type { StoryOptions } from '../model/types'

const lengthParagraphs: Record<StoryOptions['length'], number> = {
  short: 3,
  medium: 5,
  long: 7,
}

const conflictSeeds = [
  'a promise made years ago starts to break',
  'a map rewrites itself whenever moonlight appears',
  'an ally withholds the one truth that matters',
  'the city clock begins to run backward',
]

function pickByHash(input: string, values: string[]) {
  const hash = Array.from(input).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return values[hash % values.length]
}

export function composeStory(options: StoryOptions) {
  const paragraphs = lengthParagraphs[options.length]
  const seed = `${options.title}|${options.premise}|${options.genre}|${options.tone}`
  const conflict = pickByHash(seed, conflictSeeds)

  const opening = `${options.title} was spoken about in whispers across the ${options.genre.toLowerCase()} lanes of the old quarter. ${options.premise} Everyone believed the mystery was harmless, until ${conflict}.`

  const body = [
    `The narration moved in a ${options.tone.toLowerCase()} rhythm, and every decision carried weight for ${options.audience.toLowerCase()} readers.`,
    options.includeDialogue
      ? `"If the lanterns go dark tonight, we lose more than light," the mentor warned, but the protagonist stepped forward anyway.`
      : `No one spoke aloud, yet the silence was clearer than any warning bell.`,
    `Told through ${options.pointOfView.toLowerCase()}, each scene revealed how fear and courage can share the same heartbeat.`,
    options.includeTwist
      ? `Then came the twist: the messages were not from the past but from futures that would vanish if ignored.`
      : `Instead of a dramatic reversal, the story leaned into slow realization and emotional payoff.`,
    `By dawn, the protagonist lit the final lantern and learned that hope is not found—it is built, choice by choice.`,
    `The city changed quietly afterward: fewer secrets, kinder streets, and one keeper who now taught others to read the light.`,
  ]

  return [opening, ...body].slice(0, paragraphs).join('\n\n')
}

export async function generateStory(options: StoryOptions) {
  await new Promise((resolve) => setTimeout(resolve, 550))
  return composeStory(options)
}
