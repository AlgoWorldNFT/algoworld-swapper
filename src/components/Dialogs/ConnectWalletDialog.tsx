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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { WalletClient, WalletType } from '@/models/Wallet';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { useAppDispatch } from '@/redux/store/hooks';
import { DialogActions, Button, Avatar, ListItemAvatar } from '@mui/material';
import { CONNECT_WALLET_DIALOG_ID } from './constants';
import Image from 'next/image';

const walletClients = [
  {
    type: WalletType.PeraWallet,
    title: `PeraWallet`,
    supported: true,
    iconPath: `/perawallet_logo.svg`,
  },
  {
    type: WalletType.MyAlgoWallet,
    title: `MyAlgoWallet`,
    supported: true,
    iconPath: `/myalgowallet_logo.svg`,
  },
] as WalletClient[];

if (process.env.NEXT_PUBLIC_CI) {
  walletClients.push({
    type: WalletType.Mnemonic,
    title: `Mnemonic`,
    supported: true,
  });
}

type Props = {
  open: boolean;
  onClientSelected: (client: WalletClient) => void;
};

const ConnectWalletDialog = ({ open, onClientSelected }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <Dialog id={CONNECT_WALLET_DIALOG_ID} open={open}>
      <DialogTitle>Connect a wallet</DialogTitle>
      <List sx={{ pt: 0 }}>
        {walletClients.map((client) => (
          <ListItem
            button
            onClick={() => onClientSelected(client)}
            key={client.title}
            disabled={!client.supported}
          >
            {client.iconPath && (
              <ListItemAvatar>
                <Avatar>
                  <Image
                    src={client.iconPath}
                    alt={`${client.title} Logo`}
                    height={40}
                    width={40}
                  />
                </Avatar>
              </ListItemAvatar>
            )}
            <ListItemText primary={client.title} />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(setIsWalletPopupOpen(false));
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectWalletDialog;
