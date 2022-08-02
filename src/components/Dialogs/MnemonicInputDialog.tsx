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
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { WalletClient, WalletType } from '@/models/Wallet';
import { DialogActions, Button, TextField } from '@mui/material';
import {
  MNEMONIC_DIALOG_ID,
  MNEMONIC_DIALOG_SELECT_BUTTON_ID,
  MNEMONIC_DIALOG_TEXT_INPUT_ID,
} from './constants';

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
  onMnemonicSelected: (mnemonicPhrase: string) => void;
};

const MnemonicInputDialog = ({ open, onMnemonicSelected }: Props) => {
  const [mnemonicPhrase, setMnemonicPhrase] = React.useState(``);

  return (
    <Dialog id={MNEMONIC_DIALOG_ID} open={open}>
      <DialogTitle>Enter mnemonic phrase:</DialogTitle>

      <TextField
        value={mnemonicPhrase}
        onChange={(e) => setMnemonicPhrase(e.target.value)}
        label="Multiline Placeholder"
        placeholder="Placeholder"
        multiline
        id={MNEMONIC_DIALOG_TEXT_INPUT_ID}
      />

      <DialogActions>
        <Button
          id={MNEMONIC_DIALOG_SELECT_BUTTON_ID}
          onClick={() => {
            onMnemonicSelected(mnemonicPhrase);
            setMnemonicPhrase(``);
          }}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MnemonicInputDialog;
