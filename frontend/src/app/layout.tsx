import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ErrorBoundary } from 'react-error-boundary';
import type { Metadata } from 'next';
import mantineTheme from '@/theme';
import ErrorFallback from './error';
import SiteHeader from '@/layout/header';
import SiteFooter from '@/layout/footer';
import '@mantine/core/styles.css';
import '@/styles/global.scss';

// Types
interface RootLayoutProps {
  children: React.ReactNode;
}

// Default SEO Metadata
export const metadata: Metadata = {
  title: {
    template: '%s > Next Story',
    default: 'Next Story',
  },
  description: 'Proof of Concept project, to demonstrate the integration of the chosen tech stack to customers.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const colorScheme = 'auto';

  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript defaultColorScheme={colorScheme} />
      </head>
      <body>
        <MantineProvider defaultColorScheme={colorScheme} theme={mantineTheme}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <SiteHeader />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              {children}
            </ErrorBoundary>
            <SiteFooter />
          </ErrorBoundary>
        </MantineProvider>
      </body>
    </html>
  );
}
