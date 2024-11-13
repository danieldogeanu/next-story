'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { capitalize } from '@/utils/strings';

export interface AnalyticsProps {
  id?: string;
  host?: string;
}

interface ExtraData {
  [key: string]: any;
}

interface ElementConfig {
  /** CSS selector to target elements. */
  selector: string;
  /** Type of event to listen for. */
  eventType: keyof HTMLElementEventMap;
  /** Base event name for tracking. */
  eventName: string;
  /** Optional function to extract extra data for the event. */
  extraData?: (element: HTMLElement) => ExtraData;
}

export default function Analytics({ id, host }: AnalyticsProps) {
  const pathname = usePathname();
  const analyticsScriptUrl = new URL('script.js', host).href;

  /** Helper to track analytics events based on element attributes. */
  const trackEvent = (eventName: string, element: HTMLElement, extraData: ExtraData = {}) => {
    const trackingLabel = element.getAttribute('title') || element.getAttribute('aria-label') || element.innerText || 'Unknown';
    if (typeof window.umami === 'object') {
      umami.track(`${capitalize(eventName)}: ${capitalize(trackingLabel)}`, extraData);
    }
  };

  /** Generic event handler that uses the config's `eventName` and `extraData`. */
  const createEventHandler = useCallback((eventName: string, extraDataFn?: (element: HTMLElement) => ExtraData) => {
    return (event: Event) => {
      const element = event.currentTarget as HTMLElement;
      const extraData = extraDataFn ? extraDataFn(element) : {};
      trackEvent(eventName, element, extraData);
    };
  }, []);

  /** Reusable function to set up listeners based on configs. */
  const setupEventListeners = useCallback((configs: ElementConfig[]) => {
    configs.forEach(({ selector, eventType, eventName, extraData }) => {
      const handler = createEventHandler(eventName, extraData);
      document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventType, handler);
        // Store the handler on the element for later removal.
        (element as any)._handler = handler;
      });
    });
  }, [createEventHandler]);

  /** Reusable function to remove listeners based on configs. */
  const removeEventListeners = (configs: ElementConfig[]) => {
    configs.forEach(({ selector, eventType }) => {
      document.querySelectorAll(selector).forEach((element) => {
        const handler = (element as any)._handler;
        if (handler) {
          element.removeEventListener(eventType, handler);
          delete (element as any)._handler;
        }
      });
    });
  };

  // Configurations for elements and their respective event types.
  const elementConfigs: ElementConfig[] = useMemo(() => ([
    {
      selector: 'a',
      eventType: 'click',
      eventName: 'Link Click',
      extraData: (element) => ({ href: (element as HTMLAnchorElement).href })
    },
    {
      selector: 'button',
      eventType: 'click',
      eventName: 'Button Click'
    },
    {
      selector: 'input.mantine-Select-input',
      eventType: 'click',
      eventName: 'Select Input Click',
      extraData: () => {
        // Ensure select options have individual click tracking.
        const selectOptions = document.querySelectorAll('.mantine-Select-option');
        selectOptions.forEach((option) => {
          option.removeEventListener('click', createEventHandler('Select Option Click'));
          option.addEventListener('click', createEventHandler('Select Option Click'));
        });
        return {}; // Return empty as main element doesn't need extra data.
      }
    }
  ]), [createEventHandler]);

  useEffect(() => {
    setupEventListeners(elementConfigs);
    return () => removeEventListeners(elementConfigs); // Clean up to prevent duplicate listeners.
  }, [pathname, elementConfigs, setupEventListeners]);

  return (
    <>
      <Script
        id='analytics'
        strategy='afterInteractive'
        src={analyticsScriptUrl}
        data-website-id={id}
        async
      />
    </>
  );
}
