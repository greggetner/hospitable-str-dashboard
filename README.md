# Greg's Sedona Retreats — STR Intelligence Dashboard

AI-powered business intelligence for short-term rentals, built on the Hospitable MCP.
Ask questions in plain English, get live answers from your Hospitable account.

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
1. Create a new repo at github.com (name it `str-dashboard` or anything you like)
2. Upload this entire folder to it (drag & drop works on GitHub's web UI)

### Step 2 — Connect to Vercel
1. Go to vercel.com and sign in (free account)
2. Click **Add New Project**
3. Import your GitHub repo
4. Vercel will auto-detect Next.js — no build settings needed

### Step 3 — Add your API key
In the Vercel project settings, go to **Environment Variables** and add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (from console.anthropic.com) |

### Step 4 — Deploy
Click **Deploy**. Vercel builds and gives you a live URL like:
`https://str-dashboard-yourname.vercel.app`

That's your buildathon submission URL.

---

## Run locally

```bash
npm install
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
# Open http://localhost:3000
```

---

## How it works

- The React frontend (`app/page.jsx`) sends questions to `/api/ask`
- The API route (`app/api/ask/route.js`) calls the Anthropic API server-side with your key hidden
- Anthropic's Claude connects to the **Hospitable MCP server** (`mcp.hospitable.com/mcp`) to fetch your live property data
- The response (with optional chart JSON) is rendered back in the UI

Your API key never touches the browser. Safe to deploy publicly.

---

## Customizing

- Change property names in `app/api/ask/route.js` (the SYSTEM_PROMPT)
- Add/edit preset questions in `app/page.jsx` (the PRESETS array)
- Colors: search for `#C4622D` to find the terracotta accent color
