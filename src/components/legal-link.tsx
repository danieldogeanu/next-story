'use server';

import Link from "next/link";
import { Anchor } from "@mantine/core";

export interface LegalLinkProps {
  href: string;
  children: React.ReactNode;
}

export default async function LegalLink({href, children}: LegalLinkProps) {
  return (
    <Anchor component={Link} href={href} size='sm'>
      {children}
    </Anchor>
  );
}
