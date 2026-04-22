import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Abir Siddiky | Portfolio & CMS',
  description: 'Premium Portfolio and CMS for Abir Siddiky',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {/* Smartsupp Chat Integration */}
        <Script id="smartsupp-chat" strategy="afterInteractive">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = 'YOUR_SMARTSUPP_KEY'; // This should be dynamicly loaded from settings in a real app
            window.smartsupp||(function(d){
               var s=d.createElement('script');s.type='text/javascript';s.async=true;
               s.src='https://www.smartsuppchat.com/loader.js?';d.getElementsByTagName('head')[0].appendChild(s);
            })(document);
          `}
        </Script>
      </body>
    </html>
  );
}
