import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { ErrorBoundary } from 'react-error-boundary';
import { Notifications } from '@mantine/notifications';
import { ColorSchemeScript, MantineColorScheme, MantineProvider } from '@mantine/core';
import { generateCoverImageObject, generateRobotsObject } from '@/utils/server/seo';
import { makeSeoDescription, makeSeoKeywords, makeSeoTitle } from '@/utils/client/seo';
import { getFrontEndURL, getLocalEnv, getSiteLang } from '@/utils/client/env';
import { getSiteSettings, SiteSettings } from '@/data/settings';
import { CurrentURL } from '@/data/current-url';
import { combineProviders } from '@/providers';
import { getMimeTypeFromUrl } from '@/utils/urls';
import { capitalize } from '@/utils/strings';
import ErrorFallback from '@/app/error';
import SiteHeader from '@/layout/header';
import SiteFooter from '@/layout/footer';
import mantineTheme from '@/theme';
import defaultCover from '@/assets/imgs/default-cover.jpg';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
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
  const colorScheme: MantineColorScheme = 'auto';

  // If we're running in a local environment, we need to get the hostname dynamically.
  // We do this so we can access the website on mobile devices for testing.
  // WARNING: This is only for the local development environment only!
  if (getLocalEnv()) {
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto');
    const fullUrl = new URL(`${protocol}://${host}`);

    // Instantiate the CurrentURL singleton class and set the current URL.
    // We do this so that we can access the current URL everywhere in our app.
    if (!global.currentURL) global.currentURL = CurrentURL;
    global.currentURL?.setURL(fullUrl);
  }


  /**
   * The `Providers` constant combines multiple context providers into a single component.
   * 
   * The `combineProviders` function accepts an array of tuples where each tuple has the shape:
   * [ProviderComponent, providerProps]. This allows for wrapping the application with various providers,
   * each receiving its specific props.
   * 
   * The order of providers in the array is important as it determines the nesting and context accessibility.
   */
  const Providers = combineProviders([
    [MantineProvider, {defaultColorScheme: colorScheme, theme: mantineTheme}],
  ]);

  return (
    <html lang={getSiteLang()}>
      <head>
        <ColorSchemeScript defaultColorScheme={colorScheme} />
      </head>
      <body>
        <Providers>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <SiteHeader />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              {children}
            </ErrorBoundary>
            <SiteFooter />
            <Notifications
              className='notification-system'
              position='bottom-right' limit={5} />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
