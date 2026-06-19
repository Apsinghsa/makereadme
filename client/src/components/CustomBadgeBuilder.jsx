import { useState } from 'react';
import { getCustomBadgeMarkdown } from '../lib/badgeMarkdown';

export default function CustomBadgeBuilder({ onAdd, disabled }) {
  const [label, setLabel] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('blue');

  const preview = label && message && color
    ? `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}`
    : null;

  const handleAdd = () => {
    const md = getCustomBadgeMarkdown(label, message, color);
    if (!md) return;
    onAdd(md);
    setLabel('');
    setMessage('');
    setColor('blue');
  };

  return (
    <div className="grid gap-2 mt-3">
      <div className="grid grid-cols-[repeat(3,1fr)_auto] gap-2 max-sm:grid-cols-1">
        <input
          className="w-full min-h-[40px] px-3 py-2 border border-border rounded-md bg-bg text-fg outline-none placeholder-meta focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={disabled}
        />
        <input
          className="w-full min-h-[40px] px-3 py-2 border border-border rounded-md bg-bg text-fg outline-none placeholder-meta focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
        />
        <input
          className="w-full min-h-[40px] px-3 py-2 border border-border rounded-md bg-bg text-fg outline-none placeholder-meta focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={disabled}
        />
        <button className="inline-flex items-center justify-center min-h-[40px] px-5 py-1 border border-border rounded-sm bg-transparent text-fg font-medium leading-loose no-underline transition-colors hover:border-fg-2 hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleAdd} disabled={disabled || !label || !message}>
          + Add
        </button>
      </div>
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Custom badge preview" height={20} />
        </div>
      )}
    </div>
  );
}
