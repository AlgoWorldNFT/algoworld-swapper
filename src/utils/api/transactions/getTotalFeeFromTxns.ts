import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';

export default function getTotalFeeFromTxns(txns: TransactionToSign[]) {
  let totalAlgoFee = 0;

  for (const txn of txns) {
    totalAlgoFee += txn.transaction.fee;

    if (
      (txn.type === TransactionToSignType.UserFeeTransaction ||
        txn.type === TransactionToSignType.LsigFeeTransaction) &&
      `amount` in txn.transaction
    ) {
      totalAlgoFee += Number(txn.transaction.amount);
    }
  }

  return totalAlgoFee;
}
