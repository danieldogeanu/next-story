import type { Metadata } from 'next';
import { ErrorBoundary } from 'react-error-boundary';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { getFrontEndURL, getSiteLang } from '@/utils/client/env';
import { getMimeTypeFromUrl } from '@/utils/urls';
import { capitalize } from '@/utils/strings';
import ErrorFallback from '@/app/error';
import SiteHeader from '@/layout/header';
import SiteFooter from '@/layout/footer';
import mantineTheme from '@/theme';
import defaultCover from '@/assets/imgs/default-cover.jpg';
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
    publisher: 'Next Story',
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
    description: makeSeoDescription(siteSettings.siteDescription),
    keywords: makeSeoKeywords(siteSettings.siteKeywords),
    applicationName: capitalize(siteSettings.siteName),
    publisher: capitalize(siteSettings.siteName),
    robots: await generateRobotsObject(),
    openGraph: {
      ...defaultMetadata.openGraph,
      title: makeSeoTitle(siteSettings.siteTitle),
      description: makeSeoDescription(siteSettings.siteDescription),
      siteName: capitalize(siteSettings.siteName),
      url: getFrontEndURL(),
      locale: getSiteLang(),
      images: await generateCoverImageObject(),
    },
  };
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const colorScheme = 'auto';

  return (
    <html lang={getSiteLang()}>
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
