import type { Metadata } from 'next';
import { getSiteSettings, PageCover, PageRobots, SiteCover, SiteRobots, SiteSettings } from '@/data/settings';
import { StrapiImageFormats } from '@/types/strapi';
import { getFileURL } from '@/data/files';
import { getMimeTypeFromUrl } from '@/utils/urls';

export type RobotsObject = Metadata['robots'];
export type CoverImageObject = NonNullable<Metadata['openGraph']>['images'];

/**
 * Generates a RobotsObject based on the page-specific and site-wide robots settings.
 *
 * If site-wide robots options are set to `false`, they will take precedence over the page-specific
 * options, otherwise the current page-specific settings will apply.
 *
 * @param {PageRobots} pageRobots - The robots settings specific to the current page.
 * @returns {Promise<RobotsObject>} A promise that resolves to a RobotsObject object with combined site and page robots settings.
 *
 * @example
 * // Generate robots tag for a page.
 * await generateRobotsObject(pageRobots);
 */
export async function generateRobotsObject(pageRobots: PageRobots): Promise<RobotsObject> {
  const siteSettingsResponse = await getSiteSettings({populate: '*'});
  const siteSettings = siteSettingsResponse?.data?.attributes as SiteSettings;
  const siteRobots = siteSettings?.siteRobots as SiteRobots;

  return {
    index: (siteRobots.indexAllowed === false) ? false : pageRobots.indexAllowed,
    follow: (siteRobots.followAllowed === false) ? false : pageRobots.followAllowed,
    nocache: (siteRobots.cacheAllowed === false) ? true : !pageRobots.cacheAllowed,
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
  const siteCoverURL = (siteCoverFormats?.large?.url) ? getFileURL(siteCoverFormats.large.url) : '';

  if (pageCover) {
    const pageCoverFormats = pageCover?.formats as unknown as StrapiImageFormats;
    const pageCoverURL = (pageCoverFormats?.large?.url) ? getFileURL(pageCoverFormats.large.url) : '';

    return {
      url: pageCoverURL,
      alt: pageCover?.alternativeText,
      type: (getMimeTypeFromUrl(pageCoverURL) || undefined),
      width: pageCoverFormats?.large?.width,
      height: pageCoverFormats?.large?.height,
    };
  }

  return {
    url: siteCoverURL,
    alt: siteCover?.alternativeText,
    type: (getMimeTypeFromUrl(siteCoverURL) || undefined),
    width: siteCoverFormats?.large?.width,
    height: siteCoverFormats?.large?.height,
  };
}
