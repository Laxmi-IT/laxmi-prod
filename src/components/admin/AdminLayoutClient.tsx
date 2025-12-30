'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { ThemeProvider } from '@/components/providers/theme-provider';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  adminName: string;
  adminRole: string;
}

export function AdminLayoutClient({
  children,
  adminName,
  adminRole,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {/* Mobile Header with Menu Toggle */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-lg font-light text-zinc-900 dark:text-white">LAXMI Admin</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        adminName={adminName}
        adminRole={adminRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="min-h-screen pt-16 md:pt-0 md:ml-64 bg-zinc-50 dark:bg-zinc-950">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </ThemeProvider>
  );
}
