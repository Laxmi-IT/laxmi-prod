import type { Metadata } from "next";
import "./globals.css";

// Root layout - minimal wrapper
// Actual layout with fonts and providers is in [locale]/layout.tsx
export const metadata: Metadata = {
  title: "LAXMI | Luxury Italian Furniture Consulting",
  description: "Exclusive luxury Italian furniture consulting. Made in Italy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
