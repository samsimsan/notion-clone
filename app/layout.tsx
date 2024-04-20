import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';   // this is for posting notifications

import { ThemeProvider } from '@/components/providers/Theme-provider';
import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { ModalProvider } from '@/components/providers/modal-provider';

import { EdgeStoreProvider } from '@/lib/edgestore';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notion . S',
  description: 'This is a clone of the Notion app made by me, Sam',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/Notion.S Logo.png",
        href: "/Notion.S Logo.png"
      },
      {
        media: "",
        url: "/Notion.S Logo.png",
        href: "/Notion.S Logo.png"
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
              storageKey='notion-s-theme'
            >
              <Toaster position='bottom-center' /> {/* the notifications will come at the bottom right of the screen */}
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
