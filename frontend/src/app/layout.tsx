import { ErrorBoundary } from 'react-error-boundary';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { getSiteSettings, SiteRobots, SiteSettings } from '@/data/settings';
import type { Metadata } from 'next';
import ErrorFallback from '@/app/error';
import SiteHeader from '@/layout/header';
import SiteFooter from '@/layout/footer';
import mantineTheme from '@/theme';
import '@mantine/core/styles.css';
import '@/styles/global.scss';

// Types
interface RootLayoutProps {
  children: React.ReactNode;
}

// Default SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteRobots = siteSettings?.siteRobots as SiteRobots;
  const defaultMetadata = {
    title: {
      template: '%s > Next Story',
      default: 'Next Story',
    },
    description: 'Demo Website',
    applicationName: 'Next Story',
    keywords: 'next, story',
    creator: 'Daniel Dogeanu',
    publisher: 'Daniel Dogeanu',
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };

  return {
    ...defaultMetadata,
    title: {
      template: `%s > ${siteSettings.siteName}`,
      default: siteSettings.siteName,
    },
    description: siteSettings.siteDescription,
    keywords: siteSettings.siteKeywords,
    applicationName: siteSettings.siteName,
    robots: {
      index: siteRobots.indexAllowed,
      follow: siteRobots.followAllowed,
      nocache: !siteRobots.cacheAllowed,
    },
  };
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
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
