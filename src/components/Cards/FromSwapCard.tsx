/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Card, CardHeader, CardContent, Stack, Button } from '@mui/material';

import { useState } from 'react';
import { Asset } from '@/models/Asset';
import { FromAssetPickerDialog } from '../Dialogs/FromAssetPickerDialog';
import AssetListView from '../Lists/AssetListView';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { setOfferingAssets } from '@/redux/slices/walletConnectSlice';
import { FROM_SWAP_OFFERING_ASSET_BTN_ID } from './constants';

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
                id={FROM_SWAP_OFFERING_ASSET_BTN_ID}
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
