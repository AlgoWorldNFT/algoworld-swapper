import { Card, CardHeader, CardContent, Stack, Button } from '@mui/material';

import { useMemo, useState } from 'react';
import { Asset } from '@/models/Asset';
import AssetListView from '../Lists/AssetListView';
import { setRequestingAssets } from '@/redux/slices/walletConnectSlice';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { CoinType } from '@/models/CoinType';
import { ToAlgoPickerDialog } from '../Dialogs/ToAlgoPickerDialog';
import { ToAssetPickerDialog } from '../Dialogs/ToAssetPickerDialog';

type Props = {
  cardTitle: string;
  maxAssets: number;
  coinType?: CoinType;
  disabled?: boolean;
};

const ToSwapCard = ({
  cardTitle,
  maxAssets,
  coinType = CoinType.ASA,
  disabled = false,
}: Props) => {
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  const address = useAppSelector((state) => state.walletConnect.address);
  const requestingAssets = useAppSelector(
    (state) => state.walletConnect.selectedRequestingAssets,
  );
  const dispatch = useAppDispatch();

  const pickerContent = useMemo(() => {
    if (coinType === CoinType.ASA) {
      return (
        <ToAssetPickerDialog
          open={pickerOpen}
          onAssetSelected={(asset: Asset, amount: number) => {
            dispatch(
              setRequestingAssets([
                ...requestingAssets,
                {
                  ...asset,
                  requestingAmount: amount * Math.pow(10, asset.decimals),
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
      );
    } else {
      return (
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
      );
    }
  }, [coinType, dispatch, pickerOpen, requestingAssets]);

  return (
    <>
      {pickerContent}
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
              disabled={
                requestingAssets.length >= maxAssets || !address || disabled
              }
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
