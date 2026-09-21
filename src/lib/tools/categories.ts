import { ToolCategory } from '../../types/tool';

export interface CategoryInfo {
  slug: ToolCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const categories: CategoryInfo[] = [
  { slug: 'merge-split', title: 'Merge & Split', description: 'Combine or separate PDF documents', icon: 'Merge', color: 'blue' },
  { slug: 'convert', title: 'Convert', description: 'Transform PDFs to/from other formats', icon: 'ArrowLeftRight', color: 'green' },
  { slug: 'compress', title: 'Compress', description: 'Reduce PDF file size', icon: 'Minimize2', color: 'orange' },
  { slug: 'edit', title: 'Edit', description: 'Modify PDF content and structure', icon: 'Edit3', color: 'purple' },
  { slug: 'security', title: 'Security', description: 'Protect and manage PDF security', icon: 'Shield', color: 'red' },
  { slug: 'organize', title: 'Organize', description: 'Rearrange, rotate, and manage pages', icon: 'Layout', color: 'teal' },
  { slug: 'ocr', title: 'OCR', description: 'Extract text from scanned documents', icon: 'ScanText', color: 'indigo' },
  { slug: 'extract', title: 'Extract', description: 'Pull content from PDFs', icon: 'Download', color: 'cyan' },
  { slug: 'inspect', title: 'Inspect', description: 'Analyze PDF structure and metadata', icon: 'Search', color: 'slate' },
  { slug: 'compare', title: 'Compare', description: 'Find differences between documents', icon: 'GitCompare', color: 'amber' },
  { slug: 'forms', title: 'Forms', description: 'Create and fill PDF forms', icon: 'FileText', color: 'rose' },
  { slug: 'ai', title: 'AI Tools', description: 'AI-powered PDF analysis and generation', icon: 'Brain', color: 'violet' },
  { slug: 'optimize', title: 'Optimize', description: 'Optimize PDF for specific use cases', icon: 'Zap', color: 'yellow' },
  { slug: 'accessibility', title: 'Accessibility', description: 'Validate and fix PDF accessibility', icon: 'Eye', color: 'emerald' },
];
