import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { Transaction } from 'algosdk';

export default function createTransactionToSign(
  transaction: Transaction,
  type: TransactionToSignType,
) {
  return {
    transaction: transaction,
    type: type,
  } as TransactionToSign;
}
