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

import ManageSwapDialog from '@/components/Dialogs/ManageSwapDialog';
import ShareSwapDialog from '@/components/Dialogs/ShareSwapDialog';
import PageHeader from '@/components/Headers/PageHeader';
import MySwapsTable from '@/components/Tables/MySwapsTable';
import { ellipseAddress } from '@/redux/helpers/utilities';
import {
  setIsShareSwapPopupOpen,
  setIsManageSwapPopupOpen,
  setIsWalletPopupOpen,
} from '@/redux/slices/applicationSlice';
import {
  getAccountSwaps,
  optAssets,
  recoverSwapTxnHistory,
} from '@/redux/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { AWVT_ASSET_INDEX, MY_SWAPS_PAGE_HEADER_ID } from '@/common/constants';
import { useMemo, useState } from 'react';
import { useWallet } from '@txnlab/use-wallet';

export default function MySwaps() {
  const hasAwvt = useAppSelector((state) => state.application.hasAwvt);
  const dispatch = useAppDispatch();
  const selectedManageSwap = useAppSelector(
    (state) => state.application.selectedManageSwap,
  );
  const {
    gateway,
    chain,
    swaps,
    recoveredSwaps,
    fetchingSwaps,
    recoveringSwaps,
    proxy,
  } = useAppSelector((state) => state.application);

  const isManageSwapPopupOpen = useAppSelector(
    (state) => state.application.isManageSwapPopupOpen,
  );

  const { activeAddress, signTransactions } = useWallet();

  const address = useMemo(() => {
    return activeAddress;
  }, [activeAddress]);

  const isShareSwapPopupOpen = useAppSelector(
    (state) => state.application.isShareSwapPopupOpen,
  );
  const [isShowHistoricalSwaps, setIsShowHistoricalSwaps] =
    useState<boolean>(false);

  const mySwaps = useMemo(() => {
    if (!proxy || Object.keys(proxy).length === 0) {
      return [];
    }
    return isShowHistoricalSwaps ? recoveredSwaps : swaps;
  }, [isShowHistoricalSwaps, proxy, recoveredSwaps, swaps]);

  const awvtIndex = useMemo(() => [AWVT_ASSET_INDEX(chain)], [chain]);

  return (
    <>
      <ManageSwapDialog
        open={isManageSwapPopupOpen}
        onClose={() => {
          if (!address) {
            return;
          }
          dispatch(setIsManageSwapPopupOpen(false));
          dispatch(getAccountSwaps({ chain, gateway, address }));
        }}
        onShare={() => {
          dispatch(setIsManageSwapPopupOpen(false));
          dispatch(setIsShareSwapPopupOpen(true));
        }}
      ></ManageSwapDialog>

      <ShareSwapDialog
        open={isShareSwapPopupOpen}
        swapConfiguration={selectedManageSwap}
        onClose={() => {
          dispatch(setIsShareSwapPopupOpen(false));
        }}
        onConfirm={() => {
          dispatch(setIsShareSwapPopupOpen(false));
        }}
        showManageSwapBtn={false}
      >
        {`Success! Your swap ${ellipseAddress(
          selectedManageSwap?.escrow,
        )} is initialized!`}
      </ShareSwapDialog>

      <PageHeader
        id={MY_SWAPS_PAGE_HEADER_ID}
        title="📜 My Swaps"
        description="Activate, update or deactivate your existing swaps"
      >
        {address && (
          <Grid
            sx={{ pt: 2 }}
            container
            justifyContent="space-evenly"
            alignItems="center"
          >
            {hasAwvt ? (
              <Button
                variant="outlined"
                onClick={async () => {
                  await dispatch(
                    optAssets({
                      assetIndexes: awvtIndex,
                      gateway,
                      chain,
                      activeAddress: address,
                      signTransactions,
                      deOptIn: true,
                    }),
                  );
                }}
              >
                Opt out visibility token
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={async () => {
                  await dispatch(
                    optAssets({
                      assetIndexes: awvtIndex,
                      gateway,
                      chain,
                      activeAddress: address,
                      signTransactions,
                    }),
                  );
                }}
              >
                Opt in visibility token
              </Button>
            )}
            {isShowHistoricalSwaps ? (
              <Tooltip title="Click to disable fetching of swaps that are not present in configuration file. This loads all active swaps currently assigned to your configuration file.">
                <Button
                  variant="outlined"
                  onClick={async () => {
                    setIsShowHistoricalSwaps(!isShowHistoricalSwaps);
                    await dispatch(
                      getAccountSwaps({ chain, gateway, address }),
                    );
                  }}
                >
                  Hide detailed history
                </Button>
              </Tooltip>
            ) : (
              <Tooltip
                title="⚠️ PLEASE READ: This option is only useful if you are attempting
              to recover previously created swaps that are still active but were somehow deleted from your configuration
              file.
              Such errors may happen occasionally and are caused by
              ingestion latency on ipfs data upload. If you see any swaps
              with this flag enabled, deactivate them and recreate again in
              order to restore it to your active configuration file."
              >
                <Button
                  variant="outlined"
                  onClick={async () => {
                    setIsShowHistoricalSwaps(!isShowHistoricalSwaps);
                    await dispatch(
                      recoverSwapTxnHistory({
                        chain,
                        gateway,
                        activeAddress: address,
                      }),
                    );
                  }}
                >
                  Show detailed history
                </Button>
              </Tooltip>
            )}
          </Grid>
        )}
      </PageHeader>

      <Container
        maxWidth="md"
        sx={{ textAlign: `center`, pb: 5 }}
        component="main"
      >
        {!address ? (
          <Button
            onClick={() => {
              dispatch(setIsWalletPopupOpen(true));
            }}
            fullWidth
            variant="contained"
            color="primary"
          >
            Connect Wallet
          </Button>
        ) : proxy && (fetchingSwaps || recoveringSwaps) ? (
          <Box sx={{ width: `100%` }}>
            <LinearProgress />
          </Box>
        ) : (
          <MySwapsTable swapConfigurations={mySwaps}></MySwapsTable>
        )}
      </Container>
    </>
  );
}
