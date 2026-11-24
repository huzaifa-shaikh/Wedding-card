import './globals.css';
const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://localhost:3000');
const title = 'You are invited: Walima & Nikah, 27 December 2026';
const description = 'Mr. & Mrs. Imtiaz Wahla invite you to the Walima of Sajid Ur Rehman & Sadia Ashfaque and the Nikah of Mohammad Sumair & Samrah Imtiaz. Hatul Banquet, Mirpurkhas.';
export const metadata = {
  metadataBase: new URL(base), title, description,
  openGraph: { title, description, type: 'website', locale: 'en_PK', siteName: 'Wahla Family', images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Walima & Nikah invitation' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.jpg'] },
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#5e0f1f' };
export default function RootLayout({ children }) {
  return (<html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Cinzel+Decorative:wght@700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>);
}
