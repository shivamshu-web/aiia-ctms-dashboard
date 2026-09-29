import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AIIA Clinical Trials Management System (CTMS)',
  description: 'GCP-compliant CTMS for Ayurveda Research with CDISC/FHIR interoperability',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
