import { Metadata } from "next";
import { getSiteSettings, PageRobots, SiteRobots, SiteSettings } from "@/data/settings";

export type RobotsObject = Metadata['robots'];

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
