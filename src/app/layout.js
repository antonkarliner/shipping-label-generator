// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'Shipping Label Generator',
  description: 'Generate shipping labels easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}