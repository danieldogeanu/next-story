// Data fetched from the server must be in the following format:

export interface NavEntryItem {
  href: string;
  label: string;
  icon?: string;
  submenu?: NavEntryItem[];
}

export interface SocialEntryItem {
  href: string;
  label: string;
  icon: string;
}
