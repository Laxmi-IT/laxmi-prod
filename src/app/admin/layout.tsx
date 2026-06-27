import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "LAXMI Admin",
  description: "LAXMI Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

// Admin root layout — owns the single <html>/<body> for the whole /admin segment
// (login + dashboard). Theme is driven by the shared LAXMI ThemeProvider so the
// admin uses the same global design tokens as the public site.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
