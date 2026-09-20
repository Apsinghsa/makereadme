import MarkdownPreview from './MarkdownPreview';

export default function EditorPreview({ content, onChange, viewMode, setViewMode, lineCount }) {
  const showEditor = viewMode === 'editor' || viewMode === 'split';
  const showPreview = viewMode === 'preview' || viewMode === 'split';

  return (
    <main data-tour="editor" className="min-w-0 min-h-0 grid grid-rows-[auto_1fr] bg-surface">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border bg-bg max-[820px]:items-start max-[820px]:flex-col">
        <div className="grid gap-1">
          <h1 className="text-xl leading-[1.25] font-display">README Studio</h1>
          <p className="text-muted text-sm">Edit generated Markdown and preview the rendered structure before export.</p>
        </div>
        <div className="inline-flex border border-border rounded-sm overflow-hidden" aria-label="View mode">
          {['editor', 'split', 'preview'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={`min-h-[36px] px-3 border-0 border-r border-border bg-surface text-muted text-sm cursor-pointer transition-colors last:border-r-0
                ${viewMode === mode
                  ? 'text-fg bg-bg font-medium'
                  : 'hover:text-fg hover:bg-surface-warm'
                }`}
              aria-pressed={viewMode === mode}
              onClick={() => setViewMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <section className={`grid grid-rows-[minmax(0,1fr)] gap-4 p-5 min-h-0 min-[1101px]:pb-2 max-[820px]:p-4 ${showEditor && showPreview ? 'grid-cols-2 max-[820px]:grid-cols-1' : 'grid-cols-1'}`}>
        <article className={`min-w-0 min-h-0 grid grid-rows-[auto_minmax(0,1fr)] border border-border rounded-lg bg-bg overflow-hidden ${showPreview && !showEditor ? 'hidden' : ''}`}>
          <div className="flex justify-between gap-4 px-4 py-3 border-b border-border text-muted text-sm">
            <span>EDITOR</span>
            <span>{lineCount} lines</span>
          </div>
          <textarea
            className="w-full h-full min-h-0 max-[1100px]:min-h-[520px] max-[820px]:min-h-[420px] resize-none border-0 rounded-none p-5 bg-bg text-fg font-mono text-sm outline-none leading-[1.55]"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder="Generated README will stream here..."
          />
        </article>

        <article className={`min-w-0 min-h-0 grid grid-rows-[auto_minmax(0,1fr)] border border-border rounded-lg bg-bg overflow-hidden ${showEditor && !showPreview ? 'hidden' : ''}`}>
          <div className="flex justify-between gap-4 px-4 py-3 border-b border-border text-muted text-sm">
            <span>PREVIEW</span>
            <span>live</span>
          </div>
          <MarkdownPreview content={content} />
        </article>
      </section>
    </main>
  );
}
