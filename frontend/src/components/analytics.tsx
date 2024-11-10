'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export interface AnalyticsProps {
  id: string;
  src: string;
}

export default function Analytics({ id, src }: AnalyticsProps) {
  const pathname = usePathname();

  const handleLinkClick = (e: Event) => {
    const currentLink = e.currentTarget as HTMLAnchorElement;
    const extraData = { href: currentLink.href };
    if (typeof window.umami === 'object') {
      if (currentLink.hasAttribute('title')) {
        umami.track(`Link Click: ${currentLink.title}`, extraData);
      } else if (currentLink.hasAttribute('ariaLabel')) {
        umami.track(`Link Click: ${currentLink.ariaLabel}`, extraData);
      } else {
        umami.track(`Link Click: ${currentLink?.innerText || 'Unknown'}`, extraData);
      }
    }
  };

  const handleButtonClick = (e: Event) => {
    const currentButton = e.currentTarget as HTMLButtonElement;
    if (typeof window.umami === 'object') {
      if (currentButton.hasAttribute('title')) {
        umami.track(`Button Click: ${currentButton.title}`);
      } else if (currentButton.hasAttribute('ariaLabel')) {
        umami.track(`Button Click: ${currentButton.ariaLabel}`);
      } else {
        umami.track(`Button Click: ${currentButton?.innerText || 'Unknown'}`);
      }
    }
  };

  const attachEventListeners = useCallback(() => {
    if (typeof window.umami === 'object') {
      const allLinks = document.querySelectorAll('a');
      const allButtons = document.querySelectorAll('button');

      allLinks.forEach((link) => link.addEventListener('click', handleLinkClick));
      allButtons.forEach((button) => button.addEventListener('click', handleButtonClick));
    }
  }, []);

  const removeEventListeners = useCallback(() => {
    if (typeof window.umami === 'object') {
      const allLinks = document.querySelectorAll('a');
      const allButtons = document.querySelectorAll('button');
  
      allLinks.forEach((link) => link.removeEventListener('click', handleLinkClick));
      allButtons.forEach((button) => button.removeEventListener('click', handleButtonClick));
    }
  }, []);

  useEffect(() => {
    attachEventListeners(); // Track events on initial load and when pathname changes.
    return () => removeEventListeners(); // Clear previous event listeners to prevent duplicate tracking.
  }, [pathname, attachEventListeners, removeEventListeners]);

  return (
    <>
      <Script
        id='analytics'
        strategy='afterInteractive'
        src={src} data-website-id={id}
        onReady={attachEventListeners}
        async
      />
    </>
  );
}
