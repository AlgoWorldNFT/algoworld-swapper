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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Asset } from '@/models/Asset';
import { useState } from 'react';
import CryptoTextField from '../TextFields/CryptoTextField';
import { CoinType } from '@/models/CoinType';
import { selectAssets } from '@/redux/slices/walletConnectSlice';
import { useAppSelector } from '@/redux/store/hooks';
import {
  DIALOG_CANCEL_BTN_ID,
  DIALOG_SELECT_BTN_ID,
  TO_ALGO_PICKER_DIALOG_ID,
} from './constants';

type Props = {
  open: boolean;
  onAlgoAmoutSelected: (algo: Asset, amount: number) => void;
  onCancel: () => void;
  selectedAssets?: Asset[];
  coinType?: CoinType;
};

export const ToAlgoPickerDialog = ({
  open,
  onAlgoAmoutSelected,
  onCancel,
}: Props) => {
  const [selectedAlgoAmount, setSelectedAlgoAmount] = useState<
    number | undefined
  >(undefined);

  const existingAssets = useAppSelector(selectAssets);
  const algoAsset = existingAssets.find(
    (asset: Asset) => asset.index === 0,
  ) as Asset;

  return (
    <div>
      <Dialog id={TO_ALGO_PICKER_DIALOG_ID} open={open}>
        <DialogTitle>Input amount</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the requested Algo amount</DialogContentText>

          <CryptoTextField
            label={`Requesting amount`}
            sx={{ marginTop: 2 }}
            value={selectedAlgoAmount}
            onChange={(value) => {
              setSelectedAlgoAmount(value);
            }}
            coinType={CoinType.ALGO}
            decimals={6}
          />
        </DialogContent>
        <DialogActions>
          <Button
            id={DIALOG_CANCEL_BTN_ID}
            onClick={() => {
              setSelectedAlgoAmount(undefined);
              onCancel();
            }}
          >
            Cancel
          </Button>

          <Button
            id={DIALOG_SELECT_BTN_ID}
            onClick={() => {
              if (selectedAlgoAmount) {
                onAlgoAmoutSelected(algoAsset, selectedAlgoAmount);
                setSelectedAlgoAmount(undefined);
              }
            }}
          >
            Select
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
