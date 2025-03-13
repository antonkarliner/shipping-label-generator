'use client';

import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import Image from 'next/image';
import { Github } from 'lucide-react';
import '../app/print-styles.css';

const ShippingLabelGenerator = () => {
  const [pdfProviders, setPdfProviders] = useState({});
  const [senderAddress, setSenderAddress] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: ''
  });
  const [recipientAddress, setRecipientAddress] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: ''
  });
  const [stampImage, setStampImage] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [language, setLanguage] = useState('en');
  const [selectedProvider, setSelectedProvider] = useState('');
  
  const fileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const mod = await import('@/utils/pdfConverter');
        const providers = mod.pdfProviders;
        console.log("Loaded providers:", providers);
        setPdfProviders(providers);
        if (Object.keys(providers).length > 0) {
          setSelectedProvider(Object.keys(providers)[0]);
        }
      } catch (error) {
        console.error("Error loading providers:", error);
      }
    };
    
    loadProviders();
  }, []);

  useEffect(() => {
    // Load saved sender address
    const savedSender = localStorage.getItem('senderAddress');
    if (savedSender) {
      try {
        setSenderAddress(JSON.parse(savedSender));
      } catch (error) {
        console.error('Error parsing saved sender address:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    // Save sender address whenever it changes
    localStorage.setItem('senderAddress', JSON.stringify(senderAddress));
  }, [senderAddress]); // This will run whenever senderAddress changes

  const translations = {
    en: { from: 'FROM:', to: 'TO:', tracking: 'Tracking #:', notes: 'Notes:' },
    de: { from: 'VON:', to: 'AN:', tracking: 'Sendungsnummer:', notes: 'Hinweise:' },
    fr: { from: 'DE:', to: 'À:', tracking: 'Numéro de suivi:', notes: 'Remarques:' },
    es: { from: 'DE:', to: 'PARA:', tracking: 'Número de seguimiento:', notes: 'Notas:' }
  };

  const handleSenderChange = (e) => {
    const { name, value } = e.target;
    setSenderAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecipientChange = (e) => {
    const { name, value } = e.target;
    setRecipientAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleStampUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStampImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (file && selectedProvider && pdfProviders[selectedProvider]) {
      try {
        const result = await pdfProviders[selectedProvider].extract(file);
        console.log("Extracted stamp data URL:", result);
        if (result && result.startsWith("data:image/png")) {
          setStampImage(result);
        } else {
          console.error("PDF extraction did not return a valid image.");
        }
      } catch (error) {
        console.error('Error extracting stamp:', error);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerPDFInput = () => {
    pdfFileInputRef.current?.click();
  };

  const handleGenerateLabel = () => {
    setShowPreview(true);
  };

  const handlePrint = () => {
    // Save current body styles
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.padding;
    
    // Create a print-only container
    const printContainer = document.createElement('div');
    printContainer.className = 'print-only-container';
    
    // Clone the label for printing
    const labelToPrint = document.querySelector('.printable-label').cloneNode(true);
    labelToPrint.style.width = '6in';
    labelToPrint.style.height = '4in';
    labelToPrint.style.margin = '0';
    labelToPrint.style.padding = '0.25in';
    labelToPrint.style.position = 'relative';
    labelToPrint.style.boxSizing = 'border-box';
    labelToPrint.style.backgroundColor = 'white';
    labelToPrint.classList.remove('border-2', 'border-gray-300');
    labelToPrint.style.border = 'none';
    
    // Ensure stamp container constraints
    const stampArea = labelToPrint.querySelector('.stamp-area');
    if (stampArea) {
      stampArea.style.overflow = 'hidden';
      stampArea.style.flex = '0 0 40%'; // Enforce height allocation
      const stampImg = stampArea.querySelector('img');
      if (stampImg) {
        stampImg.style.maxHeight = '100%';
        stampImg.style.objectFit = 'contain';
      }
    }
    
    // Ensure child elements have visible text
    Array.from(labelToPrint.querySelectorAll('*')).forEach(el => {
      el.style.visibility = 'visible';
      if (el.textContent && !el.style.color) {
        el.style.color = 'black';
      }
    });
    
    printContainer.appendChild(labelToPrint);
    document.body.appendChild(printContainer);
    
    // Hide everything else
    document.body.style.overflow = 'hidden';
    document.body.style.padding = '0';
    
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
        document.body.style.overflow = originalOverflow;
        document.body.style.padding = originalPadding;
      }, 500);
    }, 100);
};

const handleCreatePDF = async () => {
    const labelElement = document.querySelector('.printable-label');
    if (!labelElement) return;
    
    const labelClone = labelElement.cloneNode(true);
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);
  
    // Apply critical text styling to all elements
    const allElements = labelClone.getElementsByTagName('*');
    for (const el of allElements) {
      el.style.wordSpacing = 'normal';
      el.style.letterSpacing = 'normal';
      el.style.whiteSpace = 'normal';
      el.style.fontFamily = 'Arial, sans-serif';
      el.style.overflowWrap = 'break-word';
    }
  
    // Enforce stamp container constraints
    const stampArea = labelClone.querySelector('.stamp-area');
    if (stampArea) {
      stampArea.style.overflow = 'hidden';
      stampArea.style.flex = '0 0 40%'; // Maintain height ratio
      const stampImg = stampArea.querySelector('img');
      if (stampImg) {
        stampImg.style.maxHeight = '100%';
        stampImg.style.objectFit = 'contain';
      }
    }
  
    // Set dimensions
    labelClone.style.width = '576px';
    labelClone.style.height = '384px';
    labelClone.style.padding = '24px';
    labelClone.style.boxSizing = 'border-box';
    labelClone.style.position = 'relative';
    labelClone.style.overflow = 'hidden';
    
    tempContainer.appendChild(labelClone);
  
    try {
      const canvas = await html2canvas(labelClone, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: 'white',
        width: 576,
        height: 384,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      });
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [6, 4]
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 6, 4);
      
      const cleanName = recipientAddress.name
        ? recipientAddress.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
        : '';
      const fileName = cleanName ? `${cleanName}_label.pdf` : 'shipping-label.pdf';
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      document.body.removeChild(tempContainer);
    }
};

  const handleReset = () => {
    setSenderAddress({ name: '', street: '', city: '', state: '', zip: '', country: '' });
    setRecipientAddress({ name: '', street: '', city: '', state: '', zip: '', country: '' });
    setStampImage(null);
    setTrackingNumber('');
    setNotes('');
    setShowPreview(false);
    localStorage.removeItem('senderAddress'); // Add this line
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
  {/* Header */}
  <div className="flex justify-between items-center mb-2">
    <div className="flex items-center">
      <div className="mr-4 flex-shrink-0">
        <Image 
          src="/logo.svg" 
          alt="Logo" 
          width={64} 
          height={64}
          priority
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-1">Shipping Label Generator</h1>
        <div className="text-gray-600 text-sm">
          <p className="mb-2">
          A free and open-source tool for creating 4x6" shipping labels. While many providers offer pre-optimized labels, some national postal services provide stamps of varying sizes. This tool helps you format all necessary details, avoiding the need to print stamps separately and fill out addresses by hand. All the processing is done inside your browser.
          </p>
          <p>You can request additional providers via <a href="https://github.com/antonkarliner/shipping-label-generator/issues" className="text-blue-600 hover:underline">GitHub issues</a>.</p>
          <p><strong>Note!</strong> Currently only extracts the first stamp from PDF.</p>
        </div>
      </div>
    </div>
    <a 
      href="https://github.com/antonkarliner/shipping-label-generator" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-gray-700 hover:text-gray-900 self-start"
      title="View source on GitHub"
    >
      <Github size={28} />
    </a>
  </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className={`space-y-6 ${showPreview ? 'hidden md:block' : ''}`}>
          {/* Language Selection */}
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Label Language</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="en">English</option>
              <option value="de">German (Deutsch)</option>
              <option value="fr">French (Français)</option>
              <option value="es">Spanish (Español)</option>
            </select>
          </div>

          {/* Stamp Upload Section */}
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Postage Stamp</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={triggerFileInput}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Upload Stamp Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleStampUpload}
                  accept="image/*"
                  className="hidden"
                />
                {stampImage && <span className="text-green-600">✓ Uploaded</span>}
              </div>
              <div className="flex items-center gap-4 w-full">
      <select
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
        className="p-2 border rounded w-4/10 min-w-[120px] whitespace-normal break-words"
        disabled={Object.keys(pdfProviders).length === 0}
      >
        {Object.keys(pdfProviders).map((providerKey) => (
          <option 
            key={providerKey} 
            value={providerKey}
            className="break-words whitespace-normal"
          >
            {pdfProviders[providerKey]?.displayName || providerKey}
          </option>
        ))}
      </select>
      <button
        onClick={triggerPDFInput}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex-1"
        disabled={!selectedProvider}
      >
        Extract Stamp from PDF
      </button>
      <input
        type="file"
        ref={pdfFileInputRef}
        onChange={handlePDFUpload}
        accept="application/pdf"
        className="hidden"
      />
    </div>
  </div>
