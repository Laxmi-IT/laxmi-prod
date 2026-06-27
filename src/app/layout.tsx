import type { Metadata } from "next";
import "./globals.css";

// Root layout - minimal wrapper
// Actual layout with fonts and providers is in [locale]/layout.tsx
export const metadata: Metadata = {
  title: "LAXMI | Bespoke Luxury Italian Furniture",
  description: "Bespoke, made-to-measure luxury Italian furniture. Made in Italy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
