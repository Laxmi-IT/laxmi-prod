import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LAXMI Admin",
  description: "LAXMI Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
