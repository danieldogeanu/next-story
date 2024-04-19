'use client';

import { TablerIconsProps } from '@tabler/icons-react';
import { useState, useEffect, useTransition } from 'react';

export interface DynamicIconProps extends TablerIconsProps {
  icon: string;
};

export interface TablerIcons {
  [key: string]: React.FC<TablerIconsProps>;
};

/**
 * Client React component that generates TablerIcons dynamically from a string.
 * 
 * @param props The React props for the dynamically loaded icon.
 * @returns Returns a promise of the JSX.Element that can be used as SVG Icon in any React component.
 */
export default function DynamicIcon({icon, ...props}: DynamicIconProps) {
  const [isPending, startTransition] = useTransition();
  const [SelectedIcon, selectIcon] = useState<React.FC<TablerIconsProps> | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const tablerIcons = (await import('@tabler/icons-react')) as unknown as TablerIcons;
      selectIcon(() => tablerIcons[icon]);
    });
  }, [icon]);

  return SelectedIcon ? <SelectedIcon {...props} /> : null;
};
