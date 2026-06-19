# makereadme — Frontend Replacement Plan

> **Purpose:** Replace the current `client/` React frontend with the new design from the `new frontend/` folder. This plan is written to be self-contained so a new session can read it and start building immediately without re-exploring the design.

---

## 1. Project Context

`makereadme` takes a GitHub repo URL, fetches its files, and uses Gemini to generate a README.md. The user then edits the markdown in a browser editor and downloads it.

### Current Architecture

```
makereadme/
├── client/          # React (Vite) frontend — TO BE REPLACED
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── homepage.jsx      # LandingPage + EditorView in one file
│       │   ├── sidebar.jsx       # unused old component
│       │   ├── Particles.jsx     # WebGL background (unused in current flow)
│       │   └── Icon.jsx          # old icon helper
│       ├── index.css             # Tailwind v4 import
│       └── main.jsx
└── server/          # Node.js / Express backend
    ├── index.js
    ├── routes/api.js
    ├── controllers/readmeController.js
    └── services/
        ├── geminiService.js
        ├── githubService.js
        ├── pathUtils.js
        └── github/
            ├── files.js
            └── url.js
```

### Backend Flow (PRESERVE)

1. **Two-pass Gemini flow** — do NOT revert to single-pass.
   - Pass 1: send file tree paths to Gemini, ask which files it needs. Returns JSON array of paths.
   - Pass 2: send selected file contents to Gemini, get the README.
2. If pass 1 fails or returns garbage, `githubService.js` falls back to sending all files. Keep this fallback.
3. `githubService.js` hardcodes `'main'` as the ref. Make it try `main` then fall back to `master` if needed.
4. File fetching returns `{ fileTree: string[], fileContents: Record<string, string> }` — do not change back to a concatenated string.
5. The `/api/generate` route returns `Content-Type: text/plain` and streams the response. The client reads it as a stream. Keep this intact.
6. CORS is open (`app.use(cors())`) — fine for local dev, lock down before deploying.

---

## 2. Goal

Replace the current single-page frontend with a multi-page React frontend based on the exported HTML files in `new frontend/`:

- `new frontend/index.html` — launcher/overview (compact hero + command panel + outline)
- `new frontend/makereadme-landing.html` — full marketing landing page
- `new frontend/makereadme-studio.html` — the README editor studio

### Final Navigation & Flow

1. **Home page (`/`)**
   - Combined marketing page: hero + URL input + length selector + Generate button.
   - Clicking **Generate** does **not** generate yet. It redirects to `/studio?url=<url>&size=<size>`.
   - Features section and workflow section included.

2. **Studio page (`/studio`)**
   - Reads `url` and `size` from query params.
   - URL input is pre-filled in the top bar.
   - Left sidebar shows **Sections** checkboxes and **Badges** panel.
   - User selects which sections they want, then clicks **Generate**.
   - Backend receives `url`, `size`, and `sections`.
   - README content streams from Gemini into the editor textarea.
   - Preview pane renders the markdown live as it streams.
   - **Badges are disabled before generation completes and enabled after.**
   - Copy and Download buttons become active after generation.

---

## 3. Design Source of Truth

### New Design Tokens (extract from `new frontend/*.html`)

| Token | Value |
|---|---|
| Background | `#201d1d` |
| Surface | `#302c2c` |
| Foreground | `#fdfcfc` |
| Foreground secondary | `#c8c6c4` |
| Muted | `#9a9898` |
| Meta | `#6e6e73` |
| Border | `#464343` |
| Border soft | `#302c2c` |
| Accent | `#007aff` |
| Accent on | `#ffffff` |
| Accent hover | `#0056b3` |
| Accent active | `#004085` |
| Success | `#30d158` |
| Warn | `#ff9f0a` |
| Danger | `#ff3b30` |
| Font | `"Berkeley Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace` |
| Text xs | 12px |
| Text sm | 14px |
| Text base | 16px |
| Text lg | 18px |
| Text xl | 22px |
| Text 2xl | 28px |
| Text 3xl | 38px |
| Text 4xl | 48px |
| Radius sm | 4px |
| Radius md | 6px |
| Radius lg | 8px |
| Radius pill | 9999px |
| Motion fast | 100ms |
| Motion base | 150ms |
| Ease | `cubic-bezier(0.2, 0, 0, 1)` |
| Container max | 880px |

### Responsive Breakpoints (from HTML CSS)

- `max-width: 920px` — tablet: stack hero grid, section heads, grid-3; hide nav-links.
- `max-width: 560px` — phone: reduce spacing, command rows stack vertically, smaller headings.
- Studio: `max-width: 1100px` — sidebar becomes horizontal strip; `max-width: 820px` — topbar stacks, panes stack vertically, segmented mobile pane switching.

### Typography

