import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { README_SIZES, DEFAULT_SIZE } from '../lib/constants';

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [size, setSize] = useState(DEFAULT_SIZE);
  const navigate = useNavigate();

  const selectedSize = README_SIZES.find((s) => s.value === size);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    navigate(`/studio?url=${encodeURIComponent(repoUrl.trim())}&size=${encodeURIComponent(size)}`);
  };

  return (
    <div className="home-page">
      <header className="topnav">
        <div className="container topnav-inner">
          <a className="logo" href="/">MakeReadme</a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#features">Features</a>
            <a href="#flow">Flow</a>
            <a href="/studio">Studio</a>
          </nav>
          <a className="btn" href="/studio">Open studio</a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">README GENERATOR · REPO TO DOCS</p>
              <h1>Make a useful README from a GitHub repo.</h1>
              <p className="lead">
                Paste a repository URL, choose how detailed the README should be, then review the generated Markdown in the studio.
              </p>
            </div>
            <div className="command-panel" aria-label="README generator">
              <form className="prompt-row" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="repo-url">GitHub repository URL</label>
                <input
                  className="input"
                  id="repo-url"
                  type="url"
                  placeholder="https://github.com/user/repo"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">Generate →</button>
              </form>
              <div className="length-selector">
                <span className="meta">README LENGTH</span>
                <div className="pill-group">
                  {README_SIZES.map((s) => (
                    <label className="pill" key={s.value}>
                      <input
                        type="radio"
                        name="length"
                        value={s.value}
                        checked={size === s.value}
                        onChange={() => setSize(s.value)}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
                <p className="meta">{selectedSize?.desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">WHY IT EXISTS</p>
                <h2>README generation for teams that still read the output.</h2>
              </div>
              <p className="lead">
                MakeReadme keeps the generated document editable and scoped instead of producing a wall of generic project praise.
              </p>
            </div>
            <div className="grid-3">
              <article className="card">
                <h3>Section controls</h3>
                <p>Detected package managers, scripts, and framework files shape the README outline before copy is generated.</p>
              </article>
              <article className="card">
                <h3>Badge builder</h3>
                <p>Add language, framework, tool, and project-status badges without leaving the README editor.</p>
              </article>
              <article className="card">
                <h3>Split preview</h3>
                <p>Edit Markdown and preview the rendered README side by side before copying or downloading.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="flow">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">FLOW</p>
                <h2>Three steps, no prompt archaeology.</h2>
              </div>
              <div className="steps">
                <article className="step">
                  <span className="step-num">01</span>
                  <div>
                    <h3>Paste a repo</h3>
                    <p className="meta">Start from a GitHub URL and a target README length.</p>
                  </div>
                </article>
                <article className="step">
                  <span className="step-num">02</span>
                  <div>
                    <h3>Review the plan</h3>
                    <p className="meta">Keep sections that matter, remove the rest, and add badges.</p>
                  </div>
                </article>
                <article className="step">
                  <span className="step-num">03</span>
                  <div>
                    <h3>Export Markdown</h3>
                    <p className="meta">Copy the final README or download it from the studio.</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <span>MakeReadme · AI README Generator</span>
          <span><a href="/studio">Studio</a></span>
        </div>
      </footer>
    </div>
  );
}
