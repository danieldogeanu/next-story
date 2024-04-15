'use server';

import DynamicIcon from "@/components/dynamic-icon";
import { TablerIconsProps } from "@tabler/icons-react";

// Types

export interface OriginalEntry {
  icon?: string;
  [key: string]: any;
};

export interface ResultEntry extends Omit<OriginalEntry, 'icon'> {
  icon?: React.ReactElement<TablerIconsProps>;
};

/**
 * Server function that converts string icons to ReactElement components.
 * 
 * USAGE: In server components we can `await` this function directly, but we
 * need to convert icons in `useEffect` hook in client components.
 * 
 * Here's some example code:
 * 
 * ```
 * // Server Components:
 * const entries: EntryProps[] = await convertDynamicIcons(fetchedServerEntries) as EntryProps[];
 * ```
 * 
 * ```
 * // Client Components:
 * const [entries, setEntries] = useState<EntryProps[]>([]);
 * useEffect(() => {
 *   (async () => setEntries(
 *     await convertDynamicIcons(fetchedServerEntries) as EntryProps[]
 *   ))();
 * });
 * ```
 * 
 * @param entries The original entries array that may contain `icon` props that need to be converted.
 * @returns Returns a new array with the results of the conversion.
 */
export async function convertDynamicIcons(entries: OriginalEntry[]): Promise<ResultEntry[]> {
  return entries.map((item) => {
    if (item.icon && typeof item.icon === 'string') {
      return {...item, icon: <DynamicIcon icon={item.icon} />};
    } else return item;
  }) as ResultEntry[];
}
