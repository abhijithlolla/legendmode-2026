import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legend Mode 2026 | Dominate Your Habits",
  description:
    "The elite habit tracking protocol for 2026. Gamified disciplines, high-fidelity analytics, and professional-grade streaks.",
  manifest: "/manifest.webmanifest",
  applicationName: "Legend Mode",
  appleWebApp: {
    capable: true,
    title: "Legend Mode",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: "Legend Mode 2026",
    title: "Legend Mode | Elite Performance Protocol",
    description: "Transform your habits into superpowers. Experience the most immersive discipline system ever built.",
    url: "https://www.mytracker.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Legend Mode 2026",
    description: "The professional discipline protocol for builders and winners.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1a1a] text-[#ededed]`}
      >
        {children}
      </body>
    </html>
  );
}
