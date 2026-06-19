# makereadme — Progress Report

> Based on the frontend replacement plan (`plan.md`) and project context (`AGENTS.md`).

---

## ✅ DONE

### Frontend Foundation
| Item | Status |
|---|---|
| Remove old `homepage.jsx`, `sidebar.jsx`, `Icon.jsx`, `Particles.jsx` | ✅ |
| Install `react-router-dom`; remove `axios`, `react-top-loading-bar` | ✅ |
| `index.css` — CSS variables for new design tokens + base styles | ✅ |
| `App.css` — All component styles: home page, studio, buttons, inputs, cards, responsive breakpoints at 1100px, 920px, 820px, 560px | ✅ |

### Shared Primitives
| File | Description |
|---|---|
| `lib/constants.js` | API_BASE_URL, README_SIZES (6 sizes), SECTIONS (8 checkboxes), BADGE_CATEGORIES_TABS |
| `lib/badgePresets.js` | All badge categories (Languages, Frameworks, Tools, Status) ported from old code |
| `lib/badgeMarkdown.js` | `getBadgeMarkdown()`, `getCustomBadgeMarkdown()`, `extractBadgeUrl()` |
| `lib/markdownHelpers.js` | `insertBadgeAfterHeading()`, `countLines()`, `countActiveSections()` |

### Hooks
| File | Description |
|---|---|
| `hooks/useStreamingReadme.js` | Streaming fetch, abort support, startGeneration/reset, isGenerating/isGenerated/error |

### Components Built
| Component | Description |
|---|---|
| `HomePage.jsx` | Full marketing landing page: topnav, hero with URL input + size pills, features section, workflow section, footer |
| `StudioPage.jsx` | Root studio orchestrator: reads query params, manages sections/viewMode/status, wires generate/copy/download/badge-insert |
| `TopBar.jsx` | Studio topbar: logo, URL input, Generate button, Copy button, Download button (disabled states) |
| `Sidebar.jsx` | Layout wrapper for sidebar |
| `SectionControls.jsx` | 8 checkboxes (Title, Description, TOC, Features, Installation, Usage, Tests, License) |
| `BadgePanel.jsx` | Badge grid with category tabs, disabled overlay before generation |
| `CustomBadgeBuilder.jsx` | Label/Message/Color inputs + preview + Add button |
| `EditorPreview.jsx` | Segmented control (Editor/Split/Preview), editor textarea + react-markdown preview panes |
| `MarkdownPreview.jsx` | `react-markdown` + `rehype-raw` + studio preview styles |
| `Footer.jsx` | Shared footer component |

---

## 🚧 NOT YET DONE

### Frontend Blocker (HIGH PRIORITY)
| Task | Notes |
|---|---|
| Update `App.jsx` to import new components and set up routing | Still imports old `./components/homepage` which is deleted. Needs `BrowserRouter` with `/` → `HomePage` and `/studio` → `StudioPage` |
| Verify `main.jsx` works with new App | Should be fine, but needs testing |
| Verify Vite build pipeline | Must confirm tailwind/postcss config still works |

### Backend (MUST DO per plan)
| Task | File | Change |
|---|---|---|
| Add `sections` query param | `routes/api.js` | Pass `req.query.sections` to controller |
| Accept `sections` in controller | `controllers/readmeController.js` | Pass `sections` to service |
| Build `sections` instruction into prompt | `services/githubService.js` | Add sections directive before codeContext, also add branch fallback (`main` → `master`) |
| Accept `sections` in Gemini generation | `services/geminiService.js` | Prepend "Include these sections: ..." instruction to content |

### Testing
| Task | Details |
|---|---|
| Start backend (`npm run dev` in `server/`) | Needs `GEMINI_API_KEY` and `GITHUB_TOKEN` |
| Start frontend (`npm run dev` in `client/`) | Needs `VITE_REACT_APP_API_URL` |
| End-to-end flow | Enter URL → redirect to studio → select sections → generate → stream → preview → badges → copy/download |
| Responsive verification | Check at 360, 560, 820, 920, 1100, 1440px widths |

### Documentation
| Task | Details |
|---|---|
| Update `AGENTS.md` | Reflect new frontend structure, component list, state flow |
| Update `README.md` | If screenshots or setup instructions changed |

---

## Next Step

**Run `App.jsx` to wire routing** — this is the single blocking item before the frontend compiles. Then proceed to backend changes and testing.
