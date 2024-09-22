'use client';

import React, { FC, lazy, LazyExoticComponent } from 'react';

/**
 * Lazy-loaded component that resolves after a specified delay.
 * @returns {Promise<{ default: FC }>} A promise that resolves to a React component.
 */
const LazyComponent: LazyExoticComponent<FC> = lazy(() => {
  return new Promise<{ default: FC }>((resolve) => {
    setTimeout(() => resolve({ default: () => {
      return (<div style={{ display: 'none' }}>SUSPENSE TRIGGER</div>);
    }}), 20 * 1000);
  });
});

/**
 * SuspenseTrigger component that triggers the Suspense boundary for 20 seconds.
 * @returns {JSX.Element} The lazy-loaded component.
 */
const SuspenseTrigger: FC = (): JSX.Element => (<LazyComponent />);

export default SuspenseTrigger;
