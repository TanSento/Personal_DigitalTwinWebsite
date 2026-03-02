# Comprehensive Code Review

**Project:** Tan Bui Professional Website + Digital Twin Chat\
**Date:** 2 March 2026\
**Reviewer:** Antigravity AI - Opus 4.6\
**Scope:** All source files in `site/` and `site/professional-site/`

---

## Summary

This is a well-structured Next.js (App Router) personal website with a GPT-powered "Digital Twin" chatbot. The code is clean and readable, with good patterns like data-driven rendering, input sanitisation, and separation of client/server logic. However, there are several issues across security, accessibility, testing, and code maintainability that should be addressed.

### Severity Legend

| Icon | Severity |
|------|----------|
| 🔴 | **Critical** — Must fix before any public deployment |
| 🟠 | **High** — Should fix soon; affects security, reliability, or UX |
| 🟡 | **Medium** — Recommended improvement |
| 🟢 | **Low** — Nice-to-have / polish |

---

## 🔴 Critical Issues

### 1. API Key Exposed in Plain Text — `site/.env`

**File:** `site/.env`

The OpenRouter API key is stored as a plain-text secret:

```
OPENROUTER_API_KEY=sk-or-v1-.....cf35
```

Although `site/.gitignore` lists `.env` and the file is **not currently tracked** by git, this setup is fragile:

- The outer `.gitignore` only contains two lines (`.env` and `*.pdf`). If someone adds a nested `.gitignore` with `!.env`, or re-initialises git, the key could be committed.
- If this key has ever been committed and force-pushed away, it should still be treated as compromised.

**Remedial actions:**
1. **Rotate the API key immediately** on the OpenRouter dashboard as a precaution.
2. Move `.env` into `professional-site/` where Next.js natively loads it (via `NEXT_PUBLIC_*` or server-only env vars), removing the need for the manual `dotenv` hack.
3. Use `OPENROUTER_API_KEY` as a standard Next.js server-side env var (no `NEXT_PUBLIC_` prefix ensures it cannot leak to the client bundle).

---

### 2. No Rate Limiting on API Route — `route.ts`

**File:** `professional-site/app/api/digital-twin/route.ts`

The `/api/digital-twin` endpoint has **zero rate limiting**. Anyone can send unlimited requests, which could:
- Rack up significant OpenRouter API costs
- Be used as a denial-of-service vector
- Abuse the model for purposes unrelated to the site

**Remedial actions:**
1. Add IP-based or session-based rate limiting (e.g., `next-rate-limit`, Vercel Edge rate limits, or a simple in-memory token bucket).
2. Consider adding a CAPTCHA or session token for the chat feature.
3. Set a daily/hourly spend cap on the OpenRouter dashboard as a safety net.

---

## 🟠 High Issues

### 3. Manual `dotenv` Loading is Fragile — `route.ts`

**File:** `professional-site/app/api/digital-twin/route.ts` (lines 1–9)

```ts
import { config as loadEnv } from "dotenv";
import path from "node:path";

loadEnv({
  path: path.resolve(process.cwd(), "../.env"),
  override: false,
  quiet: true,
});
```

This manually loads `.env` from the parent directory using a relative path. Problems:
- `process.cwd()` varies depending on how the app is started (local dev vs. production vs. CI).
- This side-effect runs at module import time in a serverless context, which is unreliable.
- Next.js has built-in `.env` support — this manual approach is unnecessary.

**Remedial actions:**
1. Move the `.env` file into `professional-site/`.
2. Remove the `dotenv` dependency and the manual loading code entirely.
3. Access the key via `process.env.OPENROUTER_API_KEY` — Next.js will load it automatically.

---

### 4. `page.tsx` is a 398-Line Monolith

**File:** `professional-site/app/page.tsx`

All data arrays (`journey`, `featuredWork`, `coreCapabilities`, `snapshotStats`, `credentials`, `portfolioRoadmap`) and every section's JSX are in a single file. This makes it hard to maintain and test individual sections.

**Remedial actions:**
1. **Extract data** into a separate file, e.g., `data/profile.ts`, exporting typed constants.
2. **Extract section components** like `<HeroSection />`, `<CareerJourney />`, `<ProjectsSection />`, `<CredentialsSection />` into `components/`.
3. The main `page.tsx` becomes a simple composition of imported components.

---

### 5. No Input Length Validation — `route.ts`

**File:** `professional-site/app/api/digital-twin/route.ts`

While `sanitizeMessages()` checks message roles and trims content, there is **no limit on individual message length**. A user could send a single message containing megabytes of text, which would:
- Be forwarded to OpenRouter, potentially exceeding token limits
- Cause large memory allocations on the server

**Remedial actions:**
1. Add a per-message character limit (e.g., 2000 characters).
2. Add a total request body size limit via Next.js config or middleware.

---

### 6. No Automated Tests

**All files**

There are no test files anywhere in the project. No unit tests, no integration tests, no end-to-end tests.

