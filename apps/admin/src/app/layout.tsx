import React from 'react';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const metadata = {
  title: 'Lumora + Cypher Swift — Admin Console',
  description: 'Enterprise Administrative and Operations Console for Business Development Partner Network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-[#F8FAFC] text-slate-900 flex min-h-screen antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          <Header />
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
