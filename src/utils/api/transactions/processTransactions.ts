import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import {
  assignGroupID,
  signLogicSigTransactionObject,
  LogicSigAccount,
  encodeUnsignedTransaction,
} from 'algosdk';

const processTransactions = async (
  transactions: TransactionToSign[],
  signTransactions: (transactions: Uint8Array[]) => Promise<Uint8Array[]>,
) => {
  const rawTxns = [...transactions.map((txn) => txn.transaction)];
  const txnGroup = assignGroupID(rawTxns);
  const txnGroupEncoded = txnGroup.map((txn, index) => {
    const txnToSign = transactions[index];
    if (
      txnToSign.type === TransactionToSignType.LsigTransaction ||
      txnToSign.type === TransactionToSignType.LsigFeeTransaction
    ) {
      const signedEscrowTx = signLogicSigTransactionObject(
        txnGroup[index],
        transactions[index].signer as LogicSigAccount,
      );

      return signedEscrowTx.blob;
    }
    return encodeUnsignedTransaction(txn);
  });

  const signedUserTransactionsResult = await signTransactions(
    txnGroupEncoded,
  ).catch((error) => {
    console.error(error);
    return [];
  });

  return signedUserTransactionsResult;
};

export default processTransactions;
