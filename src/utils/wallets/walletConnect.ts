import { AlgoWorldWallet, WalletType } from '@/models/Wallet';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { encodeAddress, Transaction } from 'algosdk';
import store from '@/redux/store';
import { onSessionUpdate, reset } from '@/redux/slices/walletConnectSlice';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import getWalletConnectTxn from '../api/transactions/walletConnect/getWalletConnectTxn';
import { CONNECTED_WALLET_TYPE } from '@/common/constants';

const connectProps = {
  bridge: `https://bridge.walletconnect.org`,
  qrcodeModal: QRCodeModal,
};
export default class WalletConnectClient implements AlgoWorldWallet {
  private client: WalletConnect;

  constructor() {
    this.client = new WalletConnect(connectProps);
  }

  private subsribeToEvents = async () => {
    // Subscribe to connection events
    console.log(`%cin subscribeToEvents`, `background: yellow`);
    this.client.on(`connect`, (error, payload) => {
      console.log(`%cOn connect`, `background: yellow`);
      if (error) {
        throw error;
      }
      const { accounts } = payload.params[0];
      store.dispatch(onSessionUpdate(accounts));
      QRCodeModal.close();
      localStorage.setItem(CONNECTED_WALLET_TYPE, WalletType.PeraWallet);
    });

    this.client.on(`session_update`, (error, payload) => {
      console.log(`%cOn session_update`, `background: yellow`);
      if (error) {
        throw error;
      }
      const { accounts } = payload.params[0];
      store.dispatch(onSessionUpdate(accounts));
    });

    this.client.on(`disconnect`, (error) => {
      console.log(`%cOn disconnect`, `background: yellow`);
      localStorage.removeItem(CONNECTED_WALLET_TYPE);
      if (error) {
        throw error;
      }
      store.dispatch(reset());
    });
  };

  public connect = async () => {
    if (this.client.connected) return;
    if (this.client.pending) return QRCodeModal.open(this.client.uri, null);
    await this.client.createSession();
    await this.subsribeToEvents();
  };

  public address = () => {
    return ``;
  };

  public accounts = () => {
    return this.client.accounts;
  };

  public signTransactions = async (txnGroup: Transaction[]) => {
    const userRequest = formatJsonRpcRequest(`algo_signTxn`, [
      txnGroup.map((value) => {
        if (
          this.client.accounts.includes(encodeAddress(value.from.publicKey))
        ) {
          return getWalletConnectTxn(value, true);
        } else {
          return getWalletConnectTxn(value, false);
        }
      }),
    ]);
    return await this.client.sendCustomRequest(userRequest);
  };

  public disconnect = async () => {
    if (this.client) {
      await this.client.killSession();
      this.client.off(`connect`);
      this.client.off(`session_update`);
      this.client.off(`disconnect`);
    } else {
      return Promise.resolve();
    }
  };

  public connected = () => {
    return this.client.connected;
  };
}