- All headings and body use the same monospace font stack.
- Headings: `text-wrap: balance`.
- Body paragraphs: `text-wrap: pretty`.
- Links: underline 1px, underline-offset 3px, hover accent color.

---

## 4. Final Page Structure

### Home Page (`/`)

**Hero**
- Eyebrow: `README GENERATOR · REPO TO DOCS`
- Headline: `Make a useful README from a GitHub repo.`
- Lead: `Paste a repository URL, choose how detailed the README should be, then review the generated Markdown in the studio.`
- Command panel:
  - URL input placeholder: `https://github.com/user/repo`
  - Length selector pills: `Quick Start`, `Concise`, `Standard`, `Detailed`, `Comprehensive`, `Enterprise`
  - Selected length description line (dynamic, e.g., `~120 lines, balanced`)
  - `Generate →` button

**Features Section**
- Eyebrow: `WHY IT EXISTS`
- Heading: `README generation for teams that still read the output.`
- Lead: `MakeReadme keeps the generated document editable and scoped instead of producing a wall of generic project praise.`
- 3 cards:
  1. **Section controls** — `Detected package managers, scripts, and framework files shape the README outline before copy is generated.`
  2. **Badge builder** — `Add language, framework, tool, and project-status badges without leaving the README editor.`
  3. **Split preview** — `Edit Markdown and preview the rendered README side by side before copying or downloading.`

**Workflow Section**
- Eyebrow: `FLOW`
- Heading: `Three steps, no prompt archaeology.`
- 3 steps:
  1. `01 Paste a repo` — `Start from a GitHub URL and a target README length.`
  2. `02 Review the plan` — `Keep sections that matter, remove the rest, and add badges.`
  3. `03 Export Markdown` — `Copy the final README or download it from the studio.`

**Footer**
- Left: `MakeReadme · AI README Generator`
- Right: `Studio` link

### Studio Page (`/studio`)

**Top Bar**
- Left: `MakeReadme` logo (links to `/`)
- Center: URL input (pre-filled) + `Generate` button
- Right: `Copy` button, `Download` button

**Left Sidebar**
- **Sections** panel:
  - Checkboxes:
    - Title (checked)
    - Description (checked)
    - TOC (checked)
    - Features (checked)
    - Installation (checked)
    - Usage (checked)
    - Tests (unchecked)
    - License (unchecked)
- **Badges** panel:
  - Category tabs: `Languages`, `Frameworks`, `Tools`, `Status`
  - Badge grid of clickable shields.io badges
  - Custom badge builder: Label, Message, Color inputs + preview + Add button
  - **Disabled before generation**
- **Document** panel:
  - Status card showing:
    - `<line-count>` lines
    - `<section-count>` active sections
    - `<save-state>` message (e.g., `Ready to edit`, `Generating…`, `Generated`, `Copied`, `Downloaded`)

**Main Workspace**
- Workspace title: `README Studio`
- Subtitle: `Edit generated Markdown and preview the rendered structure before export.`
- Segmented control: `Editor` | `Split` | `Preview`
- Panes:
  - Editor pane with textarea and line count label
  - Preview pane rendering markdown (use `react-markdown` + `rehype-raw`)

---

## 5. State Management

### Studio Component State

```ts
type ViewMode = 'editor' | 'split' | 'preview';

interface StudioState {
  repoUrl: string;
  size: string;
  sections: string[];           // checked section names
  markdown: string;
  isGenerating: boolean;
  isGenerated: boolean;         // true once stream completes
  viewMode: ViewMode;
  copied: boolean;
  statusMessage: string;        // shown in Document status card
  lineCount: number;
  activeSectionCount: number;
}
```

### State Flow

1. Studio mounts → parse `url` and `size` from query params → set `repoUrl` and `size`.
2. Initial render:
   - `markdown` empty
   - `isGenerating` false
   - `isGenerated` false
   - Badges disabled
   - Copy/Download disabled (or no-op)
3. User selects sections.
4. User clicks **Generate**:
   - `isGenerating` true
   - `statusMessage` = `Generating…`
   - Call `GET /api/generate?url=<url>&size=<size>&sections=<comma-list>`
   - Read response as stream, append chunks to `markdown`
   - Update `lineCount` and `activeSectionCount` continuously
   - Update preview continuously
5. Stream ends:
   - `isGenerating` false
   - `isGenerated` true
   - `statusMessage` = `Generated from repository URL`
   - Badges enabled
   - Copy/Download enabled
6. **Copy** → copy markdown to clipboard, set `copied` true for 1.5s, `statusMessage` = `Copied README to clipboard`.
7. **Download** → create blob, trigger download of `README.md`, `statusMessage` = `Downloaded README.md`.
8. **Badge click** → insert badge markdown after the first `# Heading` line (preserve existing behavior). Update preview and status.

### Query Param Flow

Home page form submit:

