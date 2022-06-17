import { Transaction } from 'algosdk';

export default interface IAlgoWorldWallet {
  address: () => string;
  signTransactions: (transactions: Transaction[]) => Promise<any[]>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
