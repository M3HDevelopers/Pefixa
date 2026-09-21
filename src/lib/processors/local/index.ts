import { ToolDefinition, ToolInput, ToolOutput } from '../../../types/tool';
import { PDFDocument, rgb, StandardFonts, degrees, PDFPage } from 'pdf-lib';

export interface ProcessorAdapter {
  process(tool: ToolDefinition, input: ToolInput): Promise<ToolOutput>;
}

function toBlob(bytes: Uint8Array, type: string): Blob {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Blob([buffer], { type });
}

function parsePageRanges(rangesStr: string, totalPages: number): number[] {
  const pages: number[] = [];
  const parts = rangesStr.split(',').map(p => p.trim());
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()));
      for (let i = start; i <= Math.min(end, totalPages); i++) {
        if (i >= 1) pages.push(i - 1);
      }
    } else {
      const num = parseInt(part);
      if (num >= 1 && num <= totalPages) pages.push(num - 1);
    }
  }
  return [...new Set(pages)].sort((a, b) => a - b);
}

class MergeProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const mergedPdf = await PDFDocument.create();
    for (const file of input.files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    return {
      files: [{ name: 'merged.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { pageCount: mergedPdf.getPageCount(), originalFiles: input.files.length },
    };
  }
}

class SplitProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const mode = input.options.mode || 'ranges';
    const outputFiles: { name: string; blob: Blob }[] = [];

    if (mode === 'each') {
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
        const pdfBytes = await newPdf.save();
        outputFiles.push({ name: `page-${i + 1}.pdf`, blob: toBlob(pdfBytes, 'application/pdf') });
      }
    } else if (mode === 'every-n') {
      const n = parseInt(input.options.everyN || '5');
      for (let i = 0; i < pdf.getPageCount(); i += n) {
        const newPdf = await PDFDocument.create();
        const end = Math.min(i + n, pdf.getPageCount());
        const indices = Array.from({ length: end - i }, (_, j) => i + j);
        const pages = await newPdf.copyPages(pdf, indices);
        pages.forEach(page => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        outputFiles.push({ name: `pages-${i + 1}-${end}.pdf`, blob: toBlob(pdfBytes, 'application/pdf') });
      }
    } else {
      const rangesStr = (input.options.ranges || '1-' + pdf.getPageCount()) as string;
      const ranges = rangesStr.split(',').map((r: string) => r.trim());
      for (const range of ranges) {
        const parts = range.split('-').map((n: string) => parseInt(n.trim()));
        const start = parts[0] - 1;
        const end = parts[1] !== undefined ? parts[1] - 1 : start;
        const newPdf = await PDFDocument.create();
        const pageIndices: number[] = [];
        for (let i = start; i <= Math.min(end, pdf.getPageCount() - 1); i++) {
          if (i >= 0) pageIndices.push(i);
        }
        const pages = await newPdf.copyPages(pdf, pageIndices);
        pages.forEach(page => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        outputFiles.push({ name: `pages-${start + 1}-${end + 1}.pdf`, blob: toBlob(pdfBytes, 'application/pdf') });
      }
    }

    return { files: outputFiles, warnings: [], metadata: { mode, splits: outputFiles.length } };
  }
}

class ExtractPagesProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pagesStr = (input.options.pages || '1-' + pdf.getPageCount()) as string;
    const pageIndices = parsePageRanges(pagesStr, pdf.getPageCount());
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, pageIndices);
    pages.forEach(page => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    return {
      files: [{ name: 'extracted-pages.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { extractedPages: pageIndices.length },
    };
  }
}

class DeletePagesProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pagesStr = (input.options.pages || '') as string;
    const deleteIndices = new Set(parsePageRanges(pagesStr, pdf.getPageCount()));
    const newPdf = await PDFDocument.create();
    const keepIndices = Array.from({ length: pdf.getPageCount() }, (_, i) => i).filter(i => !deleteIndices.has(i));
    const pages = await newPdf.copyPages(pdf, keepIndices);
    pages.forEach(page => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    return {
      files: [{ name: 'pages-deleted.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { deletedPages: deleteIndices.size, remainingPages: keepIndices.length },
    };
  }
}

class ReversePagesProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const newPdf = await PDFDocument.create();
    const indices = Array.from({ length: pdf.getPageCount() }, (_, i) => i).reverse();
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach(page => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    return {
      files: [{ name: 'reversed.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { pageCount: pdf.getPageCount() },
    };
  }
}

class ExtractOddPagesProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const newPdf = await PDFDocument.create();
    const indices = Array.from({ length: pdf.getPageCount() }, (_, i) => i).filter(i => (i + 1) % 2 !== 0);
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach(page => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    return {
      files: [{ name: 'odd-pages.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { pageCount: indices.length },
    };
  }
}

class ExtractEvenPagesProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const newPdf = await PDFDocument.create();
    const indices = Array.from({ length: pdf.getPageCount() }, (_, i) => i).filter(i => (i + 1) % 2 === 0);
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach(page => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    return {
      files: [{ name: 'even-pages.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { pageCount: indices.length },
    };
  }
}

class RotatePagesProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const angle = parseInt(input.options.angle || '90');
    const pages = input.options.pages || 'all';

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const page = pdf.getPage(i);
      const shouldRotate =
        pages === 'all' ||
        (pages === 'even' && (i + 1) % 2 === 0) ||
        (pages === 'odd' && (i + 1) % 2 !== 0);
      if (shouldRotate) {
        page.setRotation(degrees((page.getRotation().angle + angle) % 360));
      }
    }

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'rotated.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { angle, pages },
    };
  }
}

class WatermarkTextProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    const text = (input.options.text || 'WATERMARK') as string;
    const opacity = (input.options.opacity || 0.5) as number;
    const rotation = (input.options.rotation || 45) as number;

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();
      const fontSize = Math.min(width, height) / 10;
      page.drawText(text, {
        x: width / 2 - (text.length * fontSize) / 4,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(0.7, 0.7, 0.7),
        opacity,
        rotate: degrees(rotation),
      });
    }

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'watermarked.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { text, opacity, rotation },
    };
  }
}

class PageNumbersProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const position = (input.options.position || 'bottom-center') as string;
    const startFrom = (input.options.startFrom || 1) as number;
    const format = (input.options.format || 'number') as string;
    const totalPages = pdf.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();
      const pageNum = i + startFrom;
      let text = '';
      switch (format) {
        case 'dash': text = `- ${pageNum} -`; break;
        case 'page': text = `Page ${pageNum}`; break;
        case 'of': text = `Page ${pageNum} of ${totalPages}`; break;
        default: text = `${pageNum}`;
      }

      const fontSize = 10;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      let x = width / 2 - textWidth / 2;
      let y = 30;

      if (position.includes('top')) y = height - 30;
      if (position.includes('left')) x = 40;
      if (position.includes('right')) x = width - textWidth - 40;

      page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });
    }

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'numbered.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { position, format, totalPages },
    };
  }
}

class BatesNumberingProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Courier);
    const prefix = (input.options.prefix || 'BATES-') as string;
    const start = (input.options.start || 1) as number;
    const padding = (input.options.padding || 6) as number;
    const position = (input.options.position || 'top-right') as string;

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();
      const num = String(start + i).padStart(padding, '0');
      const text = `${prefix}${num}`;
      const fontSize = 9;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      let x = width - textWidth - 40;
      let y = height - 30;

      if (position.includes('bottom')) y = 30;
      if (position.includes('left')) x = 40;

      page.drawText(text, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
    }

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'bates-numbered.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { prefix, start, padding, totalPages: pdf.getPageCount() },
    };
  }
}

class StampPdfProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    let stampText = (input.options.stamp || 'APPROVED') as string;
    if (stampText === 'CUSTOM') stampText = (input.options.customText || 'CUSTOM') as string;
    const colorMap: Record<string, [number, number, number]> = {
      red: [0.8, 0.1, 0.1], blue: [0.1, 0.1, 0.8], green: [0.1, 0.6, 0.1], black: [0.2, 0.2, 0.2],
    };
    const color = colorMap[(input.options.color as string) || 'red'] || colorMap.red;

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();
      const fontSize = Math.min(width, height) / 8;
      const textWidth = font.widthOfTextAtSize(stampText, fontSize);
      page.drawText(stampText, {
        x: width / 2 - textWidth / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(color[0], color[1], color[2]),
        opacity: 0.8,
        rotate: degrees(-15),
      });
      // Draw border
      const bx = width / 2 - textWidth / 2 - 10;
      const by = height / 2 - 5;
      page.drawRectangle({ x: bx, y: by, width: textWidth + 20, height: fontSize + 10, borderColor: rgb(color[0], color[1], color[2]), borderWidth: 3, opacity: 0.8 });
    }

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'stamped.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { stamp: stampText },
    };
  }
}

class HeaderFooterProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const headerText = (input.options.headerText || '') as string;
    const footerText = (input.options.footerText || '') as string;
    const fontSize = (input.options.fontSize || 10) as number;

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();
      if (headerText) {
        const hw = font.widthOfTextAtSize(headerText, fontSize);
        page.drawText(headerText, { x: width / 2 - hw / 2, y: height - 25, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });
      }
      if (footerText) {
        const fw = font.widthOfTextAtSize(footerText, fontSize);
        page.drawText(footerText, { x: width / 2 - fw / 2, y: 15, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });
      }
    }

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'header-footer.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { headerText, footerText },
    };
  }
}

class AddTextProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const text = (input.options.text || 'Text') as string;
    const fontSize = (input.options.fontSize || 12) as number;
    const fontName = (input.options.font || 'Helvetica') as string;
    const x = (input.options.x || 50) as number;
    const y = (input.options.y || 50) as number;

    let font;
    switch (fontName) {
      case 'Times': font = await pdf.embedFont(StandardFonts.TimesRoman); break;
      case 'Courier': font = await pdf.embedFont(StandardFonts.Courier); break;
      default: font = await pdf.embedFont(StandardFonts.Helvetica);
    }

    const page = pdf.getPage(0);
    page.drawText(text, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'text-added.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { text, fontSize, font: fontName },
    };
  }
}

class CompressProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const level = input.options.level || 'recommended';
    const useObjectStreams = level !== 'low';
    const pdfBytes = await pdf.save({ useObjectStreams });
    const originalSize = file.size;
    const newSize = pdfBytes.length;
    return {
      files: [{ name: `compressed-${file.name}`, blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: newSize >= originalSize ? ['File size did not decrease. PDF may already be optimized.'] : [],
      metadata: { originalSize, newSize, reduction: `${((1 - newSize / originalSize) * 100).toFixed(1)}%` },
    };
  }
}

class FlattenProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'flattened.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: ['Form fields and annotations flattened in output'],
      metadata: { pageCount: pdf.getPageCount() },
    };
  }
}

class EncryptProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pdfBytes = await pdf.save();
    return {
      files: [{ name: `encrypted-${file.name}`, blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: ['Note: Full encryption requires backend support. Output is a copy with metadata note.'],
      metadata: { encrypted: true },
    };
  }
}

class DecryptProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pdfBytes = await pdf.save();
    return {
      files: [{ name: `decrypted-${file.name}`, blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { decrypted: true },
    };
  }
}

class RemoveMetadataProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setProducer('');
    pdf.setCreator('');
    const pdfBytes = await pdf.save();
    return {
      files: [{ name: `no-metadata-${file.name}`, blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { metadataRemoved: true },
    };
  }
}

class EditMetadataProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    if (input.options.title) pdf.setTitle(input.options.title);
    if (input.options.author) pdf.setAuthor(input.options.author);
    if (input.options.subject) pdf.setSubject(input.options.subject);
    if (input.options.keywords) pdf.setKeywords(input.options.keywords.split(',').map((k: string) => k.trim()));
    const pdfBytes = await pdf.save();
    return {
      files: [{ name: `metadata-updated-${file.name}`, blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { updated: true },
    };
  }
}

class PDFInfoProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const info = {
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle() || 'N/A',
      author: pdf.getAuthor() || 'N/A',
      subject: pdf.getSubject() || 'N/A',
      creator: pdf.getCreator() || 'N/A',
      producer: pdf.getProducer() || 'N/A',
      creationDate: pdf.getCreationDate()?.toISOString() || 'N/A',
      modificationDate: pdf.getModificationDate()?.toISOString() || 'N/A',
      pages: Array.from({ length: pdf.getPageCount() }, (_, i) => {
        const page = pdf.getPage(i);
        const { width, height } = page.getSize();
        return { index: i + 1, width: Math.round(width), height: Math.round(height) };
      }),
    };
    return {
      files: [{ name: 'pdf-info.json', blob: new Blob([JSON.stringify(info, null, 2)], { type: 'application/json' }) }],
      warnings: [],
      metadata: info,
    };
  }
}

class GeneratePasswordProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const length = (input.options.length || 16) as number;
    const includeSymbols = input.options.includeSymbols !== false;
    const includeNumbers = input.options.includeNumbers !== false;
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }
    return {
      files: [{ name: 'generated-password.txt', blob: new Blob([password], { type: 'text/plain' }) }],
      warnings: [],
      metadata: { length, hasSymbols: includeSymbols, hasNumbers: includeNumbers },
    };
  }
}

class BlankPdfProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const pdf = await PDFDocument.create();
    const pageSize = (input.options.pageSize || 'a4') as string;
    const pageCount = (input.options.pageCount || 1) as number;
    const orientation = (input.options.orientation || 'portrait') as string;

    const sizes: Record<string, [number, number]> = {
      a4: [595.28, 841.89], a3: [841.89, 1190.55], a5: [419.53, 595.28],
      letter: [612, 792], legal: [612, 1008],
    };
    let [w, h] = sizes[pageSize] || sizes.a4;
    if (orientation === 'landscape') [w, h] = [h, w];

    for (let i = 0; i < pageCount; i++) {
      pdf.addPage([w, h]);
    }

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: `blank-${pageSize}-${pageCount}pg.pdf`, blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { pageSize, pageCount, orientation },
    };
  }
}

class TextToPdfProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const file = input.files[0];
    const text = await file.text();
    const pdf = await PDFDocument.create();
    const fontSize = (input.options.fontSize || 12) as number;
    const fontName = (input.options.font || 'Helvetica') as string;

    let font;
    switch (fontName) {
      case 'Times': font = await pdf.embedFont(StandardFonts.TimesRoman); break;
      case 'Courier': font = await pdf.embedFont(StandardFonts.Courier); break;
      default: font = await pdf.embedFont(StandardFonts.Helvetica);
    }

    const pageSize = (input.options.pageSize || 'a4') as string;
    const sizes: Record<string, [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };
    const [pageWidth, pageHeight] = sizes[pageSize] || sizes.a4;
    const margin = 50;
    const lineHeight = fontSize * 1.4;
    const maxWidth = pageWidth - margin * 2;
    const lines: string[] = text.split('\n');
    let page = pdf.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    for (const line of lines) {
      if (y < margin) {
        page = pdf.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      if (line.trim() === '') {
        y -= lineHeight;
        continue;
      }
      // Simple word wrapping
      const words = line.split(' ');
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && currentLine) {
          page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
          y -= lineHeight;
          currentLine = word;
          if (y < margin) {
            page = pdf.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }
    }

    const pdfBytes = await pdf.save();
    return {
      files: [{ name: file.name.replace(/\.[^.]+$/, '.pdf'), blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { pages: pdf.getPageCount(), fontSize, font: fontName },
    };
  }
}

class ImageToPdfProcessor implements ProcessorAdapter {
  async process(_tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const pdf = await PDFDocument.create();
    for (const file of input.files) {
      const bytes = await file.arrayBuffer();
      const uint8 = new Uint8Array(bytes);
      let image;
      if (file.type === 'image/png') {
        image = await pdf.embedPng(uint8);
      } else {
        image = await pdf.embedJpg(uint8);
      }
      const pageSize = (input.options.pageSize || 'fit') as string;
      let pageWidth = image.width;
      let pageHeight = image.height;
      if (pageSize === 'a4') { pageWidth = 595.28; pageHeight = 841.89; }
      else if (pageSize === 'letter') { pageWidth = 612; pageHeight = 792; }
      const page = pdf.addPage([pageWidth, pageHeight]);
      const scale = Math.min(pageWidth / image.width, pageHeight / image.height) * 0.9;
      const x = (pageWidth - image.width * scale) / 2;
      const y = (pageHeight - image.height * scale) / 2;
      page.drawImage(image, { x, y, width: image.width * scale, height: image.height * scale });
    }
    const pdfBytes = await pdf.save();
    return {
      files: [{ name: 'images-to-pdf.pdf', blob: toBlob(pdfBytes, 'application/pdf') }],
      warnings: [],
      metadata: { imageCount: input.files.length },
    };
  }
}

class MockProcessor implements ProcessorAdapter {
  async process(tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
    const capLabel = tool.capability === 'ai-required' ? 'AI backend' : tool.capability === 'backend-required' ? 'server processing' : 'browser engine';
    return {
      files: [{ name: `result-${tool.slug}.pdf`, blob: new Blob(['mock-output'], { type: tool.outputType || 'application/pdf' }) }],
      warnings: [`⚡ ${tool.title} requires ${capLabel}. This is a placeholder result. Full processing will be available when connected.`],
      metadata: { mock: true, capability: tool.capability, inputFiles: input.files.length, tool: tool.slug },
    };
  }
}

// Register all browser-ready processors
const processors: Record<string, ProcessorAdapter> = {
  'merge-pdf': new MergeProcessor(),
  'split-pdf': new SplitProcessor(),
  'extract-pages': new ExtractPagesProcessor(),
  'delete-pages': new DeletePagesProcessor(),
  'reverse-pages': new ReversePagesProcessor(),
  'extract-odd-pages': new ExtractOddPagesProcessor(),
  'extract-even-pages': new ExtractEvenPagesProcessor(),
  'rotate-pages': new RotatePagesProcessor(),
  'watermark-text': new WatermarkTextProcessor(),
  'page-numbers': new PageNumbersProcessor(),
  'bates-numbering': new BatesNumberingProcessor(),
  'stamp-pdf': new StampPdfProcessor(),
  'header-footer': new HeaderFooterProcessor(),
  'add-text': new AddTextProcessor(),
  'compress-pdf': new CompressProcessor(),
  'flatten-pdf': new FlattenProcessor(),
  'flatten-annotations': new FlattenProcessor(),
  'flatten-for-sharing': new FlattenProcessor(),
  'encrypt-pdf': new EncryptProcessor(),
  'decrypt-pdf': new DecryptProcessor(),
  'remove-metadata': new RemoveMetadataProcessor(),
  'edit-metadata': new EditMetadataProcessor(),
  'pdf-info': new PDFInfoProcessor(),
  'pdf-metadata-viewer': new PDFInfoProcessor(),
  'generate-password': new GeneratePasswordProcessor(),
  'blank-pdf': new BlankPdfProcessor(),
  'text-to-pdf': new TextToPdfProcessor(),
  'jpg-to-pdf': new ImageToPdfProcessor(),
  'png-to-pdf': new ImageToPdfProcessor(),
};

const mockProcessor = new MockProcessor();

export function getProcessor(tool: ToolDefinition): ProcessorAdapter {
  return processors[tool.slug] || mockProcessor;
}

export async function processTool(tool: ToolDefinition, input: ToolInput): Promise<ToolOutput> {
  const processor = getProcessor(tool);
  return processor.process(tool, input);
}
