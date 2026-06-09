import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'SOLOFTS — Solo Female Travelers',
  description:
    'The community for solo female travelers. Real stories, crowdsourced safety data, ranked gear, and AI trip planning — built by women who refused to wait.',
  openGraph: {
    title: 'SOLOFTS — Solo Female Travelers',
    description: 'Solo Female Travelers',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
