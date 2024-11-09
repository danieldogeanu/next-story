'use client';

import Script from 'next/script';

export interface AnalyticsProps {
  id: string;
}

export default function Analytics({id}: AnalyticsProps) {

  return (
    <>
      <Script
        id='analytics'
        strategy='afterInteractive'
        src='https://umami.ddsv.eu/script.js'
        data-website-id={id}
        async
      />
    </>
  );
}
