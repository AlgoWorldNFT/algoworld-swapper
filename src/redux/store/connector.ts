/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import WalletConnect from '@walletconnect/client';
import { createContext } from 'react';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';

const connectProps = {
  bridge: `https://bridge.walletconnect.org`,
  qrcodeModal: QRCodeModal,
};
export const connector = new WalletConnect(connectProps);
export const ConnectContext = createContext(connector);
