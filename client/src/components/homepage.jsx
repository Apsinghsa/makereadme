import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

// ── Badge categories & templates ──────────────────────────────────────────────
const BADGE_CATEGORIES = {
  'Languages': [
    { label: 'JavaScript', color: 'F7DF1E', logo: 'javascript', logoColor: 'black' },
    { label: 'TypeScript', color: '3178C6', logo: 'typescript', logoColor: 'white' },
    { label: 'Python', color: '3776AB', logo: 'python', logoColor: 'white' },
    { label: 'Rust', color: '000000', logo: 'rust', logoColor: 'white' },
    { label: 'Go', color: '00ADD8', logo: 'go', logoColor: 'white' },
    { label: 'Java', color: 'ED8B00', logo: 'openjdk', logoColor: 'white' },
    { label: 'C++', color: '00599C', logo: 'cplusplus', logoColor: 'white' },
    { label: 'C#', color: '239120', logo: 'csharp', logoColor: 'white' },
    { label: 'PHP', color: '777BB4', logo: 'php', logoColor: 'white' },
    { label: 'Ruby', color: 'CC342D', logo: 'ruby', logoColor: 'white' },
    { label: 'Swift', color: 'FA7343', logo: 'swift', logoColor: 'white' },
    { label: 'Kotlin', color: '7F52FF', logo: 'kotlin', logoColor: 'white' },
    { label: 'Dart', color: '0175C2', logo: 'dart', logoColor: 'white' },
  ],
  'Frameworks': [
    { label: 'React', color: '61DAFB', logo: 'react', logoColor: 'black' },
    { label: 'Next.js', color: '000000', logo: 'nextdotjs', logoColor: 'white' },
    { label: 'Vue.js', color: '4FC08D', logo: 'vuedotjs', logoColor: 'white' },
    { label: 'Angular', color: 'DD0031', logo: 'angular', logoColor: 'white' },
    { label: 'Svelte', color: 'FF3E00', logo: 'svelte', logoColor: 'white' },
    { label: 'Express', color: '000000', logo: 'express', logoColor: 'white' },
    { label: 'FastAPI', color: '009688', logo: 'fastapi', logoColor: 'white' },
    { label: 'Django', color: '092E20', logo: 'django', logoColor: 'white' },
    { label: 'Flask', color: '000000', logo: 'flask', logoColor: 'white' },
    { label: 'Spring', color: '6DB33F', logo: 'spring', logoColor: 'white' },
    { label: 'Flutter', color: '02569B', logo: 'flutter', logoColor: 'white' },
    { label: 'Tailwind CSS', color: '06B6D4', logo: 'tailwindcss', logoColor: 'white' },
    { label: 'Node.js', color: '339933', logo: 'nodedotjs', logoColor: 'white' },
  ],
  'Tools': [
    { label: 'Docker', color: '2496ED', logo: 'docker', logoColor: 'white' },
    { label: 'Kubernetes', color: '326CE5', logo: 'kubernetes', logoColor: 'white' },
    { label: 'Git', color: 'F05032', logo: 'git', logoColor: 'white' },
    { label: 'GitHub', color: '181717', logo: 'github', logoColor: 'white' },
    { label: 'PostgreSQL', color: '4169E1', logo: 'postgresql', logoColor: 'white' },
    { label: 'MongoDB', color: '47A248', logo: 'mongodb', logoColor: 'white' },
    { label: 'Redis', color: 'DC382D', logo: 'redis', logoColor: 'white' },
    { label: 'Nginx', color: '009639', logo: 'nginx', logoColor: 'white' },
    { label: 'Vite', color: '646CFF', logo: 'vite', logoColor: 'white' },
    { label: 'Webpack', color: '8DD6F9', logo: 'webpack', logoColor: 'black' },
    { label: 'AWS', color: '232F3E', logo: 'amazonaws', logoColor: 'white' },
    { label: 'Vercel', color: '000000', logo: 'vercel', logoColor: 'white' },
  ],
  'Status': [
    { label: 'MIT License', color: 'yellow', logo: '', logoColor: '', static: true, message: 'MIT' },
    { label: 'Apache 2.0', color: 'blue', logo: '', logoColor: '', static: true, message: 'Apache 2.0' },
    { label: 'GPL v3', color: 'blue', logo: '', logoColor: '', static: true, message: 'GPL v3' },
    { label: 'PRs Welcome', color: 'brightgreen', logo: '', logoColor: '', static: true, message: 'PRs Welcome', labelText: 'contributions' },
    { label: 'Maintained', color: 'green', logo: '', logoColor: '', static: true, message: 'yes', labelText: 'maintained' },
    { label: 'WIP', color: 'orange', logo: '', logoColor: '', static: true, message: 'WIP', labelText: 'status' },
  ],
};

