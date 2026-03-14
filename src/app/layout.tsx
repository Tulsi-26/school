import type { Metadata } from "next"
import { Poppins, JetBrains_Mono, Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/sonner"
import { OrganizationStatusGuard } from "@/components/OrganizationStatusGuard"
import { LanguageProvider } from "@/context/LanguageContext"

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

import { OrientationLock } from "@/components/OrientationLock"

export const metadata: Metadata = {
  title: "Physics Lab | Virtual Laboratory",
  description: "Interactive virtual physics laboratory — build circuits, trace rays, and explore the laws of nature through hands-on experiments.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Physics Lab",
  },
}

export const viewport = {
  themeColor: "#3b82f6",
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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <OrientationLock />
          <LanguageProvider>
            <AuthProvider>
              <OrganizationStatusGuard>
                {children}
              </OrganizationStatusGuard>
            </AuthProvider>
          </LanguageProvider>
          <Toaster />
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                    // In development: unregister service workers to prevent stale cache issues
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {
                      registrations.forEach(function(registration) { registration.unregister(); });
                    });
                    caches.keys().then(function(names) {
                      names.forEach(function(name) { caches.delete(name); });
                    });
                  } else {
                    // In production: register the service worker normally
                    navigator.serviceWorker.register('/sw.js');
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
