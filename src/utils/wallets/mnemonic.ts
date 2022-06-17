import { TransactionToSign } from '@/models/Transaction';
import { AlgoWorldWallet } from '@/models/Wallet';
import algosdk, { Account, Transaction } from 'algosdk';

export default class MnemonicClient implements AlgoWorldWallet {
  private client: Account | undefined;
  private mnemonic: string;

  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
    this.client = algosdk.mnemonicToSecretKey(mnemonic);
  }

  public connect = async () => {
    this.client = algosdk.mnemonicToSecretKey(this.mnemonic);
    return Promise.resolve();
  };

  public address = () => {
    if (this.client) {
      return this.client.addr;
    } else {
      throw new Error(`Client not connected`);
    }
  };

  public accounts = () => {
    if (this.client) {
      return [this.client.addr];
    } else {
      throw new Error(`Client not connected`);
    }
  };

  public signTransactions = async (
    transactionsToSign: TransactionToSign[],
    txnGroup: Transaction[],
  ) => {
    return Promise.resolve();
  };

  public disconnect = async () => {
    this.client = undefined;
    return;
  };

  public connected = () => {
    return this.client !== undefined;
  };

  public pending = () => {
    return false;
  };
}
