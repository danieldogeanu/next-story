import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import type { Metadata } from 'next';
import mantineTheme from '@/theme';
import '@mantine/core/styles.css';
import '@/styles/global.scss';

// Types
interface RootLayoutProps {
  children: React.ReactNode;
}

// SEO Metadata
export const metadata: Metadata = {
  title: 'Next Story',
  description: 'Playground app to figure out how to integrate the chosen tech stack.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={mantineTheme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
