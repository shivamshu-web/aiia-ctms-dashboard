import './globals.css';

export const metadata = {
  title: 'AIIA Clinical Trials Management System',
  description: 'Evidence • Safety • Ayurveda • Global Impact',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#071322] text-slate-100 antialiased overflow-hidden m-0 p-0">
        {children}
      </body>
    </html>
  );
}