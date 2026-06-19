import { useState } from 'react';
import { BADGE_CATEGORIES } from '../lib/badgePresets';
import { BADGE_CATEGORIES_TABS } from '../lib/constants';
import { getBadgeMarkdown, getGitHubBadgeMarkdown, extractBadgeUrl } from '../lib/badgeMarkdown';
import CustomBadgeBuilder from './CustomBadgeBuilder';

export default function BadgePanel({ onInsertBadge, disabled, repoUrl }) {
  const [activeCategory, setActiveCategory] = useState(BADGE_CATEGORIES_TABS[0]);

  const handleInsert = (badgeMd) => {
    if (disabled) return;
    onInsertBadge(badgeMd);
  };

  const getBadgeMdForBadge = (badge) => {
    if (badge.github) return getGitHubBadgeMarkdown(badge, repoUrl);
    return getBadgeMarkdown(badge);
  };

  return (
    <section className={`border-t border-border pt-5 mt-5 max-[1100px]:border-t-0 max-[1100px]:pt-0 max-[1100px]:mt-0 ${disabled ? 'disabled-overlay' : ''}`}>
      <h2 className="text-muted text-xs font-bold uppercase mb-3">Badges</h2>

      {disabled && (
        <div className="overlay-message">
          Badges unlock after generation completes
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-3">
        {BADGE_CATEGORIES_TABS.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 border rounded-sm text-xs cursor-pointer bg-transparent transition-colors
              ${activeCategory === cat
                ? 'bg-surface border-accent text-fg'
                : 'border-border text-muted hover:border-fg-2 hover:text-fg'
              }`}
            onClick={() => setActiveCategory(cat)}
            disabled={disabled}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {BADGE_CATEGORIES[activeCategory].map((badge) => {
          const badgeMd = getBadgeMdForBadge(badge);
          const url = extractBadgeUrl(badgeMd);
          return (
            <button
              key={badge.label}
              className="flex items-center justify-center p-0.5 border-0 bg-transparent cursor-pointer transition-transform duration-100 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              onClick={() => handleInsert(badgeMd)}
              disabled={disabled}
              title={`Insert ${badge.label} badge`}
            >
              <img
                src={url}
                alt={badge.label}
                className="h-[22px] block"
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
