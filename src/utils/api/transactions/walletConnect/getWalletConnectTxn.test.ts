import { Transaction } from 'algosdk';
import getWalletConnectTxn from './getWalletConnectTxn';

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

    const result = getWalletConnectTxn(txn, true);
    expect(result[0]).toEqual({
      txn: txn,
      message: `Sign transaction to proceed`,
      signers: undefined,
    });

    const result2 = getWalletConnectTxn(txn, false);
    expect(result2[0]).toEqual({
      txn: txn,
      message: `Sign transaction to proceed`,
      signers: [],
    });
  });
});
