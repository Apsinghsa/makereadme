import { useEffect } from 'react';

const ICONS = {
  done: <span className="text-success leading-none">✓</span>,
  active: (
    <span className="inline-block h-3 w-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
  ),
  error: <span className="text-danger leading-none">✕</span>,
};

const TEXT = {
  done: 'text-fg-2',
  active: 'text-fg',
  error: 'text-danger',
};

export default function StatusNotification({ steps, error, isGenerated, visible, onDismiss }) {
  const shown = steps.filter((s) => s.state !== 'pending');

  useEffect(() => {
    if (!isGenerated || !visible) return;
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [isGenerated, visible, onDismiss]);

  if (!visible || (shown.length === 0 && !error)) return null;

  return (
    <aside
      data-tour="status"
      className="fixed right-4 top-20 z-10 w-[280px] max-w-[calc(100vw-32px)] rounded-lg border border-border bg-surface p-4 shadow-xl"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-muted text-xs font-bold uppercase">Status</h2>
        <button
          type="button"
          aria-label="Dismiss status"
          onClick={onDismiss}
          className="bg-transparent border-0 text-muted hover:text-fg text-lg leading-none -mt-1"
        >
          ×
        </button>
      </div>

      <ul className="grid gap-2">
        {shown.map((step) => (
          <li
            key={step.id}
            className={`grid grid-cols-[16px_1fr] items-start gap-2 text-sm ${TEXT[step.state]}`}
          >
            <span className="flex justify-center pt-0.5">{ICONS[step.state]}</span>
            <span>{step.label}</span>
          </li>
        ))}
      </ul>

      {error && <p className="text-danger text-xs mt-3">{error}</p>}
    </aside>
  );
}
