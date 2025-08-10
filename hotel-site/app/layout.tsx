import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Aurum Hotel',
  description: 'A sanctuary of elegance and serenity',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl">Aurum Hotel</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/rooms">Rooms</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/about">About</Link>
              <a href="#book" className="bg-amber-600 text-white px-3 py-1.5 rounded-md">Book</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t mt-20">
          <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-600 flex items-center justify-between">
            <p>© {new Date().getFullYear()} Aurum Hotel. All rights reserved.</p>
            <p>123 Royal Avenue, City Center · +1 (555) 010-010</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
