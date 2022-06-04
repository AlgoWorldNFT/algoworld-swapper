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
import { Autocomplete, CircularProgress } from '@mui/material';
import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { ALGOEXPLORER_INDEXER_URL, axiosFetcher } from '@/common/api';
import useSWR from 'swr';
import CryptoTextField from '../TextFields/CryptoTextField';
import { CoinType } from '@/models/CoinType';

type Props = {
  open: boolean;
  onAssetSelected: (asset: Asset, amount: number) => void;
  onCancel: () => void;
  selectedAssets?: Asset[];
};

export const ToAssetPickerDialog = ({
  open,
  onAssetSelected,
  onCancel,
  selectedAssets,
}: Props) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
  const [selectedAssetAmount, setSelectedAssetAmount] = useState<
    number | undefined
  >(undefined);

  const [searchContent, setSearchContent] = useState(``);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  const searchAssetSearchParam = useMemo(() => {
    if (!searchContent || searchContent === ``) {
      return undefined;
    }
    const searchParam = !isNaN(Number(searchContent))
      ? `asset-id=${Number(searchContent)}`
      : `name=${searchContent}`;

    return `${ALGOEXPLORER_INDEXER_URL}/v2/assets?${searchParam}&limit=5`;
  }, [searchContent]);

  const { data, error } = useSWR(searchAssetSearchParam, axiosFetcher);

  const searchedAssets: Asset[] = useMemo(() => {
    if (error || !data) {
      return [];
    }

    const unpackedSelectedAssetIndexes = selectedAssets
      ? selectedAssets.map((asset) => asset.index)
      : [];

    return data.assets
      .map((rawAsset: any) => {
        const assetParams = rawAsset[`params`];
        return {
          index: rawAsset[`index`],
          name: assetParams.hasOwnProperty(`name`) ? assetParams[`name`] : ``,
          imageUrl: assetParams.hasOwnProperty(`url`)
            ? assetParams[`url`]
            : EMPTY_ASSET_IMAGE_URL,
          decimals: assetParams[`decimals`],
          unitName: assetParams[`unit-name`],
          amount: 0,
          offeringAmount: 0,
          requestingAmount: 0,
        } as Asset;
      })
      .filter((asset: { index: number }) => {
        return !unpackedSelectedAssetIndexes.includes(asset.index);
      });
  }, [data, error, selectedAssets]);
  const loading = autocompleteOpen && searchedAssets.length === 0;

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Pick Asset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the asset ID or name to pick your selection
          </DialogContentText>

          <Autocomplete
            id="requiring-assets-picker"
            autoComplete
            open={autocompleteOpen}
            onOpen={() => {
              setAutocompleteOpen(true);
            }}
            onClose={() => {
              setAutocompleteOpen(false);
            }}
            options={searchedAssets}
            getOptionLabel={(option) => `${option.index}: ${option.name}`}
            filterSelectedOptions
            loading={loading}
            onInputChange={(event, value) => {
              setSearchContent(value);
            }}
            onChange={(_, value) => {
              setSelectedAssetAmount(1);
              setSelectedAsset(value ?? undefined);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Requesting assets"
                placeholder="Pick the assets you want to offer"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <CryptoTextField
            label={`Requesting asset amount`}
            sx={{ marginTop: 2 }}
            disabled={!selectedAsset}
            value={selectedAssetAmount}
            onChange={(value) => {
              console.log(value);
              setSelectedAssetAmount(value);
            }}
            coinType={CoinType.ASA}
            decimals={selectedAsset?.decimals ?? 0}
            maxValue={1e14}
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
