import MarkdownPreview from './MarkdownPreview';

export default function EditorPreview({ content, onChange, viewMode, setViewMode, lineCount }) {
  const showEditor = viewMode === 'editor' || viewMode === 'split';
  const showPreview = viewMode === 'preview' || viewMode === 'split';

  return (
    <main className="workspace">
      <div className="workspace-head">
        <div className="workspace-title">
          <h1>README Studio</h1>
          <p className="meta">Edit generated Markdown and preview the rendered structure before export.</p>
        </div>
        <div className="segmented" aria-label="View mode">
          {['editor', 'split', 'preview'].map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={viewMode === mode}
              onClick={() => setViewMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <section className="panes">
        <article className={`pane ${showPreview && !showEditor ? 'hidden-mobile' : ''}`}>
          <div className="pane-head">
            <span>EDITOR</span>
            <span>{lineCount} lines</span>
          </div>
          <textarea
            className="editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder="Generated README will stream here..."
          />
        </article>

        <article className={`pane ${showEditor && !showPreview ? 'hidden-mobile' : ''}`}>
          <div className="pane-head">
            <span>PREVIEW</span>
            <span>live</span>
          </div>
          <MarkdownPreview content={content} />
        </article>
      </section>
    </main>
  );
}
