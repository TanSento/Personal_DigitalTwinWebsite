# Professional Website + Digital Twin Chat Tutorial

This tutorial explains, step by step, how this project was built and how each part works. It is written for complete beginners to frontend coding.

---

## 1) What Has Been Built

This is modern personal website built with Next.js that includes:

- A premium landing page with sections like About, Career Journey, Projects, and Credentials
- A "Digital Twin" chat box where visitors can ask questions about your background
- A backend API route that calls OpenRouter using the model `openai/gpt-oss-120b`
- Response cleanup logic so chat replies look like normal messages instead of janky markdown

---

## 2) Technology Summary (Beginner-Friendly)

### Next.js
Next.js is a React framework. It helps you build websites with:

- Pages and routing
- API endpoints (server code in the same project)
- Easy build and deployment workflows

This project uses the **App Router** (`app/` folder).

### React
React builds UI using components. A component is a reusable UI block.

Example:
- `DigitalTwinChat` is a component
- It has state (`messages`, `input`, `isLoading`)
- It updates the screen when state changes

### TypeScript
TypeScript is JavaScript with types. Types help catch mistakes earlier.

Example:
- `type ChatMessage = { role: "user" | "assistant"; content: string }`

### Tailwind CSS
Tailwind is a utility-first CSS framework. You style directly in class names.

Example:
- `rounded-2xl bg-cyan-400/10 text-slate-100`

### OpenRouter API
OpenRouter is the AI gateway used by your backend route.  
Your route sends chat history + a system prompt and gets back an AI answer.

### Dotenv
`dotenv` loads the API key from `.env` so secrets are not hardcoded in source files.

---

## 3) Project Structure (Important Files)

```text
professional-site/
  app/
    api/
      digital-twin/
        route.ts              # Backend API route for AI chat
    globals.css               # Global styles + Tailwind import
    layout.tsx                # Root layout + metadata
    page.tsx                  # Main personal website page
  components/
    digital-twin-chat.tsx     # Frontend chat UI component
  package.json                # Scripts and dependencies
```

---

## 4) High-Level Walkthrough

### Step A: Build the website shell
In `app/page.tsx`, the page uses arrays of content (`journey`, `featuredWork`, etc.) and maps over them to generate sections.

Why this is good for beginners:
- Content and UI are separated
- You can update text without rewriting layout logic

### Step B: Add chat UI
In `components/digital-twin-chat.tsx`, a client component was created to:

- store messages in state
- render a chat conversation
- send messages to `/api/digital-twin`
- show loading and error states

### Step C: Add backend AI route
In `app/api/digital-twin/route.ts`, a server route:

- loads `OPENROUTER_API_KEY` from `.env`
- receives messages from the frontend
- sends them to OpenRouter (`openai/gpt-oss-120b`)
- returns `{ answer, model }` JSON

### Step D: Improve reply quality
To fix janky replies:

- the system prompt now explicitly asks for plain conversational text
- output is post-processed by `normalizeForChat()` to remove markdown artifacts
- model settings were tightened for cleaner output (`temperature: 0.2`, `max_tokens: 260`)

---

## 5) Detailed Code Review With Samples

## 5.1 `app/layout.tsx` (Global page wrapper)

This file sets metadata and global fonts.

```tsx
export const metadata: Metadata = {
  title: "Tan Bui | AI Developer",
  description:
    "Professional website for Tan Bui - Machine Learning Enthusiast, AI Developer, and Sessional Academic based in Perth.",
};
```

Why it matters:
- Metadata improves SEO and browser tab title.
- The layout wraps every page in your app.

---

## 5.2 `app/globals.css` (Global styling + Tailwind entry)

```css
@import "tailwindcss";

:root {
  --background: #020617;
  --foreground: #e2e8f0;
}
```

Why it matters:
- `@import "tailwindcss";` activates Tailwind.
- CSS variables define your dark, premium visual theme.
- These values are reused across the whole site.

---

## 5.3 `app/page.tsx` (Main personal website page)

The home page is data-driven.

```tsx
const journey = [
  {
    role: "AI and Control System Developer",
    company: "Australian Wildlife Conservancy",
    period: "Aug 2024 - Dec 2024",
    impact: "Designed and implemented a smart-gate ecosystem...",
    highlights: [
      "Co-developed IoT signal reception circuitry...",
      "Deployed CNN-based classification...",
    ],
  },
];
```

