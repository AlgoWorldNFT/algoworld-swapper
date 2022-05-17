import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Button,
  ButtonGroup,
  Tab,
  Tabs,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setOfferingAssets } from '@/redux/slices/userSlice';
import { useState } from 'react';
import { Asset } from '@/models/Asset';
import { FromAssetPickerDialog } from '../Dialogs/FromAssetPickerDialog';
import AssetListView from '../Lists/AssetListView';

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
      <FromAssetPickerDialog
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
        selectedAssets={offeringAssets}
        assets={owningAssets}
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
            <ButtonGroup
              fullWidth
              variant="outlined"
              aria-label="outlined button group"
            >
              <Button sx={{ marginRight: 1 }}>Algo</Button>
              <Button sx={{ marginLeft: 1 }}>ASA</Button>
            </ButtonGroup>

            <Tabs
              value={`value`}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
              <Tab label="Item Four" />
              <Tab label="Item Five" />
              <Tab label="Item Six" />
              <Tab label="Item Seven" />
            </Tabs>

            <Stack spacing={2}>
              <Button
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
