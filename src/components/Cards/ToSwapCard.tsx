import { Card, CardHeader, CardContent, Stack, Button } from '@mui/material';

import { useState } from 'react';
import { Asset } from '@/models/Asset';
import AssetListView from '../Lists/AssetListView';
import { setRequestingAssets } from '@/redux/slices/walletConnectSlice';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { CoinType } from '@/models/CoinType';
import { ToAlgoPickerDialog } from '../Dialogs/ToAlgoPickerDialog';

type Props = {
  cardTitle: string;
  maxAssets: number;
  coinType?: CoinType;
};

const ToSwapCard = ({
  cardTitle,
  maxAssets,
  coinType = CoinType.ASA,
}: Props) => {
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  const address = useAppSelector((state) => state.walletConnect.address);
  const requestingAssets = useAppSelector(
    (state) => state.walletConnect.selectedRequestingAssets,
  );
  const dispatch = useAppDispatch();

  return (
    <>
      <ToAlgoPickerDialog
        open={pickerOpen}
        onAlgoAmoutSelected={(algo: Asset, amount: number) => {
          dispatch(
            setRequestingAssets([
              ...requestingAssets,
              {
                ...algo,
                requestingAmount: amount * Math.pow(10, algo.decimals),
              },
            ]),
          );
          setPickerOpen(false);
        }}
        selectedAssets={requestingAssets}
        onCancel={() => {
          setPickerOpen(false);
        }}
      />
      <Card>
        <CardHeader
          title={cardTitle}
          titleTypographyProps={{ align: `center` }}
          subheaderTypographyProps={{
            align: `center`,
          }}
        />
        <CardContent>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              disabled={requestingAssets.length >= maxAssets || !address}
              onClick={() => {
                setPickerOpen(true);
              }}
            >
              {coinType === CoinType.ASA
                ? `Select Requesting Asset`
                : `Enter requesting Algo`}
            </Button>

            {requestingAssets.length > 0 && (
              <AssetListView
                assets={requestingAssets}
                onAssetDeselected={(asset) => {
                  dispatch(
                    setRequestingAssets([
                      ...requestingAssets.filter(
                        (curAsset) => curAsset.index !== asset.index,
                      ),
                    ]),
                  );
                }}
                isOffering={false}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default ToSwapCard;
