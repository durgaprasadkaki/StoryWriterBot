/**
 * ASI-1 API Service Layer
 * Handles all interactions with ASI-1 API for story generation and chat
 * Free tier optimized: batching requests, caching responses
 */

export interface ASI1Message {
  role: 'user' | 'assistant'
  content: string
}

export interface StoryGenerationRequest {
  prompt: string
  genre: string
  tone: string
  length: 'short' | 'medium' | 'long'
  themes?: string[]
}

export interface StoryGenerationResponse {
  story: string
  title?: string
  metadata?: Record<string, unknown>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

class ASI1Service {
  private baseURL: string
  private requestQueue: Array<() => Promise<unknown>> = []
  private isProcessing = false
  private rateLimitDelay = 1000 // Free tier: 1 req/sec
  private requestTimeoutMs = 20000
  private maxRetries = 1

  constructor() {
    const configuredBaseUrl = import.meta.env.VITE_ASI1_PROXY_URL?.trim()
    this.baseURL = configuredBaseUrl ? configuredBaseUrl.replace(/\/$/, '') : ''
    console.log('ASI-1 Service initialized')
    console.log('Backend Proxy URL:', this.baseURL || '(same-origin /api)')
  }

  /**
   * Queue API requests to respect free tier rate limits
   */
  private async queueRequest<T>(
    fn: () => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  /**
   * Process queued requests with rate limiting
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return

    this.isProcessing = true
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        try {
          await request()
        } catch (error) {
          console.error('Request failed:', error)
        }
        // Rate limit delay between requests
        await new Promise((resolve) =>
          setTimeout(resolve, this.rateLimitDelay)
        )
      }
    }
    this.isProcessing = false
  }

  /**
   * Make authenticated API call through backend proxy
   */
  private async call<T>(
    endpoint: string,
    method: string = 'POST',
    body?: unknown
  ): Promise<T> {
    const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint
    console.log('🔄 API Call:', method, url)

    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), this.requestTimeoutMs)

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        })

        console.log('📊 Response Status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ API Error Response:', errorText)
          const errorData = errorText ? (() => { try { return JSON.parse(errorText) } catch { return {} } })() : {}
          throw new Error(
            `API Error: ${response.status} - ${(errorData as any).error || response.statusText}`
          )
        }

        const data = await response.json()
        console.log('✅ API Response received')
        return data as T
      } catch (error) {
        const isNetworkError = error instanceof TypeError || error instanceof DOMException
        const canRetry = isNetworkError && attempt < this.maxRetries

        console.error('🚨 Fetch Error:', error)

        if (canRetry) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          continue
        }

        if (isNetworkError) {
          throw new Error(
            'Unable to reach the AI backend. Start it with "npm run dev:backend" (or "npm run dev:full") and try again.'
          )
        }

        throw error
      } finally {
        window.clearTimeout(timeout)
      }
    }

    throw new Error('Unexpected request failure')
  }

  /**
   * Generate a story using ASI-1 through backend proxy
   */
  async generateStory(
    request: StoryGenerationRequest
  ): Promise<StoryGenerationResponse> {
    return this.queueRequest(async () => {
      try {
        const response = await this.call<StoryGenerationResponse>(
          '/api/stories/generate',
          'POST',
          {
            prompt: request.prompt,
            genre: request.genre,
            tone: request.tone,
            length: request.length,
            themes: request.themes,
          }
        )

        return response
      } catch (error) {
        console.error('Story generation failed:', error)
        throw error
      }
    })
  }

  /**
   * Chat with ASI-1 through backend proxy
   */
  async sendChatMessage(
    userMessage: string,
    conversationHistory: ASI1Message[]
  ): Promise<string> {
    return this.queueRequest(async () => {
      try {
        const messages: Array<{ role: string; content: string }> = [
          ...conversationHistory,
          { role: 'user', content: userMessage },
        ]

        const response = await this.call<{ content: string }>(
          '/api/chat',
          'POST',
          {
            messages: messages,
          }
        )

        return response.content || 'No response received'
      } catch (error) {
        console.error('Chat message failed:', error)
        throw error
      }
    })
  }

  /**
   * Get available story genres and templates
   */
  async getStoryTemplates(): Promise<
    Array<{
      id: string
      name: string
      prompt: string
      suggestedTone: string
    }>
  > {
    // Mock data for free tier - no API call
    return [
      {
        id: 'fantasy-quest',
        name: 'Fantasy Quest',
        prompt:
          'A hero embarks on an epic journey to save their kingdom...',
        suggestedTone: 'adventurous',
      },
      {
        id: 'sci-fi-future',
        name: 'Sci-Fi Future',
        prompt:
          'In a distant future, a mysterious discovery changes everything...',
        suggestedTone: 'mysterious',
      },
      {
        id: 'romance-tale',
        name: 'Romance Tale',
        prompt:
          'Two souls meet under unexpected circumstances...',
        suggestedTone: 'romantic',
      },
      {
        id: 'mystery-thriller',
        name: 'Mystery Thriller',
        prompt:
          'A detective arrives at a crime scene with no clear suspects...',
        suggestedTone: 'suspenseful',
      },
      {
        id: 'short-poetry',
        name: 'Poetry Collection',
        prompt:
          'Create a series of interconnected poems about...',
        suggestedTone: 'lyrical',
      },
    ]
  }

  /**
   * Check API health and connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`)
      return response.ok
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const asi1Service = new ASI1Service()
