'use client';

import Script from 'next/script';

export interface AnalyticsProps {
  id: string;
}

export default function Analytics({id}: AnalyticsProps) {
  const trackEvents = () => {
    if (typeof window !== 'undefined' && typeof window.umami === 'object') {
      const allLinks = document.querySelectorAll('a');
      const allButtons = document.querySelectorAll('button');

      // Set event listeners for all links on the page, and attach event trackers to them.
      allLinks.forEach((link) => link.addEventListener('click', (e) => {
        const currentLink = e.currentTarget as HTMLAnchorElement;
        if (currentLink.hasAttribute('title')) {
          umami.track(`Link Click: ${currentLink.title}`, { href: currentLink.href });
        } else if (currentLink.hasAttribute('ariaLabel')) {
          umami.track(`Link Click: ${currentLink.ariaLabel}`, { href: currentLink.href });
        } else {
          umami.track(`Link Click: ${currentLink?.innerText || 'Unknown'}`, { href: currentLink.href });
        }
      }));

      // Set event listeners for all buttons on the page, and attach event trackers to them.
      allButtons.forEach((button) => button.addEventListener('click', (e) => {
        const currentButton = e.currentTarget as HTMLButtonElement;
        if (currentButton.hasAttribute('title')) {
          umami.track(`Button Click: ${currentButton.title}`);
        } else if (currentButton.hasAttribute('ariaLabel')) {
          umami.track(`Button Click: ${currentButton.ariaLabel}`);
        } else {
          umami.track(`Button Click: ${currentButton?.innerText || 'Unknown'}`);
        }
      }));
    }
  };

  return (
    <>
      <Script
        id='analytics'
        strategy='afterInteractive'
        src='https://umami.ddsv.eu/script.js'
        data-website-id={id}
        onReady={trackEvents}
        async
      />
    </>
  );
}
