import ManageSwapDialog from '@/components/Dialogs/ManageSwapDialog';
import ShareSwapDialog from '@/components/Dialogs/ShareSwapDialog';
import MySwapsTable from '@/components/Tables/MySwapsTable';
import { ellipseAddress } from '@/redux/helpers/utilities';
import {
  setIsShareSwapPopupOpen,
  setIsManageSwapPopupOpen,
} from '@/redux/slices/applicationSlice';
import { getAccountSwaps } from '@/redux/slices/walletConnectSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { Container, Typography } from '@mui/material';

export default function MySwaps() {
  const swaps = useAppSelector((state) => state.walletConnect.swaps);
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
        title="Share AlgoWorld Swap"
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

      {/* Hero unit */}
      <Container
        disableGutters
        maxWidth="md"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          ⚡️ Manage existing swaps
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          component="p"
        >
          Activate, update or deactivate your existing swaps.
        </Typography>
      </Container>
      {/* End hero unit */}

      <Container maxWidth="md" sx={{ textAlign: `center` }} component="main">
        <MySwapsTable swapConfigurations={swaps}></MySwapsTable>
      </Container>
    </>
  );
}
