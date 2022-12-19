import { TransactionToSign } from '@/models/Transaction';
import { WalletType } from '@/models/Wallet';
import WalletManager from './walletManager';

jest.mock(`algosdk`, () => ({
  assignGroupID: jest.fn().mockReturnValue([]),
  signLogicSigTransactionObject: jest.fn().mockReturnValue({
    blob: new Uint8Array([]),
  }),
}));

jest.mock(`./walletConnect`, () => {
  return {
    WalletConnectClient: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn().mockResolvedValue(undefined),
        address: jest.fn().mockReturnValue(``),
        accounts: jest.fn().mockReturnValue([]),
        signTransactions: jest.fn().mockResolvedValue([]),
        disconnect: jest.fn().mockResolvedValue(undefined),
        connected: jest.fn().mockReturnValue(true),
      };
    }),
    WalletConnectSingleton: {
      Instance: jest.fn().mockImplementation(() => {
        return {
          connect: jest.fn().mockResolvedValue(undefined),
          address: jest.fn().mockReturnValue(``),
          accounts: jest.fn().mockReturnValue([]),
          signTransactions: jest.fn().mockResolvedValue([]),
          disconnect: jest.fn().mockResolvedValue(undefined),
          connected: jest.fn().mockReturnValue(true),
        };
      }),
    },
  };
});

jest.mock(`./myAlgoWallet`, () => {
  return jest.fn().mockImplementation(() => {
    return {
      MyAlgoWalletClient: jest.fn().mockImplementation(() => {
        return {
          connect: jest.fn().mockResolvedValue(undefined),
          address: jest.fn().mockReturnValue(``),
          accounts: jest.fn().mockReturnValue([]),
          signTransactions: jest.fn().mockResolvedValue([]),
          disconnect: jest.fn().mockResolvedValue(undefined),
          connected: jest.fn().mockReturnValue(true),
        };
      }),
      MyAlgoSingleton: {
        Instance: jest.fn().mockImplementation(() => {
          return {
            connect: jest.fn().mockResolvedValue(undefined),
            address: jest.fn().mockReturnValue(``),
            accounts: jest.fn().mockReturnValue([]),
            signTransactions: jest.fn().mockResolvedValue([]),
            disconnect: jest.fn().mockResolvedValue(undefined),
            connected: jest.fn().mockReturnValue(true),
          };
        }),
      },
    };
  });
});

jest.mock(`./mnemonic`, () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn().mockResolvedValue(undefined),
      address: jest.fn().mockReturnValue(``),
      accounts: jest.fn().mockReturnValue([]),
      signTransactions: jest.fn().mockResolvedValue([]),
      disconnect: jest.fn().mockResolvedValue(undefined),
      connected: jest.fn().mockReturnValue(true),
    };
  });
});

describe(`WalletManager`, () => {
  let walletManager: WalletManager;

  beforeEach(() => {
    walletManager = new WalletManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      walletType: WalletType.PeraWallet,
      phrase: undefined,
    },
    // { to be fixed
    //   walletType: WalletType.MyAlgoWallet,
    //   phrase: undefined,
    // },
    {
      walletType: WalletType.Mnemonic,
      phrase: `mnemonic phrase`,
    },
  ];

  testCases.forEach((testCase) => {
    it(`sets the wallet client for wallet type ${testCase.walletType}`, () => {
      walletManager.setWalletClient(testCase.walletType, testCase.phrase);
      expect(walletManager.getWalletClient()).toBeDefined();
    });

    it(`connects the wallet client for wallet type ${testCase.walletType}`, async () => {
      walletManager.setWalletClient(testCase.walletType, testCase.phrase);
      await walletManager.connect();
      expect(walletManager.getWalletClient().connect).toHaveBeenCalled();
    });

    it(`disconnects the wallet client for wallet type ${testCase.walletType}`, async () => {
      walletManager.setWalletClient(testCase.walletType, testCase.phrase);
      await walletManager.disconnect();
      expect(walletManager.getWalletClient().disconnect).toHaveBeenCalled();
    });

    it(`signs transactions for wallet type ${testCase.walletType}`, async () => {
      walletManager.setWalletClient(testCase.walletType, testCase.phrase);
      const transactions = [{ transaction: {} }];
      await walletManager
        .signTransactions(transactions as TransactionToSign[])
        .then((signedTransactions) => {
          expect(signedTransactions).toBeDefined();
        });
    });

    it(`gets the accounts for wallet type ${testCase.walletType}`, async () => {
      walletManager.setWalletClient(testCase.walletType, testCase.phrase);
      const accounts = await walletManager.accounts();
      expect(accounts).toBeDefined();
    });

    it(`gets the connected status for wallet type ${testCase.walletType}`, async () => {
      walletManager.setWalletClient(testCase.walletType, testCase.phrase);
      const connected = await walletManager.connected;
      expect(connected).toBeDefined();
    });

    it(`gets the wallet client for wallet type ${testCase.walletType}`, () => {
      walletManager.setWalletClient(testCase.walletType, testCase.phrase);
      expect(walletManager.getWalletClient()).toBeDefined();
    });
  });
});
