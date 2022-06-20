import { AlgoWorldWallet } from '@/models/Wallet';
import { onSessionUpdate } from '@/redux/slices/walletConnectSlice';
import store from '@/redux/store';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { encodeAddress, Transaction } from 'algosdk';

class MyAlgoSingleton {
  private static _instance: MyAlgoConnect;

  private constructor() {
    //...
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new MyAlgoConnect());
  }
}

export default class MyAlgoWalletClient implements AlgoWorldWallet {
  private client: MyAlgoConnect | undefined;
  private userAccounts: string[] = [];

  constructor() {
    this.client = MyAlgoSingleton.Instance;
  }

  public connect = async () => {
    if (this.client) {
      try {
        const accounts = await this.client.connect({
          shouldSelectOneAccount: true,
        });
        this.userAccounts = accounts.map((account) => account.address);
        store.dispatch(onSessionUpdate(this.userAccounts));
        return Promise.resolve();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message.includes(`Windows is opened`));
        }
      }
    } else {
      throw new Error(`Client not connected`);
    }
  };

  public address = () => {
    if (this.client && this.userAccounts.length > 0) {
      return this.userAccounts[0];
    } else {
      throw new Error(`Client not connected`);
    }
  };

  public accounts = () => {
    if (this.client) {
      return this.userAccounts;
    } else {
      throw new Error(`Client not connected`);
    }
  };

  public signTransactions = async (txnGroup: Transaction[]) => {
    if (this.client) {
      const userTxns = txnGroup
        .filter((txn) => {
          return this.address() === encodeAddress(txn.from.publicKey);
        })
        .map((txn) => {
          return txn.toByte();
        });
      return this.client.signTransaction(userTxns);
    } else {
      throw new Error(`Client not connected`);
    }
  };

  public disconnect = async () => {
    this.client = undefined;
    return;
  };

  public connected = () => {
    return this.userAccounts.length > 0;
  };
}
