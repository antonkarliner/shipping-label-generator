'use client';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

// Set the worker source to a URL string
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export default pdfjsLib;