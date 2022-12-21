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
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { useAppDispatch } from '@/redux/store/hooks';
import {
  DialogActions,
  Button,
  ListItemAvatar,
  Divider,
  ListItemButton,
} from '@mui/material';
import { CONNECT_PROVIDER_DIALOG_ID } from './constants';
import Image from 'next/image';
import { useWallet } from '@txnlab/use-wallet';

type Props = {
  open: boolean;
};

const ConnectProviderDialog = ({ open }: Props) => {
  const dispatch = useAppDispatch();

  const { providers } = useWallet();

  return (
    <>
      <Dialog id={CONNECT_PROVIDER_DIALOG_ID} open={open}>
        <DialogTitle>Connect a wallet</DialogTitle>
        <List>
          {providers?.map((provider) => (
            <React.Fragment key={`provider-${provider.metadata.id}`}>
              <ListItem>
                <ListItemButton
                  onClick={() => {
                    provider
                      .connect()
                      .then(() => {
                        dispatch(setIsWalletPopupOpen(false));
                      })
                      .catch(() => {
                        dispatch(setIsWalletPopupOpen(false));
                      });
                  }}
                >
                  <ListItemAvatar>
                    <div
                      style={{
                        borderRadius: `50%`,
                        overflow: `hidden`,
                        width: `48px`,
                        height: `48px`,
                      }}
                    >
                      <Image
                        src={provider.metadata.icon}
                        width={48}
                        height={48}
                        placeholder="blur"
                        blurDataURL={provider.metadata.icon}
                        alt={`Wallet icon`}
                      />
                    </div>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ fontStyle: `bold`, pl: 2, pr: 2 }}
                    primary={provider.metadata.name}
                    secondary={provider.isActive ? `Active` : ``}
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
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
    </>
  );
};

export default ConnectProviderDialog;
