import createTransactionToSign from './createTransactionToSign';
import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { Transaction, LogicSigAccount } from 'algosdk';

describe(`createTransactionToSign`, () => {
  it(`should create a TransactionToSign object with the correct properties`, () => {
    const transaction: Transaction = {
      fee: 10,
      firstRound: 1000,
      lastRound: 2000,
      note: Buffer.from(`note`),
      genesisID: `test-genesis-id`,
      genesisHash: `test-genesis-hash`,
    } as unknown as Transaction;
    const signer: LogicSigAccount = {
      address: `test-address`,
      logicSig: {
        msig: {
          subsignatures: [],
          threshold: 1,
        },
      },
    } as unknown as LogicSigAccount;
    const type: TransactionToSignType = TransactionToSignType.LsigTransaction;

    const result = createTransactionToSign(transaction, signer, type);
    expect(result).toEqual({
      transaction: transaction,
      signer: signer,
      type: type,
    } as TransactionToSign);
  });
});
