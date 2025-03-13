// src/app/page.js
import ShippingLabelGenerator from '@/components/ShippingLabelGenerator';

export default function Home() {
  return (
    <main className="min-h-screen">
      <ShippingLabelGenerator />
    </main>
  );
}