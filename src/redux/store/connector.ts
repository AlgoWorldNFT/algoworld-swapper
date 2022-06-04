import WalletConnect from '@walletconnect/client';
import { createContext } from 'react';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';

const connectProps = {
  bridge: `https://bridge.walletconnect.org`,
  qrcodeModal: QRCodeModal,
};
export const connector = new WalletConnect(connectProps);
export const ConnectContext = createContext(connector);
