# RAG (Retrieval Augmented Generation) Setup Guide

## 🎯 What is This?

This system allows your "Ask the Manual" AI assistant to **always use the latest version of your Ethics Manual** by:

1. Storing your manual in a **vector database** (Supabase with pgvector)
2. **Searching** for relevant sections when someone asks a question
3. **Including** those sections in the AI's context for accurate answers

This means: **Update your manual once → AI uses it immediately!**

---

## 📋 Prerequisites

✅ OpenAI API key (already configured)
✅ Supabase project (already set up)
✅ Node.js installed

---

## 🚀 Setup Instructions

### Step 1: Enable pgvector in Supabase

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Copy the contents of `supabase/migrations/20251210_create_vector_store.sql`
5. Paste and **Run** the SQL script
6. You should see: "Success. No rows returned"

This creates the `manual_embeddings` table and search function.

### Step 2: Export Your Manual

Since Canva doesn't allow direct access, you'll need to export your manual:

**Option A: Copy as Text (Quick)**
1. Open your Canva document
2. Select all text (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)
4. Paste into a new file: `ethics-manual.txt`
5. Save in your project root folder

**Option B: Export as PDF (Recommended for formatting)**
1. In Canva, click **Share** → **Download**
2. Choose **PDF** format
3. Download to your project root
4. Save as `ethics-manual.pdf`

*Note: For now, use Option A (text). PDF support coming soon!*

### Step 3: Upload Your Manual

Run this command in your terminal:

```bash
npm run update-manual ethics-manual.txt
```

This will:
- Clear old content
- Split your manual into chunks
- Generate AI embeddings
- Store everything in Supabase

**Expected output:**
```
🚀 Starting manual update process...
📖 Reading manual from: ethics-manual.txt
✅ Read 45000 characters from manual
🗑️  Clearing existing embeddings...
✅ Existing embeddings cleared
⚙️  Processing and storing manual chunks...
Processed 10/45 chunks
Processed 20/45 chunks
...
✅ Successfully processed 45 chunks!
🎉 Manual update complete!
```

### Step 4: Test It

1. Start your dev server: `npm run dev`
2. Open http://localhost:8081
3. Click "Ask The Manual"
4. Ask a question from your manual
5. Check the browser console - you should see: `RAG: Retrieved X relevant chunks`

---

## 🔄 Updating Your Manual

Whenever you update your Canva document:

1. Export the new version as text/PDF
2. Run: `npm run update-manual ethics-manual.txt`
3. Done! The AI now uses the latest version

**No code changes needed!**

---

## ⚙️ Configuration

In `services/openaiService.ts`, you can adjust:

```typescript
const USE_RAG = true; // Enable/disable RAG
const RAG_MATCH_COUNT = 5; // How many relevant chunks to retrieve
const RAG_SIMILARITY_THRESHOLD = 0.7; // Minimum relevance score (0.0 - 1.0)
```

---

## 🎯 How It Works

### When Someone Asks a Question:

1. **Query arrives**: "What are the core values?"
2. **Embedding created**: Convert question to vector
3. **Semantic search**: Find 5 most similar chunks in database
4. **Context building**: Add retrieved chunks to AI prompt
5. **Response generation**: OpenAI generates answer using latest manual content
6. **User sees**: Accurate, up-to-date answer

### Behind the Scenes:

```
User Question
    ↓
Generate Embedding (OpenAI)
    ↓
Search Vector DB (Supabase)
    ↓
Retrieve Relevant Sections
    ↓
Build Enhanced Context
    ↓
Generate Response (GPT-4o)
    ↓
Return to User
```

---

## 📊 Database Schema

### Table: `manual_embeddings`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `content` | TEXT | Manual text chunk |
| `embedding` | vector(1536) | OpenAI embedding |
| `metadata` | JSONB | Section, page, title, etc. |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## 🐛 Troubleshooting

### "No relevant chunks found"
**Cause**: Vector database is empty
**Fix**: Run `npm run update-manual ethics-manual.txt`

### "API Key is missing"
**Cause**: OpenAI key not set
**Fix**: Check `.env.local` has `VITE_OPENAI_API_KEY=your_key`

### "Error storing embedding"
**Cause**: Supabase migration not run
**Fix**: Run the SQL migration in Supabase dashboard

### "Module not found" errors
**Cause**: Dependencies not installed
**Fix**: Run `npm install`

---

## 💡 Pro Tips

1. **Update regularly**: Keep your AI synchronized with manual changes
2. **Test after updates**: Ask sample questions to verify accuracy
3. **Check console logs**: See which chunks are being retrieved
4. **Adjust threshold**: Lower = more results, Higher = more precise
5. **Monitor costs**: OpenAI embeddings cost ~$0.0001 per 1000 tokens

---

## 🔐 Security Notes

- ✅ **Public read access**: Anyone can query the manual (intended for your public website)
- ✅ **Authenticated write**: Only authenticated Supabase users can update embeddings
- ✅ **Row Level Security (RLS)**: Enabled with proper policies
- ✅ **API keys**: Stored securely in `.env.local` (not committed to git)

---

## 📈 Future Enhancements

- [ ] Direct PDF parsing support
- [ ] Automatic Canva API integration (if available)
- [ ] Scheduled auto-updates
- [ ] Version history tracking
- [ ] A/B testing different prompts
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 📞 Need Help?

If you run into issues:

1. Check the console for error messages
2. Verify Supabase migration was successful
3. Confirm API keys are set correctly
4. Test with a small text file first

---

## 🎉 You're All Set!

Your AI assistant now has a living connection to your Ethics Manual. Every time you update the manual and run the update script, your AI instantly knows the latest information.

**Happy chatting! 🤖✨**
