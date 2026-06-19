import { useState } from 'react';
import { SECTIONS, SECTION_CATEGORIES } from '../lib/constants';

const CATEGORY_NAMES = Object.keys(SECTION_CATEGORIES);

export default function SectionControls({ selectedSections, onChange }) {
  const [category, setCategory] = useState('All');

  // Which sections to display in the tag cloud
  const visibleSections = SECTION_CATEGORIES[category] === null
    ? SECTIONS
    : SECTIONS.filter((s) => SECTION_CATEGORIES[category].includes(s.value));

  const visibleValues = visibleSections.map((s) => s.value);
  const allVisibleSelected = visibleValues.length > 0
    && visibleValues.every((v) => selectedSections.includes(v));

  const toggleSection = (value) => {
    if (selectedSections.includes(value)) {
      onChange(selectedSections.filter((s) => s !== value));
    } else {
      onChange([...selectedSections, value]);
    }
  };

  const handleToggleAll = () => {
    if (allVisibleSelected) {
      // Deselect everything visible in this category
      onChange(selectedSections.filter((v) => !visibleValues.includes(v)));
    } else {
      // Add all visible to whatever is already selected
      onChange([...new Set([...selectedSections, ...visibleValues])]);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-muted text-xs font-bold uppercase">Sections</h2>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative inline-flex items-center">
            <select
              className="category-select bg-surface border border-border rounded-sm text-muted text-xs font-mono pl-2 pr-[22px] py-0.5 cursor-pointer outline-none leading-relaxed transition-colors hover:border-fg-2 hover:text-fg-2 focus-visible:border-accent focus-visible:text-fg max-w-[120px]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter sections by project type"
            >
              {CATEGORY_NAMES.map((cat) => (
                <option key={cat} value={cat} className="bg-surface text-fg">{cat}</option>
              ))}
            </select>
          </div>
          <button
            className="text-xs text-muted bg-transparent border border-border rounded-sm px-2 py-0.5 cursor-pointer transition-colors leading-relaxed hover:text-fg-2 hover:border-fg-2"
            onClick={handleToggleAll}
            type="button"
          >
            {allVisibleSelected ? 'Clear' : 'All'}
          </button>
        </div>
      </div>

      {selectedSections.length === 0 && (
        <p className="text-xs text-warn mb-3 opacity-85">Pick at least one section to generate.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {visibleSections.map((section) => {
          const active = selectedSections.includes(section.value);
          return (
            <button
              key={section.value}
              type="button"
              className={`inline-flex items-center px-3 py-1 border rounded-full bg-transparent text-xs font-mono cursor-pointer select-none transition-all leading-relaxed
                ${active
                  ? 'bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] border-accent text-accent shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_28%,transparent)]'
                  : 'border-border text-muted hover:border-fg-2 hover:text-fg-2'
                }`}
              onClick={() => toggleSection(section.value)}
              aria-pressed={active}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
