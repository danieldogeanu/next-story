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
  const siteCover = siteSettings.siteCover?.data?.attributes as SiteCover;
  const siteCoverFormats = siteCover?.formats as unknown as StrapiImageFormats;
  const siteCoverURL = (siteCoverFormats?.large?.url) ? getFileURL(siteCoverFormats.large.url) : '';

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

  // TODO: Change the cover image for Open Graph and Twitter Card to be the correct resolution and format.

  /**
   * The resolution for Open Graph must be at least `1200x630`, with an aspect ratio of `40:21` and max `8MB` in size.
   * The resolution for Twitter Card must be at least `1200x600`, with an aspect ratio of `2:1` and max `5MB` in size.
   * Both type of images must be in `JPEG`, `PNG` or `GIF` formats, as `WEBP` and `AVIF` are not widely supported yet.
   */

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
      images: {
        url: siteCoverURL,
        alt: siteCover?.alternativeText,
        type: (getMimeTypeFromUrl(siteCoverURL) || undefined),
        width: siteCoverFormats?.large?.width,
        height: siteCoverFormats?.large?.height,
      },
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
