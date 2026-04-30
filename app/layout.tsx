import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { HtmlLangSync } from "@/components/layout/html-lang-sync";
import { PwaCacheProvider } from "@/components/layout/pwa-cache-provider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Landly — Your guide to life in Korea",
  description: "Helping foreigners navigate Korea with confidence.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Landly",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-100 antialiased`}>
        <HtmlLangSync />
        <PwaCacheProvider />
        {children}
      </body>
    </html>
  );
}
