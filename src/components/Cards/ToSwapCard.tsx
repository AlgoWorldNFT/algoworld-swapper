import { Card, CardHeader, CardContent, Stack, Button } from '@mui/material';

import { useState } from 'react';
import { Asset } from '@/models/Asset';
import { ToAssetPickerDialog } from '../Dialogs/ToAssetPickerDialog';
import AssetListView from '../Lists/AssetListView';
import { setRequestingAssets } from '@/redux/slices/walletConnectSlice';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';

type Props = {
  cardTitle: string;
  maxAssets: number;
};

const ToSwapCard = ({ cardTitle, maxAssets }: Props) => {
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  const address = useAppSelector((state) => state.walletConnect.address);
  const requestingAssets = useAppSelector(
    (state) => state.walletConnect.selectedRequestingAssets,
  );
  const dispatch = useAppDispatch();

  return (
    <>
      <ToAssetPickerDialog
        open={pickerOpen}
        onAssetSelected={(asset: Asset, amount: number) => {
          dispatch(
            setRequestingAssets([
              ...requestingAssets,
              { ...asset, requestingAmount: amount },
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
              Select Requesting Asset
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
