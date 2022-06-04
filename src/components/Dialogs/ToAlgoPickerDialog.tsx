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
      <Dialog open={open}>
        <DialogTitle>Input amount</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the requested Algo amount</DialogContentText>

          <CryptoTextField
            label={`Requesting amount (${
              algoAsset.amount / Math.pow(10, algoAsset.decimals)
            } max) `}
            sx={{ marginTop: 2 }}
            value={selectedAlgoAmount}
            onChange={(value) => {
              setSelectedAlgoAmount(value);
            }}
            coinType={CoinType.ALGO}
            decimals={6}
            maxValue={algoAsset.amount / Math.pow(10, algoAsset.decimals)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedAlgoAmount(undefined);
              onCancel();
            }}
          >
            Cancel
          </Button>

          <Button
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