```js
navigate(`/studio?url=${encodeURIComponent(repoUrl)}&size=${encodeURIComponent(size)}`);
```

Studio reads:

```js
const params = new URLSearchParams(window.location.search);
const repoUrl = params.get('url') || '';
const size = params.get('size') || 'standard';
```

---

## 6. Backend API Changes

### Current Endpoint

```
GET /api/generate?url=<repo>&size=<size>
```

### Updated Endpoint

```
GET /api/generate?url=<repo>&size=<size>&sections=<comma-separated-list>
```

### Files to Touch

1. `server/routes/api.js` — pass `sections` from query to controller.
2. `server/controllers/readmeController.js` — accept `sections` and pass to `githubService.generateReadme`.
3. `server/services/githubService.js` — forward `sections` to Gemini prompt building.
4. `server/services/geminiService.js` — include the selected sections in the generation prompt.

### Prompt Change

When generating the README (Pass 2), include a section like:

```
Include the following sections in the README:
<comma-separated list of sections>

Only include these sections. If a section does not apply, omit it rather than adding filler content.
```

Keep the existing two-pass flow and fallback behavior unchanged.

---

## 7. Component File Structure

Replace `client/src/` with:

```
client/src/
├── main.jsx
├── App.jsx
├── index.css
├── App.css
├── components/
│   ├── HomePage.jsx
│   ├── StudioPage.jsx
│   ├── TopBar.jsx
│   ├── Sidebar.jsx
│   ├── SectionControls.jsx
│   ├── BadgePanel.jsx
│   ├── CustomBadgeBuilder.jsx
│   ├── EditorPreview.jsx
│   ├── MarkdownPreview.jsx
│   └── Footer.jsx
├── hooks/
│   └── useStreamingReadme.js
└── lib/
    ├── badgePresets.js       # all current badge categories
    ├── badgeMarkdown.js      # helpers to build shields.io URLs
    ├── markdownHelpers.js    # badge insertion, line counting, etc.
    └── constants.js          # sections list, sizes list, API URL
```

### Component Responsibilities

- `HomePage.jsx` — full landing page, form validation, redirect on submit.
- `StudioPage.jsx` — main container, owns all state, orchestrates API call and streaming.
- `TopBar.jsx` — studio top bar with URL input, Generate, Copy, Download.
- `Sidebar.jsx` — layout container for sidebar panels.
- `SectionControls.jsx` — checkboxes, derives `activeSectionCount`.
- `BadgePanel.jsx` — tabs, badge grid, disabled overlay before generation.
- `CustomBadgeBuilder.jsx` — label/message/color inputs + preview.
- `EditorPreview.jsx` — editor textarea + preview pane, view mode switching.
- `MarkdownPreview.jsx` — `react-markdown` wrapper with studio styles.
- `Footer.jsx` — shared footer component.
- `useStreamingReadme.js` — custom hook wrapping `fetch` streaming logic.

---

## 8. Dependencies

### Current `client/package.json` dependencies

Keep:
- `react`, `react-dom`
- `react-markdown`
- `rehype-raw`
- `ogl` (keep installed, not rendered in current flow)

Remove or consider removing:
- `axios` (not used if we use `fetch` for streaming)
- `react-top-loading-bar` (unused)

### Add

- `react-router-dom` — for `/` and `/studio` routes.

### Tailwind

The current setup uses Tailwind v4 (`@tailwindcss/postcss`, `@tailwindcss/cli`, `tailwindcss` v4). The new HTML files use plain CSS with CSS variables. You have two options:

1. **Option A (recommended):** Keep Tailwind v4 and map the design tokens into a custom CSS file with `@theme` / CSS variables, then use Tailwind utility classes that reference those tokens. This keeps the existing build pipeline.
2. **Option B:** Convert to plain CSS modules mirroring the HTML structure. More faithful to the export but requires reworking the build pipeline.

Use **Option A** unless you have a strong reason not to.

---

## 9. Implementation Steps (in order)

### Step 1: Clean up `client/src`

- Delete old components: `homepage.jsx`, `sidebar.jsx`, `Icon.jsx`, `Particles.jsx`.
- Delete `App.css` if no longer needed, or keep it minimal.
- Reset `index.css` to import Tailwind and define the new CSS variables.

### Step 2: Add routing

- Install `react-router-dom`.
- Update `App.jsx` to use `BrowserRouter` with routes `/` and `/studio`.
- Update `main.jsx` if needed.

### Step 3: Build shared primitives

- Create CSS variables in `index.css`.
- Create `lib/constants.js` with sections list, sizes list, API URL.
- Create `lib/badgePresets.js` from the existing `BADGE_CATEGORIES` in `homepage.jsx`.
- Create `lib/badgeMarkdown.js` from `getBadgeMarkdown` in `homepage.jsx`.
- Create `lib/markdownHelpers.js` with `insertBadgeAfterHeading`, `countLines`, `countSections`.

