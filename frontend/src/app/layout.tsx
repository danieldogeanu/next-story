import type { Metadata } from 'next';
import { ErrorBoundary } from 'react-error-boundary';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { getSiteSettings, SiteCover, SiteRobots, SiteSettings } from '@/data/settings';
import { StrapiImageFormats } from '@/types/strapi';
import { getFrontEndURL } from '@/utils/client/env';
import { getMimeTypeFromUrl } from '@/utils/urls';
import { capitalize } from '@/utils/strings';
import { getFileURL } from '@/data/files';
import ErrorFallback from '@/app/error';
import SiteHeader from '@/layout/header';
import SiteFooter from '@/layout/footer';
import mantineTheme from '@/theme';
import defaultCover from '@/assets/imgs/default-cover.jpg';
import '@mantine/core/styles.css';
import '@/styles/global.scss';
import { generateCoverImageObject } from '@/utils/server/seo';

// Types
interface RootLayoutProps {
  children: React.ReactNode;
}

// Default SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteRobots = siteSettings?.siteRobots as SiteRobots;
  const defaultCoverURL = new URL(defaultCover.src, getFrontEndURL()).href;

  const defaultMetadata: Metadata = {
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
    openGraph: {
      title: {
        template: '%s > Next Story',
        default: 'Next Story',
      },
      description: 'Demo Website',
      siteName: 'Next Story',
      url: 'http://localhost:3000',
      locale: 'en_US',
      type: 'website',
      images: {
        url: defaultCoverURL,
        alt: 'Default Next Story Cover',
        type: (getMimeTypeFromUrl(defaultCoverURL) || undefined),
        width: defaultCover.width,
        height: defaultCover.height,
      },
    },
  };

  return {
    ...defaultMetadata,
    metadataBase: new URL(getFrontEndURL()),
    title: {
      template: `%s > ${capitalize(siteSettings.siteName)}`,
      default: capitalize(siteSettings.siteName),
    },
    description: siteSettings.siteDescription,
    keywords: siteSettings.siteKeywords,
    applicationName: capitalize(siteSettings.siteName),
    robots: {
      index: siteRobots.indexAllowed,
      follow: siteRobots.followAllowed,
      nocache: !siteRobots.cacheAllowed,
    },
    openGraph: {
      title: {
        template: `%s > ${capitalize(siteSettings.siteName)}`,
        default: capitalize(siteSettings.siteName),
      },
      description: siteSettings.siteDescription,
      siteName: capitalize(siteSettings.siteName),
      url: getFrontEndURL(),
      images: await generateCoverImageObject(),
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
