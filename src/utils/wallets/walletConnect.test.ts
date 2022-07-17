/**
 * @jest-environment node
 */
import WalletConnectClient from './walletConnect';

import { generateAccount } from 'algosdk';
import WalletConnect from '@walletconnect/client';

const dummyAccount = generateAccount();

jest.mock(`@walletconnect/client`, () => {
  return jest.fn().mockImplementation(() => {
    return {
      connected: false,
      createSession: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      accounts: [{ address: dummyAccount.addr }],
      killSession: jest.fn(),
    };
  });
});

describe(`WalletConnectClient`, () => {
  it(`Initializes and disconnects correctly`, async () => {
    const mockedWalletConnect = new WalletConnect({});
    const walletConnectClient = new WalletConnectClient(mockedWalletConnect);

    expect(walletConnectClient.connected()).toBe(false);

    await walletConnectClient.connect();

    expect(mockedWalletConnect.createSession).toBeCalledTimes(1);
    expect(mockedWalletConnect.on).toBeCalledTimes(3);
    expect(walletConnectClient.accounts()).toStrictEqual([
      {
        address: dummyAccount.addr,
      },
    ]);

    await walletConnectClient.disconnect();
    expect(mockedWalletConnect.killSession).toBeCalledTimes(1);
    expect(mockedWalletConnect.off).toBeCalledTimes(3);
  });
});
