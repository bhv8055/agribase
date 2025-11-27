import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import './globals.css';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { NavItems } from '@/components/nav-items';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Agrobase',
  description: 'AI-powered Agriculture Assistance Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <Button variant="ghost" className="h-auto w-full justify-start p-2" asChild>
                <Link href="/">
                  <Leaf className="h-7 w-7 text-primary" />
                  <div className="flex flex-col items-start pl-2">
                    <span className="font-headline text-lg font-semibold tracking-tight">Agrobase</span>
                  </div>
                </Link>
              </Button>
            </SidebarHeader>
            <SidebarContent>
              <NavItems />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
