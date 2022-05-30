import PerformSwapAssetsViewCard, {
  PerformSwapCardType,
} from '@/components/Cards/PerformSwapAssetsViewCard';
import { SwapConfiguration } from '@/models/Swap';
import { useAppSelector } from '@/redux/store/hooks';
import loadSwapConfigurations from '@/utils/api/swaps/loadSwapConfigurations';
import swapExists from '@/utils/api/swaps/swapExists';
import { Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';

const PerformSwap = () => {
  const router = useRouter();
  const { proxy, escrow } = router.query;
  const chain = useAppSelector((state) => state.walletConnect.chain);

  const [swapConfigsState, doLoadSwapConfigs] = useAsyncFn(async () => {
    return await loadSwapConfigurations(chain, proxy as string);
  }, []);

  useEffect(() => {
    doLoadSwapConfigs();
  }, [doLoadSwapConfigs]);

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

    if (swapExists(escrow as string, swapConfigurations)) {
      const swapConfiguration = swapConfigurations.filter(
        (config) => config.escrow === escrow,
      )[0];
      console.log(`exists` + swapConfiguration);
      return (
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <PerformSwapAssetsViewCard
              title="You receive"
              type={PerformSwapCardType.Offering}
              assets={swapConfiguration.offering}
            />
          </Grid>
        </Grid>
      );
    } else {
      return <Typography>Swap is deactivated...</Typography>;
    }
  }, [
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
            swap&apos;s escrow account. Everything is performed in a single
            atomic transaction ensuring speed and safety.
          </Typography>
        </Container>
        {/* End hero unit */}
      </div>
      {swapConfigsState.loading ? `loading` : performSwapPageContent}
    </>
  );
};

export default PerformSwap;