</div>

          {/* Sender Address */}
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Sender Address</h2>
            <div className="space-y-2">
              <input
                type="text"
                name="name"
                value={senderAddress.name}
                onChange={handleSenderChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="street"
                value={senderAddress.street}
                onChange={handleSenderChange}
                placeholder="Street Address"
                className="w-full p-2 border rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="city"
                  value={senderAddress.city}
                  onChange={handleSenderChange}
                  placeholder="City"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="state"
                  value={senderAddress.state}
                  onChange={handleSenderChange}
                  placeholder="State/Province"
                  className="p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="zip"
                  value={senderAddress.zip}
                  onChange={handleSenderChange}
                  placeholder="ZIP/Postal Code"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="country"
                  value={senderAddress.country}
                  onChange={handleSenderChange}
                  placeholder="Country"
                  className="p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Recipient Address */}
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Recipient Address</h2>
            <div className="space-y-2">
              <input
                type="text"
                name="name"
                value={recipientAddress.name}
                onChange={handleRecipientChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="street"
                value={recipientAddress.street}
                onChange={handleRecipientChange}
                placeholder="Street Address"
                className="w-full p-2 border rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="city"
                  value={recipientAddress.city}
                  onChange={handleRecipientChange}
                  placeholder="City"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="state"
                  value={recipientAddress.state}
                  onChange={handleRecipientChange}
                  placeholder="State/Province"
                  className="p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="zip"
                  value={recipientAddress.zip}
                  onChange={handleRecipientChange}
                  placeholder="ZIP/Postal Code"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="country"
                  value={recipientAddress.country}
                  onChange={handleRecipientChange}
                  placeholder="Country"
                  className="p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Additional Details</h2>
            <div className="space-y-2">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking Number (optional)"
                className="w-full p-2 border rounded break-words"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full p-2 border rounded h-20 break-words"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateLabel}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex-grow"
            >
              Generate Label
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="border rounded p-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Label Preview</h2>
              <div className="space-x-2">
                <button
                  onClick={handlePrint}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Print
                </button>
                <button
                  onClick={handleCreatePDF}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Create PDF
                </button>
              </div>
            </div>
            
            {/* Printable Label using Flex Layout */}
            <div
              className="printable-label border-2 border-gray-300 w-full bg-white relative"
              style={{
                aspectRatio: '6/4',
                padding: '1rem',
                maxHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
              }}
            >
              {/* Stamp Area */}
              <div
                className="stamp-area"
                style={{
                  flex: '0 0 40%',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {stampImage ? (
                  <img src={stampImage} alt="Postage stamp" className="object-contain max-h-full max-w-full" />
                ) : (
                  <div className="text-gray-400 text-sm text-center">Postage Stamp</div>
                )}
              </div>
              
              {/* Addresses & Details */}
              <div
  className="addresses flex justify-between mt-2"
  style={{
    flex: '1',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 0.5rem',
    wordSpacing: 'normal', // Add this
    whiteSpace: 'normal' // Add this
  }}
>

                <div className="from text-sm break-words" style={{ 
  width: '50%', 
  paddingRight: '0.25rem',
  wordSpacing: 'normal',
  letterSpacing: 'normal',
  whiteSpace: 'normal'
}}>
                  <div className="font-semibold">{translations[language].from}</div>
                  <div>{senderAddress.name}</div>
                  <div>{senderAddress.street}</div>
                  <div>
                    {senderAddress.city}, {senderAddress.state} {senderAddress.zip}
                  </div>
                  <div>{senderAddress.country}</div>
                  {trackingNumber && (
                    <div className="text-sm mt-2 break-words">
                      <span className="font-semibold">{translations[language].tracking}</span> {trackingNumber}
                    </div>
                  )}
                </div>
                <div className="to text-sm break-words" style={{ 
  width: '50%', 
  paddingLeft: '0.25rem',
  wordSpacing: 'normal',
  letterSpacing: 'normal',
  whiteSpace: 'normal'
}}>
                  <div className="font-semibold">{translations[language].to}</div>
                  <div className="font-bold">{recipientAddress.name}</div>
                  <div>{recipientAddress.street}</div>
                  <div>
                    {recipientAddress.city}, {recipientAddress.state} {recipientAddress.zip}
                  </div>
                  <div>{recipientAddress.country}</div>
                  {notes && (
                    <div className="text-xs mt-2 break-words">
                      <div className="font-semibold">{translations[language].notes}</div>
                      <div>{notes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="text-blue-500 hover:underline text-sm"
              >
                « Back to Edit Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingLabelGenerator;
