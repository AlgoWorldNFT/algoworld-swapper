import WalletConnect from '@walletconnect/client';
import { Transaction } from 'algosdk';
import { LogicSigAccount } from 'algosdk/dist/types/src/logicsig';

export enum TransactionToSignType {
  UserTransaction,
  LsigTransaction,
  UserFeeTransaction,
  LsigFeeTransaction,
}

export interface TransactionToSign {
  transaction: Transaction;
  signer: WalletConnect | LogicSigAccount;
  type: TransactionToSignType;
}

export type SubmitTransactionResponse = {
  txId: string;
  confirmedRound: number;
};