**Remedial actions:**
1. Add **unit tests** for `sanitizeMessages()`, `extractAssistantText()`, and `normalizeForChat()` — these are pure functions and trivially testable.
2. Add **component tests** for `DigitalTwinChat` using React Testing Library.
3. Add **API route tests** for `/api/digital-twin` using `next/test` or plain `fetch` against a test server.
4. Add a test script to `package.json`, e.g., `"test": "jest"` or `"test": "vitest"`.

---

### 7. Hardcoded `HTTP-Referer` Header — `route.ts`

**File:** `professional-site/app/api/digital-twin/route.ts` (line 183)

```ts
"HTTP-Referer": "http://localhost:3000",
```

This is hardcoded to `localhost:3000`. When deployed to production, it will still send `localhost` as the referer to OpenRouter, which may cause request rejection or incorrect analytics.

**Remedial actions:**
1. Use an environment variable, e.g., `SITE_URL`, and fall back to `http://localhost:3000` in dev.
2. Or derive it from the incoming request headers.

---

## 🟡 Medium Issues

### 8. No Accessibility (a11y) Attributes

**Files:** `page.tsx`, `digital-twin-chat.tsx`

The site has no ARIA labels, no `role` attributes, no skip-to-content links, and no focus management. Specific issues:
- The chat message list (`div` with `ref={viewportRef}`) has no `role="log"` or `aria-live="polite"`.
- The loading indicator ("Thinking...") should use `aria-live="assertive"`.
- Navigation links have no `aria-current` state.
- The input field has no associated `<label>`.
- No skip-to-content link for keyboard users.

**Remedial actions:**
1. Add `role="log"` and `aria-live="polite"` to the chat message container.
2. Add `aria-label` to the chat input.
3. Add a visually hidden skip-to-content link at the top of the page.
4. Add `aria-current="page"` to the active nav link.

---

### 9. Light Mode is Broken / Non-Existent — `globals.css`

**File:** `professional-site/app/globals.css` (lines 3–20)

The `:root` and `@media (prefers-color-scheme: dark)` blocks define **identical values**, meaning there is no light mode at all — but the code _implies_ there should be one.

```css
:root {
  --background: #020617;
  --foreground: #e2e8f0;
}
@media (prefers-color-scheme: dark) {
  :root {
    --background: #020617;  /* identical */
    --foreground: #e2e8f0;  /* identical */
  }
}
```

**Remedial actions:**
1. Either remove the `@media (prefers-color-scheme: dark)` block entirely (the site is dark-only by design), or
2. Define actual light mode colours in the `:root` block and move dark values into the media query.

---

### 10. `useMemo` for `canSend` is Unnecessary — `digital-twin-chat.tsx`

**File:** `professional-site/components/digital-twin-chat.tsx` (lines 41–44)

```ts
const canSend = useMemo(
  () => input.trim().length > 0 && !isLoading,
  [input, isLoading],
);
```

`useMemo` is overkill for a simple boolean expression involving two primitive values. This adds cognitive complexity with no performance benefit.

**Remedial action:**
Replace with a simple derived variable:
```ts
const canSend = input.trim().length > 0 && !isLoading;
```

---

### 11. Starter Prompt Buttons Remain Visible Permanently — `digital-twin-chat.tsx`

**File:** `professional-site/components/digital-twin-chat.tsx` (lines 150–162)

The four starter prompt buttons remain visible even after the user has sent multiple messages. In a typical chatbot UX, these should disappear after the first interaction to avoid clutter.

**Remedial action:**
Conditionally render starter prompts only when `messages.length <= 1` (i.e., only the initial assistant greeting is present).

---

### 12. Error Message Added to Chat History — `digital-twin-chat.tsx`

**File:** `professional-site/components/digital-twin-chat.tsx` (lines 96–103)

When an API call fails, a hardcoded "I hit a connection issue…" message is appended as an `assistant` message to the state. If the user clicks "Send" again, this error message is sent to the API as conversation history, confusing the model.

**Remedial actions:**
1. Display errors as transient UI elements (like a toast or inline warning) rather than permanent chat messages.
2. Or mark error messages with a special flag and filter them out before sending to the API.

---

### 13. Missing `node_modules` in Outer `.gitignore`

**File:** `site/.gitignore`

The outer `.gitignore` only contains:
```
.env
*.pdf
```

It does **not** ignore `node_modules`, `.next`, `build`, etc. The inner `professional-site/.gitignore` does handle these, but if any tooling or CI runs from the outer directory, stale build artifacts could be committed.

**Remedial action:**
Add `node_modules/`, `.next/`, and `build/` to the outer `site/.gitignore`.

---

### 14. Personal Information Hardcoded in Source — `page.tsx`, `route.ts`

**Files:** `page.tsx` (phone number, email), `route.ts` (full career profile in system prompt)

