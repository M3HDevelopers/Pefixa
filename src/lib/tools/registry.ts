import { ToolDefinition } from '../../types/tool';

// Helper to create tool definitions with common defaults
const pdfTool = (slug: string, title: string, description: string, category: ToolDefinition['category'], capability: ToolDefinition['capability'], options: ToolDefinition['options'] = [], extra: Partial<ToolDefinition> = {}): ToolDefinition => ({
  slug, title, description, category, capability, icon: 'FileText',
  acceptsMultiple: false, acceptedTypes: ['application/pdf'], maxFileSizeMB: 200,
  options, outputType: 'application/pdf', outputMultiple: false,
  supportsBatch: false, supportsChaining: false, ...extra,
});

export const toolRegistry: ToolDefinition[] = [
  // ═══════════════════════════════════════════════════════════
  // 9.1 ORGANIZE & PAGE MANAGEMENT (30 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('merge-pdf', 'Merge PDF', 'Combine multiple PDFs in chosen order', 'organize', 'browser-ready', [], { acceptsMultiple: true, supportsChaining: true }),
  pdfTool('split-pdf', 'Split PDF', 'Split by page ranges, every N pages, or selected pages', 'organize', 'browser-ready', [
    { key: 'mode', label: 'Split Mode', type: 'select', default: 'ranges', options: [{ value: 'ranges', label: 'Page Ranges' }, { value: 'each', label: 'Every Page' }, { value: 'every-n', label: 'Every N Pages' }, { value: 'selected', label: 'Selected Pages' }] },
    { key: 'ranges', label: 'Page Ranges', type: 'text', default: '1-3, 4-6' },
    { key: 'everyN', label: 'Every N Pages', type: 'number', default: 5 },
  ], { outputMultiple: true }),
  pdfTool('extract-pages', 'Extract Pages', 'Create new PDF from selected pages', 'organize', 'browser-ready', [
    { key: 'pages', label: 'Pages', type: 'text', default: '1-3, 5, 8-10' },
  ]),
  pdfTool('delete-pages', 'Delete Pages', 'Remove selected pages from PDF', 'organize', 'browser-ready', [
    { key: 'pages', label: 'Pages to Delete', type: 'text', default: '2, 4-6' },
  ]),
  pdfTool('reorder-pages', 'Reorder Pages', 'Drag/resequence pages and preserve rotations', 'organize', 'browser-ready', [], { supportsChaining: true }),
  pdfTool('rotate-pages', 'Rotate Pages', 'Rotate selected or all pages in 90° increments', 'organize', 'browser-ready', [
    { key: 'angle', label: 'Rotation', type: 'select', default: '90', options: [{ value: '90', label: '90° Clockwise' }, { value: '180', label: '180°' }, { value: '270', label: '90° Counter-clockwise' }] },
    { key: 'pages', label: 'Apply To', type: 'select', default: 'all', options: [{ value: 'all', label: 'All Pages' }, { value: 'even', label: 'Even Pages' }, { value: 'odd', label: 'Odd Pages' }, { value: 'custom', label: 'Custom Range' }] },
  ], { supportsChaining: true }),
  pdfTool('duplicate-pages', 'Duplicate Pages', 'Duplicate selected pages one or multiple times', 'organize', 'browser-ready', [
    { key: 'pages', label: 'Pages to Duplicate', type: 'text', default: '1, 3' },
    { key: 'copies', label: 'Number of Copies', type: 'number', default: 1 },
  ]),
  pdfTool('reverse-pages', 'Reverse Pages', 'Reverse the complete page order', 'organize', 'browser-ready', [], { supportsChaining: true }),
  pdfTool('insert-blank-pages', 'Insert Blank Pages', 'Insert blank pages at selected positions', 'organize', 'browser-partial', [
    { key: 'position', label: 'Insert After Page', type: 'text', default: '1, 3, 5' },
    { key: 'size', label: 'Page Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }, { value: 'same', label: 'Same as Document' }] },
  ]),
  pdfTool('insert-pdf-pages', 'Insert PDF Pages', 'Insert selected pages from another PDF', 'organize', 'browser-ready', [
    { key: 'insertAt', label: 'Insert After Page', type: 'number', default: 1 },
    { key: 'sourcePages', label: 'Pages from Second PDF', type: 'text', default: 'all' },
  ], { acceptsMultiple: true }),
  pdfTool('replace-pages', 'Replace Pages', 'Replace one or more pages using another PDF', 'organize', 'browser-partial', [
    { key: 'targetPages', label: 'Pages to Replace', type: 'text', default: '2-3' },
  ], { acceptsMultiple: true }),
  pdfTool('move-pages-between', 'Move Pages Between PDFs', 'Cut pages from one document and insert into another', 'organize', 'browser-partial', [
    { key: 'sourcePages', label: 'Pages to Move', type: 'text', default: '1-2' },
    { key: 'insertAt', label: 'Insert Position', type: 'number', default: 1 },
  ], { acceptsMultiple: true }),
  pdfTool('alternate-mix', 'Alternate & Mix', 'Interleave pages from multiple PDFs', 'organize', 'browser-ready', [
    { key: 'pattern', label: 'Pattern', type: 'select', default: '1-1', options: [{ value: '1-1', label: '1 from each' }, { value: '2-1', label: '2 from first, 1 from second' }, { value: 'custom', label: 'Custom Pattern' }] },
  ], { acceptsMultiple: true }),
  pdfTool('split-in-half', 'Split in Half', 'Turn two-up scans into separate pages', 'organize', 'backend-required', [
    { key: 'direction', label: 'Split Direction', type: 'select', default: 'vertical', options: [{ value: 'vertical', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }] },
  ], { outputMultiple: true }),
  pdfTool('booklet-imposition', 'Booklet Imposition', 'Arrange pages for booklet printing/folding', 'organize', 'browser-partial', [
    { key: 'folding', label: 'Folding', type: 'select', default: 'half', options: [{ value: 'half', label: 'Half Fold' }, { value: 'third', label: 'Third Fold' }] },
    { key: 'duplex', label: 'Duplex', type: 'boolean', default: true },
  ]),
  pdfTool('n-up-pages', 'N-Up Pages', 'Put 2, 4, 6, 8 or custom pages on one sheet', 'organize', 'browser-partial', [
    { key: 'n', label: 'Pages Per Sheet', type: 'select', default: '2', options: [{ value: '2', label: '2-Up' }, { value: '4', label: '4-Up' }, { value: '6', label: '6-Up' }, { value: '8', label: '8-Up' }, { value: '9', label: '9-Up' }, { value: '16', label: '16-Up' }] },
    { key: 'order', label: 'Order', type: 'select', default: 'horizontal', options: [{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }] },
  ]),
  pdfTool('poster-tiled', 'Poster/Tiled PDF', 'Split a large page into printable tiles', 'organize', 'backend-required', [
    { key: 'tileSize', label: 'Tile Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }, { value: 'a3', label: 'A3' }] },
    { key: 'overlap', label: 'Overlap (mm)', type: 'number', default: 10 },
  ], { outputMultiple: true }),
  pdfTool('page-contact-sheet', 'Page Contact Sheet', 'Generate thumbnail/contact-sheet pages', 'organize', 'backend-required', [
    { key: 'columns', label: 'Columns', type: 'number', default: 3 },
    { key: 'rows', label: 'Rows', type: 'number', default: 4 },
  ]),
  pdfTool('split-by-file-size', 'Split by File Size', 'Create multiple PDFs below a chosen size target', 'organize', 'browser-partial', [
    { key: 'maxSize', label: 'Max Size (MB)', type: 'number', default: 10 },
  ], { outputMultiple: true }),
  pdfTool('split-by-bookmarks', 'Split by Bookmarks', 'Split according to outline/bookmark entries', 'organize', 'browser-partial', [
    { key: 'level', label: 'Bookmark Level', type: 'select', default: '1', options: [{ value: '1', label: 'Level 1' }, { value: '2', label: 'Level 2' }, { value: 'all', label: 'All Levels' }] },
  ], { outputMultiple: true }),
  pdfTool('split-by-text', 'Split by Text', 'Split when a specified text/header changes', 'organize', 'backend-required', [
    { key: 'text', label: 'Split Text Pattern', type: 'text', default: 'Chapter' },
    { key: 'matchType', label: 'Match Type', type: 'select', default: 'starts', options: [{ value: 'starts', label: 'Starts With' }, { value: 'contains', label: 'Contains' }, { value: 'regex', label: 'Regex' }] },
  ], { outputMultiple: true }),
  pdfTool('extract-odd-pages', 'Extract Odd Pages', 'Export odd-numbered pages', 'organize', 'browser-ready', [], { supportsChaining: true }),
  pdfTool('extract-even-pages', 'Extract Even Pages', 'Export even-numbered pages', 'organize', 'browser-ready', [], { supportsChaining: true }),
  pdfTool('sort-pages-number', 'Sort Pages by Number', 'Natural numeric page sorting', 'organize', 'browser-partial', [
    { key: 'order', label: 'Order', type: 'select', default: 'asc', options: [{ value: 'asc', label: 'Ascending' }, { value: 'desc', label: 'Descending' }] },
  ]),
  pdfTool('sort-pages-text', 'Sort Pages by Text', 'Sort pages using detected text keys', 'organize', 'backend-required', [
    { key: 'pattern', label: 'Sort Key Pattern', type: 'text', default: '' },
    { key: 'order', label: 'Order', type: 'select', default: 'asc', options: [{ value: 'asc', label: 'Ascending' }, { value: 'desc', label: 'Descending' }] },
  ]),
  pdfTool('page-labels', 'Page Labels', 'Create or edit logical page labels', 'organize', 'browser-partial', [
    { key: 'style', label: 'Label Style', type: 'select', default: 'decimal', options: [{ value: 'decimal', label: '1, 2, 3...' }, { value: 'roman-upper', label: 'I, II, III...' }, { value: 'roman-lower', label: 'i, ii, iii...' }, { value: 'alpha-upper', label: 'A, B, C...' }, { value: 'alpha-lower', label: 'a, b, c...' }] },
    { key: 'prefix', label: 'Prefix', type: 'text', default: '' },
  ]),
  pdfTool('page-range-builder', 'Page Range Builder', 'Advanced syntax parser for page ranges', 'organize', 'browser-ready', [
    { key: 'expression', label: 'Range Expression', type: 'text', default: '1-3, 5, 8-12, 15' },
  ]),
  pdfTool('page-sequence-gen', 'Page Sequence Generator', 'Create repeated page sequences for batch', 'organize', 'browser-partial', [
    { key: 'sequence', label: 'Sequence', type: 'text', default: '1,2,3' },
    { key: 'repeats', label: 'Repeats', type: 'number', default: 5 },
  ]),
  pdfTool('rotate-by-detection', 'Rotate By Detection', 'Detect landscape/upside-down and auto-rotate', 'organize', 'backend-required', [
    { key: 'sensitivity', label: 'Sensitivity', type: 'select', default: 'medium', options: [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }] },
  ]),
  pdfTool('blank-page-detector', 'Blank Page Detector', 'Detect and optionally remove blank pages', 'organize', 'browser-partial', [
    { key: 'action', label: 'Action', type: 'select', default: 'report', options: [{ value: 'report', label: 'Report Only' }, { value: 'remove', label: 'Remove Blank Pages' }] },
    { key: 'threshold', label: 'Threshold (%)', type: 'number', default: 1 },
  ]),

  // ═══════════════════════════════════════════════════════════
  // 9.2 EDIT, ANNOTATE & MARKUP (27 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('edit-pdf-text', 'Edit PDF Text', 'Edit detected existing text where supported', 'edit', 'browser-partial', []),
  pdfTool('add-text', 'Add Text', 'Place text blocks with font, size and alignment', 'edit', 'browser-ready', [
    { key: 'text', label: 'Text', type: 'text', default: 'Your text here' },
    { key: 'fontSize', label: 'Font Size', type: 'number', default: 12 },
    { key: 'font', label: 'Font', type: 'select', default: 'Helvetica', options: [{ value: 'Helvetica', label: 'Helvetica' }, { value: 'Times', label: 'Times Roman' }, { value: 'Courier', label: 'Courier' }] },
    { key: 'x', label: 'X Position', type: 'number', default: 50 },
    { key: 'y', label: 'Y Position', type: 'number', default: 50 },
  ]),
  pdfTool('add-image', 'Add Image', 'Insert images with scaling/position controls', 'edit', 'browser-partial', [
    { key: 'x', label: 'X Position', type: 'number', default: 50 },
    { key: 'y', label: 'Y Position', type: 'number', default: 50 },
    { key: 'width', label: 'Width', type: 'number', default: 200 },
  ], { acceptedTypes: ['application/pdf', 'image/png', 'image/jpeg'] }),
  pdfTool('add-shape', 'Add Shape', 'Rectangles, circles, polygons and freeform shapes', 'edit', 'browser-partial', [
    { key: 'shape', label: 'Shape', type: 'select', default: 'rectangle', options: [{ value: 'rectangle', label: 'Rectangle' }, { value: 'circle', label: 'Circle' }, { value: 'polygon', label: 'Polygon' }] },
    { key: 'color', label: 'Color', type: 'text', default: '#000000' },
  ]),
  pdfTool('add-line-arrow', 'Add Line & Arrow', 'Draw connectors and arrows', 'edit', 'browser-partial', [
    { key: 'type', label: 'Type', type: 'select', default: 'line', options: [{ value: 'line', label: 'Line' }, { value: 'arrow', label: 'Arrow' }, { value: 'double-arrow', label: 'Double Arrow' }] },
  ]),
  pdfTool('freehand-draw', 'Freehand Draw', 'Pen/highlighter drawing layer', 'edit', 'browser-partial', [
    { key: 'color', label: 'Color', type: 'text', default: '#0000ff' },
    { key: 'width', label: 'Stroke Width', type: 'number', default: 2 },
  ]),
  pdfTool('highlight-text', 'Highlight Text', 'Highlight selected text', 'edit', 'browser-partial', [
    { key: 'color', label: 'Color', type: 'select', default: 'yellow', options: [{ value: 'yellow', label: 'Yellow' }, { value: 'green', label: 'Green' }, { value: 'blue', label: 'Blue' }, { value: 'pink', label: 'Pink' }] },
  ]),
  pdfTool('underline-text', 'Underline Text', 'Underline selected text', 'edit', 'backend-required', []),
  pdfTool('strikeout-text', 'Strikeout Text', 'Strike out selected text', 'edit', 'backend-required', []),
  pdfTool('add-comment', 'Add Comment', 'Attach comments/notes to locations', 'edit', 'browser-partial', [
    { key: 'text', label: 'Comment', type: 'text', default: '' },
  ]),
  pdfTool('sticky-note', 'Sticky Note', 'Add note annotations', 'edit', 'browser-partial', [
    { key: 'text', label: 'Note Text', type: 'text', default: '' },
    { key: 'color', label: 'Color', type: 'select', default: 'yellow', options: [{ value: 'yellow', label: 'Yellow' }, { value: 'blue', label: 'Blue' }, { value: 'green', label: 'Green' }, { value: 'red', label: 'Red' }] },
  ]),
  pdfTool('callout-annotation', 'Callout Annotation', 'Add text callouts connected to regions', 'edit', 'browser-partial', [
    { key: 'text', label: 'Callout Text', type: 'text', default: '' },
  ]),
  pdfTool('add-link', 'Add Link', 'Create URL or internal-page links', 'edit', 'browser-partial', [
    { key: 'url', label: 'URL', type: 'text', default: 'https://' },
    { key: 'linkType', label: 'Link Type', type: 'select', default: 'url', options: [{ value: 'url', label: 'External URL' }, { value: 'page', label: 'Internal Page' }] },
  ]),
  pdfTool('edit-links', 'Edit Links', 'Inspect/edit existing links where supported', 'edit', 'browser-partial', []),
  pdfTool('whiteout', 'Whiteout', 'Cover content with non-reversible whiteout', 'edit', 'browser-partial', [
    { key: 'mode', label: 'Mode', type: 'select', default: 'visual', options: [{ value: 'visual', label: 'Visual Only' }, { value: 'permanent', label: 'Permanent (Flattened)' }] },
  ]),
  pdfTool('redaction', 'Redaction', 'Permanently remove selected sensitive content', 'edit', 'backend-required', [
    { key: 'searchText', label: 'Text to Redact', type: 'text', default: '' },
    { key: 'fillColor', label: 'Fill Color', type: 'select', default: 'black', options: [{ value: 'black', label: 'Black' }, { value: 'white', label: 'White' }] },
  ]),
  pdfTool('find-replace', 'Find & Replace', 'Find terms and create replacement instructions', 'edit', 'backend-required', [
    { key: 'find', label: 'Find', type: 'text', default: '' },
    { key: 'replace', label: 'Replace With', type: 'text', default: '' },
    { key: 'caseSensitive', label: 'Case Sensitive', type: 'boolean', default: false },
  ]),
  pdfTool('header-footer', 'Header & Footer', 'Add text/header/footer across selected pages', 'edit', 'browser-ready', [
    { key: 'headerText', label: 'Header Text', type: 'text', default: '' },
    { key: 'footerText', label: 'Footer Text', type: 'text', default: '' },
    { key: 'fontSize', label: 'Font Size', type: 'number', default: 10 },
  ], { supportsChaining: true }),
  pdfTool('page-numbers', 'Add Page Numbers', 'Insert configurable page numbering', 'edit', 'browser-ready', [
    { key: 'position', label: 'Position', type: 'select', default: 'bottom-center', options: [{ value: 'bottom-center', label: 'Bottom Center' }, { value: 'bottom-right', label: 'Bottom Right' }, { value: 'bottom-left', label: 'Bottom Left' }, { value: 'top-center', label: 'Top Center' }, { value: 'top-right', label: 'Top Right' }] },
    { key: 'startFrom', label: 'Start From', type: 'number', default: 1 },
    { key: 'format', label: 'Format', type: 'select', default: 'number', options: [{ value: 'number', label: '1, 2, 3...' }, { value: 'dash', label: '- 1 -' }, { value: 'page', label: 'Page 1' }, { value: 'of', label: 'Page 1 of N' }] },
  ], { supportsChaining: true }),
  pdfTool('bates-numbering', 'Bates Numbering', 'Sequential legal numbering with prefix/suffix', 'edit', 'browser-ready', [
    { key: 'prefix', label: 'Prefix', type: 'text', default: 'BATES-' },
    { key: 'start', label: 'Start Number', type: 'number', default: 1 },
    { key: 'padding', label: 'Zero Padding', type: 'number', default: 6 },
    { key: 'position', label: 'Position', type: 'select', default: 'top-right', options: [{ value: 'top-right', label: 'Top Right' }, { value: 'top-left', label: 'Top Left' }, { value: 'bottom-right', label: 'Bottom Right' }, { value: 'bottom-left', label: 'Bottom Left' }] },
  ], { supportsChaining: true }),
  pdfTool('watermark-text', 'Watermark Text', 'Add text watermark with opacity and rotation', 'edit', 'browser-ready', [
    { key: 'text', label: 'Watermark Text', type: 'text', default: 'CONFIDENTIAL' },
    { key: 'opacity', label: 'Opacity', type: 'range', default: 0.5, min: 0.1, max: 1, step: 0.1 },
    { key: 'rotation', label: 'Rotation', type: 'number', default: 45 },
    { key: 'fontSize', label: 'Font Size', type: 'select', default: 'auto', options: [{ value: 'auto', label: 'Auto' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }] },
  ], { supportsChaining: true }),
  pdfTool('watermark-image', 'Watermark Image', 'Add image watermark', 'edit', 'browser-partial', [
    { key: 'opacity', label: 'Opacity', type: 'range', default: 0.5, min: 0.1, max: 1, step: 0.1 },
    { key: 'position', label: 'Position', type: 'select', default: 'center', options: [{ value: 'center', label: 'Center' }, { value: 'tile', label: 'Tiled' }] },
  ], { acceptedTypes: ['application/pdf', 'image/png', 'image/jpeg'] }),
  pdfTool('background-layer', 'Background Layer', 'Add background color/image/page', 'edit', 'browser-partial', [
    { key: 'type', label: 'Background Type', type: 'select', default: 'color', options: [{ value: 'color', label: 'Solid Color' }, { value: 'image', label: 'Image' }, { value: 'pdf', label: 'PDF Page' }] },
    { key: 'color', label: 'Color', type: 'text', default: '#ffffff' },
  ]),
  pdfTool('foreground-overlay', 'Foreground Overlay', 'Overlay an external PDF/page layer', 'edit', 'browser-partial', [
    { key: 'sourcePage', label: 'Source Page', type: 'number', default: 1 },
  ], { acceptsMultiple: true }),
  pdfTool('stamp-pdf', 'Stamp PDF', 'Reusable APPROVED/DRAFT/CONFIDENTIAL stamps', 'edit', 'browser-ready', [
    { key: 'stamp', label: 'Stamp', type: 'select', default: 'APPROVED', options: [{ value: 'APPROVED', label: 'APPROVED' }, { value: 'DRAFT', label: 'DRAFT' }, { value: 'CONFIDENTIAL', label: 'CONFIDENTIAL' }, { value: 'REVIEWED', label: 'REVIEWED' }, { value: 'FINAL', label: 'FINAL' }, { value: 'CUSTOM', label: 'Custom Text' }] },
    { key: 'customText', label: 'Custom Stamp Text', type: 'text', default: '' },
    { key: 'color', label: 'Color', type: 'select', default: 'red', options: [{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }, { value: 'green', label: 'Green' }, { value: 'black', label: 'Black' }] },
  ], { supportsChaining: true }),
  pdfTool('signature-placement', 'Signature Placement', 'Place saved signature object', 'edit', 'browser-partial', [
    { key: 'position', label: 'Position', type: 'select', default: 'bottom-right', options: [{ value: 'bottom-right', label: 'Bottom Right' }, { value: 'bottom-left', label: 'Bottom Left' }, { value: 'custom', label: 'Custom Position' }] },
  ]),
  pdfTool('flatten-annotations', 'Flatten Annotations', 'Convert annotations into fixed page content', 'edit', 'browser-ready', [], { supportsBatch: true, supportsChaining: true }),

  // ═══════════════════════════════════════════════════════════
  // 9.3 FORMS & SIGNING (13 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('fill-form', 'Fill PDF Form', 'Fill existing interactive form fields', 'forms', 'browser-ready', []),
  pdfTool('create-fillable-form', 'Create Fillable Form', 'Create text fields, checkboxes, dropdowns', 'forms', 'browser-partial', [
    { key: 'fieldType', label: 'Field Type', type: 'select', default: 'text', options: [{ value: 'text', label: 'Text Field' }, { value: 'checkbox', label: 'Checkbox' }, { value: 'radio', label: 'Radio Button' }, { value: 'dropdown', label: 'Dropdown' }, { value: 'list', label: 'List Box' }, { value: 'date', label: 'Date Field' }, { value: 'signature', label: 'Signature' }] },
  ]),
  pdfTool('auto-detect-fields', 'Auto Detect Form Fields', 'Detect likely fields and suggest placement', 'forms', 'backend-required', []),
  pdfTool('form-field-inspector', 'Form Field Inspector', 'Inspect field type, name, flags and values', 'forms', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('form-field-editor', 'Form Field Editor', 'Rename fields and change defaults/options', 'forms', 'browser-partial', []),
  pdfTool('form-reset', 'Form Reset', 'Reset field values to defaults', 'forms', 'browser-ready', [], { supportsBatch: true }),
  pdfTool('form-data-export', 'Form Data Export', 'Export form fields to JSON/CSV/FDF', 'forms', 'browser-ready', [
    { key: 'format', label: 'Export Format', type: 'select', default: 'json', options: [{ value: 'json', label: 'JSON' }, { value: 'csv', label: 'CSV' }, { value: 'fdf', label: 'FDF' }, { value: 'xfdf', label: 'XFDF' }] },
  ], { outputType: 'application/json' }),
  pdfTool('form-data-import', 'Form Data Import', 'Import field data into a compatible PDF', 'forms', 'browser-partial', [
    { key: 'format', label: 'Import Format', type: 'select', default: 'json', options: [{ value: 'json', label: 'JSON' }, { value: 'csv', label: 'CSV' }, { value: 'fdf', label: 'FDF' }, { value: 'xfdf', label: 'XFDF' }] },
  ], { acceptedTypes: ['application/pdf', 'application/json', 'text/csv'] }),
  pdfTool('signature-draw', 'Signature Draw', 'Draw signature', 'forms', 'browser-partial', []),
  pdfTool('signature-type', 'Signature Type', 'Create typed signature', 'forms', 'browser-ready', [
    { key: 'name', label: 'Name', type: 'text', default: '' },
    { key: 'style', label: 'Style', type: 'select', default: 'cursive', options: [{ value: 'cursive', label: 'Cursive' }, { value: 'formal', label: 'Formal' }, { value: 'casual', label: 'Casual' }] },
  ]),
  pdfTool('signature-image', 'Signature Image', 'Upload signature image', 'forms', 'browser-partial', [], { acceptedTypes: ['application/pdf', 'image/png', 'image/jpeg'] }),
  pdfTool('signature-verify', 'Signature Verify', 'Show signature/certificate verification status', 'forms', 'backend-required', []),
  pdfTool('signing-request', 'Signing Request', 'Flow for later send-to-signer integration', 'forms', 'backend-required', [
    { key: 'signerEmail', label: 'Signer Email', type: 'text', default: '' },
    { key: 'message', label: 'Message', type: 'text', default: '' },
  ]),

  // ═══════════════════════════════════════════════════════════
  // 9.4 CONVERT FROM PDF (22 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('pdf-to-word', 'PDF to Word', 'Convert PDF to DOC/DOCX', 'convert-from', 'backend-required', [
    { key: 'format', label: 'Format', type: 'select', default: 'docx', options: [{ value: 'docx', label: 'DOCX' }, { value: 'doc', label: 'DOC' }] },
  ], { outputType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', supportsBatch: true }),
  pdfTool('pdf-to-excel', 'PDF to Excel', 'Extract tables to XLSX/CSV', 'convert-from', 'backend-required', [
    { key: 'format', label: 'Format', type: 'select', default: 'xlsx', options: [{ value: 'xlsx', label: 'XLSX' }, { value: 'csv', label: 'CSV' }] },
  ], { outputType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', supportsBatch: true }),
  pdfTool('pdf-to-powerpoint', 'PDF to PowerPoint', 'Convert pages/content to PPT/PPTX', 'convert-from', 'backend-required', [
    { key: 'format', label: 'Format', type: 'select', default: 'pptx', options: [{ value: 'pptx', label: 'PPTX' }, { value: 'ppt', label: 'PPT' }] },
  ], { supportsBatch: true }),
  pdfTool('pdf-to-images', 'PDF to Images', 'Convert pages to image files', 'convert-from', 'browser-ready', [
    { key: 'format', label: 'Image Format', type: 'select', default: 'png', options: [{ value: 'png', label: 'PNG' }, { value: 'jpeg', label: 'JPEG' }, { value: 'webp', label: 'WebP' }] },
    { key: 'dpi', label: 'Resolution (DPI)', type: 'select', default: '150', options: [{ value: '72', label: '72 DPI' }, { value: '150', label: '150 DPI' }, { value: '300', label: '300 DPI' }] },
  ], { outputType: 'image/png', outputMultiple: true }),
  pdfTool('pdf-to-jpg', 'PDF to JPG', 'Rasterize pages as JPG', 'convert-from', 'browser-ready', [
    { key: 'quality', label: 'Quality', type: 'select', default: '85', options: [{ value: '60', label: '60%' }, { value: '75', label: '75%' }, { value: '85', label: '85%' }, { value: '95', label: '95%' }] },
    { key: 'dpi', label: 'DPI', type: 'select', default: '150', options: [{ value: '72', label: '72' }, { value: '150', label: '150' }, { value: '300', label: '300' }] },
  ], { outputType: 'image/jpeg', outputMultiple: true }),
  pdfTool('pdf-to-png', 'PDF to PNG', 'Rasterize pages as PNG', 'convert-from', 'browser-ready', [
    { key: 'dpi', label: 'DPI', type: 'select', default: '150', options: [{ value: '72', label: '72' }, { value: '150', label: '150' }, { value: '300', label: '300' }] },
  ], { outputType: 'image/png', outputMultiple: true }),
  pdfTool('pdf-to-webp', 'PDF to WebP', 'Rasterize pages as WebP', 'convert-from', 'browser-partial', [
    { key: 'quality', label: 'Quality', type: 'number', default: 85 },
  ], { outputType: 'image/webp', outputMultiple: true }),
  pdfTool('pdf-to-bmp', 'PDF to BMP', 'Rasterize pages as BMP', 'convert-from', 'backend-required', [], { outputType: 'image/bmp', outputMultiple: true }),
  pdfTool('pdf-to-tiff', 'PDF to TIFF', 'Rasterize pages as TIFF', 'convert-from', 'backend-required', [
    { key: 'compression', label: 'Compression', type: 'select', default: 'lzw', options: [{ value: 'none', label: 'None' }, { value: 'lzw', label: 'LZW' }, { value: 'jpeg', label: 'JPEG' }] },
  ], { outputType: 'image/tiff', outputMultiple: true }),
  pdfTool('pdf-to-svg', 'PDF to SVG', 'Convert vector/page content to SVG', 'convert-from', 'backend-required', [], { outputType: 'image/svg+xml', outputMultiple: true }),
  pdfTool('pdf-to-html', 'PDF to HTML', 'Produce structured HTML representation', 'convert-from', 'backend-required', [], { outputType: 'text/html', supportsBatch: true }),
  pdfTool('pdf-to-text', 'PDF to Plain Text', 'Extract text', 'convert-from', 'browser-ready', [
    { key: 'format', label: 'Format', type: 'select', default: 'txt', options: [{ value: 'txt', label: 'Plain Text' }, { value: 'rtf', label: 'Rich Text' }] },
  ], { outputType: 'text/plain', supportsBatch: true }),
  pdfTool('pdf-to-json', 'PDF to Structured JSON', 'Export page/text/block metadata as JSON', 'convert-from', 'browser-partial', [
    { key: 'includeText', label: 'Include Text', type: 'boolean', default: true },
    { key: 'includeBlocks', label: 'Include Blocks', type: 'boolean', default: false },
  ], { outputType: 'application/json' }),
  pdfTool('pdf-to-markdown', 'PDF to Markdown', 'Convert headings, lists, tables to Markdown', 'convert-from', 'ai-required', [
    { key: 'headings', label: 'Detect Headings', type: 'boolean', default: true },
    { key: 'tables', label: 'Convert Tables', type: 'boolean', default: true },
  ], { outputType: 'text/markdown', supportsBatch: true }),
  pdfTool('pdf-to-epub', 'PDF to EPUB', 'Create EPUB from document content', 'convert-from', 'backend-required', [], { outputType: 'application/epub+zip' }),
  pdfTool('pdf-to-odt', 'PDF to ODT', 'Convert to OpenDocument text', 'convert-from', 'backend-required', [], { outputType: 'application/vnd.oasis.opendocument.text' }),
  pdfTool('pdf-to-ods', 'PDF to ODS', 'Convert tables to OpenDocument spreadsheet', 'convert-from', 'backend-required', [], { outputType: 'application/vnd.oasis.opendocument.spreadsheet' }),
  pdfTool('pdf-to-pdfa', 'PDF to PDF/A', 'Create archival PDF/A output', 'convert-from', 'backend-required', [
    { key: 'standard', label: 'Standard', type: 'select', default: '2b', options: [{ value: '1b', label: 'PDF/A-1b' }, { value: '2b', label: 'PDF/A-2b' }, { value: '3b', label: 'PDF/A-3b' }, { value: '2u', label: 'PDF/A-2u' }, { value: '3u', label: 'PDF/A-3u' }] },
  ], { supportsBatch: true }),
  pdfTool('pdf-to-pdfa-variant', 'PDF to PDF/X', 'Create print-oriented PDF/X output', 'convert-from', 'backend-required', [
    { key: 'standard', label: 'Standard', type: 'select', default: '1a', options: [{ value: '1a', label: 'PDF/X-1a' }, { value: '3', label: 'PDF/X-3' }, { value: '4', label: 'PDF/X-4' }] },
  ]),
  pdfTool('pdf-to-searchable', 'PDF to Searchable PDF', 'OCR PDF into searchable layer', 'convert-from', 'backend-required', [
    { key: 'language', label: 'Language', type: 'select', default: 'eng', options: [{ value: 'eng', label: 'English' }, { value: 'spa', label: 'Spanish' }, { value: 'fra', label: 'French' }, { value: 'deu', label: 'German' }] },
  ]),
  pdfTool('pdf-to-zip-images', 'PDF to ZIP Images', 'Export all rendered pages as a ZIP', 'convert-from', 'browser-partial', [
    { key: 'format', label: 'Image Format', type: 'select', default: 'png', options: [{ value: 'png', label: 'PNG' }, { value: 'jpeg', label: 'JPEG' }] },
  ], { outputType: 'application/zip' }),
  pdfTool('pdf-images-extractor', 'PDF Images Extractor', 'Extract embedded raster images', 'convert-from', 'browser-partial', [
    { key: 'minSize', label: 'Min Size (px)', type: 'number', default: 50 },
  ], { outputType: 'image/png', outputMultiple: true }),

  // ═══════════════════════════════════════════════════════════
  // 9.5 CONVERT TO PDF (24 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('jpg-to-pdf', 'JPG to PDF', 'Create PDF from JPG images', 'convert-to', 'browser-ready', [
    { key: 'pageSize', label: 'Page Size', type: 'select', default: 'fit', options: [{ value: 'fit', label: 'Fit to Image' }, { value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }] },
    { key: 'orientation', label: 'Orientation', type: 'select', default: 'auto', options: [{ value: 'auto', label: 'Auto' }, { value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }] },
  ], { acceptsMultiple: true, acceptedTypes: ['image/jpeg'] }),
  pdfTool('png-to-pdf', 'PNG to PDF', 'Create PDF from PNG images', 'convert-to', 'browser-ready', [
    { key: 'pageSize', label: 'Page Size', type: 'select', default: 'fit', options: [{ value: 'fit', label: 'Fit to Image' }, { value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }] },
  ], { acceptsMultiple: true, acceptedTypes: ['image/png'] }),
  pdfTool('webp-to-pdf', 'WebP to PDF', 'Create PDF from WebP images', 'convert-to', 'browser-partial', [], { acceptsMultiple: true, acceptedTypes: ['image/webp'] }),
  pdfTool('heic-to-pdf', 'HEIC to PDF', 'Create PDF from HEIC images', 'convert-to', 'backend-required', [], { acceptsMultiple: true, acceptedTypes: ['image/heic'] }),
  pdfTool('bmp-to-pdf', 'BMP to PDF', 'Create PDF from BMP images', 'convert-to', 'browser-partial', [], { acceptsMultiple: true, acceptedTypes: ['image/bmp'] }),
  pdfTool('tiff-to-pdf', 'TIFF to PDF', 'Create PDF from TIFF images', 'convert-to', 'backend-required', [], { acceptsMultiple: true, acceptedTypes: ['image/tiff'] }),
  pdfTool('svg-to-pdf', 'SVG to PDF', 'Create PDF from SVG artwork', 'convert-to', 'backend-required', [], { acceptedTypes: ['image/svg+xml'] }),
  pdfTool('gif-to-pdf', 'GIF to PDF', 'Convert GIF frames to PDF', 'convert-to', 'browser-partial', [
    { key: 'frame', label: 'Frame', type: 'select', default: 'first', options: [{ value: 'first', label: 'First Frame' }, { value: 'all', label: 'All Frames' }] },
  ], { acceptedTypes: ['image/gif'] }),
  pdfTool('doc-to-pdf', 'DOC/DOCX to PDF', 'Office document conversion', 'convert-to', 'backend-required', [], { acceptedTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'] }),
  pdfTool('xls-to-pdf', 'XLS/XLSX to PDF', 'Spreadsheet conversion', 'convert-to', 'backend-required', [], { acceptedTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'] }),
  pdfTool('ppt-to-pdf', 'PPT/PPTX to PDF', 'Presentation conversion', 'convert-to', 'backend-required', [], { acceptedTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'] }),
  pdfTool('odt-to-pdf', 'ODT/ODS/ODP to PDF', 'OpenDocument conversion', 'convert-to', 'backend-required', [], { acceptedTypes: ['application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.presentation'] }),
  pdfTool('txt-to-pdf', 'TXT to PDF', 'Generate PDF from text', 'convert-to', 'browser-ready', [
    { key: 'fontSize', label: 'Font Size', type: 'number', default: 12 },
    { key: 'font', label: 'Font', type: 'select', default: 'Courier', options: [{ value: 'Courier', label: 'Courier' }, { value: 'Helvetica', label: 'Helvetica' }, { value: 'Times', label: 'Times Roman' }] },
    { key: 'pageSize', label: 'Page Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }] },
  ], { acceptedTypes: ['text/plain'] }),
  pdfTool('rtf-to-pdf', 'RTF to PDF', 'Generate PDF from RTF content', 'convert-to', 'backend-required', [], { acceptedTypes: ['application/rtf', 'text/rtf'] }),
  pdfTool('html-to-pdf', 'HTML to PDF', 'Convert HTML to PDF', 'convert-to', 'backend-required', [
    { key: 'pageSize', label: 'Page Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }] },
  ], { acceptedTypes: ['text/html'] }),
  pdfTool('url-to-pdf', 'URL/Webpage to PDF', 'Convert web pages to PDF', 'convert-to', 'backend-required', [
    { key: 'url', label: 'URL', type: 'text', default: 'https://' },
    { key: 'pageSize', label: 'Page Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }] },
  ], { acceptsMultiple: false, acceptedTypes: ['text/plain'] }),
  pdfTool('markdown-to-pdf', 'Markdown to PDF', 'Render Markdown to PDF', 'convert-to', 'browser-partial', [
    { key: 'theme', label: 'Theme', type: 'select', default: 'default', options: [{ value: 'default', label: 'Default' }, { value: 'github', label: 'GitHub' }, { value: 'minimal', label: 'Minimal' }] },
  ], { acceptedTypes: ['text/markdown', 'text/plain'] }),
  pdfTool('epub-to-pdf', 'EPUB to PDF', 'Convert EPUB to PDF', 'convert-to', 'backend-required', [], { acceptedTypes: ['application/epub+zip'] }),
  pdfTool('publisher-to-pdf', 'Publisher to PDF', 'Future backend adapter', 'convert-to', 'backend-required', []),
  pdfTool('dicom-to-pdf', 'DICOM to PDF', 'Medical-image backend adapter', 'convert-to', 'backend-required', []),
  pdfTool('email-to-pdf', 'Email to PDF', 'Convert .eml/.msg to PDF', 'convert-to', 'backend-required', [], { acceptedTypes: ['application/vnd.ms-outlook', 'message/rfc822'] }),
  pdfTool('json-to-pdf', 'JSON to PDF', 'Render structured JSON/data into PDF', 'convert-to', 'browser-partial', [
    { key: 'template', label: 'Template', type: 'select', default: 'table', options: [{ value: 'table', label: 'Table' }, { value: 'key-value', label: 'Key-Value' }, { value: 'tree', label: 'Tree View' }] },
  ], { acceptedTypes: ['application/json', 'text/plain'] }),
  pdfTool('csv-to-pdf', 'CSV to PDF', 'Turn tabular CSV into paginated PDF', 'convert-to', 'browser-partial', [
    { key: 'delimiter', label: 'Delimiter', type: 'select', default: ',', options: [{ value: ',', label: 'Comma' }, { value: ';', label: 'Semicolon' }, { value: '\\t', label: 'Tab' }] },
    { key: 'hasHeader', label: 'Has Header', type: 'boolean', default: true },
  ], { acceptedTypes: ['text/csv', 'text/plain'] }),
  pdfTool('xml-to-pdf', 'XML to PDF', 'Render XML using configurable mapping', 'convert-to', 'backend-required', [
    { key: 'mapping', label: 'Mapping', type: 'select', default: 'auto', options: [{ value: 'auto', label: 'Auto Detect' }, { value: 'table', label: 'Table' }, { value: 'tree', label: 'Tree' }, { value: 'custom', label: 'Custom XSLT' }] },
  ], { acceptedTypes: ['application/xml', 'text/xml'] }),

  // ═══════════════════════════════════════════════════════════
  // 9.6 COMPRESS & OPTIMIZE (25 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('compress-pdf', 'Compress PDF', 'Reduce file size with quality presets', 'compress', 'browser-ready', [
    { key: 'level', label: 'Compression Level', type: 'select', default: 'recommended', options: [{ value: 'low', label: 'Low (Best Quality)' }, { value: 'recommended', label: 'Recommended' }, { value: 'high', label: 'High (Smallest Size)' }] },
  ], { supportsBatch: true, supportsChaining: true }),
  pdfTool('custom-compression', 'Custom Compression', 'Control image resolution/quality parameters', 'compress', 'backend-required', [
    { key: 'imageQuality', label: 'Image Quality', type: 'range', default: 0.7, min: 0.1, max: 1, step: 0.1 },
    { key: 'imageDpi', label: 'Image DPI', type: 'select', default: '150', options: [{ value: '72', label: '72' }, { value: '96', label: '96' }, { value: '150', label: '150' }, { value: '300', label: '300' }] },
    { key: 'removeUnused', label: 'Remove Unused', type: 'boolean', default: true },
  ]),
  pdfTool('web-optimize', 'Web Optimize / Linearize', 'Optimize PDF for first-page/streaming', 'compress', 'browser-partial', [
    { key: 'linearize', label: 'Linearize', type: 'boolean', default: true },
  ], { supportsBatch: true }),
  pdfTool('downsample-images', 'Downsample Images', 'Reduce image DPI', 'compress', 'backend-required', [
    { key: 'targetDpi', label: 'Target DPI', type: 'select', default: '150', options: [{ value: '72', label: '72' }, { value: '96', label: '96' }, { value: '150', label: '150' }, { value: '200', label: '200' }] },
  ]),
  pdfTool('jpeg-quality-optimizer', 'JPEG Quality Optimizer', 'Re-encode raster images at chosen quality', 'compress', 'backend-required', [
    { key: 'quality', label: 'Quality', type: 'range', default: 0.7, min: 0.1, max: 1, step: 0.05 },
  ]),
  pdfTool('images-to-grayscale', 'Convert Images to Grayscale', 'Reduce color information', 'compress', 'backend-required', []),
  pdfTool('pdf-to-grayscale', 'Convert PDF to Grayscale', 'Raster/convert pages to grayscale', 'compress', 'backend-required', [
    { key: 'method', label: 'Method', type: 'select', default: 'luminance', options: [{ value: 'luminance', label: 'Luminance' }, { value: 'average', label: 'Average' }, { value: 'desaturate', label: 'Desaturate' }] },
  ]),
  pdfTool('monochrome-optimize', 'Monochrome Scan Optimization', 'Optimize black-and-white scans', 'compress', 'backend-required', [
    { key: 'threshold', label: 'Threshold', type: 'number', default: 128 },
    { key: 'compression', label: 'Compression', type: 'select', default: 'ccitt4', options: [{ value: 'ccitt4', label: 'CCITT Group 4' }, { value: 'ccitt3', label: 'CCITT Group 3' }, { value: 'g3', label: 'G3 Fax' }] },
  ]),
  pdfTool('remove-duplicate-resources', 'Remove Duplicate Resources', 'Deduplicate repeated objects', 'compress', 'browser-partial', [], { supportsBatch: true }),
  pdfTool('subset-fonts', 'Subset Fonts', 'Reduce embedded font size', 'compress', 'backend-required', []),
  pdfTool('remove-unused-objects', 'Remove Unused Objects', 'Clean unreachable objects', 'compress', 'browser-partial', [], { supportsBatch: true }),
  pdfTool('rasterize-pdf', 'Rasterize PDF', 'Flatten complex pages into raster images', 'compress', 'backend-required', [
    { key: 'dpi', label: 'DPI', type: 'select', default: '150', options: [{ value: '72', label: '72' }, { value: '150', label: '150' }, { value: '300', label: '300' }] },
  ]),
  pdfTool('flatten-pdf', 'Flatten PDF', 'Flatten forms/annotations/content layers', 'compress', 'browser-ready', [
    { key: 'flattenForms', label: 'Flatten Forms', type: 'boolean', default: true },
    { key: 'flattenAnnotations', label: 'Flatten Annotations', type: 'boolean', default: true },
  ], { supportsBatch: true, supportsChaining: true }),
  pdfTool('normalize-page-size', 'Normalize Page Size', 'Make pages consistent', 'compress', 'browser-partial', [
    { key: 'targetSize', label: 'Target Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }, { value: 'largest', label: 'Largest Page' }, { value: 'smallest', label: 'Smallest Page' }] },
  ]),
  pdfTool('change-page-size', 'Change Page Size', 'Resize pages to standard/custom size', 'compress', 'browser-partial', [
    { key: 'size', label: 'Page Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'a3', label: 'A3' }, { value: 'a5', label: 'A5' }, { value: 'letter', label: 'Letter' }, { value: 'legal', label: 'Legal' }, { value: 'custom', label: 'Custom' }] },
    { key: 'scale', label: 'Scale Content', type: 'boolean', default: true },
  ]),
  pdfTool('fit-content-to-page', 'Fit Content to Page', 'Scale content into target bounds', 'compress', 'browser-partial', [
    { key: 'margin', label: 'Margin (pt)', type: 'number', default: 36 },
  ]),
  pdfTool('margin-crop', 'Margin Crop', 'Auto-crop whitespace/margins', 'compress', 'backend-required', [
    { key: 'threshold', label: 'Whitespace Threshold', type: 'number', default: 95 },
    { key: 'keepMargin', label: 'Keep Margin (pt)', type: 'number', default: 20 },
  ]),
  pdfTool('deskew-scan', 'Deskew Scan', 'Correct page rotation/skew', 'compress', 'backend-required', [
    { key: 'maxAngle', label: 'Max Correction Angle', type: 'number', default: 10 },
  ]),
  pdfTool('despeckle-scan', 'Despeckle Scan', 'Remove small noise artifacts', 'compress', 'backend-required', [
    { key: 'radius', label: 'Noise Radius', type: 'number', default: 2 },
  ]),
  pdfTool('repair-pdf', 'Repair PDF', 'Attempt recovery of malformed structures', 'compress', 'browser-partial', [], { supportsBatch: true, supportsChaining: true }),
  pdfTool('pdf-version-converter', 'PDF Version Converter', 'Upgrade/downgrade PDF version', 'compress', 'browser-partial', [
    { key: 'targetVersion', label: 'Target Version', type: 'select', default: '1.7', options: [{ value: '1.4', label: 'PDF 1.4' }, { value: '1.5', label: 'PDF 1.5' }, { value: '1.6', label: 'PDF 1.6' }, { value: '1.7', label: 'PDF 1.7' }, { value: '2.0', label: 'PDF 2.0' }] },
  ]),
  pdfTool('pdfa-converter', 'PDF/A Converter', 'Convert to archival variants', 'compress', 'backend-required', [
    { key: 'standard', label: 'Standard', type: 'select', default: '2b', options: [{ value: '1a', label: 'PDF/A-1a' }, { value: '1b', label: 'PDF/A-1b' }, { value: '2a', label: 'PDF/A-2a' }, { value: '2b', label: 'PDF/A-2b' }, { value: '3b', label: 'PDF/A-3b' }] },
  ], { supportsBatch: true }),
  pdfTool('pdfa-validator', 'PDF/A Validator', 'Validate archival requirements', 'compress', 'backend-required', [
    { key: 'standard', label: 'Standard', type: 'select', default: '2b', options: [{ value: '1b', label: 'PDF/A-1b' }, { value: '2b', label: 'PDF/A-2b' }, { value: '3b', label: 'PDF/A-3b' }] },
  ], { outputType: 'application/json' }),
  pdfTool('pdfx-preflight', 'PDF/X Preflight', 'Check print-oriented requirements', 'compress', 'backend-required', [
    { key: 'standard', label: 'Standard', type: 'select', default: '4', options: [{ value: '1a', label: 'PDF/X-1a' }, { value: '3', label: 'PDF/X-3' }, { value: '4', label: 'PDF/X-4' }] },
  ], { outputType: 'application/json' }),
  pdfTool('optimize-fonts', 'Optimize Fonts', 'Inspect and optimize font embeddings', 'compress', 'backend-required', []),
  pdfTool('resource-report', 'Resource Report', 'Show major size contributors', 'compress', 'browser-partial', [], { outputType: 'application/json' }),

  // ═══════════════════════════════════════════════════════════
  // 9.7 OCR & SCAN INTELLIGENCE (13 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('ocr-pdf', 'OCR PDF', 'Recognize text in scanned PDFs', 'ocr', 'backend-required', [
    { key: 'language', label: 'Language', type: 'select', default: 'eng', options: [{ value: 'eng', label: 'English' }, { value: 'spa', label: 'Spanish' }, { value: 'fra', label: 'French' }, { value: 'deu', label: 'German' }, { value: 'chi', label: 'Chinese' }, { value: 'jpn', label: 'Japanese' }, { value: 'ara', label: 'Arabic' }] },
    { key: 'mode', label: 'Mode', type: 'select', default: 'searchable', options: [{ value: 'searchable', label: 'Searchable PDF' }, { value: 'text', label: 'Text Only' }] },
  ], { supportsBatch: true }),
  pdfTool('ocr-image-to-pdf', 'OCR Image to PDF', 'OCR uploaded images into searchable PDF', 'ocr', 'backend-required', [
    { key: 'language', label: 'Language', type: 'select', default: 'eng', options: [{ value: 'eng', label: 'English' }, { value: 'spa', label: 'Spanish' }, { value: 'fra', label: 'French' }] },
  ], { acceptsMultiple: true, acceptedTypes: ['image/png', 'image/jpeg', 'image/tiff'] }),
  pdfTool('ocr-selected-pages', 'OCR Selected Pages', 'Run OCR only on chosen pages', 'ocr', 'backend-required', [
    { key: 'pages', label: 'Pages', type: 'text', default: '1-3, 5' },
    { key: 'language', label: 'Language', type: 'select', default: 'eng', options: [{ value: 'eng', label: 'English' }, { value: 'spa', label: 'Spanish' }] },
  ]),
  pdfTool('ocr-language-selector', 'OCR Language Pack Selector', 'Choose language(s) for OCR', 'ocr', 'backend-required', [
    { key: 'languages', label: 'Languages', type: 'select', default: 'eng', options: [{ value: 'eng', label: 'English' }, { value: 'eng+spa', label: 'English + Spanish' }, { value: 'eng+fra', label: 'English + French' }, { value: 'multi', label: 'Multi-language Auto' }] },
  ]),
  pdfTool('auto-language-detect', 'Auto Language Detect', 'Suggest OCR language', 'ocr', 'backend-required', []),
  pdfTool('deskew-before-ocr', 'Deskew Before OCR', 'Correct skew before recognition', 'ocr', 'backend-required', [
    { key: 'maxAngle', label: 'Max Angle', type: 'number', default: 15 },
  ]),
  pdfTool('remove-scan-noise', 'Remove Scan Noise', 'Preprocess noisy scans', 'ocr', 'backend-required', [
    { key: 'strength', label: 'Strength', type: 'select', default: 'medium', options: [{ value: 'light', label: 'Light' }, { value: 'medium', label: 'Medium' }, { value: 'heavy', label: 'Heavy' }] },
  ]),
  pdfTool('searchable-text-layer', 'Searchable Text Layer', 'Generate hidden searchable text layer', 'ocr', 'backend-required', []),
  pdfTool('ocr-text-export', 'OCR Text Export', 'Export recognized text', 'ocr', 'backend-required', [
    { key: 'format', label: 'Format', type: 'select', default: 'txt', options: [{ value: 'txt', label: 'Plain Text' }, { value: 'json', label: 'JSON with positions' }] },
  ], { outputType: 'text/plain' }),
  pdfTool('ocr-confidence-report', 'OCR Confidence Report', 'Show per-page confidence from engine', 'ocr', 'backend-required', [], { outputType: 'application/json' }),
  pdfTool('layout-aware-ocr', 'Layout-aware OCR', 'Preserve blocks, columns, tables', 'ocr', 'backend-required', [
    { key: 'preserveLayout', label: 'Preserve Layout', type: 'boolean', default: true },
  ]),
  pdfTool('table-ocr', 'Table OCR', 'Extract detected tables', 'ocr', 'backend-required', [
    { key: 'format', label: 'Output Format', type: 'select', default: 'csv', options: [{ value: 'csv', label: 'CSV' }, { value: 'xlsx', label: 'Excel' }, { value: 'json', label: 'JSON' }] },
  ], { outputType: 'text/csv' }),
  pdfTool('handwriting-ocr', 'Handwriting OCR', 'Future handwriting-capable backend/AI', 'ocr', 'ai-required', [
    { key: 'language', label: 'Language', type: 'select', default: 'eng', options: [{ value: 'eng', label: 'English' }, { value: 'multi', label: 'Multi-language' }] },
  ]),

  // ═══════════════════════════════════════════════════════════
  // 9.8 SECURITY, PRIVACY & SANITIZATION (18 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('encrypt-pdf', 'Encrypt PDF', 'Password-protect PDF', 'security', 'browser-ready', [
    { key: 'userPassword', label: 'User Password', type: 'text', default: '' },
    { key: 'ownerPassword', label: 'Owner Password', type: 'text', default: '' },
  ], { supportsBatch: true, supportsChaining: true }),
  pdfTool('decrypt-pdf', 'Decrypt PDF', 'Remove known-password protection', 'security', 'browser-ready', [
    { key: 'password', label: 'Password', type: 'text', default: '' },
  ], { supportsBatch: true }),
  pdfTool('protect-permissions', 'Protect Permissions', 'Restrict printing/copy/edit permissions', 'security', 'browser-ready', [
    { key: 'permissions', label: 'Restrictions', type: 'select', default: 'none', options: [{ value: 'none', label: 'No Restrictions' }, { value: 'no-print', label: 'No Printing' }, { value: 'no-copy', label: 'No Copying' }, { value: 'no-edit', label: 'No Editing' }, { value: 'all', label: 'All Restrictions' }] },
  ], { supportsBatch: true }),
  pdfTool('generate-password', 'Generate Secure Password', 'Generate random password locally', 'security', 'browser-ready', [
    { key: 'length', label: 'Length', type: 'number', default: 16 },
    { key: 'includeSymbols', label: 'Include Symbols', type: 'boolean', default: true },
    { key: 'includeNumbers', label: 'Include Numbers', type: 'boolean', default: true },
  ], { outputType: 'text/plain' }),
  pdfTool('password-strength', 'Password Strength Checker', 'Evaluate password strength', 'security', 'browser-ready', [
    { key: 'password', label: 'Password', type: 'text', default: '' },
  ], { outputType: 'application/json' }),
  pdfTool('sanitize-pdf', 'Sanitize PDF', 'Remove sensitive metadata and active content', 'security', 'browser-partial', [
    { key: 'removeMetadata', label: 'Remove Metadata', type: 'boolean', default: true },
    { key: 'removeJS', label: 'Remove JavaScript', type: 'boolean', default: true },
    { key: 'removeAttachments', label: 'Remove Attachments', type: 'boolean', default: true },
    { key: 'removeLinks', label: 'Remove Links', type: 'boolean', default: false },
  ], { supportsBatch: true, supportsChaining: true }),
  pdfTool('remove-metadata', 'Remove Metadata', 'Clear title/author/subject/keywords', 'security', 'browser-ready', [], { supportsBatch: true }),
  pdfTool('edit-metadata', 'Edit Metadata', 'Edit standard and custom document metadata', 'security', 'browser-ready', [
    { key: 'title', label: 'Title', type: 'text', default: '' },
    { key: 'author', label: 'Author', type: 'text', default: '' },
    { key: 'subject', label: 'Subject', type: 'text', default: '' },
    { key: 'keywords', label: 'Keywords', type: 'text', default: '' },
  ]),
  pdfTool('remove-javascript', 'Remove JavaScript', 'Strip document-level JavaScript', 'security', 'browser-partial', [], { supportsBatch: true }),
  pdfTool('remove-embedded-files', 'Remove Embedded Files', 'Remove attachments', 'security', 'browser-partial', [], { supportsBatch: true }),
  pdfTool('remove-annotations', 'Remove Annotations', 'Delete annotations/comments', 'security', 'browser-partial', [
    { key: 'types', label: 'Annotation Types', type: 'select', default: 'all', options: [{ value: 'all', label: 'All' }, { value: 'comments', label: 'Comments Only' }, { value: 'links', label: 'Links Only' }, { value: 'highlights', label: 'Highlights Only' }] },
  ]),
  pdfTool('remove-hidden-content', 'Remove Hidden Content', 'Remove hidden layers/objects', 'security', 'backend-required', []),
  pdfTool('remove-links', 'Remove Links', 'Strip external/internal link annotations', 'security', 'browser-partial', [], { supportsBatch: true }),
  pdfTool('flatten-for-sharing', 'Flatten for Sharing', 'Freeze forms/annotations for reduced editability', 'security', 'browser-ready', [], { supportsBatch: true, supportsChaining: true }),
  pdfTool('redact-pdf', 'Redact PDF', 'Permanent black-box redaction workflow', 'security', 'backend-required', [
    { key: 'searchText', label: 'Text to Redact', type: 'text', default: '' },
    { key: 'fillColor', label: 'Fill Color', type: 'select', default: 'black', options: [{ value: 'black', label: 'Black' }, { value: 'white', label: 'White' }] },
  ]),
  pdfTool('redaction-audit', 'Redaction Audit', 'List all redaction marks and affected pages', 'security', 'backend-required', [], { outputType: 'application/json' }),
  pdfTool('security-inspection', 'Security Inspection', 'Generate security findings report', 'security', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('signature-cert-inspector', 'Signature Certificate Inspector', 'Inspect digital signature fields', 'security', 'backend-required', [], { outputType: 'application/json' }),

  // ═══════════════════════════════════════════════════════════
  // 9.9 INSPECT, ANALYZE, COMPARE & VALIDATE (28 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('pdf-viewer', 'PDF Viewer', 'Open/read PDF with zoom, navigation and search', 'inspect', 'browser-ready', []),
  pdfTool('pdf-metadata-viewer', 'PDF Metadata Viewer', 'Inspect standard metadata', 'inspect', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('page-dimensions', 'Page Dimensions Analyzer', 'Show page width/height/orientation per page', 'inspect', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('font-inspector', 'Font Inspector', 'List fonts, embedding and usage', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('image-inspector', 'Image Inspector', 'List embedded images and properties', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('color-usage', 'Color Usage Analyzer', 'Estimate RGB/CMYK/grayscale usage', 'inspect', 'backend-required', [], { outputType: 'application/json' }),
  pdfTool('annotation-inspector', 'Annotation Inspector', 'List annotations by type/page', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('link-inspector', 'Link Inspector', 'List URLs/internal links', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('bookmark-inspector', 'Bookmark/Outline Inspector', 'View hierarchy and destinations', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('attachment-inspector', 'Attachment Inspector', 'List embedded files', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('page-structure-inspector', 'Page Structure Inspector', 'Inspect text blocks, images and annotations', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('pdf-version-detector', 'PDF Version Detector', 'Identify PDF version', 'inspect', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('pdf-health-report', 'PDF Health Report', 'Run broad checks and produce warnings', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('accessibility-checker', 'Accessibility Checker', 'Check accessibility signals', 'inspect', 'backend-required', [
    { key: 'standard', label: 'Standard', type: 'select', default: 'wcag21', options: [{ value: 'wcag21', label: 'WCAG 2.1' }, { value: 'pdfua', label: 'PDF/UA' }, { value: 'tagged', label: 'Tagged PDF' }] },
  ], { outputType: 'application/json' }),
  pdfTool('pdfa-validate', 'PDF/A Validator', 'Validate archival profile', 'inspect', 'backend-required', [
    { key: 'standard', label: 'Standard', type: 'select', default: '2b', options: [{ value: '1b', label: 'PDF/A-1b' }, { value: '2b', label: 'PDF/A-2b' }, { value: '3b', label: 'PDF/A-3b' }] },
  ], { outputType: 'application/json' }),
  pdfTool('compare-pdfs', 'Compare PDFs', 'Visual/page comparison between two PDFs', 'inspect', 'browser-partial', [
    { key: 'mode', label: 'Compare Mode', type: 'select', default: 'visual', options: [{ value: 'visual', label: 'Visual Overlay' }, { value: 'text', label: 'Text Diff' }, { value: 'both', label: 'Both' }] },
  ], { acceptsMultiple: true }),
  pdfTool('text-compare', 'Text Compare', 'Extract and diff text between versions', 'inspect', 'browser-partial', [], { acceptsMultiple: true, outputType: 'text/plain' }),
  pdfTool('pixel-compare', 'Pixel Compare', 'Render matched pages and highlight differences', 'inspect', 'backend-required', [
    { key: 'threshold', label: 'Difference Threshold', type: 'number', default: 10 },
  ], { acceptsMultiple: true }),
  pdfTool('page-by-page-diff', 'Page-by-Page Diff', 'Show page mapping and change status', 'inspect', 'browser-partial', [], { acceptsMultiple: true, outputType: 'application/json' }),
  pdfTool('compare-metadata', 'Compare Metadata', 'Diff document properties', 'inspect', 'browser-ready', [], { acceptsMultiple: true, outputType: 'application/json' }),
  pdfTool('compare-bookmarks', 'Compare Bookmarks', 'Diff outline trees', 'inspect', 'browser-partial', [], { acceptsMultiple: true, outputType: 'application/json' }),
  pdfTool('document-statistics', 'Document Statistics', 'Pages, words, characters, images, fonts', 'inspect', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('reading-time', 'Reading Time Estimator', 'Estimate reading time from text', 'inspect', 'browser-partial', [
    { key: 'wpm', label: 'Words Per Minute', type: 'number', default: 200 },
  ], { outputType: 'application/json' }),
  pdfTool('keyword-frequency', 'Keyword Frequency', 'Count repeated terms', 'inspect', 'browser-partial', [
    { key: 'topN', label: 'Top N Keywords', type: 'number', default: 20 },
    { key: 'minLength', label: 'Min Word Length', type: 'number', default: 4 },
  ], { outputType: 'application/json' }),
  pdfTool('table-detector', 'Table Detector Report', 'Detect possible table regions', 'inspect', 'backend-required', [], { outputType: 'application/json' }),
  pdfTool('blank-page-report', 'Blank Page Report', 'Identify empty/near-empty pages', 'inspect', 'browser-partial', [
    { key: 'threshold', label: 'Threshold (%)', type: 'number', default: 1 },
  ], { outputType: 'application/json' }),
  pdfTool('duplicate-page-detector', 'Duplicate Page Detector', 'Detect visually/textually duplicate pages', 'inspect', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('orientation-report', 'Orientation Report', 'List portrait/landscape distribution', 'inspect', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('print-readiness', 'Print Readiness Report', 'Check margins, page sizes, color mode', 'inspect', 'backend-required', [], { outputType: 'application/json' }),

  // ═══════════════════════════════════════════════════════════
  // 9.10 EXTRACT & EXPORT (17 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('extract-text-blocks', 'Extract Text Blocks', 'Export positioned text blocks', 'extract', 'browser-partial', [
    { key: 'format', label: 'Format', type: 'select', default: 'json', options: [{ value: 'json', label: 'JSON' }, { value: 'csv', label: 'CSV' }] },
  ], { outputType: 'application/json' }),
  pdfTool('extract-all-text', 'Extract All Text', 'Export plain text', 'extract', 'browser-ready', [
    { key: 'format', label: 'Format', type: 'select', default: 'txt', options: [{ value: 'txt', label: 'Plain Text' }, { value: 'csv', label: 'CSV' }] },
  ], { outputType: 'text/plain', supportsBatch: true }),
  pdfTool('extract-images', 'Extract Images', 'Extract embedded images', 'extract', 'browser-partial', [
    { key: 'format', label: 'Output Format', type: 'select', default: 'png', options: [{ value: 'png', label: 'PNG' }, { value: 'jpeg', label: 'JPEG' }] },
    { key: 'minSize', label: 'Min Size (px)', type: 'number', default: 50 },
  ], { outputType: 'image/png', outputMultiple: true }),
  pdfTool('extract-attachments', 'Extract Attachments', 'Download embedded files', 'extract', 'browser-partial', [], { outputMultiple: true }),
  pdfTool('extract-fonts-meta', 'Extract Fonts Metadata', 'Export font inventory', 'extract', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('extract-links', 'Extract Links', 'Export links as CSV/JSON', 'extract', 'browser-partial', [
    { key: 'format', label: 'Format', type: 'select', default: 'csv', options: [{ value: 'csv', label: 'CSV' }, { value: 'json', label: 'JSON' }] },
  ], { outputType: 'text/csv' }),
  pdfTool('extract-bookmarks', 'Extract Bookmarks', 'Export bookmark tree', 'extract', 'browser-partial', [
    { key: 'format', label: 'Format', type: 'select', default: 'json', options: [{ value: 'json', label: 'JSON' }, { value: 'csv', label: 'CSV' }] },
  ], { outputType: 'application/json' }),
  pdfTool('extract-annotations', 'Extract Annotations', 'Export annotations', 'extract', 'browser-partial', [
    { key: 'format', label: 'Format', type: 'select', default: 'json', options: [{ value: 'json', label: 'JSON' }, { value: 'csv', label: 'CSV' }] },
  ], { outputType: 'application/json' }),
  pdfTool('extract-forms', 'Extract Forms', 'Export form schema and current values', 'extract', 'browser-ready', [
    { key: 'format', label: 'Format', type: 'select', default: 'json', options: [{ value: 'json', label: 'JSON' }, { value: 'csv', label: 'CSV' }, { value: 'fdf', label: 'FDF' }] },
  ], { outputType: 'application/json' }),
  pdfTool('extract-thumbnails', 'Extract Page Thumbnails', 'Generate page thumbnail images', 'extract', 'browser-partial', [
    { key: 'width', label: 'Thumbnail Width', type: 'number', default: 200 },
  ], { outputType: 'image/png', outputMultiple: true }),
  pdfTool('export-page-map', 'Export Page Map', 'Export page index/orientation/size metadata', 'extract', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('export-manifest', 'Export Document Manifest', 'Create machine-readable manifest', 'extract', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('data-extraction-csv', 'Data Extraction to CSV', 'Extract repeating rows/tables to CSV', 'extract', 'backend-required', [
    { key: 'pattern', label: 'Detection Pattern', type: 'select', default: 'auto', options: [{ value: 'auto', label: 'Auto Detect' }, { value: 'rows', label: 'Row Pattern' }, { value: 'columns', label: 'Column Pattern' }] },
  ], { outputType: 'text/csv' }),
  pdfTool('invoice-extraction', 'Invoice/Receipt Field Extraction', 'Future AI adapter for structured fields', 'extract', 'ai-required', [
    { key: 'docType', label: 'Document Type', type: 'select', default: 'invoice', options: [{ value: 'invoice', label: 'Invoice' }, { value: 'receipt', label: 'Receipt' }] },
  ], { outputType: 'application/json' }),
  pdfTool('bank-statement-extraction', 'Bank Statement Extraction', 'Future AI/structured extraction', 'extract', 'ai-required', [], { outputType: 'application/json' }),
  pdfTool('resume-extraction', 'Resume/CV Extraction', 'Future AI extraction adapter', 'extract', 'ai-required', [], { outputType: 'application/json' }),
  pdfTool('contract-clause-extraction', 'Contract Clause Extraction', 'Future AI extraction adapter', 'extract', 'ai-required', [
    { key: 'clauseType', label: 'Clause Type', type: 'select', default: 'all', options: [{ value: 'all', label: 'All Clauses' }, { value: 'liability', label: 'Liability' }, { value: 'termination', label: 'Termination' }, { value: 'confidentiality', label: 'Confidentiality' }] },
  ], { outputType: 'application/json' }),

  // ═══════════════════════════════════════════════════════════
  // 9.11 AI PDF WORKSPACE (18 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('ai-summarize', 'AI Summarize PDF', 'Generate short/medium/detailed summary', 'ai', 'ai-required', [
    { key: 'length', label: 'Summary Length', type: 'select', default: 'medium', options: [{ value: 'short', label: 'Short (1 paragraph)' }, { value: 'medium', label: 'Medium (3-5 paragraphs)' }, { value: 'detailed', label: 'Detailed (full overview)' }] },
  ], { outputType: 'text/plain' }),
  pdfTool('ask-pdf', 'Ask PDF', 'Question-answering over document content', 'ai', 'ai-required', [
    { key: 'question', label: 'Your Question', type: 'text', default: '' },
  ], { outputType: 'text/plain' }),
  pdfTool('chat-pdf', 'Chat With PDF', 'Conversation history tied to a document', 'ai', 'ai-required', [
    { key: 'message', label: 'Message', type: 'text', default: '' },
  ], { outputType: 'text/plain' }),
  pdfTool('translate-pdf', 'Translate PDF', 'Translate text while preserving layout', 'ai', 'ai-required', [
    { key: 'targetLanguage', label: 'Target Language', type: 'select', default: 'es', options: [{ value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' }, { value: 'it', label: 'Italian' }, { value: 'pt', label: 'Portuguese' }, { value: 'zh', label: 'Chinese' }, { value: 'ja', label: 'Japanese' }, { value: 'ar', label: 'Arabic' }, { value: 'hi', label: 'Hindi' }] },
  ]),
  pdfTool('rewrite-text', 'Rewrite Selected Text', 'Change tone/readability of selected text', 'ai', 'ai-required', [
    { key: 'tone', label: 'Tone', type: 'select', default: 'professional', options: [{ value: 'professional', label: 'Professional' }, { value: 'casual', label: 'Casual' }, { value: 'academic', label: 'Academic' }, { value: 'simple', label: 'Simple' }] },
  ], { outputType: 'text/plain' }),
  pdfTool('explain-section', 'Explain Section', 'Explain selected technical/legal/academic content', 'ai', 'ai-required', [
    { key: 'level', label: 'Explanation Level', type: 'select', default: 'general', options: [{ value: 'simple', label: 'Simple (ELI5)' }, { value: 'general', label: 'General' }, { value: 'expert', label: 'Expert' }] },
  ], { outputType: 'text/plain' }),
  pdfTool('generate-outline', 'Generate Outline', 'Create chapter/heading outline', 'ai', 'ai-required', [], { outputType: 'text/plain' }),
  pdfTool('generate-key-points', 'Generate Key Points', 'Extract actionable/key points', 'ai', 'ai-required', [
    { key: 'count', label: 'Number of Points', type: 'number', default: 10 },
  ], { outputType: 'text/plain' }),
  pdfTool('generate-keywords', 'Generate Keywords', 'Create keyword/tag set', 'ai', 'ai-required', [
    { key: 'count', label: 'Number of Keywords', type: 'number', default: 15 },
  ], { outputType: 'text/plain' }),
  pdfTool('generate-flashcards', 'Generate Flashcards', 'Create study cards from content', 'ai', 'ai-required', [
    { key: 'count', label: 'Number of Cards', type: 'number', default: 20 },
    { key: 'difficulty', label: 'Difficulty', type: 'select', default: 'mixed', options: [{ value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }, { value: 'mixed', label: 'Mixed' }] },
  ], { outputType: 'application/json' }),
  pdfTool('generate-quiz', 'Generate Quiz', 'Generate multiple choice/short-answer questions', 'ai', 'ai-required', [
    { key: 'count', label: 'Number of Questions', type: 'number', default: 10 },
    { key: 'type', label: 'Question Type', type: 'select', default: 'mcq', options: [{ value: 'mcq', label: 'Multiple Choice' }, { value: 'short', label: 'Short Answer' }, { value: 'mixed', label: 'Mixed' }] },
  ], { outputType: 'application/json' }),
  pdfTool('generate-faq', 'Generate FAQ', 'Generate questions and answers', 'ai', 'ai-required', [
    { key: 'count', label: 'Number of FAQs', type: 'number', default: 10 },
  ], { outputType: 'text/plain' }),
  pdfTool('generate-executive-brief', 'Generate Executive Brief', 'One-page executive-style summary', 'ai', 'ai-required', [], { outputType: 'text/plain' }),
  pdfTool('generate-action-items', 'Generate Action Items', 'Identify tasks/owners/dates from text', 'ai', 'ai-required', [], { outputType: 'application/json' }),
  pdfTool('citation-finder', 'Citation Finder', 'Extract cited sources/URLs', 'ai', 'ai-required', [], { outputType: 'application/json' }),
  pdfTool('clause-finder', 'Clause Finder', 'Search legal/business clauses semantically', 'ai', 'ai-required', [
    { key: 'query', label: 'Search Query', type: 'text', default: '' },
  ], { outputType: 'application/json' }),
  pdfTool('table-explanation', 'Table Explanation', 'Explain selected table data', 'ai', 'ai-required', [], { outputType: 'text/plain' }),
  pdfTool('multi-pdf-synthesis', 'Multi-PDF Synthesis', 'Ask questions across multiple PDFs', 'ai', 'ai-required', [
    { key: 'question', label: 'Question', type: 'text', default: '' },
  ], { acceptsMultiple: true, outputType: 'text/plain' }),

  // ═══════════════════════════════════════════════════════════
  // 9.12 WORKFLOWS, BATCH & AUTOMATION (18 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('batch-runner', 'Batch Tool Runner', 'Run one tool over many PDFs', 'workflows', 'browser-ready', [
    { key: 'tool', label: 'Tool', type: 'select', default: 'compress-pdf', options: [{ value: 'compress-pdf', label: 'Compress' }, { value: 'rotate-pages', label: 'Rotate' }, { value: 'watermark-text', label: 'Watermark' }, { value: 'encrypt-pdf', label: 'Encrypt' }, { value: 'flatten-pdf', label: 'Flatten' }, { value: 'remove-metadata', label: 'Remove Metadata' }] },
  ], { acceptsMultiple: true, supportsBatch: true }),
  pdfTool('batch-download-zip', 'Batch Download ZIP', 'Download all outputs as ZIP', 'workflows', 'browser-partial', [], { outputType: 'application/zip' }),
  pdfTool('workflow-builder', 'Workflow Builder', 'Chain multiple PDF operations', 'workflows', 'browser-ready', []),
  pdfTool('workflow-templates', 'Workflow Templates', 'Save reusable workflows', 'workflows', 'browser-ready', []),
  pdfTool('workflow-import-export', 'Workflow Import/Export', 'Save workflows as JSON', 'workflows', 'browser-ready', [
    { key: 'action', label: 'Action', type: 'select', default: 'export', options: [{ value: 'export', label: 'Export' }, { value: 'import', label: 'Import' }] },
  ], { outputType: 'application/json' }),
  pdfTool('conditional-step', 'Conditional Step', 'Run step based on file/page metadata', 'workflows', 'browser-partial', [
    { key: 'condition', label: 'Condition', type: 'select', default: 'pageCount', options: [{ value: 'pageCount', label: 'Page Count' }, { value: 'fileSize', label: 'File Size' }, { value: 'hasText', label: 'Has Text' }, { value: 'isEncrypted', label: 'Is Encrypted' }] },
    { key: 'operator', label: 'Operator', type: 'select', default: 'gt', options: [{ value: 'gt', label: 'Greater Than' }, { value: 'lt', label: 'Less Than' }, { value: 'eq', label: 'Equal To' }] },
    { key: 'value', label: 'Value', type: 'text', default: '' },
  ]),
  pdfTool('page-filter-step', 'Page Filter Step', 'Pass only pages matching criteria', 'workflows', 'browser-partial', [
    { key: 'filter', label: 'Filter', type: 'select', default: 'hasText', options: [{ value: 'hasText', label: 'Has Text' }, { value: 'hasImages', label: 'Has Images' }, { value: 'isBlank', label: 'Is Blank' }, { value: 'orientation', label: 'Orientation' }] },
  ]),
  pdfTool('file-naming-template', 'File Naming Template', 'Use variables like {name}, {pageCount}, {date}', 'workflows', 'browser-ready', [
    { key: 'template', label: 'Template', type: 'text', default: '{name}_{tool}_{date}' },
  ]),
  pdfTool('preset-manager', 'Preset Manager', 'Save common settings', 'workflows', 'browser-ready', []),
  pdfTool('favorite-tools', 'Favorite Tools', 'Pin frequently used tools', 'workflows', 'browser-ready', []),
  pdfTool('recent-projects', 'Recent Projects', 'Open recent local projects', 'workflows', 'browser-ready', []),
  pdfTool('job-history', 'Job History', 'Track local processing history', 'workflows', 'browser-ready', []),
  pdfTool('retry-failed-job', 'Retry Failed Job', 'Retry with same settings', 'workflows', 'browser-ready', []),
  pdfTool('duplicate-job', 'Duplicate Job', 'Clone a previous configuration', 'workflows', 'browser-ready', []),
  pdfTool('multi-stage-output', 'Multi-stage Output', 'Feed output of step A into B', 'workflows', 'browser-partial', []),
  pdfTool('workflow-validation', 'Workflow Validation', 'Detect incompatible step inputs', 'workflows', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('workflow-simulation', 'Workflow Simulation', 'Preview pipeline before execution', 'workflows', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('processing-queue', 'Processing Queue', 'Queue multiple jobs for sequential processing', 'workflows', 'browser-ready', [
    { key: 'concurrency', label: 'Concurrency', type: 'select', default: '1', options: [{ value: '1', label: 'Sequential' }, { value: '2', label: '2 Parallel' }, { value: '4', label: '4 Parallel' }] },
  ]),

  // ═══════════════════════════════════════════════════════════
  // 9.13 PDF CREATION & TEMPLATES (14 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('blank-pdf', 'Blank PDF Creator', 'Create blank pages with chosen paper size', 'create', 'browser-ready', [
    { key: 'pageSize', label: 'Page Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'a3', label: 'A3' }, { value: 'a5', label: 'A5' }, { value: 'letter', label: 'Letter' }, { value: 'legal', label: 'Legal' }] },
    { key: 'pageCount', label: 'Number of Pages', type: 'number', default: 1 },
    { key: 'orientation', label: 'Orientation', type: 'select', default: 'portrait', options: [{ value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }] },
  ]),
  pdfTool('text-to-pdf', 'Text-to-PDF', 'Convert rich/plain text to PDF', 'create', 'browser-ready', [
    { key: 'fontSize', label: 'Font Size', type: 'number', default: 12 },
    { key: 'font', label: 'Font', type: 'select', default: 'Helvetica', options: [{ value: 'Helvetica', label: 'Helvetica' }, { value: 'Times', label: 'Times Roman' }, { value: 'Courier', label: 'Courier' }] },
    { key: 'pageSize', label: 'Page Size', type: 'select', default: 'a4', options: [{ value: 'a4', label: 'A4' }, { value: 'letter', label: 'Letter' }] },
  ], { acceptedTypes: ['text/plain'] }),
  pdfTool('md-to-pdf-create', 'Markdown-to-PDF', 'Render Markdown document to PDF', 'create', 'browser-partial', [
    { key: 'theme', label: 'Theme', type: 'select', default: 'default', options: [{ value: 'default', label: 'Default' }, { value: 'github', label: 'GitHub' }, { value: 'minimal', label: 'Minimal' }] },
  ], { acceptedTypes: ['text/markdown', 'text/plain'] }),
  pdfTool('data-to-pdf', 'Data-to-PDF', 'Render CSV/JSON/table data using templates', 'create', 'browser-partial', [
    { key: 'template', label: 'Template', type: 'select', default: 'table', options: [{ value: 'table', label: 'Table' }, { value: 'cards', label: 'Cards' }, { value: 'list', label: 'List' }] },
  ], { acceptedTypes: ['application/json', 'text/csv'] }),
  pdfTool('invoice-generator', 'Invoice PDF Generator', 'Create invoice PDF from structured fields', 'create', 'browser-ready', [
    { key: 'companyName', label: 'Company Name', type: 'text', default: '' },
    { key: 'invoiceNumber', label: 'Invoice Number', type: 'text', default: '' },
    { key: 'dueDate', label: 'Due Date', type: 'text', default: '' },
  ]),
  pdfTool('receipt-generator', 'Receipt PDF Generator', 'Create receipt-style PDF', 'create', 'browser-ready', [
    { key: 'storeName', label: 'Store Name', type: 'text', default: '' },
    { key: 'receiptNumber', label: 'Receipt Number', type: 'text', default: '' },
  ]),
  pdfTool('certificate-generator', 'Certificate PDF Generator', 'Create certificate from data', 'create', 'browser-ready', [
    { key: 'recipientName', label: 'Recipient Name', type: 'text', default: '' },
    { key: 'courseName', label: 'Course/Achievement', type: 'text', default: '' },
    { key: 'date', label: 'Date', type: 'text', default: '' },
    { key: 'template', label: 'Template', type: 'select', default: 'classic', options: [{ value: 'classic', label: 'Classic' }, { value: 'modern', label: 'Modern' }, { value: 'elegant', label: 'Elegant' }] },
  ]),
  pdfTool('report-generator', 'Report PDF Generator', 'Generate paginated reports', 'create', 'browser-partial', [
    { key: 'title', label: 'Report Title', type: 'text', default: '' },
    { key: 'includeTOC', label: 'Include Table of Contents', type: 'boolean', default: true },
  ]),
  pdfTool('cover-page-generator', 'Cover Page Generator', 'Create cover page from metadata', 'create', 'browser-ready', [
    { key: 'title', label: 'Title', type: 'text', default: '' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', default: '' },
    { key: 'author', label: 'Author', type: 'text', default: '' },
    { key: 'style', label: 'Style', type: 'select', default: 'minimal', options: [{ value: 'minimal', label: 'Minimal' }, { value: 'corporate', label: 'Corporate' }, { value: 'creative', label: 'Creative' }] },
  ]),
  pdfTool('toc-generator', 'Table of Contents Generator', 'Create TOC from headings/bookmarks', 'create', 'browser-partial', [
    { key: 'depth', label: 'Depth', type: 'select', default: '2', options: [{ value: '1', label: '1 Level' }, { value: '2', label: '2 Levels' }, { value: '3', label: '3 Levels' }] },
  ]),
  pdfTool('bookmark-generator', 'Bookmark Generator', 'Create bookmarks from headings', 'create', 'browser-partial', [
    { key: 'detectFrom', label: 'Detect From', type: 'select', default: 'text', options: [{ value: 'text', label: 'Text Patterns' }, { value: 'fontSize', label: 'Font Size' }, { value: 'manual', label: 'Manual' }] },
  ]),
  pdfTool('qr-code-pdf', 'QR Code to PDF', 'Create QR codes embedded into PDFs', 'create', 'browser-ready', [
    { key: 'data', label: 'QR Data', type: 'text', default: 'https://' },
    { key: 'size', label: 'Size (pt)', type: 'number', default: 100 },
  ]),
  pdfTool('barcode-pdf', 'Barcode to PDF', 'Future barcode generation support', 'create', 'backend-required', [
    { key: 'type', label: 'Barcode Type', type: 'select', default: 'code128', options: [{ value: 'code128', label: 'Code 128' }, { value: 'code39', label: 'Code 39' }, { value: 'ean13', label: 'EAN-13' }, { value: 'upc', label: 'UPC-A' }] },
    { key: 'data', label: 'Data', type: 'text', default: '' },
  ]),
  pdfTool('letterhead-creator', 'Letterhead PDF Creator', 'Place letterhead/background and content', 'create', 'browser-partial', [
    { key: 'headerText', label: 'Header', type: 'text', default: '' },
    { key: 'footerText', label: 'Footer', type: 'text', default: '' },
  ], { acceptedTypes: ['application/pdf', 'image/png', 'image/jpeg'] }),

  // ═══════════════════════════════════════════════════════════
  // 9.14 DEVELOPER / POWER-USER PDF TOOLS (17 tools)
  // ═══════════════════════════════════════════════════════════
  pdfTool('pdf-object-stats', 'PDF Object Statistics', 'Count and estimate sizes of object types', 'developer', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('xref-inspection', 'Cross-Reference Inspection', 'Inspect xref-related structure', 'developer', 'backend-required', [], { outputType: 'application/json' }),
  pdfTool('object-stream-inspector', 'Object Stream Inspector', 'Inspect compressed object-streams', 'developer', 'backend-required', [], { outputType: 'application/json' }),
  pdfTool('linearization-check', 'Linearization Check', 'Report whether PDF is web optimized', 'developer', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('trailer-catalog-inspector', 'Trailer/Catalog Inspector', 'Expose document catalog info', 'developer', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('permissions-parser', 'Permissions Parser', 'Decode effective permission flags', 'developer', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('page-tree-inspector', 'Page Tree Inspector', 'Expose page tree consistency', 'developer', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('acroform-inspector', 'AcroForm Inspector', 'Inspect AcroForm structure', 'developer', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('js-presence-detector', 'JavaScript Presence Detector', 'Detect embedded JS', 'developer', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('embedded-file-detector', 'Embedded File Detector', 'Detect embedded files', 'developer', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('encrypted-doc-detector', 'Encrypted Document Detector', 'Detect encryption mode metadata', 'developer', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('digital-sig-detector', 'Digital Signature Detector', 'Detect signature fields', 'developer', 'browser-partial', [], { outputType: 'application/json' }),
  pdfTool('render-stress-test', 'Render Stress Test', 'Render all pages and flag failures', 'developer', 'backend-required', [], { outputType: 'application/json' }),
  pdfTool('pdf-fuzz-test', 'PDF Fuzz/Robustness Test', 'Developer-only validation test page', 'developer', 'backend-required', []),
  pdfTool('fixture-generator', 'Fixture Generator', 'Generate synthetic PDFs for testing', 'developer', 'browser-ready', [
    { key: 'type', label: 'Fixture Type', type: 'select', default: 'basic', options: [{ value: 'basic', label: 'Basic Single Page' }, { value: 'multi', label: 'Multi-page' }, { value: 'encrypted', label: 'Encrypted' }, { value: 'tagged', label: 'Tagged PDF' }, { value: 'forms', label: 'With Forms' }, { value: 'images', label: 'With Images' }] },
    { key: 'pageCount', label: 'Page Count', type: 'number', default: 5 },
  ]),
  pdfTool('capability-matrix', 'Tool Capability Matrix', 'Show which tools run locally vs backend', 'developer', 'browser-ready', [], { outputType: 'application/json' }),
  pdfTool('batch-rules-editor', 'Batch Rules JSON Editor', 'Advanced batch rules inspection/export', 'developer', 'browser-ready', [
    { key: 'rules', label: 'Rules JSON', type: 'text', default: '{}' },
  ], { outputType: 'application/json' }),
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolRegistry.find(t => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return toolRegistry.filter(t => t.category === category);
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase();
  return toolRegistry.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  );
}

export function getCapabilityCounts(): Record<string, number> {
  const counts: Record<string, number> = { 'browser-ready': 0, 'browser-partial': 0, 'backend-required': 0, 'ai-required': 0 };
  toolRegistry.forEach(t => { counts[t.capability] = (counts[t.capability] || 0) + 1; });
  return counts;
}
