import { render, queryByAttribute } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { setupStore } from '@/redux/store';
import {
  NAV_BAR_CHAIN_FORM_CONTROL_ID,
  NAV_BAR_CHAIN_SWITCH_ID,
} from './constants';

jest.mock(`algorand-walletconnect-qrcode-modal`, () => {
  return jest.fn().mockImplementation(() => {
    return {};
  });
});

jest.mock(`next/router`, () => {
  return {
    useRouter: jest.fn().mockReturnValue({ query: { chain: `testnet` } }),
  };
});

import { useRouter } from 'next/router';
import NavBar from './NavBar';

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = {},
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

describe(`NavBar`, () => {
  it.each([`testnet`, `mainnet`])(
    `renders correct switch when chain is %p`,
    (chainType) => {
      (useRouter as jest.Mock).mockReturnValue({ query: { chain: chainType } });

      const dom = renderWithProviders(<NavBar />);
      const getById = queryByAttribute.bind(null, `id`);

      const chainFormControlComponent = getById(
        dom.container,
        NAV_BAR_CHAIN_FORM_CONTROL_ID,
      );
      expect(chainFormControlComponent).toBeInTheDocument();
      expect(chainFormControlComponent?.textContent?.toLowerCase()).toBe(
        chainType,
      );

      const chainSwitchComponent = getById(
        dom.container,
        NAV_BAR_CHAIN_SWITCH_ID,
      ) as HTMLInputElement;
      expect(chainSwitchComponent).toBeInTheDocument();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(chainSwitchComponent.checked).toBe(chainType === `mainnet`);
    },
  );
});
