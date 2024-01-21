import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ThemeProvider } from '@/components/providers/Theme-provider'

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
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
          storageKey='notion-s-theme'
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
