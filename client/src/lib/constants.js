export const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';

export const README_SIZES = [
  { value: 'quick-start', label: 'Quick Start', desc: '~50 lines, bare essentials' },
  { value: 'concise', label: 'Concise', desc: '~80 lines, tight & scannable' },
  { value: 'standard', label: 'Standard', desc: '~120 lines, balanced' },
  { value: 'detailed', label: 'Detailed', desc: '~180 lines, thorough' },
  { value: 'comprehensive', label: 'Comprehensive', desc: '~250+ lines, full docs' },
  { value: 'enterprise', label: 'Enterprise', desc: '~350+ lines, maximum detail' },
];

export const DEFAULT_SIZE = 'standard';

/**
 * All default sections = false. User must choose at least one before generating.
 *
 * Grouped by function so the tag cloud has a natural reading order:
 *   Core → Setup → Usage → Architecture → Dev/Ops → ML/Data → Meta
 */
export const SECTIONS = [
  // ── Core ──────────────────────────────────────────
  { value: 'Title',              label: 'Title' },
  { value: 'Description',        label: 'Description' },
  { value: 'TOC',                label: 'Table of Contents' },
  { value: 'Features',           label: 'Features' },
  { value: 'Demo',               label: 'Demo / Screenshots' },

  // ── Setup ─────────────────────────────────────────
  { value: 'Prerequisites',      label: 'Prerequisites' },
  { value: 'Installation',       label: 'Installation' },
  { value: 'Configuration',      label: 'Configuration' },
  { value: 'Environment Variables', label: 'Env Variables' },
  { value: 'Docker',             label: 'Docker' },

  // ── Usage ─────────────────────────────────────────
  { value: 'Usage',              label: 'Usage' },
  { value: 'Examples',           label: 'Examples' },
  { value: 'API Reference',      label: 'API Reference' },
  { value: 'CLI Reference',      label: 'CLI Reference' },
  { value: 'SDK / Integration',  label: 'SDK / Integration' },

  // ── Architecture ──────────────────────────────────
  { value: 'Architecture',       label: 'Architecture' },
  { value: 'Project Structure',  label: 'Project Structure' },
  { value: 'Database Schema',    label: 'Database Schema' },
  { value: 'Hardware Requirements', label: 'Hardware Requirements' },

  // ── Dev / Ops ──────────────────────────────────────
  { value: 'Deployment',         label: 'Deployment' },
  { value: 'Testing',            label: 'Testing' },
  { value: 'Benchmarks',         label: 'Benchmarks' },
  { value: 'Security',           label: 'Security' },

  // ── ML / Data Science ─────────────────────────────
  { value: 'Dataset',            label: 'Dataset' },
  { value: 'Model Architecture', label: 'Model Architecture' },
  { value: 'Training',           label: 'Training' },
  { value: 'Results / Metrics',  label: 'Results / Metrics' },

  // ── Meta ──────────────────────────────────────────
  { value: 'Contributing',       label: 'Contributing' },
  { value: 'Changelog',          label: 'Changelog' },
  { value: 'Roadmap',            label: 'Roadmap' },
  { value: 'License',            label: 'License' },
  { value: 'Acknowledgements',   label: 'Acknowledgements' },
  { value: 'FAQ',                label: 'FAQ' },
  { value: 'Troubleshooting',    label: 'Troubleshooting' },
];

export const BADGE_CATEGORIES_TABS = ['Languages', 'Frameworks', 'Tools', 'Status', 'GitHub'];

/**
 * Maps project-type categories to the section values most relevant to them.
 * 'All' is null → show every section.
 */
export const SECTION_CATEGORIES = {
  'All':                 null,
  'Web App':             ['Title','Description','TOC','Features','Demo','Prerequisites','Installation','Configuration','Environment Variables','Docker','Usage','Examples','API Reference','Database Schema','Architecture','Project Structure','Deployment','Testing','Security','Contributing','Changelog','License','Troubleshooting'],
  'AI / ML':             ['Title','Description','TOC','Features','Dataset','Model Architecture','Training','Results / Metrics','Prerequisites','Installation','Configuration','Environment Variables','Usage','Examples','Architecture','Benchmarks','Contributing','License','Acknowledgements'],
  'CLI Tool':            ['Title','Description','TOC','Features','Prerequisites','Installation','Configuration','Usage','CLI Reference','Examples','Testing','Contributing','Changelog','License'],
  'Library / SDK':       ['Title','Description','TOC','Features','Prerequisites','Installation','API Reference','SDK / Integration','Examples','Configuration','Benchmarks','Contributing','Changelog','Roadmap','License'],
  'Mobile App':          ['Title','Description','TOC','Features','Demo','Prerequisites','Installation','Configuration','Usage','Contributing','License'],
  'DevOps / Infra':      ['Title','Description','TOC','Features','Prerequisites','Installation','Configuration','Environment Variables','Docker','Architecture','Project Structure','Deployment','Security','Contributing','License'],
  'Game Dev':            ['Title','Description','TOC','Features','Demo','Prerequisites','Installation','Configuration','Usage','Architecture','Contributing','License'],
  'Hardware / Embedded': ['Title','Description','TOC','Features','Hardware Requirements','Prerequisites','Installation','Configuration','Usage','Results / Metrics','Contributing','License'],
  'Data Science':        ['Title','Description','TOC','Features','Dataset','Prerequisites','Installation','Configuration','Usage','Examples','Results / Metrics','Benchmarks','Contributing','License'],
};

