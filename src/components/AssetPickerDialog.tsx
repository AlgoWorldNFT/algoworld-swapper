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
};

export const AssetPickerDialog = ({
  open,
  onAssetSelected,
  onCancel,
  assets,
}: Props) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const [selectedAssetAmount, setSelectedAssetAmount] = useState<number>();

  const searchedAssets = useMemo(() => {
    const unpackedAssets = assets ? assets : [];
    const filtered = [
      ...unpackedAssets.filter((asset) => {
        return asset.amount > 0;
      }),
    ];
    return filtered;
  }, [assets]);

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Pick Asset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the asset ID or name to pick your selection
          </DialogContentText>

          <Autocomplete
            id="tags-outlined"
            autoComplete
            sx={{ marginTop: 2 }}
            options={searchedAssets}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            onChange={(_, value) => {
              if (value) {
                setSelectedAsset(value);
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
            label="Offering asset amount"
            onChange={(input) => {
              setSelectedAssetAmount(Number(input.target.value));
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
              setSelectedAsset(undefined);
              setSelectedAssetAmount(undefined);
              onCancel();
            }}
          >
            Cancel
          </Button>

          <Button
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
