import {
  Card,
  CardHeader,
  CardContent,
  Autocomplete,
  TextField,
  Stack,
} from '@mui/material';
import AssetListView from './AssetListView';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setOfferingAssets } from '@/redux/slices/userSlice';
import { useState } from 'react';
import { Asset } from '@/models/Asset';
import { AssetPickerDialog } from './AssetPickerDialog';

type Props = {
  cardTitle: string;
};

const FromSwapCard = ({ cardTitle }: Props) => {
  const owningAssets = useAppSelector((state) => state.user.owningAssets);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  const offeringAssets = useAppSelector(
    (state) => state.user.selectedOfferingAssets,
  );
  const dispatch = useAppDispatch();

  return (
    <>
      <AssetPickerDialog
        open={pickerOpen}
        onAssetSelected={(asset: Asset, amount: number) => {
          dispatch(
            setOfferingAssets([
              ...offeringAssets,
              { ...asset, offeringAmount: amount },
            ]),
          );
          setPickerOpen(false);
        }}
        assets={owningAssets}
        onCancel={() => {
          setPickerOpen(false);
        }}
      ></AssetPickerDialog>
      <Card sx={{ minWidth: 275 }}>
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
            {/* <Autocomplete
              multiple
              id="tags-outlined"
              autoComplete
              options={owningAssets}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              onClick={() => {
                setPickerOpen(true);
              }}
              onChange={(_, value) => {
                dispatch(setOfferingAssets(value));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Offering assets"
                  placeholder="Pick the assets you want to offer"
                />
              )}
            /> */}
            <TextField
              id="name"
              label="Offering asset amount"
              onClick={() => {
                setPickerOpen(true);
              }}
              type="number"
              fullWidth
              variant="outlined"
            />

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
        </CardContent>
      </Card>
    </>
  );
};

export default FromSwapCard;