function getBadgeMarkdown(badge) {
  const label = badge.labelText || badge.label.replace(/ /g, '_');
  const message = badge.message || badge.label.replace(/ /g, '_');
  if (badge.static) {
    return `![${badge.label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${badge.color})`;
  }
  const logoParam = badge.logo ? `&logo=${badge.logo}&logoColor=${badge.logoColor}` : '';
  return `![${badge.label}](https://img.shields.io/badge/${encodeURIComponent(badge.label.replace(/ /g, '_'))}-${badge.color}?style=flat-square${logoParam})`;
}

// ── Custom Badge Builder ───────────────────────────────────────────────────────
function CustomBadgeBuilder({ onAdd }) {
  const [label, setLabel] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('blue');
  const preview = label && message
    ? `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}`
    : null;

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px', marginTop: 12 }}>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Custom Badge</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <input placeholder="Label" value={label} onChange={e => setLabel(e.target.value)}
          style={{ flex: 1, minWidth: 80, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '5px 8px', color: '#e2e8f0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
        <input placeholder="Message" value={message} onChange={e => setMessage(e.target.value)}
          style={{ flex: 1, minWidth: 80, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '5px 8px', color: '#e2e8f0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
        <input placeholder="Color (e.g. blue, FF6B6B)" value={color} onChange={e => setColor(e.target.value)}
          style={{ flex: 1, minWidth: 80, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '5px 8px', color: '#e2e8f0', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
        <button onClick={() => {
          if (!label || !message) return;
          const md = `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color})`;
          onAdd(md);
          setLabel(''); setMessage(''); setColor('blue');
        }} style={{ background: '#4ade80', color: '#000', border: 'none', borderRadius: 4, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
          + Add
        </button>
      </div>
      {preview && <img src={preview} alt="preview" style={{ marginTop: 8, height: 20 }} />}
    </div>
  );
}

// ── Badge Panel ────────────────────────────────────────────────────────────────
function BadgePanel({ onInsertBadge }) {
  const [activeCategory, setActiveCategory] = useState('Languages');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {Object.keys(BADGE_CATEGORIES).map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{
              padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
              background: activeCategory === cat ? '#4ade80' : 'rgba(255,255,255,0.07)',
              color: activeCategory === cat ? '#000' : '#aaa',
              fontWeight: activeCategory === cat ? 700 : 400,
              transition: 'all 0.15s',
            }}>
            {cat}
          </button>
        ))}
      </div>
      {/* Badge grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {BADGE_CATEGORIES[activeCategory].map(badge => (
            <button key={badge.label} onClick={() => onInsertBadge(getBadgeMarkdown(badge))}
              title={`Click to insert ${badge.label} badge`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', borderRadius: 4, transition: 'transform 0.1s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <img
                src={getBadgeMarkdown(badge).match(/!\[.*?\]\((.*?)\)/)?.[1]}
                alt={badge.label}
                style={{ height: 22, display: 'block' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </button>
          ))}
        </div>
        <CustomBadgeBuilder onAdd={onInsertBadge} />
      </div>
    </div>
  );
}

// ── Main Editor ────────────────────────────────────────────────────────────────
function EditorView({ content, onChange, onDownload, streaming }) {
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'split'
  const [showBadges, setShowBadges] = useState(false);
  const [copied, setCopied] = useState(false);

  const insertBadge = useCallback((badgeMd) => {
    const lines = content.split('\n');
    const h1idx = lines.findIndex(l => l.startsWith('# '));
    if (h1idx !== -1) {
      // Find if there's a center block right after title
      let centerStart = -1, centerEnd = -1;
      for (let i = h1idx + 1; i < Math.min(h1idx + 10, lines.length); i++) {
        if (lines[i].startsWith('<p align="center">')) centerStart = i;
        if (centerStart !== -1 && lines[i].startsWith('</p>')) { centerEnd = i; break; }
      }
      if (centerStart !== -1 && centerEnd !== -1) {
        // Insert badge before </p>, with blank line separation
        lines.splice(centerEnd, 0, '', badgeMd);
      } else {
        // Create new center block after title with blank lines for GitHub markdown
        lines.splice(h1idx + 1, 0, '', '<p align="center">', '', badgeMd, '', '</p>', '');
      }
      onChange(lines.join('\n'));
    } else {
      onChange('<p align="center">\n\n' + badgeMd + '\n\n</p>\n\n' + content);
    }
  }, [content, onChange]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', width: '100%',
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#4ade80', letterSpacing: '-0.02em' }}>makereadme</span>
          <span style={{ color: '#4b5563', fontSize: 12 }}>README.md</span>
          {streaming && (
            <span style={{ fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
              generating…
            </span>
          )}
        </div>
        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: 3, gap: 2 }}>
          {['editor', 'split', 'preview'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '4px 14px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 12,
                background: activeTab === tab ? '#4ade80' : 'transparent',
                color: activeTab === tab ? '#000' : '#888',
                fontWeight: activeTab === tab ? 700 : 400,
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.15s',
              }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowBadges(s => !s)} style={{
            padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
            background: showBadges ? 'rgba(74,222,128,0.12)' : 'transparent',
            color: showBadges ? '#4ade80' : '#9ca3af', fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'all 0.15s',
          }}>
            Badges
          </button>
          <button onClick={handleCopy} style={{
            padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
            background: 'transparent', color: copied ? '#4ade80' : '#9ca3af', fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.15s',
          }}>
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>
          <button onClick={onDownload} style={{
            padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: '#4ade80', color: '#000', fontSize: 12, fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            ↓ Download
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Badge panel */}
        {showBadges && (
          <div style={{
            width: 300, flexShrink: 0,
            background: '#0d1117', borderRight: '1px solid rgba(255,255,255,0.08)',
            padding: '14px 14px 14px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 11, color: '#4ade80', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              shields.io badges
            </div>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 10 }}>
              Click a badge to insert it after the first heading
            </div>
            <BadgePanel onInsertBadge={insertBadge} />
          </div>
        )}

        {/* Editor pane */}
        {(activeTab === 'editor' || activeTab === 'split') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: activeTab === 'split' ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <div style={{ padding: '6px 16px', background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#4b5563' }}>
              EDITOR · {content.split('\n').length} lines
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => onChange(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none',
                background: '#0d1117', color: '#e2e8f0',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 13, lineHeight: 1.7,
                padding: '20px 24px',
                tabSize: 2,
              }}
            />
          </div>
        )}

        {/* Preview pane */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div style={{ flex: 1, overflow: 'auto', background: '#0d1117' }}>
            <div style={{ padding: '6px 16px', background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#4b5563', position: 'sticky', top: 0 }}>
              PREVIEW
            </div>
            <div className="markdown-preview" style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Landing Page ───────────────────────────────────────────────────────────────
function LandingPage({ onGenerate, loading, error, readmeSize, onSizeChange }) {
  const [repoUrl, setRepoUrl] = useState('');

  const SIZES = [
    { value: 'quick-start', label: 'Quick Start', desc: '~50 lines, bare essentials' },
    { value: 'concise', label: 'Concise', desc: '~80 lines, tight & scannable' },
    { value: 'standard', label: 'Standard', desc: '~120 lines, balanced' },
    { value: 'detailed', label: 'Detailed', desc: '~180 lines, thorough' },
    { value: 'comprehensive', label: 'Comprehensive', desc: '~250+ lines, full docs' },
    { value: 'enterprise', label: 'Enterprise', desc: '~350+ lines, maximum detail' },
  ];

  const handleSubmit = () => {
    if (repoUrl.trim()) onGenerate(repoUrl.trim());
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: 640, padding: '0 24px' }}>
        {/* Logo area */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.04em', color: '#4ade80' }}>make</span>
          <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.04em', color: '#e2e8f0' }}>readme</span>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 48, letterSpacing: '0.04em' }}>
          paste a github repo → get a beautiful README
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <input
            placeholder="https://github.com/user/repo"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            disabled={loading}
            style={{
              flex: 1, padding: '14px 20px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0', fontSize: 14, outline: 'none',
              fontFamily: '"JetBrains Mono", monospace',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button onClick={handleSubmit} disabled={loading || !repoUrl.trim()}
            style={{
              padding: '14px 24px', borderRadius: 8, border: 'none', cursor: loading ? 'wait' : 'pointer',
              background: loading ? 'rgba(74,222,128,0.4)' : '#4ade80',
              color: '#000', fontWeight: 700, fontSize: 14,
              fontFamily: '"JetBrains Mono", monospace',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
              opacity: !repoUrl.trim() ? 0.5 : 1,
            }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                  </path>
                </svg>
                generating…
              </span>
            ) : 'Generate →'}
          </button>
        </div>

        {/* Size selector */}
        <div style={{ marginTop: 16, width: '100%' }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}>README Length</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SIZES.map(s => (
              <button key={s.value} onClick={() => onSizeChange(s.value)} disabled={loading}
                style={{
                  padding: '6px 12px', borderRadius: 6, border: '1px solid',
                  borderColor: readmeSize === s.value ? '#4ade80' : 'rgba(255,255,255,0.1)',
                  background: readmeSize === s.value ? 'rgba(74,222,128,0.1)' : 'transparent',
                  color: readmeSize === s.value ? '#4ade80' : '#6b7280',
                  fontSize: 12, cursor: loading ? 'wait' : 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  transition: 'all 0.15s',
                }}>
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#4b5563', marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>
            {SIZES.find(s => s.value === readmeSize)?.desc}
          </div>
        </div>

        {loading && (
          <div style={{ marginTop: 20, fontSize: 12, color: '#4b5563' }}>
            <span style={{ color: '#4ade80' }}>▸</span> fetching repo files & asking gemini which ones to read…
          </div>
        )}

        {error && (
          <div style={{ marginTop: 16, padding: '10px 16px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 48, fontSize: 11, color: '#374151', lineHeight: 1.8 }}>
          <div>↳ two-pass AI — first asks what to read, then generates</div>
          <div>↳ edit markdown in-browser before downloading</div>
          <div>↳ insert shields.io badges in one click</div>
        </div>
      </div>
    </div>
  );
}

// ── Root Component ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const [stage, setStage] = useState('landing'); // 'landing' | 'editor'
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [readmeSize, setReadmeSize] = useState('standard');

  const handleGenerate = async (repoUrl) => {
    setLoading(true);
    setError('');
    setMarkdown('');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/generate?url=${encodeURIComponent(repoUrl)}&size=${encodeURIComponent(readmeSize)}`
      );
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      // Switch to editor immediately
      setStage('editor');
      setStreaming(true);

      // Read the response as a stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMarkdown(accumulated);
      }

      setStreaming(false);
    } catch (err) {
      setError(err.message || 'Failed to generate README. Check the URL and try again.');
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'README.md';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (stage === 'editor') {
    return <EditorView content={markdown} onChange={setMarkdown} onDownload={handleDownload} streaming={streaming} />;
  }

  return <LandingPage onGenerate={handleGenerate} loading={loading} error={error} readmeSize={readmeSize} onSizeChange={setReadmeSize} />;
}
