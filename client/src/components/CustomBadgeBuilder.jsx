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
    <div className="builder">
      <div className="builder-row">
        <input
          className="input"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={disabled}
        />
        <input
          className="input"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
        />
        <input
          className="input"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={disabled}
        />
        <button className="btn" onClick={handleAdd} disabled={disabled || !label || !message}>
          + Add
        </button>
      </div>
      {preview && (
        <div className="builder-preview">
          <img src={preview} alt="Custom badge preview" height={20} />
        </div>
      )}
    </div>
  );
}
