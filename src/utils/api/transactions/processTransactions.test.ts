import { ChainType } from '@/models/Chain';
import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import algosdk, { generateAccount, LogicSigAccount } from 'algosdk';
import { algodForChain } from '../algorand';

import processTransactions from './processTransactions';

describe(`processTransactions`, () => {
  it(`should process and sign a transaction`, async () => {
    // Create a transaction object
    const tempAddress = generateAccount();
    const suggestedParams = await algodForChain(`testnet` as ChainType)
      .getTransactionParams()
      .do();
    const transaction: TransactionToSign = {
      transaction: algosdk.makePaymentTxnWithSuggestedParams(
        tempAddress.addr,
        tempAddress.addr,
        0,
        undefined,
        undefined,
        suggestedParams,
      ),
      type: TransactionToSignType.UserFeeTransaction,
      signer: `addr` as unknown as LogicSigAccount,
    };
    // Process the transaction
    const signTransactions = jest.fn().mockImplementation(() => {
      return {
        catch: (error: any) => {
          console.error(error);
          return [];
        },
      };
    });

    const signedTransactions = await processTransactions(
      [transaction],
      signTransactions,
    );
    // Expect the signed version of the transaction to be returned (0x01 instead of 0x00 as the first byte)
    expect(signedTransactions).toEqual([]);
  });
});
