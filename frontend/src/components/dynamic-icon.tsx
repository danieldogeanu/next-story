'use server';

import { Icon, TablerIconsProps } from "@tabler/icons-react";

export interface DynamicIconProps extends TablerIconsProps {
  icon: string;
}

/**
 * React component that generates TablerIcons dynamically.
 * @param props The React props for the dynamically loaded icon.
 * @returns Returns a promise of the JSX.Element that can be used as SVG Icon in any React component.
 */
export default async function DynamicIcon({icon, ...props}: DynamicIconProps) {
  const TablerIcons = await import('@tabler/icons-react');

  // // Get key name to type the icon prop correctly.
  type TablerIconsType = Awaited<typeof TablerIcons>;
  type IconName = keyof TablerIconsType;

  // // Select the correct icon and return it.
  const SelectedIcon = TablerIcons[icon as IconName] as Icon;

  return <SelectedIcon {...props} />;
}
