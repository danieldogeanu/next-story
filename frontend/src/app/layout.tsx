import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { ErrorBoundary } from 'react-error-boundary';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { getFrontEndURL, getHostname, getNodeEnv, getSiteLang } from '@/utils/client/env';
import { HostnameProvider } from '@/providers/hostname';
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
    alternates: {
      canonical: 'http://localhost:3000',
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
        type: getMimeTypeFromUrl(defaultCoverURL),
        width: defaultCover.width,
        height: defaultCover.height,
      },
    },
  };

  if (typeof siteSettingsResponse === 'undefined') return defaultMetadata;

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
    alternates: {
      canonical: getFrontEndURL(),
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: makeSeoTitle(siteSettings.siteTitle),
      description: makeSeoDescription(siteSettings.siteDescription),
      siteName: capitalize(siteSettings.siteName),
      url: getFrontEndURL(),
      locale: getSiteLang('posix'),
      images: await generateCoverImageObject(),
    },
  };
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const colorScheme = 'auto';

  // Load hostname and href, so that we can build the frontend URLs.
  let hostname = null;
  let href = null;

  // If we're in the development environment, we need to get hostname dynamically.
  // We do this so we can access the website on mobile devices for testing.
  if (getNodeEnv() === 'development') {
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto');
    const fullUrl = new URL(`${protocol}://${host}`);
    hostname = fullUrl.hostname;
    href = fullUrl.href;
  } else {
    hostname = getHostname();
    href = getFrontEndURL();
  }

  return (
    <html lang={getSiteLang()}>
      <head>
        <ColorSchemeScript defaultColorScheme={colorScheme} />
      </head>
      <body>
        <HostnameProvider hostname={hostname} href={href}>
          <MantineProvider defaultColorScheme={colorScheme} theme={mantineTheme}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <SiteHeader />
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                {children}
              </ErrorBoundary>
              <SiteFooter />
            </ErrorBoundary>
          </MantineProvider>
        </HostnameProvider>
      </body>
    </html>
  );
}
