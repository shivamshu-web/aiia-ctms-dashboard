import './globals.css';

export const metadata = {
  title: 'AIIA Clinical Trials Management System',
  description: 'Evidence • Safety • Ayurveda',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#071322] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}