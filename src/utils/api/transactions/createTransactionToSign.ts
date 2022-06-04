import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import { Transaction, LogicSigAccount } from 'algosdk';

export default function createTransactionToSign(
  transaction: Transaction,
  signer: WalletConnect | LogicSigAccount,
  type: TransactionToSignType,
) {
  return {
    transaction: transaction,
    signer: signer,
    type: type,
  } as TransactionToSign;
}
