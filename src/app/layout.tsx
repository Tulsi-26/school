import type { Metadata } from "next"
import { Poppins, JetBrains_Mono, Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const poppins = Poppins({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: 'swap',
})

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
})

// Fallback font just in case
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Morphix | Enterprise Data Transformation",
  description: "Transform messy spreadsheets into perfect databases instantly with AI-powered data transformation.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${mono.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Default to light mode for the corporate feel, allow toggle
          enableSystem={false} // Force light mode default initially as per design vibes usually being light for SaaS landing, but support dark
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
