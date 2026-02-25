/**
 * Backend API proxy for ASI-1
 * This acts as a CORS-friendly bridge between frontend and ASI-1 API
 * Run with: npm run dev:backend
 */

import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Load environment variables
dotenv.config({ path: './backend/.env' })

const app = express()
app.use(express.json())
app.use(cors())

const ASI1_API_KEY = process.env.ASI1_API_KEY || ''
const ASI1_BASE_URL = process.env.ASI1_BASE_URL || 'https://api.asimodel.com/v1'
const MONGODB_URI = process.env.MONGODB_URI || ''

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    options: {
      type: Object,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    snippet: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

storySchema.index({ userId: 1, createdAt: -1 })

const Story = mongoose.models.Story || mongoose.model('Story', storySchema)

function isMongoConnected() {
  return mongoose.connection.readyState === 1
}

async function connectMongo() {
  if (!MONGODB_URI) {
    console.log('⚠️ MONGODB_URI not configured. Story history APIs will be disabled.')
    return
  }

  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
  }
}

function requireUserId(req, res) {
  const raw = req.query.userId ?? req.body?.userId
  const userId = typeof raw === 'string' ? raw.trim() : ''

  if (!userId) {
    res.status(400).json({ error: 'userId is required' })
    return null
  }

  return userId
}

function toStoryResponse(doc) {
  return {
    id: String(doc._id),
    createdAt: doc.createdAt,
    options: doc.options,
    content: doc.content,
    snippet: doc.snippet,
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: isMongoConnected() ? 'connected' : 'disconnected',
  })
})

app.get('/api/stories', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'MongoDB is not connected' })
    }

    const userId = requireUserId(req, res)
    if (!userId) return

    const stories = await Story.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return res.json({ stories: stories.map(toStoryResponse) })
  } catch (error) {
    console.error('🚨 Failed to fetch stories:', error)
    return res.status(500).json({
      error: 'Failed to fetch stories',
      details: error instanceof Error ? error.message : String(error),
    })
  }
})

app.post('/api/stories', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'MongoDB is not connected' })
    }

    const userId = requireUserId(req, res)
    if (!userId) return

    const { options, content, snippet } = req.body ?? {}
    if (!options || typeof content !== 'string' || typeof snippet !== 'string') {
      return res.status(400).json({
        error: 'options, content, and snippet are required',
      })
    }

    const created = await Story.create({
      userId,
      options,
      content,
      snippet,
    })

    return res.status(201).json({ story: toStoryResponse(created) })
  } catch (error) {
    console.error('🚨 Failed to save story:', error)
    return res.status(500).json({
      error: 'Failed to save story',
      details: error instanceof Error ? error.message : String(error),
    })
  }
})

app.delete('/api/stories/:id', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'MongoDB is not connected' })
    }

    const userId = requireUserId(req, res)
    if (!userId) return

    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'id is required' })
    }

    const deleted = await Story.findOneAndDelete({ _id: id, userId })
    if (!deleted) {
      return res.status(404).json({ error: 'Story not found' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('🚨 Failed to delete story:', error)
    return res.status(500).json({
      error: 'Failed to delete story',
      details: error instanceof Error ? error.message : String(error),
    })
  }
})

app.delete('/api/stories', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'MongoDB is not connected' })
    }

    const userId = requireUserId(req, res)
    if (!userId) return

    await Story.deleteMany({ userId })
    return res.status(204).send()
  } catch (error) {
    console.error('🚨 Failed to clear stories:', error)
    return res.status(500).json({
      error: 'Failed to clear stories',
      details: error instanceof Error ? error.message : String(error),
    })
  }
})

// Story generation endpoint
app.post('/api/stories/generate', async (req, res) => {
  try {
    const { prompt, genre, tone, length, themes } = req.body

    if (!ASI1_API_KEY) {
      return res.status(400).json({
        error: 'ASI1_API_KEY not configured on backend'
      })
    }

    console.log(`📝 Generating story: "${prompt}" (${genre}/${tone}/${length})`)

    const response = await fetch(`${ASI1_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ASI1_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'asi1',
        messages: [
          {
            role: 'system',
            content: `You are a creative story writer. Generate a ${length} story in ${genre} genre with a ${tone} tone.${themes ? ` Include these themes: ${themes.join(', ')}` : ''} Format: Start with a compelling title on the first line, then the story.`,
          },
          {
            role: 'user',
            content: `Story prompt: ${prompt}`,
          },
        ],
        temperature: 0.85,
        max_tokens: length === 'short' ? 500 : length === 'medium' ? 1500 : 3000,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ ASI-1 API error (${response.status}):`, errorText)
      return res.status(response.status).json({
        error: `ASI-1 API error: ${response.status}`,
        details: errorText,
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    const lines = content.split('\n')
    const title = lines[0]?.replace(/^#+\s*/, '') || 'Untitled Story'
    const story = lines.slice(1).join('\n').trim()

    console.log(`✅ Story generated: "${title}"`)

    res.json({
      story,
      title,
      metadata: {
        tokens: content.length / 4,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('🚨 Story generation error:', error)
    res.status(500).json({
      error: 'Failed to generate story',
      details: error instanceof Error ? error.message : String(error),
    })
  }
})

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!ASI1_API_KEY) {
      return res.status(400).json({
        error: 'ASI1_API_KEY not configured on backend',
      })
    }

    console.log(`💬 Chat request with ${messages.length} messages`)

    const response = await fetch(`${ASI1_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ASI1_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'asi1',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful story writing assistant. Help users refine, expand, or modify their stories. Be creative and supportive.',
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 800,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Chat API error (${response.status}):`, errorText)
      return res.status(response.status).json({
        error: `ASI-1 API error: ${response.status}`,
        details: errorText,
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || 'No response received'

    console.log(`✅ Chat response generated`)

    res.json({ content })
  } catch (error) {
    console.error('🚨 Chat error:', error)
    res.status(500).json({
      error: 'Failed to process chat',
      details: error instanceof Error ? error.message : String(error),
    })
  }
})

const PORT = process.env.PORT || 3001
connectMongo().finally(() => {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 ASI-1 Proxy Server running on http://localhost:${PORT}`)
    console.log(`📝 API Key configured: ${ASI1_API_KEY ? 'Yes' : 'No'}`)
    console.log(`🔗 ASI-1 Base URL: ${ASI1_BASE_URL}`)
    console.log(`🗄️ MongoDB connected: ${isMongoConnected() ? 'Yes' : 'No'}\n`)
  })

  server.on('error', (error) => {
    if (error && error.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${PORT} is already in use. Reusing existing backend process.`)
      process.exit(0)
    }

    console.error('🚨 Backend server startup error:', error)
    process.exit(1)
  })
})
