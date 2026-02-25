# StoryWriterBot with ASI-1 API Integration

**Advanced AI-powered story generation and interactive refinement interface.**

## 🚀 Features

### ASI-1 Powered Features
- **Advanced Story Generation**: Generate premium stories using ASI-1 AI with customizable parameters
  - Multiple genres: Fantasy, Sci-Fi, Romance, Mystery, Poetry, etc.
  - Tone control: Adventurous, Mysterious, Romantic, Suspenseful, Lyrical
  - Length options: Short (500 tokens), Medium (1500 tokens), Long (3000 tokens)
  - Theme injection: Include plot twists, dialogue, and more

- **Interactive Chat Assistant**: Real-time story refinement and expansion
  - Ask the AI to modify, expand, or enhance your story
  - Conversational interface with full chat history
  - ASI-1 context awareness of your story content

### User Management
- User authentication with signup/login
- Per-user story history (up to 50 stories)
- Persistent storage of all creations

### Export & Sharing
- Download stories as PDF
- Copy stories to clipboard
- Story history with one-click restoration

## 🎯 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- ASI-1 API key (free tier available)

### Installation

1. **Clone or extract the project**
```bash
cd StoryWriterBot
npm install
```

2. **Get your ASI-1 API key**
   - Visit: https://asi-1.com/chatbot
   - Or chat with the ASI-1 bot at: https://chatbot.asi-1.com
   - Request free API key through the chatbot
   - Generate your API key from the ASI-1 dashboard

3. **Configure environment**
```bash
# Copy the backend example
cp backend/.env.example backend/.env

# Edit backend/.env and add your keys
ASI1_API_KEY=your_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

4. **Start development server**
```bash
npm run dev
# Opens at http://localhost:5173
```

This command starts both the frontend and the backend ASI-1 proxy (`http://localhost:3001`) used by `/api/stories/generate`.

5. **Build for production**
```bash
npm run build
npm run preview
```

## 📖 Usage

### Generate a Story
1. **Go to Story Controls** on the workspace
2. **Fill in details**:
   - Story Title: Required
   - Genre: Choose from 5+ genres
   - Tone: Select writing tone
   - Audience: Target demographic
   - Length: Story length preference
   - Premise: Your story setup (1-2 sentences)
   - Optional: Include plot twist, dialogue

3. **Click "Generate with ASI-1"**
   - Wait for ASI-1 to process (typically 5-30 seconds depending on length)
   - Story appears in the preview panel

### Refine Your Story
1. **Click "Refine with AI"** button in the hero section (only visible after generating)
2. **Chat interface opens** on the right side
3. **Ask the AI to**:
   - "Make it more dramatic"
   - "Add more dialogue"
   - "Shorten this part"
   - "Add a twist ending"
   - Any creative direction!

4. **Copy or Download**
   - Use "Copy" button to copy to clipboard
   - Use "Download" button to save as PDF

### Manage History
- View all your previously generated stories
- Click any story to restore it
- Delete individual stories or clear entire history
- History is per-user and persists across sessions

## 🔧 Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vite** for bundling

### ASI-1 Integration
```
StoryWorkspace (Main Container)
├── StoryForm (Input controls)
│   └── Uses ASI-1 API in useStoryGenerator hook
├── StoryPreview (Output display)
│   └── Shows generated story with export options
├── StoryHistory (Story management)
│   └── Restore/delete previous stories
└── ChatInterface (Interactive refinement)
    └── Communicates with ASI-1 for chat-based refinement
```

### Key Services
- **`asi1Service.ts`**: Core ASI-1 API wrapper with rate limiting
  - `generateStory()`: Generate stories with advanced prompting
  - `sendChatMessage()`: Interactive chat for refinement
  - Built-in queueing for free tier rate limits (1 req/sec)

### Storage
- **MongoDB**: Per-user story history persisted through backend APIs
- **localStorage**: Fallback cache for offline/temporary backend issues
- **URL params**: Not used (could be added for sharing)

## 📊 Free Tier Optimization

### Rate Limiting
- Automatic request queueing (1 request per second)
- Prevents hitting free tier rate limits
- Built-in retry logic

### Token Management
- Track tokens used per generation
- Displayed in story history
- Plan future improvements based on usage

### Fallback Handling
- Graceful error messages when API is unavailable
- Cached story history available offline

## 🔐 Security Notes

⚠️ **Demo-Only Features**:
- Plaintext passwords (use hashed passwords in production)
- localStorage for authentication (use JWT tokens in production)
- Client-side API key in .env (rotate keys, use backend proxy in production)

## 🤝 Contributing

To improve the ASI-1 integration:
1. Test with different story parameters
2. Report API issues or limitations
3. Suggest new features or prompting strategies

## 📞 Support

- **ASI-1 Help**: Visit https://asi-1.com/chatbot
- **Issue with API key**: Chat with the ASI-1 bot directly
- **App bugs**: Check console for error messages

## 📄 License

Built for ASI-1 hackathon challenges - free to use and modify.

---

**Built with ASI-1 API** 🚀 | Advanced Story Generation Interface
