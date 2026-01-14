# Quick Start: AI Features

## 🚀 Get Started in 3 Steps

### Step 1: Add OpenAI API Key
Add to your `.env` file:
```env
VITE_OPENAI_API_KEY=sk-your-key-here
```

### Step 2: Run Database Schema
1. Open Supabase SQL Editor
2. Run `supabase-ai-schema.sql`
3. Done! ✅

### Step 3: Start the App
```bash
npm run dev
```

## 🎯 Where to Find Each Feature

### 1. Mood Recommendations ✨
- **Screen**: Home
- **Location**: Below mood selector
- **How to use**: Select any mood → See AI recommendations

### 2. AI Café Ranking 🏆
- **Screen**: Weekly Ranking
- **Location**: Top of ranking section
- **How to use**: Change filters → See AI-powered rankings

### 3. Review Summary 📊
- **Screen**: Café Detail
- **Location**: Below café banner
- **How to use**: View any café → See AI review summary

## 💡 Tips

- **No API key?** Features still work with fallback logic
- **Slow responses?** Normal - AI takes 2-5 seconds
- **Want to customize?** Edit prompts in `src/lib/ai.ts`

## 📚 Full Documentation

See `AI_FEATURES_SETUP.md` for detailed setup instructions.

