import PerformSwapAssetsViewCard, {
  PerformSwapCardType,
} from '@/components/Cards/PerformSwapAssetsViewCard';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import loadSwapConfigurations from '@/utils/api/swaps/loadSwapConfigurations';
import swapExists from '@/utils/api/swaps/swapExists';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useAsync } from 'react-use';

const PerformSwap = () => {
  const router = useRouter();
  const { proxy, escrow } = router.query;
  const chain = useAppSelector((state) => state.walletConnect.chain);
  const address = useAppSelector((state) => state.walletConnect.address);

  const dispatch = useAppDispatch();

  const swapConfigsState = useAsync(async () => {
    return await loadSwapConfigurations(chain, proxy as string);
  }, []);

  const performSwapPageContent = useMemo(() => {
    if (swapConfigsState.loading) {
      return undefined;
    }

    if (swapConfigsState.error) {
      console.log(swapConfigsState.error);
      return <Typography>Unable to load swap configuration... </Typography>;
    }

    console.log(swapConfigsState.value);
    const swapConfigurations = swapConfigsState.value ?? [];
    console.log(swapConfigurations + `heehehe`);

    const swapConfigExists = swapExists(escrow as string, swapConfigurations);

    if (swapConfigExists) {
      const swapConfiguration = swapConfigurations.filter(
        (config) => config.escrow === escrow,
      )[0];
      console.log(`exists` + swapConfiguration);
      return (
        <Container maxWidth="sm" sx={{ textAlign: `center` }} component="main">
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <PerformSwapAssetsViewCard
                title="You receive"
                type={PerformSwapCardType.Offering}
                assets={swapConfiguration.offering}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <PerformSwapAssetsViewCard
                title="You provide"
                type={PerformSwapCardType.Requesting}
                assets={swapConfiguration.requesting}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack justifyContent={`center`} direction={`column`}>
                {address ? (
                  <LoadingButton
                    disabled={
                      swapConfiguration.offering.length === 0 ||
                      swapConfiguration.requesting.length === 0
                    }
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Perform Swap
                  </LoadingButton>
                ) : (
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
                )}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      );
    } else {
      return <Typography>Swap is deactivated...</Typography>;
    }
  }, [
    address,
    dispatch,
    escrow,
    swapConfigsState.error,
    swapConfigsState.loading,
    swapConfigsState.value,
  ]);

  return (
    <>
      <div>
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
            ⚡️ Perform Swap
          </Typography>
          <Typography
            variant="h6"
            align="left"
            color="text.secondary"
            component="p"
          >
            Perform a swap created created by other AlgoWorld Swapper users.
            Completing the swap will transfer your requested asset directly to
            swap creator, and you will receive the offering asset from the
            swap&apos;s escrow account.
          </Typography>
        </Container>
        {/* End hero unit */}
      </div>
      {swapConfigsState.loading ? `loading` : performSwapPageContent}
    </>
  );
};

export default PerformSwap;
