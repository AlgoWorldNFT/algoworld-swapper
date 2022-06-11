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
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Asset } from '@/models/Asset';
import { useMemo, useState } from 'react';
import { Autocomplete } from '@mui/material';
import CryptoTextField from '../TextFields/CryptoTextField';
import formatAmount from '@/utils/formatAmount';
import { CoinType } from '@/models/CoinType';

type Props = {
  open: boolean;
  onAssetSelected: (asset: Asset, amount: number | string) => void;
  onCancel: () => void;
  assets?: Asset[];
  selectedAssets?: Asset[];
};

export const FromAssetPickerDialog = ({
  open,
  onAssetSelected,
  onCancel,
  assets,
  selectedAssets,
}: Props) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
  const [selectedAssetAmount, setSelectedAssetAmount] = useState<
    number | string | undefined
  >(undefined);

  const searchedAssets = useMemo(() => {
    const unpackedAssets = assets ? assets : [];
    const unpackedSelectedAssetIndexes = selectedAssets
      ? selectedAssets.map((asset) => asset.index)
      : [];

    const filtered = [
      ...unpackedAssets.filter((asset) => {
        return (
          asset.amount > 0 &&
          !unpackedSelectedAssetIndexes.includes(asset.index) &&
          asset.index !== 0
        );
      }),
    ];

    return filtered;
  }, [assets, selectedAssets]);

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Pick Asset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the asset ID or name to pick your selection
          </DialogContentText>

          <Autocomplete
            id="owned-assets-picker"
            autoComplete
            sx={{ marginTop: 2 }}
            isOptionEqualToValue={(option, value) =>
              option.index === value.index
            }
            options={searchedAssets}
            getOptionLabel={(option) => `${option.index}: ${option.name}`}
            filterSelectedOptions
            noOptionsText={`${
              assets && assets.length > 0
                ? `No assets with non zero balance available`
                : `No assets available`
            }`}
            onChange={(_, value) => {
              setSelectedAssetAmount(``);
              setSelectedAsset(value ?? undefined);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search assets"
                placeholder="Pick the assets you want to offer"
              />
            )}
          />

          <CryptoTextField
            label={
              selectedAsset
                ? `Offering asset amount (${formatAmount(
                    selectedAsset.amount,
                    selectedAsset.decimals,
                  )} available)`
                : `Offering asset amount`
            }
            sx={{ marginTop: 2 }}
            disabled={!selectedAsset}
            value={selectedAssetAmount}
            onChange={(value) => {
              setSelectedAssetAmount(value);
            }}
            coinType={CoinType.ASA}
            decimals={selectedAsset?.decimals ?? 0}
            maxValue={
              formatAmount(selectedAsset?.amount, selectedAsset?.decimals) ?? 1
            }
          ></CryptoTextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedAsset(undefined);
              setSelectedAssetAmount(undefined);
              onCancel();
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={!selectedAssetAmount}
            onClick={() => {
              if (selectedAsset && selectedAssetAmount) {
                onAssetSelected(selectedAsset, selectedAssetAmount);
                setSelectedAsset(undefined);
                setSelectedAssetAmount(undefined);
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
