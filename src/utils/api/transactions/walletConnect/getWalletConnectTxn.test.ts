import algosdk, { Transaction } from 'algosdk';
import getWalletConnectTxn from './getWalletConnectTxn';

jest.mock(`algosdk`, () => {
  const mockAlgosdk = {
    encodeUnsignedTransaction: jest.fn(),
  };
  return mockAlgosdk;
});

describe(`getWalletConnectTxn`, () => {
  it(`should return the correct object`, () => {
    const txn = {
      fee: 10,
      firstRound: 1000,
      lastRound: 2000,
      note: Buffer.from(`note`),
      genesisID: `test-genesis-id`,
      genesisHash: Buffer.from(`test-genesis-hash`, `base64`),
    } as unknown as Transaction;

    (algosdk.encodeUnsignedTransaction as jest.Mock).mockReturnValue(
      Buffer.from(`encoded-txn`),
    );

    const result = getWalletConnectTxn(txn, true);
    expect(result).toEqual({
      txn: `ZW5jb2RlZC10eG4=`,
      message: `Sign transaction to proceed`,
      signers: undefined,
    });

    const result2 = getWalletConnectTxn(txn, false);
    expect(result2).toEqual({
      txn: `ZW5jb2RlZC10eG4=`,
      message: `Sign transaction to proceed`,
      signers: [],
    });
  });
});
