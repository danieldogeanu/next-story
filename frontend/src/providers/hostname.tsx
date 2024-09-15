'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

export interface HostnameProviderProps {
  hostname: string | null | undefined;
  href: string | null | undefined;
}

const HostnameContext = createContext<HostnameProviderProps>({
  hostname: null,
  href: null,
});

/**
 * HostnameProvider component that provides the hostname context to its children.
 *
 * @param {PropsWithChildren<HostnameProviderProps>} props - The props object containing hostname, href and children.
 * @returns {JSX.Element} The provider component with the hostname context.
 *
 * @example
 * // Wrap your component tree with HostnameProvider.
 * <HostnameProvider hostname='example.com' href='https://example.com'>
 *   <App />
 * </HostnameProvider>
 */
export const HostnameProvider = ({hostname, href, children}: PropsWithChildren<HostnameProviderProps>): JSX.Element => {
  return (
    <HostnameContext.Provider value={{hostname, href}}>
      {children}
    </HostnameContext.Provider>
  );
}

/**
 * Custom hook to use the hostname context.
 *
 * @returns {HostnameProviderProps} The current hostname context value.
 *
 * @example
 * // Use the custom hook to access the hostname context.
 * const hostname = useHostname();
 */
export const useHostname = (): HostnameProviderProps => {
  return useContext(HostnameContext);
};
