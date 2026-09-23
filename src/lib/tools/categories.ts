import { ToolCategory } from '../../types/tool';

export interface CategoryInfo {
  slug: ToolCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const categories: CategoryInfo[] = [
  { slug: 'organize', title: 'Organize & Pages', description: 'Merge, split, reorder, rotate and manage pages', icon: 'Layout', color: 'blue' },
  { slug: 'edit', title: 'Edit & Annotate', description: 'Add text, images, shapes, annotations and markup', icon: 'Edit3', color: 'purple' },
  { slug: 'forms', title: 'Forms & Signing', description: 'Fill, create and manage PDF forms and signatures', icon: 'FileText', color: 'rose' },
  { slug: 'pdf-to-office', title: 'PDF to Office', description: 'Convert PDF to Word, Excel, PowerPoint and more', icon: 'FileOutput', color: 'green' },
  { slug: 'office-to-pdf', title: 'Office to PDF', description: 'Convert Word, Excel, PowerPoint to PDF', icon: 'FileInput', color: 'teal' },
  { slug: 'convert-from', title: 'Convert From PDF', description: 'Transform PDF to other formats', icon: 'ArrowRight', color: 'emerald' },
  { slug: 'convert-to', title: 'Convert To PDF', description: 'Create PDF from other formats', icon: 'ArrowLeft', color: 'cyan' },
  { slug: 'compress', title: 'Compress & Optimize', description: 'Reduce size, optimize and repair PDFs', icon: 'Minimize2', color: 'orange' },
  { slug: 'ocr', title: 'OCR & Scans', description: 'Recognize text and process scanned documents', icon: 'ScanText', color: 'indigo' },
  { slug: 'security', title: 'Security & Privacy', description: 'Encrypt, sanitize, redact and protect PDFs', icon: 'Shield', color: 'red' },
  { slug: 'inspect', title: 'Inspect & Compare', description: 'Analyze structure, compare documents and validate', icon: 'Search', color: 'slate' },
  { slug: 'extract', title: 'Extract & Export', description: 'Pull content, data and assets from PDFs', icon: 'Download', color: 'cyan' },
  { slug: 'ai', title: 'AI Workspace', description: 'AI-powered analysis, generation and intelligence', icon: 'Brain', color: 'violet' },
  { slug: 'workflows', title: 'Workflows & Batch', description: 'Automate, chain and batch process PDFs', icon: 'GitBranch', color: 'amber' },
  { slug: 'create', title: 'Create & Templates', description: 'Generate PDFs from scratch or templates', icon: 'Plus', color: 'emerald' },
  { slug: 'developer', title: 'Developer Tools', description: 'Advanced inspection, testing and power-user tools', icon: 'Code', color: 'gray' },
];
