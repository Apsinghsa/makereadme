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

export const SECTIONS = [
  { value: 'Title', label: 'Title', defaultChecked: true },
  { value: 'Description', label: 'Description', defaultChecked: true },
  { value: 'TOC', label: 'TOC', defaultChecked: true },
  { value: 'Features', label: 'Features', defaultChecked: true },
  { value: 'Installation', label: 'Installation', defaultChecked: true },
  { value: 'Usage', label: 'Usage', defaultChecked: true },
  { value: 'Tests', label: 'Tests', defaultChecked: false },
  { value: 'License', label: 'License', defaultChecked: false },
];

export const BADGE_CATEGORIES_TABS = ['Languages', 'Frameworks', 'Tools', 'Status'];
