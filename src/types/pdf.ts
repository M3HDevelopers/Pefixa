export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
  fileSize: number;
  pdfVersion?: string;
  isEncrypted: boolean;
  isLinearized: boolean;
  hasForms: boolean;
  hasAnnotations: boolean;
  hasAttachments: boolean;
}

export interface PDFPageInfo {
  index: number;
  width: number;
  height: number;
  rotation: number;
  hasText: boolean;
  hasImages: boolean;
  hasAnnotations: boolean;
}

export interface PDFStructure {
  metadata: PDFMetadata;
  pages: PDFPageInfo[];
  bookmarks: PDFBookmark[];
  fonts: string[];
  images: { pageIndex: number; count: number }[];
}

export interface PDFBookmark {
  title: string;
  pageIndex: number;
  children: PDFBookmark[];
}
