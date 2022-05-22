import WalletConnect from '@walletconnect/client';
import { LogicSigAccount, Transaction } from 'algosdk';

export interface TransactionToSign {
  transaction: Transaction;
}

export interface UserTransactionToSign extends TransactionToSign {
  signer: WalletConnect;
}

export interface LsigTransactionToSign extends TransactionToSign {
  signer: LogicSigAccount;
}