Then rendered with `.map()`:

```tsx
{journey.map((item) => (
  <article key={`${item.company}-${item.role}`}>
    <h3>{item.role}</h3>
    <p>{item.company}</p>
  </article>
))}
```

Why this pattern is useful:
- Easy to maintain
- Easy to expand
- Good beginner introduction to React list rendering

The Digital Twin section is embedded here:

```tsx
<section id="digital-twin">
  <h2>Ask My Digital Twin</h2>
  <DigitalTwinChat />
</section>
```

---

## 5.4 `components/digital-twin-chat.tsx` (Frontend chat logic)

This is a **client component**, so it can use React hooks and browser APIs.

```tsx
"use client";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
```

Core state:

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([ ... ]);
const [input, setInput] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

Send message flow:

```tsx
const response = await fetch("/api/digital-twin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: nextMessages }),
});
```

Display messages:

```tsx
{messages.map((message, index) => (
  <div
    key={`${message.role}-${index}`}
    className={`max-w-[90%] break-words whitespace-pre-wrap rounded-2xl ...`}
  >
    {message.content}
  </div>
))}
```

Key improvements for readability:
- `break-words` prevents long text overflow
- `whitespace-pre-wrap` keeps line breaks readable

---

## 5.5 `app/api/digital-twin/route.ts` (Backend AI route)

This is the server-side part that keeps your API key private.

### Load key from root `.env`

```ts
loadEnv({
  path: path.resolve(process.cwd(), "../.env"),
  override: false,
  quiet: true,
});
```

### Core OpenRouter call

```ts
const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    max_tokens: 260,
    messages: [
      { role: "system", content: twinSystemPrompt },
      ...messages,
    ],
  }),
});
```

### Output cleanup (the anti-janky fix)

```ts
function normalizeForChat(raw: string): string {
  const cleaned = raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\*\*|__/g, "")
    .replace(/\|/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned;
}
```

This ensures users see normal message text instead of markdown artifacts.

---

## 5.6 `package.json` (Scripts)

```json
"scripts": {
  "dev": "next dev --webpack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

Why `--webpack`:
- In this environment, Turbopack had a module-resolution issue with Tailwind.
- Webpack mode avoids that issue and runs reliably.

---

## 6) Request/Response Flow (End-to-End)

1. User types a message in chat UI (`digital-twin-chat.tsx`)
2. Frontend sends full message history to `/api/digital-twin`
3. API route validates/sanitizes input
4. API route calls OpenRouter model
5. API route normalizes output text
6. Frontend renders clean assistant response in chat bubble

This is a standard full-stack flow:
- frontend UI -> backend route -> third-party API -> backend cleanup -> frontend render

---

## 7) How To Run The Project

From project folder:

```bash
cd "/Users/tanbui/Desktop/Main_Storage/ML&AI/Ed Donner/VibeCoding/site/professional-site"
npm install
npm run dev
```

Open:
- `http://localhost:3000`

Your API key must exist in:
- `../.env` relative to `professional-site` (your root `site/.env`)

---

## 8) Beginner Notes: Why This Architecture Is Good

- The chat UI and AI logic are separated.
- Secrets stay on server side.
- You can swap model/provider without rewriting UI.
- You can add logging/rate-limits later in API route.
- You can keep evolving website design independently of AI backend.

---

## 9) Self-Review: 5 Improvements To Make Next

1. **Add streaming responses**  
   Show tokens as they arrive (better UX, feels faster than waiting for full response).

2. **Persist chat history**  
   Save messages in `localStorage` or a database so refresh does not clear conversation.

3. **Better prompt controls in UI**  
   Add options like "short", "normal", "detailed" answer length and "formal/casual" tone.

4. **Add rate limiting and abuse protection**  
   Protect the API route from spam requests and reduce API cost risk.

5. **Move profile data to a structured data file**  
   Keep biography/experience in JSON or CMS content files so updates do not require editing code in multiple places.

---

If you want, the next tutorial can be "How to add streaming AI responses in Next.js App Router (beginner version)".

Coding Assistant Agent: GPT 5.3 Codex High
