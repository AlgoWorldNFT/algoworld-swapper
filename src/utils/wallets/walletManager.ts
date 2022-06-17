import { TransactionToSign } from '@/models/Transaction';
import { AlgoWorldWallet, WalletType } from '@/models/Wallet';
import { Transaction } from 'algosdk';
import MnemonicClient from './mnemonic';
import WalletConnectClient from './walletConnect';

export default class WalletManager {
  private static _instance: WalletManager;
  private client: AlgoWorldWallet | undefined;

  public setWalletClient = (walletType: WalletType) => {
    if (walletType === WalletType.PeraWallet) {
      this.client = new WalletConnectClient();
    } else {
      const mnemonic = process.env.NEXT_PUBLIC_MNEMONIC ?? ``;
      // this.client = new MnemonicClient(mnemonic);
    }
  };

  public connect = async (): Promise<void> => {
    if (this.client) {
      return this.client.connect();
    } else {
      throw new Error(`Client not set`);
    }
  };

  public disconnect = async (): Promise<void> => {
    if (this.client) {
      return this.client.disconnect();
    } else {
      throw new Error(`Client not set`);
    }
  };

  public signTranscations = (
    transactionsToSign: TransactionToSign[],
    txnGroup: Transaction[],
  ) => {
    if (this.client) {
      return this.client.signTransactions(transactionsToSign, txnGroup);
    } else {
      throw new Error(`Client not set`);
    }
  };

  public getWalletClient = (): AlgoWorldWallet => {
    if (this.client) {
      return this.client;
    } else {
      throw new Error(`Client not set`);
    }
  };

  public accounts = (): string[] => {
    if (this.client) {
      return this.client.accounts();
    } else {
      throw new Error(`Client not set`);
    }
  };

  get connected(): boolean {
    return Boolean(this.client && this.client.connected());
  }

  get pending(): boolean {
    return Boolean(this.client && this.client.pending());
  }
}
