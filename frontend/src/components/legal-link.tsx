'use server';

import Link from "next/link";
import { Anchor } from "@mantine/core";
import { NavEntryProps } from "@/data/types";

export default async function LegalLink({href, label}: NavEntryProps) {
  return (
    <Anchor component={Link} href={href} size='sm'>
      {label}
    </Anchor>
  );
}
