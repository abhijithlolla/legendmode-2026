import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Legend Mode 2026 | Crush Your Goals',
  description: 'Track your goals and habits in 2026 with professional dashboard',
  keywords: 'goals, habits, tracker, 2026, productivity',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-50 font-sans">
        {children}
      </body>
    </html>
  );
}
