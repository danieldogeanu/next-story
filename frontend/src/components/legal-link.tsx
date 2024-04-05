'use server';

import Link from "next/link";
import { Anchor } from "@mantine/core";

export interface LegalLinkProps {
  href: string;
  label: string;
}

export default async function LegalLink({href, label}: LegalLinkProps) {
  return (
    <Anchor component={Link} href={href} size='sm'>
      {label}
    </Anchor>
  );
}
