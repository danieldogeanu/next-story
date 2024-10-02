'use client';

import * as allTablerIcons from '@tabler/icons-react';
import { TablerIconsProps } from '@tabler/icons-react';
import { useState, useEffect, useTransition } from 'react';

export type IconName = {
  [K in keyof typeof allTablerIcons as K extends `Icon${string}` ? K : never]: typeof allTablerIcons[K];
};

export type IconKeys = keyof IconName;

export interface DynamicIconProps extends TablerIconsProps {
  icon: IconKeys;
};

/**
 * Client React component that generates TablerIcons dynamically from a string.
 * 
 * @param props The React props for the dynamically loaded icon.
 * @returns Returns a promise of the JSX.Element that can be used as SVG Icon in any React component.
 */
export default function DynamicIcon({icon, ...otherProps}: DynamicIconProps) {
  const [isPending, startTransition] = useTransition();
  const [SelectedIcon, selectIcon] = useState<React.FC<TablerIconsProps> | null>(null);

  useEffect(() => {
    startTransition(() => {
      const IconComponent = allTablerIcons[icon] as React.FC<TablerIconsProps>;
      selectIcon(() => IconComponent);
    });
  }, [icon]);

  return SelectedIcon ? <SelectedIcon {...otherProps} /> : null;
};
