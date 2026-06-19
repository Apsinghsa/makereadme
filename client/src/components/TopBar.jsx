import { useState } from 'react';

export default function TopBar({ repoUrl, onRepoUrlChange, onGenerate, isGenerating, onCopy, copied, onDownload, isGenerated }) {
  const [url, setUrl] = useState(repoUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onRepoUrlChange(url.trim());
    onGenerate();
  };

  return (
    <header className="topbar">
      <a className="logo" href="/">MakeReadme</a>
      <form className="command-group" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="topbar-repo-url">Repository URL</label>
        <input
          className="input"
          id="topbar-repo-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/user/repo"
        />
        <button className="btn btn-primary" type="submit" disabled={isGenerating || !url.trim()}>
          {isGenerating ? 'Generating…' : 'Generate'}
        </button>
      </form>
      <div className="topbar-actions">
        <button className="btn" onClick={onCopy} disabled={!isGenerated}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button className="btn" onClick={onDownload} disabled={!isGenerated}>
          Download
        </button>
      </div>
    </header>
  );
}
