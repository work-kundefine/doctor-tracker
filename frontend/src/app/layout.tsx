import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Doctor Tracker - Enterprise Clinical Intelligence',
  description: 'Enterprise Clinical Intelligence & Hospital Management Portal with real-time telemetry, doctor rosters, patient records, and performance analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
        {children}
      </body>
    </html>
  );
}