Phone numbers, email addresses, and a full career biography are embedded directly in source code. This means:
- Updating personal info requires code changes and a redeploy.
- Sensitive contact info is in the git history permanently.

**Remedial actions:**
1. Move personal data into a JSON or YAML file (e.g., `data/profile.json`).
2. Import it in both `page.tsx` and `route.ts` to keep a single source of truth.
3. Consider moving contact information to environment variables or a CMS.

---

## 🟢 Low Issues

### 15. Duplicate Navigation Markup — `page.tsx`

**File:** `professional-site/app/page.tsx` (lines 101–141)

The desktop and mobile navigation bars are two separate `<nav>` elements with identical link sets but different class names. This means any nav link change must be made in two places.

**Remedial action:**
Extract a `navLinks` array and render both nav variants from the same data source using a shared component or mapping.

---

### 16. No `<meta viewport>` Tag

**File:** `professional-site/app/layout.tsx`

While Next.js does inject a viewport meta tag by default, best practice in Next.js 14+ App Router is to explicitly export a `viewport` configuration:

```ts
export const viewport = {
  width: "device-width",
  initialScale: 1,
};
```

**Remedial action:**
Add an explicit `viewport` export to `layout.tsx`.

---

### 17. PDF Served from `/public` — Potential Privacy Concern

**File:** `professional-site/public/TanBui_Resume.pdf`

The full resume PDF is served publicly with no access controls. Anyone with the URL can download it. While this may be intentional, it's worth noting that web crawlers can index it.

**Remedial actions:**
1. If this is intentional, add `robots.txt` or a `<meta name="robots" content="noindex">` for the PDF path.
2. If not intentional, serve the PDF through an API route that checks a session or referrer.

---

### 18. Non-Standard Dev Script — `package.json`

**File:** `professional-site/package.json` (line 6)

```json
"dev": "next dev --webpack"
```

The `--webpack` flag forces Webpack mode instead of Turbopack. The README explains this was due to a module resolution issue, but this should be re-evaluated periodically as Turbopack matures.

**Remedial action:**
Add a comment in README about this workaround and periodically test if `next dev` (default Turbopack) now works.

---

### 19. `next-env.d.ts` Committed

**File:** `professional-site/next-env.d.ts`

This file is auto-generated by Next.js and is listed in the inner `.gitignore`. However, it appears to exist in the working directory. Ensure it's not being tracked.

**Remedial action:**
Verify with `git ls-files next-env.d.ts`. If tracked, run `git rm --cached next-env.d.ts`.

---

### 20. No `robots.txt` or `sitemap.xml`

**All files**

The project has no `robots.txt` or `sitemap.xml`, which are important for SEO and controlling web crawler behavior.

**Remedial actions:**
1. Add `public/robots.txt` to the Next.js project.
2. Consider generating a `sitemap.xml` via Next.js's built-in `sitemap.ts` API.

---

## Positive Observations

These are things the project does well and should continue:

| Area | Detail |
|------|--------|
| **Data-driven rendering** | Content arrays in `page.tsx` make updates easy without JSX surgery. |
| **Input sanitisation** | `sanitizeMessages()` validates roles, trims content, and limits context window. |
| **Output normalisation** | `normalizeForChat()` strips markdown artifacts for cleaner UX. |
| **TypeScript usage** | Types are used consistently for messages, API responses, and props. |
| **Error handling** | Both client and server code handle errors gracefully with user-friendly messages. |
| **Responsive design** | Tailwind classes handle mobile/desktop layout transitions well. |
| **Scroll-to-bottom** | Chat viewport auto-scrolls via `useEffect` on message changes. |
| **Context window limiting** | `MAX_CONTEXT_MESSAGES = 12` prevents unbounded token usage. |
| **Clean separation** | Client chat component is properly isolated from server API logic. |

---

## Remedial Action Priority

| Priority | Issue # | Summary |
|----------|---------|---------|
| 🔴 P0 | 1 | Rotate and properly manage API key |
| 🔴 P0 | 2 | Add rate limiting to API route |
| 🟠 P1 | 3 | Remove manual dotenv, use Next.js built-in env |
| 🟠 P1 | 5 | Add per-message length validation |
| 🟠 P1 | 7 | Fix hardcoded localhost referer |
| 🟠 P1 | 6 | Add automated tests |
| 🟡 P2 | 4 | Break up monolithic `page.tsx` |
| 🟡 P2 | 8 | Add accessibility attributes |
| 🟡 P2 | 9 | Fix/remove dead light-mode CSS |
| 🟡 P2 | 12 | Don't persist errors as chat messages |
| 🟡 P2 | 14 | Externalise personal data |
| 🟡 P2 | 13 | Fix outer `.gitignore` |
| 🟡 P3 | 10 | Remove unnecessary `useMemo` |
| 🟡 P3 | 11 | Hide starter prompts after first message |
| 🟢 P4 | 15–20 | Polish: nav dedup, viewport, robots.txt, etc. |
