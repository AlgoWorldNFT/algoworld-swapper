import MyAlgoWalletClient from './myAlgoWallet';

import MyAlgoConnect from '@randlabs/myalgo-connect';
import { generateAccount } from 'algosdk';
import { CONNECTED_WALLET_TYPE } from '@/common/constants';
import { WalletType } from '@/models/Wallet';

describe(`MyAlgoWalletClient`, () => {
  it(`Initializes and disconnects correctly`, async () => {
    const dummyAccount = generateAccount();

    const connectMock = jest.fn();

    connectMock.mockReturnValue(
      Promise.resolve([{ address: dummyAccount.addr }]),
    );

    const mockAlgoConnect: jest.Mocked<MyAlgoConnect> = {
      connect: connectMock,
      signTransaction: jest.fn(),
      signLogicSig: jest.fn(),
      tealSign: jest.fn(),
    } as unknown as jest.Mocked<MyAlgoConnect>;

    const myAlgoClient = new MyAlgoWalletClient(mockAlgoConnect);

    expect(myAlgoClient.connected()).toBe(false);
    expect(localStorage.getItem(CONNECTED_WALLET_TYPE)).toBeFalsy();

    await myAlgoClient.connect();

    expect(myAlgoClient.connected()).toBe(true);
    expect(myAlgoClient.address()).toBe(dummyAccount.addr);
    expect(localStorage.getItem(CONNECTED_WALLET_TYPE)).toBe(
      WalletType.MyAlgoWallet,
    );

    await myAlgoClient.disconnect();

    expect(myAlgoClient.connected()).toBe(false);
    expect(localStorage.getItem(CONNECTED_WALLET_TYPE)).toBeFalsy();
  });
});
