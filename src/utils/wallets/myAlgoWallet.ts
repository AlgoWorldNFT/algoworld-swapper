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
        console.log(error);
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

      const signedTxns = await this.client.signTransaction(userTxns);
      const signedTxnsMap = Object.assign(
        {},
        ...signedTxns.map((txn) => ({ [txn.txID]: txn.blob })),
      );
      const signedTxnsIds = Object.keys(signedTxnsMap);

      return txnGroup.map((originalTxn) => {
        if (signedTxnsIds.includes(originalTxn.txID())) {
          return signedTxnsMap[originalTxn.txID()];
        } else return null;
      });
    } else {
      throw new Error(`Client not connected`);
    }
  };

  public disconnect = async () => {
    this.client = undefined;
    this.userAccounts = [];
    return Promise.resolve();
  };

  public connected = () => {
    return this.userAccounts.length > 0;
  };
}
