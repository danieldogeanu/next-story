'use client';

import Link from "next/link";
import { Anchor, useMantineColorScheme, useMantineTheme } from "@mantine/core";

export interface LegalLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function LegalLink({href, children}: LegalLinkProps) {
  const {colors} = useMantineTheme();
  const {colorScheme} = useMantineColorScheme();
  const linkColor = (colorScheme === 'light') ? colors.gray[6] : colors.gray[3];

  return (
    <Anchor component={Link} href={href} c={linkColor} size='sm'>
      {children}
    </Anchor>
  );
}
