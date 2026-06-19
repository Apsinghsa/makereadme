import { SECTIONS } from '../lib/constants';

export default function SectionControls({ selectedSections, onChange }) {
  const toggleSection = (value) => {
    if (selectedSections.includes(value)) {
      onChange(selectedSections.filter((s) => s !== value));
    } else {
      onChange([...selectedSections, value]);
    }
  };

  return (
    <section className="control-section">
      <h2 className="section-title">Sections</h2>
      <div className="check-list">
        {SECTIONS.map((section) => (
          <label className="check-item" key={section.value}>
            <input
              type="checkbox"
              checked={selectedSections.includes(section.value)}
              onChange={() => toggleSection(section.value)}
            />
            <span>{section.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
