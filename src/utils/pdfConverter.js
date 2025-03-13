'use client';

import pdfjsLib from './pdfSetup';

export const pdfProviders = {
    "La Poste": {
      displayName: "La Poste",
      extract: async (file) => {
      // Read file as ArrayBuffer and convert to typed array
      const fileBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(fileBuffer);

      // Load the PDF
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      const page = await pdf.getPage(1);
      const initialViewport = page.getViewport({ scale: 1 });
      console.log("Initial viewport dimensions:", initialViewport.width, initialViewport.height);

      // Compute scale so that the rendered width is 1343 pixels
      const scale = 1343 / initialViewport.width;
      const viewport = page.getViewport({ scale });
      console.log("Scaled viewport dimensions:", viewport.width, viewport.height);

      // Render the page onto an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');
      await page.render({ canvasContext: context, viewport }).promise;
      console.log("Canvas dimensions:", canvas.width, canvas.height);

      // Coordinates for La Poste stamp (x: 45–876, y: 82–301)
      const stampX = 45;
      const stampY = 82;
      const stampWidth = 876 - 45; // 831 pixels
      const stampHeight = 301 - 82; // 219 pixels

      // Crop the stamp area
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = stampWidth;
      cropCanvas.height = stampHeight;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(canvas, stampX, stampY, stampWidth, stampHeight, 0, 0, stampWidth, stampHeight);

      const dataUrl = cropCanvas.toDataURL('image/png');
      console.log("Cropped stamp image data URL length:", dataUrl.length);
      return dataUrl;
    }
  },
  "Deutsche Post – Einfach": {
      displayName: "Deutsche Post – Einfach",
      extract: async (file) => {
      // Read file as ArrayBuffer and convert to typed array
      const fileBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(fileBuffer);

      // Load the PDF
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      const page = await pdf.getPage(1);
      const initialViewport = page.getViewport({ scale: 1 });
      console.log("Initial viewport dimensions:", initialViewport.width, initialViewport.height);

      // Compute scale so that the rendered width is 1343 pixels
      const scale = 1343 / initialViewport.width;
      const viewport = page.getViewport({ scale });
      console.log("Scaled viewport dimensions:", viewport.width, viewport.height);

      // Render the page onto an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');
      await page.render({ canvasContext: context, viewport }).promise;
      console.log("Canvas dimensions:", canvas.width, canvas.height);

 
      const stampX = 123;
      const stampY = 23;
      const stampWidth = 410 - 123;
      const stampHeight = 278 - 23;

      // Crop the stamp area
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = stampWidth;
      cropCanvas.height = stampHeight;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(canvas, stampX, stampY, stampWidth, stampHeight, 0, 0, stampWidth, stampHeight);

      const dataUrl = cropCanvas.toDataURL('image/png');
      console.log("Cropped stamp image data URL length:", dataUrl.length);
      return dataUrl;
    }
  },
  "Deutsche Post – Motiv/Einschreiben Einwurf": {
      displayName: "Deutsche Post – Motiv/Einschreiben Einwurf",
      extract: async (file) => {
      // Read file as ArrayBuffer and convert to typed array
      const fileBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(fileBuffer);

      // Load the PDF
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      const page = await pdf.getPage(1);
      const initialViewport = page.getViewport({ scale: 1 });
      console.log("Initial viewport dimensions:", initialViewport.width, initialViewport.height);

      // Compute scale so that the rendered width is 1343 pixels
      const scale = 1343 / initialViewport.width;
      const viewport = page.getViewport({ scale });
      console.log("Scaled viewport dimensions:", viewport.width, viewport.height);

      // Render the page onto an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');
      await page.render({ canvasContext: context, viewport }).promise;
      console.log("Canvas dimensions:", canvas.width, canvas.height);

 
      const stampX = 8;
      const stampY = 74;
      const stampWidth = 455 - 8;
      const stampHeight = 330 - 74;

      // Crop the stamp area
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = stampWidth;
      cropCanvas.height = stampHeight;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(canvas, stampX, stampY, stampWidth, stampHeight, 0, 0, stampWidth, stampHeight);

      const dataUrl = cropCanvas.toDataURL('image/png');
      console.log("Cropped stamp image data URL length:", dataUrl.length);
      return dataUrl;
    }
  },
  "Deutsche Post – Adresse": {
      displayName: "Deutsche Post – Adresse",
      extract: async (file) => {
      // Read file as ArrayBuffer and convert to typed array
      const fileBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(fileBuffer);

      // Load the PDF
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      const page = await pdf.getPage(1);
      const initialViewport = page.getViewport({ scale: 1 });
      console.log("Initial viewport dimensions:", initialViewport.width, initialViewport.height);

      // Compute scale so that the rendered width is 1343 pixels
      const scale = 1343 / initialViewport.width;
      const viewport = page.getViewport({ scale });
      console.log("Scaled viewport dimensions:", viewport.width, viewport.height);

      // Render the page onto an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');
      await page.render({ canvasContext: context, viewport }).promise;
      console.log("Canvas dimensions:", canvas.width, canvas.height);

 
      const stampX = 59;
      const stampY = 170;
      const stampWidth = 666 - 59;
      const stampHeight = 502 - 170;

      // Crop the stamp area
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = stampWidth;
      cropCanvas.height = stampHeight;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(canvas, stampX, stampY, stampWidth, stampHeight, 0, 0, stampWidth, stampHeight);

      const dataUrl = cropCanvas.toDataURL('image/png');
      console.log("Cropped stamp image data URL length:", dataUrl.length);
      return dataUrl;
    }
  }
  // Add more providers here in the future...
};