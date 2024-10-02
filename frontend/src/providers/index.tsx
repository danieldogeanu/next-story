import { FC, Fragment, PropsWithChildren, ReactNode } from 'react';

export type ProviderWithProps<P> = [FC<PropsWithChildren<P>>, P];

/**
 * Combines multiple React providers into a single higher-order component (HOC).
 *
 * This function takes an array of providers with their respective props and combines them into a
 * single component that can wrap children in all the specified providers. The order of the
 * providers is preserved, and each provider wraps the subsequent ones.
 *
 * @param {ProviderWithProps[]} providers - An array of providers with their associated props: `[ProviderComponent, providerProps]`.
 * @returns {FC<ProvidersProps>} A functional component that renders the children wrapped in all the providers.
 */
export function combineProviders<T extends unknown[]>(
  providers: [...{ [K in keyof T]: ProviderWithProps<T[K]> }]
): FC<{ children: ReactNode }> {

  // Reducer that combines providers by wrapping them in sequence.
  function reducer<P>(
    CombinedProviders: FC<{ children: ReactNode }>, 
    [CurrentProvider, providerProps]: ProviderWithProps<P>
  ) {
    return function CombinedComponent({ children }: PropsWithChildren<{}>): JSX.Element {
      return (
        <CombinedProviders>
          <CurrentProvider {...providerProps}>{children}</CurrentProvider>
        </CombinedProviders>
      );
    };
  }

  // Initial value that simply renders children.
  function initialValue({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Fragment>{children}</Fragment>;
  }

  // Reduce the providers to a single component.
  return providers.reduce(reducer, initialValue);
}
