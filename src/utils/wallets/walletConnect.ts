import WalletConnect from '@walletconnect/client';
import IAlgoWorldWallet from './walletClient';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { Transaction } from 'algosdk';

const connectProps = {
  bridge: `https://bridge.walletconnect.org`,
  qrcodeModal: QRCodeModal,
};

export default class WalletConnectClient implements IAlgoWorldWallet {
  private client: WalletConnect;

  constructor() {
    this.client = new WalletConnect(connectProps);
  }

  public connect = async () => {
    return;
  };

  public address = () => {
    return ``;
  };

  public signTransactions = async (transactions: Transaction[]) => {
    return [];
  };

  public disconnect = async () => {
    return;
  };
}
