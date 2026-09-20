import { useCallback, useLayoutEffect, useState } from 'react';

const DONE_KEY = 'makereadme:studio-tour-done';
const SKIP_KEY = 'makereadme:studio-tour-skipped';
const TOOLTIP_WIDTH = 320;
const MARGIN = 12;

const STEPS = [
  {
    target: '[data-tour="sections"]',
    placement: 'right',
    title: 'Pick your sections',
    body: 'Select the sections you want in the README. At least one is required before you can generate.',
  },
  {
    target: '[data-tour="generate"]',
    placement: 'bottom',
    title: 'Generate',
    body: 'Paste a repository URL and press Generate. It stays disabled until you pick a section.',
  },
  {
    target: '[data-tour="status"]',
    placement: 'bottom',
    fallback: 'top-right',
    title: 'Watch the live status',
    body: 'While generating, a status panel appears here in the top-right — one step at a time, with a spinner on the current one.',
  },
  {
    target: '[data-tour="editor"]',
    placement: 'left',
    title: 'Edit and preview',
    body: 'Your README streams into the editor with a live rendered preview beside it.',
  },
  {
    target: '[data-tour="export"]',
    placement: 'bottom',
    title: 'Copy or download',
    body: 'When it looks right, copy the Markdown or download it as README.md.',
  },
];

function place(rect, placement, fallback) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!rect) {
    if (fallback === 'top-right') {
      return { left: Math.max(8, vw - TOOLTIP_WIDTH - 16), top: 84 };
    }
    return {
      left: Math.max(8, vw / 2 - TOOLTIP_WIDTH / 2),
      top: Math.max(8, vh / 2 - 120),
    };
  }

  let left = rect.left;
  let top = rect.bottom + MARGIN;

  if (placement === 'right') {
    left = rect.right + MARGIN;
    top = rect.top;
    if (left + TOOLTIP_WIDTH > vw - 8) left = rect.left - TOOLTIP_WIDTH - MARGIN;
  } else if (placement === 'left') {
    left = rect.left - TOOLTIP_WIDTH - MARGIN;
    top = rect.top;
    if (left < 8) left = rect.right + MARGIN;
  }

  left = Math.min(Math.max(8, left), Math.max(8, vw - TOOLTIP_WIDTH - 8));
  top = Math.min(Math.max(8, top), Math.max(8, vh - 220));
  return { left, top };
}

export default function StudioTour() {
  const [visible, setVisible] = useState(() => {
    try {
      return !(localStorage.getItem(DONE_KEY) || sessionStorage.getItem(SKIP_KEY));
    } catch {
      // storage unavailable: still show the tour
      return true;
    }
  });
  const [index, setIndex] = useState(0);
  const [dontShow, setDontShow] = useState(false);
  const [rect, setRect] = useState(null);
  const [inHeader, setInHeader] = useState(false);
  const [headerBottom, setHeaderBottom] = useState(0);

  const step = STEPS[index];

  const measure = useCallback(() => {
    const el = document.querySelector(step.target);
    const header = document.querySelector('header');
    setRect(el ? el.getBoundingClientRect() : null);
    setInHeader(el ? !!el.closest('header') : false);
    setHeaderBottom(header ? header.getBoundingClientRect().bottom : 0);
  }, [step]);

  useLayoutEffect(() => {
    if (!visible) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tooltip rect must be measured from the DOM before paint
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [visible, measure]);

  if (!visible) return null;

  const close = () => {
    try {
      if (dontShow) localStorage.setItem(DONE_KEY, '1');
      else sessionStorage.setItem(SKIP_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const pos = place(rect, step.placement, step.fallback);
  const isLast = index === STEPS.length - 1;

  return (
    <div
      className="pointer-events-none"
      role="dialog"
      aria-label="Studio walkthrough"
    >
      {!rect && !step.fallback && (
        <div className="fixed inset-0 z-[15]" style={{ background: 'rgba(0, 0, 0, 0.55)' }} />
      )}

      {rect &&
        (inHeader ? (
          <>
            <div
              className="fixed z-[15]"
              style={{
                top: headerBottom,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.55)',
              }}
            />
            <div
              className="fixed z-[25] rounded-lg border-2 border-accent transition-all duration-200"
              style={{
                left: rect.left - 4,
                top: rect.top - 4,
                width: rect.width + 8,
                height: rect.height + 8,
              }}
            />
          </>
        ) : (
          <div
            className="fixed z-[15] rounded-lg border-2 border-accent transition-all duration-200"
            style={{
              left: rect.left - 4,
              top: rect.top - 4,
              width: rect.width + 8,
              height: rect.height + 8,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
            }}
          />
        ))}

      <div
        className="fixed z-[60] pointer-events-auto rounded-lg border border-accent bg-surface p-4 shadow-xl"
        style={{ left: pos.left, top: pos.top, width: TOOLTIP_WIDTH }}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-accent text-xs font-bold uppercase">
            Step {index + 1} / {STEPS.length}
          </span>
          <button
            type="button"
            aria-label="Skip tour"
            onClick={close}
            className="bg-transparent border-0 text-muted hover:text-fg text-lg leading-none -mt-1"
          >
            ×
          </button>
        </div>

        <h3 className="text-fg text-base font-display mt-2">{step.title}</h3>
        <p className="text-muted text-sm mt-1">{step.body}</p>

        <label className="flex items-center gap-2 text-muted text-xs mt-3 cursor-pointer select-none">
          <input
            type="checkbox"
            style={{ accentColor: 'var(--accent)' }}
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
          />
          Do not show again
        </label>

        <div className="flex items-center justify-between gap-2 mt-4">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="min-h-[34px] px-3 border border-border rounded-sm bg-transparent text-fg text-sm transition-colors hover:border-fg-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => (isLast ? close() : setIndex((i) => i + 1))}
            className="min-h-[34px] px-4 border rounded-sm bg-accent border-accent text-accent-on text-sm font-medium transition-colors hover:bg-accent-hover hover:border-accent-hover"
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
