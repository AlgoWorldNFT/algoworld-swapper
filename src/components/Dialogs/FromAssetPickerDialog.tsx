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

type Props = {
  open: boolean;
  onAssetSelected: (asset: Asset, amount: number) => void;
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
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>();
  const [selectedAssetAmount, setSelectedAssetAmount] = useState<number>(1);
  const maxAmount = useMemo(() => {
    return selectedAsset ? selectedAsset.amount : 1;
  }, [selectedAsset]);
  const minAmount = 1;

  const searchedAssets = useMemo(() => {
    const unpackedAssets = assets ? assets : [];
    const unpackedSelectedAssetIndexes = selectedAssets
      ? selectedAssets.map((asset) => asset.index)
      : [];
    const filtered = [
      ...unpackedAssets.filter((asset) => {
        return (
          asset.amount > 0 &&
          !unpackedSelectedAssetIndexes.includes(asset.index)
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
            onChange={(_, value) => {
              setSelectedAsset(value);
              if (!value) {
                setSelectedAssetAmount(minAmount);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search assets"
                placeholder="Pick the assets you want to offer"
              />
            )}
          />

          <TextField
            id="name"
            sx={{ marginTop: 2 }}
            label={
              selectedAsset
                ? `Offering asset amount (${selectedAsset.amount} available)`
                : `Offering asset amount`
            }
            disabled={!selectedAsset}
            InputProps={{
              inputProps: {
                type: `number`,
                max: maxAmount,
                min: minAmount,
              },
            }}
            onChange={(input) => {
              let inputVal = Number(input.target.value);
              inputVal = inputVal === 0 ? 1 : inputVal;

              if (inputVal <= maxAmount && inputVal >= minAmount) {
                setSelectedAssetAmount(inputVal);
              } else {
                setSelectedAssetAmount(minAmount);
              }
            }}
            type="number"
            value={selectedAssetAmount}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedAsset(null);
              setSelectedAssetAmount(minAmount);
              onCancel();
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              if (selectedAsset && selectedAssetAmount) {
                onAssetSelected(selectedAsset, selectedAssetAmount);
                setSelectedAsset(null);
                setSelectedAssetAmount(minAmount);
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
