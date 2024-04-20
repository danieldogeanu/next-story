import Link, { LinkProps } from "next/link";
import { Anchor, AnchorProps } from "@mantine/core";
import { NavEntryItem } from "@/data/types";

export interface LegalLinkProps extends NavEntryItem, AnchorProps, Omit<LinkProps, 'href'> {}

export default function LegalLink({href, label}: LegalLinkProps) {
  return (
    <Anchor component={Link} href={href} size='sm'>
      {label}
    </Anchor>
  );
}
