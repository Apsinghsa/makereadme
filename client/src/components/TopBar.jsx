import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TopBar({
  repoUrl,
  onRepoUrlChange,
  onGenerate,
  isGenerating,
  onCopy,
  copied,
  onDownload,
  isGenerated,
  noSections,
}) {
  const [url, setUrl] = useState(repoUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || noSections) return;
    onRepoUrlChange(url.trim());
    onGenerate();
  };

  return (
    <header className="min-h-[64px] grid grid-cols-[auto_minmax(280px,1fr)_auto] items-center gap-4 px-6 py-3 border-b border-border bg-bg sticky top-0 z-20 max-[820px]:grid-cols-1 max-[820px]:items-stretch max-[820px]:gap-3 max-[820px]:p-4">
      <Link className="font-bold no-underline text-fg inline-flex items-center" to="/">
        <img src="/icon.png" alt="MakeReadme" className="h-8 w-auto block" />
      </Link>
      <form className="grid grid-cols-[1fr_auto] gap-2 min-w-0 max-[820px]:grid-cols-1" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="topbar-repo-url">Repository URL</label>
        <input
          className="w-full min-h-[40px] px-3 py-2 border border-border rounded-md bg-surface text-fg outline-none placeholder-meta focus-visible:ring-2 focus-visible:ring-accent"
          id="topbar-repo-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/user/repo"
        />
        <button
          className="inline-flex items-center justify-center min-h-[40px] px-5 py-1 border rounded-sm font-medium leading-loose no-underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-accent border-accent text-accent-on hover:bg-accent-hover hover:border-accent-hover active:bg-accent-active active:border-accent-active"
          type="submit"
          disabled={isGenerating || !url.trim() || noSections}
          title={noSections ? 'Select at least one section in the sidebar first' : undefined}
        >
          {isGenerating ? 'Generating…' : 'Generate'}
        </button>
      </form>
      <div className="flex justify-end gap-2 max-[820px]:justify-start max-[560px]:flex-wrap">
        <button className="inline-flex items-center justify-center min-h-[40px] px-5 py-1 border border-border rounded-sm bg-transparent text-fg font-medium leading-loose no-underline transition-colors hover:border-fg-2 hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed" onClick={onCopy} disabled={!isGenerated}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <button className="inline-flex items-center justify-center min-h-[40px] px-5 py-1 border border-border rounded-sm bg-transparent text-fg font-medium leading-loose no-underline transition-colors hover:border-fg-2 hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed" onClick={onDownload} disabled={!isGenerated}>
          Download
        </button>
      </div>
    </header>
  );
}
