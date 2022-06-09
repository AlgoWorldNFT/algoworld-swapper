import { Card, CardHeader, CardContent, Stack, Button } from '@mui/material';

import { useState } from 'react';
import { Asset } from '@/models/Asset';
import { FromAssetPickerDialog } from '../Dialogs/FromAssetPickerDialog';
import AssetListView from '../Lists/AssetListView';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { setOfferingAssets } from '@/redux/slices/walletConnectSlice';

type Props = {
  cardTitle: string;
  maxAssets: number;
  disabled?: boolean;
};

const FromSwapCard = ({ cardTitle, maxAssets, disabled = false }: Props) => {
  const assets = useAppSelector((state) => state.walletConnect.assets);
  const address = useAppSelector((state) => state.walletConnect.address);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  const offeringAssets = useAppSelector(
    (state) => state.walletConnect.selectedOfferingAssets,
  );
  const dispatch = useAppDispatch();

  return (
    <>
      <FromAssetPickerDialog
        open={pickerOpen}
        onAssetSelected={(asset: Asset, amount: number | string) => {
          dispatch(
            setOfferingAssets([
              ...offeringAssets,
              {
                ...asset,
                offeringAmount: Number(amount) * Math.pow(10, asset.decimals),
              },
            ]),
          );
          setPickerOpen(false);
        }}
        selectedAssets={offeringAssets}
        assets={assets}
        onCancel={() => {
          setPickerOpen(false);
        }}
      />
      <Card>
        <CardHeader
          title={cardTitle}
          titleTypographyProps={{ align: `center` }}
          sx={{}}
        />
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={2}>
              <Button
                disabled={
                  offeringAssets.length >= maxAssets || !address || disabled
                }
                variant="outlined"
                onClick={() => {
                  setPickerOpen(true);
                }}
              >
                Select Offering Asset
              </Button>

              {offeringAssets.length > 0 && (
                <AssetListView
                  assets={offeringAssets}
                  onAssetDeselected={(asset) => {
                    dispatch(
                      setOfferingAssets([
                        ...offeringAssets.filter(
                          (curAsset) => curAsset.index !== asset.index,
                        ),
                      ]),
                    );
                  }}
                  isOffering
                />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default FromSwapCard;
