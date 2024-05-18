import Link, { LinkProps } from "next/link";
import { Anchor, AnchorProps } from "@mantine/core";

export interface LegalLinkProps extends 
  AnchorProps, Omit<LinkProps, 'href'> {
  href: string;
  label: string;
}

export default function LegalLink({href, label}: LegalLinkProps) {
  return (
    <Anchor component={Link} href={href} size='sm'>
      {label}
    </Anchor>
  );
}
