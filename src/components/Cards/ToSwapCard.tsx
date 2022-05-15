import { Card, CardHeader, CardContent, Stack, Button } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  setOfferingAssets,
  setRequestingAssets,
} from '@/redux/slices/userSlice';
import { useState } from 'react';
import { Asset } from '@/models/Asset';
import { ToAssetPickerDialog } from '../Dialogs/ToAssetPickerDialog';
import AssetListView from '../Lists/AssetListView';

type Props = {
  cardTitle: string;
};

const ToSwapCard = ({ cardTitle }: Props) => {
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  const requestingAssets = useAppSelector(
    (state) => state.user.selectedRequestingAssets,
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
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === `light`
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
          }}
        />
        <CardContent>
          <Stack spacing={2}>
            <Button
              variant="outlined"
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
                    setOfferingAssets([
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
