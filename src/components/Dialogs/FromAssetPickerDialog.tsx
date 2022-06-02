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
import CryptoTextField, {
  CryptoTextFieldType,
} from '../TextFields/CryptoTextField';
import formatAmount from '@/utils/formatAmount';

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
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
  const [selectedAssetAmount, setSelectedAssetAmount] = useState<
    number | undefined
  >(undefined);

  const searchedAssets = useMemo(() => {
    const unpackedAssets = assets ? assets : [];
    const unpackedSelectedAssetIndexes = selectedAssets
      ? selectedAssets.map((asset) => asset.index)
      : [];
    console.log(unpackedAssets);
    const filtered = [
      ...unpackedAssets.filter((asset) => {
        return (
          asset.amount > 0 &&
          !unpackedSelectedAssetIndexes.includes(asset.index) &&
          asset.index !== 0
        );
      }),
    ];
    console.log(filtered);
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
              setSelectedAssetAmount(1);
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
              console.log(value);
              setSelectedAssetAmount(value);
            }}
            coinType={CryptoTextFieldType.ASA}
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
