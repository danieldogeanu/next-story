'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export interface AnalyticsProps {
  id?: string;
  host?: string;
}

export default function Analytics({ id, host }: AnalyticsProps) {
  const pathname = usePathname();
  const analyticsScriptUrl = new URL('script.js', host).href;

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

  const handleSelectOption = (e: Event) => {
    const currentOption = e.currentTarget as HTMLDivElement;
    if (typeof window.umami === 'object') {
      umami.track(`Select Option: ${currentOption?.innerText || 'Unknown'}`);
    }
  };

  const handleSelectClick = useCallback(() => {
    if (typeof window.umami === 'object') {
      const currentOptions = document.querySelectorAll('.mantine-Select-option');
      currentOptions.forEach((option) => {
        option.removeEventListener('click', handleSelectOption);
        option.addEventListener('click', handleSelectOption);
      });
    }
  }, []);

  const attachEventListeners = useCallback(() => {
    if (typeof window.umami === 'object') {
      const allLinks = document.querySelectorAll('a');
      const allButtons = document.querySelectorAll('button');
      const allSelects = document.querySelectorAll('input.mantine-Select-input');

      allLinks.forEach((link) => link.addEventListener('click', handleLinkClick));
      allButtons.forEach((button) => button.addEventListener('click', handleButtonClick));
      allSelects.forEach((select) => select.addEventListener('click', handleSelectClick));
    }
  }, [handleSelectClick]);

  const removeEventListeners = useCallback(() => {
    if (typeof window.umami === 'object') {
      const allLinks = document.querySelectorAll('a');
      const allButtons = document.querySelectorAll('button');
      const allSelects = document.querySelectorAll('input.mantine-Select-input');
  
      allLinks.forEach((link) => link.removeEventListener('click', handleLinkClick));
      allButtons.forEach((button) => button.removeEventListener('click', handleButtonClick));
      allSelects.forEach((select) => select.removeEventListener('click', handleSelectClick));
    }
  }, [handleSelectClick]);

  useEffect(() => {
    attachEventListeners(); // Track events on initial load and when pathname changes.
    return () => removeEventListeners(); // Clear previous event listeners to prevent duplicate tracking.
  }, [pathname, attachEventListeners, removeEventListeners]);

  return (
    <>
      <Script
        id='analytics'
        strategy='afterInteractive'
        src={analyticsScriptUrl} data-website-id={id}
        onReady={attachEventListeners}
        async
      />
    </>
  );
}
