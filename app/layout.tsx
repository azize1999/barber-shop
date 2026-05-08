import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif'
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Barber Shop Évreux | Coiffeur Barbier Homme - 15 Bd de la Buffardière',
  description: 'Barber Shop à Évreux, spécialiste coiffure homme, barbe, dégradé et contours. Prenez rendez-vous au 09 52 65 51 85. 15 Bd de la Buffardière, 27000 Évreux.',
  keywords: 'barber shop Évreux, coiffeur homme, barbier, dégradé, taille de barbe, coupe moderne, Bel-Ébat',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Barber Shop Évreux | Coiffeur Barbier Homme',
    description: 'Spécialiste coiffure homme, barbe, dégradé et contours à Évreux.',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
