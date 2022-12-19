/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { WalletConnectClient } from './walletConnect';

import { generateAccount } from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';

const dummyAccount = generateAccount();

describe(`WalletConnectClient`, () => {
  beforeAll(() => {
    const localStorageMock = (function () {
      let store: { [key: string]: any } = {};

      return {
        getItem(key: string) {
          return store[key];
        },

        setItem(key: string, value: any) {
          store[key] = value;
        },

        clear() {
          store = {};
        },

        removeItem(key: string) {
          delete store[key];
        },

        getAll() {
          return store;
        },
      };
    })();

    Object.defineProperty(window, `localStorage`, { value: localStorageMock });
  });
  it(`Initializes and disconnects correctly`, async () => {
    const mockedWalletConnect = {
      isConnected: false,
      createSession: jest.fn(),
      reconnectSession: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      connector: {
        accounts: [dummyAccount.addr],
        on: jest.fn(),
      },
      accounts: [dummyAccount.addr],
      connect: jest.fn(async () => [dummyAccount.addr]),
      disconnect: jest.fn(),
      killSession: jest.fn(),
    } as unknown as PeraWalletConnect;
    const walletConnectClient = new WalletConnectClient(mockedWalletConnect);

    expect(walletConnectClient.connected()).toBe(false);

    await walletConnectClient.connect();

    expect(mockedWalletConnect.connect).toBeCalledTimes(1);
    expect(walletConnectClient.accounts()).toStrictEqual([dummyAccount.addr]);

    await walletConnectClient.disconnect();
  });
});
