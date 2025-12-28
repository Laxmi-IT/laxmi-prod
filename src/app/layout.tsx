import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Elegant serif for headings and display text
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Refined sans-serif for body text
const raleway = Raleway({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LAXMI | Luxury Furniture Consulting & Boutique Reseller",
  description: "Crafted for connoisseurs. Made in Italy. Bringing beauty, light, personality and luxury into your home.",
  keywords: ["luxury furniture", "Italian furniture", "interior design", "boutique reseller", "furniture consulting"],
  authors: [{ name: "LAXMI" }],
  openGraph: {
    title: "LAXMI | Luxury Furniture Consulting",
    description: "Crafted for connoisseurs. Made in Italy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${raleway.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
