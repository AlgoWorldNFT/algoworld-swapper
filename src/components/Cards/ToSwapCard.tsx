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

import { useMemo, useState } from 'react';
import { Asset } from '@/models/Asset';
import AssetListView from '../Lists/AssetListView';
import { setRequestingAssets } from '@/redux/slices/applicationSlice';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { CoinType } from '@/models/CoinType';
import { ToAlgoPickerDialog } from '../Dialogs/ToAlgoPickerDialog';
import { ToAssetPickerDialog } from '../Dialogs/ToAssetPickerDialog';
import { TO_SWAP_REQUESTING_BTN_ID } from './constants';
import { useWallet } from '@txnlab/use-wallet';

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
  const { activeAddress } = useWallet();

  const requestingAssets = useAppSelector(
    (state) => state.application.selectedRequestingAssets,
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
              id={TO_SWAP_REQUESTING_BTN_ID}
              variant="outlined"
              disabled={
                requestingAssets.length >= maxAssets ||
                !activeAddress ||
                disabled
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
