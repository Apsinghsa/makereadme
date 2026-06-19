import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_SIZE, SECTIONS } from '../lib/constants';
import { useStreamingReadme } from '../hooks/useStreamingReadme';
import { insertBadgeAfterHeading, countLines, countActiveSections } from '../lib/markdownHelpers';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import SectionControls from './SectionControls';
import BadgePanel from './BadgePanel';
import EditorPreview from './EditorPreview';
import Footer from './Footer';

export default function StudioPage() {
  const [searchParams] = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  const initialSize = searchParams.get('size') || DEFAULT_SIZE;

  const [repoUrl, setRepoUrl] = useState(initialUrl);
  const [size] = useState(initialSize);
  const [sections, setSections] = useState([]);
  const [viewMode, setViewMode] = useState('split');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to edit');

  const {
    markdown,
    setMarkdown,
    isGenerating,
    isGenerated,
    error,
    startGeneration,
  } = useStreamingReadme();

  useEffect(() => {
    if (isGenerating) {
      setStatusMessage('Generating…');
    } else if (isGenerated) {
      setStatusMessage('Generated from repository URL');
    } else if (error) {
      setStatusMessage(error);
    } else {
      setStatusMessage('Ready to edit');
    }
  }, [isGenerating, isGenerated, error]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleRepoUrlChange = useCallback((url) => {
    setRepoUrl(url);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!repoUrl.trim()) return;
    startGeneration(repoUrl, size, sections);
  }, [repoUrl, size, sections, startGeneration]);

  const handleInsertBadge = useCallback((badgeMd) => {
    if (!isGenerated) return;
    setMarkdown((current) => insertBadgeAfterHeading(current, badgeMd));
  }, [isGenerated, setMarkdown]);

  const handleCopy = useCallback(async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setStatusMessage('Copied README to clipboard');
    } catch {
      setStatusMessage('Copy failed');
    }
  }, [markdown]);

  const handleDownload = useCallback(() => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMessage('Downloaded README.md');
  }, [markdown]);

  const lineCount = countLines(markdown);
  const activeSectionCount = countActiveSections(sections);

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-bg text-fg">
      <TopBar
        repoUrl={repoUrl}
        onRepoUrlChange={handleRepoUrlChange}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        onCopy={handleCopy}
        copied={copied}
        onDownload={handleDownload}
        isGenerated={isGenerated}
        noSections={sections.length === 0}
      />

      <div className="grid grid-cols-[300px_minmax(0,1fr)] min-h-[calc(100vh-65px)] max-[1100px]:grid-cols-1">
        <Sidebar>
          <SectionControls selectedSections={sections} onChange={setSections} />
          <BadgePanel onInsertBadge={handleInsertBadge} disabled={!isGenerated} repoUrl={repoUrl} />
          <section className="border-t border-border pt-5 mt-5 max-[1100px]:border-t-0 max-[1100px]:pt-0 max-[1100px]:mt-0">
            <h2 className="text-muted text-xs font-bold uppercase mb-3">Document</h2>
            <div className="border border-border rounded-lg bg-surface p-4 text-muted text-sm grid gap-2">
              <p><strong className="text-fg">{lineCount}</strong> lines</p>
              <p><strong className="text-fg">{activeSectionCount}</strong> active sections</p>
              <p>{statusMessage}</p>
            </div>
          </section>
        </Sidebar>

        <EditorPreview
          content={markdown}
          onChange={setMarkdown}
          viewMode={viewMode}
          setViewMode={setViewMode}
          lineCount={lineCount}
        />
      </div>

      <Footer />
    </div>
  );
}
