import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { README_SIZES, DEFAULT_SIZE } from "../lib/constants";
import Footer from "./Footer";

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const navigate = useNavigate();

  const selectedSize = README_SIZES.find((s) => s.value === size);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    navigate(
      `/studio?url=${encodeURIComponent(repoUrl.trim())}&size=${encodeURIComponent(size)}`,
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <header className="border-b border-border bg-bg sticky top-0 z-10">
        <div className="container min-h-[64px] flex items-center justify-between gap-6 max-sm:items-start max-sm:flex-col max-sm:py-4">
          <Link
            className="font-bold no-underline text-fg inline-flex items-center"
            to="/"
          >
            <img
              src="/icon.png"
              alt="MakeReadme"
              className="h-16 w-auto block"
            />
          </Link>
          <nav
            className="flex items-center gap-6 text-muted font-medium max-[920px]:hidden"
            aria-label="Primary"
          >
            <a href="#features" className="hover:text-accent no-underline">
              Features
            </a>
            <a href="#flow" className="hover:text-accent no-underline">
              Flow
            </a>
          </nav>
          <Link
            className="inline-flex items-center justify-center min-h-[40px] px-5 py-1 border border-border rounded-sm bg-transparent text-fg font-medium leading-loose !no-underline transition-colors hover:border-fg-2 hover:text-fg hover:bg-border-soft"
            to="/studio"
          >
            Open studio
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 max-[920px]:py-16 max-sm:py-12">
          <div className="container grid grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-12 items-start max-[920px]:grid-cols-1">
            <div>
              <p className="text-accent text-xs font-bold tracking-normal uppercase mb-5">
                README GENERATOR · REPO TO DOCS
              </p>
              <h1 className="max-w-[13ch] text-[clamp(28px,7vw,48px)] font-display leading-[1.15]">
                Make a useful README from a GitHub repo.
              </h1>
              <p className="max-w-[58ch] text-muted text-lg mt-5">
                Paste a repository URL, choose how detailed the README should
                be, then review the generated Markdown in the studio.
              </p>
            </div>
            <div
              className="bg-surface border border-border rounded-lg p-4"
              aria-label="README generator"
            >
              <form
                className="grid grid-cols-[1fr_auto] gap-2 max-sm:grid-cols-1"
                onSubmit={handleSubmit}
              >
                <label className="sr-only" htmlFor="repo-url">
                  GitHub repository URL
                </label>
                <input
                  className="w-full min-h-[52px] border border-border rounded-md bg-bg text-fg p-4 outline-none placeholder-meta focus-visible:ring-2 focus-visible:ring-accent"
                  id="repo-url"
                  type="url"
                  placeholder="https://github.com/user/repo"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
                <button
                  className="inline-flex items-center justify-center min-h-[40px] px-5 py-1 border rounded-sm font-medium leading-loose no-underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-accent border-accent text-accent-on hover:bg-accent-hover hover:border-accent-hover active:bg-accent-active active:border-accent-active"
                  type="submit"
                >
                  Generate →
                </button>
              </form>
              <div className="mt-4 grid gap-3">
                <span className="text-muted text-sm">README LENGTH</span>
                <div className="flex flex-wrap gap-2">
                  {README_SIZES.map((s) => (
                    <label
                      className="inline-flex items-center min-h-[32px] px-3 border border-border rounded-sm text-sm cursor-pointer select-none transition-colors duration-100 text-muted hover:border-fg-2 hover:text-fg-2 has-[input:checked]:text-fg has-[input:checked]:border-accent has-[input:checked]:bg-surface"
                      key={s.value}
                    >
                      <input
                        type="radio"
                        className="absolute opacity-0 pointer-events-none"
                        name="length"
                        value={s.value}
                        checked={size === s.value}
                        onChange={() => setSize(s.value)}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
                <p className="text-muted text-sm">{selectedSize?.desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-20 border-t border-border max-[920px]:py-16 max-sm:py-12"
          id="features"
        >
          <div className="container">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(280px,1fr)] gap-8 mb-8 max-[920px]:grid-cols-1">
              <div>
                <p className="text-accent text-xs font-bold tracking-normal uppercase mb-5">
                  WHY IT EXISTS
                </p>
                <h2 className="text-2xl leading-[1.35] font-display">
                  README generation for teams that still read the output.
                </h2>
              </div>
              <p className="max-w-[58ch] text-muted text-lg mt-5">
                MakeReadme keeps the generated document editable and scoped
                instead of producing a wall of generic project praise.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-[920px]:grid-cols-1">
              <article className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-base font-display mb-3">
                  Section controls
                </h3>
                <p className="text-muted text-sm">
                  Detected package managers, scripts, and framework files shape
                  the README outline before copy is generated.
                </p>
              </article>
              <article className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-base font-display mb-3">Badge builder</h3>
                <p className="text-muted text-sm">
                  Add language, framework, tool, and project-status badges
                  without leaving the README editor.
                </p>
              </article>
              <article className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-base font-display mb-3">Split preview</h3>
                <p className="text-muted text-sm">
                  Edit Markdown and preview the rendered README side by side
                  before copying or downloading.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          className="py-20 border-t border-border max-[920px]:py-16 max-sm:py-12"
          id="flow"
        >
          <div className="container">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(280px,1fr)] gap-8 mb-8 max-[920px]:grid-cols-1">
              <div>
                <p className="text-accent text-xs font-bold tracking-normal uppercase mb-5">
                  FLOW
                </p>
                <h2 className="text-2xl leading-[1.35] font-display">
                  Three steps, no prompt archaeology.
                </h2>
              </div>
              <div className="grid gap-2">
                <article className="grid grid-cols-[42px_1fr] gap-4 py-4 border-t border-border max-sm:grid-cols-1 max-sm:gap-2">
                  <span className="text-accent font-bold">01</span>
                  <div>
                    <h3 className="text-base font-display mb-1">
                      Paste a repo
                    </h3>
                    <p className="text-muted text-sm">
                      Start from a GitHub URL and a target README length.
                    </p>
                  </div>
                </article>
                <article className="grid grid-cols-[42px_1fr] gap-4 py-4 border-t border-border max-sm:grid-cols-1 max-sm:gap-2">
                  <span className="text-accent font-bold">02</span>
                  <div>
                    <h3 className="text-base font-display mb-1">
                      Review the plan
                    </h3>
                    <p className="text-muted text-sm">
                      Keep sections that matter, remove the rest, and add
                      badges.
                    </p>
                  </div>
                </article>
                <article className="grid grid-cols-[42px_1fr] gap-4 py-4 border-t border-border max-sm:grid-cols-1 max-sm:gap-2">
                  <span className="text-accent font-bold">03</span>
                  <div>
                    <h3 className="text-base font-display mb-1">
                      Export Markdown
                    </h3>
                    <p className="text-muted text-sm">
                      Copy the final README or download it from the studio.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
