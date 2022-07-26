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
import PublicSwapsTable from '@/components/Tables/PublicSwapsTable';
import { ellipseAddress } from '@/redux/helpers/utilities';
import {
  setIsShareSwapPopupOpen,
  setIsManageSwapPopupOpen,
  setIsWalletPopupOpen,
} from '@/redux/slices/applicationSlice';
import { getAccountSwaps } from '@/redux/slices/walletConnectSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { Box, Button, Container, LinearProgress } from '@mui/material';
import {
  ALGOEXPLORER_INDEXER_URL,
  MY_SWAPS_PAGE_HEADER_ID,
} from '@/common/constants';
import axios from 'axios';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { SwapConfiguration } from '@/models/Swap';
import getSwapConfigurationsForAccount from '@/utils/api/accounts/getSwapConfigurationsForAccount';

export default function PublicSwaps() {
  const fetchingSwaps = useAppSelector(
    (state) => state.walletConnect.fetchingSwaps,
  );
  const dispatch = useAppDispatch();
  const selectedManageSwap = useAppSelector(
    (state) => state.application.selectedManageSwap,
  );
  const chain = useAppSelector((state) => state.walletConnect.chain);
  const address = useAppSelector((state) => state.walletConnect.address);
  const isManageSwapPopupOpen = useAppSelector(
    (state) => state.application.isManageSwapPopupOpen,
  );
  const isShareSwapPopupOpen = useAppSelector(
    (state) => state.application.isShareSwapPopupOpen,
  );

  // ---------------------------------------------------------------------------

  const [nextToken, setNextToken] = useState<string | undefined>(undefined);

  const publicSwapsSearchParam = useMemo(() => {
    let searchParams = `asset-id=100256867&limit=10&exclude=all`;

    if (nextToken) {
      searchParams += `&next=${nextToken}`;
    }

    return `${ALGOEXPLORER_INDEXER_URL(chain)}/v2/accounts?${searchParams}`;
  }, [chain, nextToken]);

  const { data } = useSWR(publicSwapsSearchParam, async (url: string) => {
    const res = await axios.get(url);
    const data = res.data;

    const addresses: string[] = data.accounts
      .filter(
        (account: { address: string }) =>
          account.address !==
          `SUF5OEJIPBSBYELHBPOXWR3GH5T2J5Y7XHW5K6L3BJ2FEQ4A6XQZVNN4UM`,
      )
      .map((account: { address: string }) => account.address);

    const publicSwaps: SwapConfiguration[] = [];

    await Promise.all(
      addresses.map((address, i) => {
        return new Promise<void>((resolve) => {
          setTimeout(async () => {
            try {
              const swapConfigurationsForProxy =
                await getSwapConfigurationsForAccount(chain, address);
              publicSwaps.push(...swapConfigurationsForProxy);
            } catch (error) {}
            resolve();
          }, 50 * i);
        });
      }),
    );

    return publicSwaps;
  });

  return (
    <>
      <ManageSwapDialog
        open={isManageSwapPopupOpen}
        onClose={() => {
          dispatch(setIsManageSwapPopupOpen(false));
          dispatch(getAccountSwaps({ chain, address }));
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
        title="📣 Public Swaps"
        description="Browse available public swap listings"
      />

      <Container
        maxWidth="lg"
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
        ) : fetchingSwaps ? (
          <Box sx={{ width: `100%` }}>
            <LinearProgress />
          </Box>
        ) : (
          <PublicSwapsTable swapConfigurations={data ?? []} />
        )}
      </Container>
    </>
  );
}
