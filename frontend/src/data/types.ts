import { IconKeys } from "@/components/dynamic-icon";

// Data fetched from the server must be in the following format:

export interface NavEntryItem {
  href: string;
  label: string;
  icon?: IconKeys;
  submenu?: NavEntryItem[];
}

export interface SocialEntryItem {
  href: string;
  label: string;
  icon: IconKeys;
}
