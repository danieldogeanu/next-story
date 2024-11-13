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
  /** Optional nested configuration(s) for child elements (e.g., select options). */
  children?: ElementConfig | ElementConfig[];
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

  /** Recursive function to set up listeners, handling nested configs. */
  const setupEventListeners = useCallback((configs: ElementConfig | ElementConfig[]) => {
    const processConfig = (config: ElementConfig) => {
      const { selector, eventType, eventName, extraData, children } = config;
      const handler = createEventHandler(eventName, extraData);
      
      document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventType, handler);

        // Store the handler on the element for later removal.
        (element as any)._handler = handler;

        // Recursively set up event listeners for any nested child configurations.
        if (children) {
          const childConfigs = Array.isArray(children) ? children : [children];
          setupEventListeners(childConfigs);
        }
      });
    };

    // Process each configuration.
    const configArray = Array.isArray(configs) ? configs : [configs];
    configArray.forEach(processConfig);
  }, [createEventHandler]);

  /** Recursive function to remove listeners, handling nested configs. */
  const removeEventListeners = useCallback((configs: ElementConfig | ElementConfig[]) => {
    const processConfig = (config: ElementConfig) => {
      const { selector, eventType, children } = config;

      document.querySelectorAll(selector).forEach((element) => {
        // Remove the event listner and the handler stored on the element previously.
        const handler = (element as any)._handler;
        if (handler) {
          element.removeEventListener(eventType, handler);
          delete (element as any)._handler;
        }

        // Recursively remove event listeners for any nested child configurations.
        if (children) {
          const childConfigs = Array.isArray(children) ? children : [children];
          removeEventListeners(childConfigs);
        }
      });
    };

    // Process each configuration.
    const configArray = Array.isArray(configs) ? configs : [configs];
    configArray.forEach(processConfig);
  }, []);

  // Configurations for elements and their respective event types, with nested child configs.
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
      children: {
        selector: '.mantine-Select-option',
        eventType: 'click',
        eventName: 'Select Option Click',
      }
    }
  ]), []);

  useEffect(() => {
    setupEventListeners(elementConfigs);
    return () => removeEventListeners(elementConfigs); // Clean up to prevent duplicate listeners.
  }, [pathname, elementConfigs, setupEventListeners, removeEventListeners]);

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
