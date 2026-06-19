import { useState } from 'react';
import { BADGE_CATEGORIES } from '../lib/badgePresets';
import { BADGE_CATEGORIES_TABS } from '../lib/constants';
import { getBadgeMarkdown, extractBadgeUrl } from '../lib/badgeMarkdown';
import CustomBadgeBuilder from './CustomBadgeBuilder';

export default function BadgePanel({ onInsertBadge, disabled }) {
  const [activeCategory, setActiveCategory] = useState(BADGE_CATEGORIES_TABS[0]);

  const handleInsert = (badgeMd) => {
    if (disabled) return;
    onInsertBadge(badgeMd);
  };

  return (
    <section className={`control-section ${disabled ? 'disabled-overlay' : ''}`}>
      <h2 className="section-title">Badges</h2>

      {disabled && (
        <div className="overlay-message">
          Badges unlock after generation completes
        </div>
      )}

      <div className="badge-tabs">
        {BADGE_CATEGORIES_TABS.map((cat) => (
          <button
            key={cat}
            className={`badge-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            disabled={disabled}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="badge-grid">
        {BADGE_CATEGORIES[activeCategory].map((badge) => {
          const badgeMd = getBadgeMarkdown(badge);
          const url = extractBadgeUrl(badgeMd);
          return (
            <button
              key={badge.label}
              className="badge-grid-btn"
              onClick={() => handleInsert(badgeMd)}
              disabled={disabled}
              title={`Insert ${badge.label} badge`}
            >
              <img
                src={url}
                alt={badge.label}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </button>
          );
        })}
      </div>

      <CustomBadgeBuilder onAdd={handleInsert} disabled={disabled} />
    </section>
  );
}
