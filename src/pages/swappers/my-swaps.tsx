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
} from '@/redux/slices/applicationSlice';
import { getAccountSwaps } from '@/redux/slices/walletConnectSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { Box, Container, LinearProgress } from '@mui/material';
import { MY_SWAPS_PAGE_HEADER_ID } from '../_constants';

export default function MySwaps() {
  const swaps = useAppSelector((state) => state.walletConnect.swaps);
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
        title="📜 My Swaps"
        description="Activate, update or deactivate your existing swaps."
      />

      <Container
        maxWidth="md"
        sx={{ textAlign: `center`, pb: 5 }}
        component="main"
      >
        {fetchingSwaps ? (
          <Box sx={{ width: `100%` }}>
            <LinearProgress />
          </Box>
        ) : (
          <MySwapsTable swapConfigurations={swaps}></MySwapsTable>
        )}
      </Container>
    </>
  );
}