### Step 4: Build HomePage

- Port the combined marketing page content.
- Implement URL input + length selector + description text.
- Implement form submit: redirect to `/studio` with query params.
- Add responsive styles.

### Step 5: Build Studio components

- `TopBar` — URL input, Generate, Copy, Download.
- `Sidebar` — layout for panels.
- `SectionControls` — checkboxes with state.
- `BadgePanel` + `CustomBadgeBuilder` — reuse existing badge logic, add disabled state.
- `EditorPreview` — textarea + preview panes + segmented control.
- `MarkdownPreview` — `react-markdown` + `rehype-raw` + studio preview styles.

### Step 6: Wire up streaming

- Create `useStreamingReadme` hook.
- Integrate into `StudioPage`.
- Ensure `isGenerating` and `isGenerated` flags drive disabled states.

### Step 7: Update backend for sections

- `api.js`: pass `sections` query param.
- `readmeController.js`: accept `sections`.
- `githubService.js`: pass `sections` to generation call.
- `geminiService.js`: include `sections` in the prompt.

### Step 8: Test end-to-end

- Start backend (`npm run dev` in `server/`).
- Start frontend (`npm run dev` in `client/`).
- Test: enter URL on home → redirect to studio → select sections → generate → stream appears → preview updates → badges enabled → copy/download work.
- Verify responsive behavior at 360, 560, 820, 920, 1100, 1440px widths.

### Step 9: Update documentation

- Update `client/README.md` if needed.
- Update `AGENTS.md` to reflect the new frontend structure and state flow.
- Update `README.md` (project root) if screenshots or setup instructions changed.

---

## 10. What to Preserve from Existing Code

- **Two-pass Gemini flow** — do not change.
- **Fallback when pass 1 returns bad file list** — keep in `githubService.js`.
- **File fetch map shape** — `{ fileTree, fileContents }` — keep.
- **Streaming response** — `Content-Type: text/plain`, client reads with `ReadableStream`.
- **Badge insertion logic** — insert after first `# Heading` line, not at cursor.
- **All existing badge presets** — port from `homepage.jsx`.
- **Default branch handling** — try `main`, fallback to `master`.
- **CORS** — keep open for local dev.

---

## 11. What to Remove / Replace

- Old dark green theme (`#4ade80` accent, `#0d1117` bg).
- Old `homepage.jsx` single-page component.
- Old `sidebar.jsx`, `Icon.jsx`, `Particles.jsx`.
- Inline-style heavy editor chrome.
- Immediate download after generation — the new flow requires studio review first.
- `axios` if not used.
- `react-top-loading-bar` if unused.

---

## 12. Key Decisions Locked In

- **Home page:** combined marketing page from `makereadme-landing.html` + URL input from `index.html`.
- **No generation on home page:** redirect only.
- **Studio page:** separate route, receives URL/size via query params.
- **Section selection:** happens in studio before generation.
- **Backend sections param:** comma-separated list passed to Gemini prompt.
- **6 README sizes:** `Quick Start`, `Concise`, `Standard`, `Detailed`, `Comprehensive`, `Enterprise`.
- **8 sections:** `Title`, `Description`, `TOC`, `Features`, `Installation`, `Usage`, `Tests`, `License`.
- **Badges:** disabled before generation, enabled after; keep existing full badge categories.
- **Theme:** warm dark `#201d1d` bg, `#007aff` accent, monospace font.
- **Routing:** React Router with `/` and `/studio`.

---

## 13. Verification Checklist

- [ ] Home page renders and matches new design visually.
- [ ] URL input + length selector redirect to `/studio` with correct query params.
- [ ] Studio loads with URL pre-filled.
- [ ] Section checkboxes are selectable.
- [ ] Generate button calls `/api/generate?url=&size=&sections=`.
- [ ] README streams into editor and preview updates live.
- [ ] Badges are disabled during generation and enabled after.
- [ ] Copy button copies markdown to clipboard.
- [ ] Download button downloads `README.md`.
- [ ] Backend prompt includes selected sections.
- [ ] No horizontal scroll at 360, 390, 430, 600, 820, 1024, 1366, 1440, 1920px widths.
- [ ] AGENTS.md updated to reflect new frontend structure.

---

## 14. Files the New Session Should Read First

1. `plan.md` (this file)
2. `AGENTS.md` (project context and constraints)
3. `new frontend/makereadme-landing.html` (home page visual)
4. `new frontend/makereadme-studio.html` (studio visual)
5. `client/src/components/homepage.jsx` (existing badge logic and streaming to port)
6. `server/services/githubService.js` and `server/services/geminiService.js` (backend flow)
7. `server/routes/api.js` and `server/controllers/readmeController.js` (where to add `sections`)
