import type { Metadata } from 'next';
import { getSiteSettings, PageCover, PageRobots, SiteCover, SiteRobots, SiteSettings } from '@/data/settings';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL, getMimeTypeFromUrl } from '@/utils/urls';
import defaultCover from '@/assets/imgs/default-cover.jpg';

export type RobotsObject = Metadata['robots'];
export type CoverImageObject = NonNullable<Metadata['openGraph']>['images'];

/**
 * Generates a robots configuration object based on page-specific and site-wide settings.
 *
 * If site-wide robots options are set to `false`, they will take precedence over the page-specific
 * options, otherwise the current page-specific settings will apply.
 *
 * @param {PageRobots} [pageRobots] - Optional robots settings specific to the current page.
 * @returns {Promise<RobotsObject>} A promise that resolves to an object containing the robots tag settings.
 *
 * @example
 * // Generate a robots object using the page-specific settings.
 * robots: await generateRobotsObject(pageRobots),
 */
export async function generateRobotsObject(pageRobots?: PageRobots): Promise<RobotsObject> {
  const siteSettingsResponse = await getSiteSettings({ populate: '*' });
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteRobots = siteSettings?.siteRobots as SiteRobots;

  if (pageRobots) {
    return {
      index: (siteRobots.indexAllowed === false) ? false : pageRobots.indexAllowed,
      follow: (siteRobots.followAllowed === false) ? false : pageRobots.followAllowed,
      nocache: (siteRobots.cacheAllowed === false) ? true : !pageRobots.cacheAllowed,
    };
  }

  return {
    index: siteRobots.indexAllowed,
    follow: siteRobots.followAllowed,
    nocache: !siteRobots.cacheAllowed,
  };
}


/**
 * Generates an object representing the Open Graph or Twitter Card cover image for a page,
 * using either the provided page cover or the site-wide cover image.
 *
 * // TODO: Change the cover image for Open Graph and Twitter Card to be the correct resolution and format.
 *
 * @note The resolution for Open Graph must be at least `1200x630`, with an aspect ratio of `40:21` and max `8MB` in size.
 * @note The resolution for Twitter Card must be at least `1200x600`, with an aspect ratio of `2:1` and max `5MB` in size.
 * @note Both type of images must be in `JPEG`, `PNG` or `GIF` formats, as `WEBP` and `AVIF` are not widely supported yet.
 *
 * @param {PageCover} [pageCover] - Optional cover image data specific to the page.
 * @returns {Promise<CoverImageObject>} A promise that resolves to an object containing the cover image details.
 *
 * @example
 * // Generate a cover image object using the page cover.
 * openGraph: {
 *  ...
 *  images: await generateCoverImageObject(pageCover),
 *  ...
 * },
 */
export async function generateCoverImageObject(pageCover?: PageCover): Promise<CoverImageObject> {
  const siteSettingsResponse = await getSiteSettings({ populate: '*' });
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteCover = siteSettings.siteCover?.data?.attributes as SiteCover;
  const siteCoverFormats = siteCover?.formats as unknown as StrapiImageFormats;
  const siteCoverURL = (siteCoverFormats?.large?.url) ? getFileURL(siteCoverFormats.large.url) : getFileURL(siteCover.url);
  const defaultCoverURL = getFileURL(defaultCover.src, 'frontend') as string;

  if (pageCover) {
    const pageCoverFormats = pageCover?.formats as unknown as StrapiImageFormats;
    const pageCoverURL = (pageCoverFormats?.large?.url) ? getFileURL(pageCoverFormats.large.url) : getFileURL(pageCover.url);

    return {
      url: pageCoverURL ?? defaultCoverURL,
      alt: pageCover?.alternativeText,
      type: getMimeTypeFromUrl(pageCoverURL),
      width: pageCoverFormats?.large?.width ?? pageCover?.width ?? defaultCover.width,
      height: pageCoverFormats?.large?.height ?? pageCover?.height ?? defaultCover.height,
    };
  }

  return {
    url: siteCoverURL ?? defaultCoverURL,
    alt: siteCover?.alternativeText,
    type: getMimeTypeFromUrl(siteCoverURL),
    width: siteCoverFormats?.large?.width ?? siteCover?.width ?? defaultCover.width,
    height: siteCoverFormats?.large?.height ?? siteCover?.height ?? defaultCover.height,
  };
}

