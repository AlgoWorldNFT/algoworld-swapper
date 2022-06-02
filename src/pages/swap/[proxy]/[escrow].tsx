import ViewOnAlgoExplorerButton from '@/components/Buttons/ViewOnAlgoExplorerButton';
import ConfirmDialog from '@/components/Dialogs/ConfirmDialog';
import ShareSwapDialog from '@/components/Dialogs/ShareSwapDialog';
import AssetListView from '@/components/Lists/AssetListView';
import { SwapConfiguration } from '@/models/Swap';
import { ellipseAddress } from '@/redux/helpers/utilities';
import useLoadingIndicator from '@/redux/hooks/useLoadingIndicator';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { connector } from '@/redux/store/connector';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import createPerformSwapTxns from '@/utils/api/swaps/createPerformSwapTxns';
import loadSwapConfigurations from '@/utils/api/swaps/loadSwapConfigurations';
import signTransactions from '@/utils/api/transactions/signTransactions';
import submitTransactions from '@/utils/api/transactions/submitTransactions';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { LogicSigAccount } from 'algosdk';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useAsyncRetry } from 'react-use';

const PerformSwap = () => {
  const router = useRouter();
  const { proxy, escrow } = router.query;
  const chain = useAppSelector((state) => state.walletConnect.chain);
  const address = useAppSelector((state) => state.walletConnect.address);

  const [confirmSwapDialogOpen, setConfirmSwapDialogOpen] =
    useState<boolean>(false);
  const [shareSwapDialogOpen, setShareSwapDialogOpen] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { setLoading, resetLoading } = useLoadingIndicator();

  const swapConfigsState = useAsyncRetry(async () => {
    return await loadSwapConfigurations(chain, proxy as string);
  }, [proxy]);

  const swapConfiguration = useMemo(() => {
    if (swapConfigsState.loading || swapConfigsState.error) return;

    console.log(swapConfigsState.value);
    const allConfigs = swapConfigsState.value ?? [];

    return allConfigs.filter((config) => config.escrow === escrow)[0];
  }, [
    swapConfigsState.loading,
    swapConfigsState.error,
    swapConfigsState.value,
    escrow,
  ]);

  const escrowAccount = useMemo(() => {
    if (!swapConfiguration) return;
    return getLogicSign(swapConfiguration.contract);
  }, [swapConfiguration]);

  const errorLabelsContent = useMemo(() => {
    if (swapConfiguration && address) {
      if (swapConfiguration.creator === address) {
        return (
          <Typography variant="h6" color={`warning.main`}>
            You can not perform the swap since you are the creator...
          </Typography>
        );
      } else {
        return (
          <LoadingButton
            disabled={
              swapConfiguration.offering.length === 0 ||
              swapConfiguration.requesting.length === 0
            }
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              setConfirmSwapDialogOpen(true);
            }}
          >
            Perform Swap
          </LoadingButton>
        );
      }
    } else if (swapConfigsState.loading) {
      return (
        <Typography color={`info.main`}>Loading, please wait...</Typography>
      );
    } else if (swapConfigsState.error) {
      return (
        <Typography color={`error.main`}>
          Swap is unavailable, creator must have deactivated it, try again
          later...
        </Typography>
      );
    }
  }, [
    address,
    swapConfigsState.error,
    swapConfigsState.loading,
    swapConfiguration,
  ]);

  const signAndSendSwapPerformTxns = async (
    swapConfiguration: SwapConfiguration,
    escrow: LogicSigAccount,
  ) => {
    const performSwapTxns = await createPerformSwapTxns(
      chain,
      address,
      connector,
      swapConfiguration.creator,
      escrow,
      swapConfiguration.offering[0],
      swapConfiguration.requesting[0],
    );

    const signedPerformSwapTxns = await signTransactions(
      performSwapTxns,
      connector,
    ).catch(() => {
      enqueueSnackbar(`You have cancelled transactions signing...`, {
        variant: `error`,
      });
      return undefined;
    });

    if (!signedPerformSwapTxns) {
      return undefined;
    }

    const performSwapResponse = await submitTransactions(
      chain,
      signedPerformSwapTxns,
    );

    return performSwapResponse.txId;
  };

  const handlePerformSwap = async () => {
    if (
      !swapConfiguration ||
      !swapConfiguration.creator ||
      !swapConfiguration.offering ||
      !swapConfiguration.requesting ||
      !escrow ||
      !escrowAccount
    )
      return;

    setLoading(`Performing swap, please sign transactions...`);

    const txId = await signAndSendSwapPerformTxns(
      swapConfiguration,
      escrowAccount,
    );

    if (!txId) {
      resetLoading();
      return;
    }

    enqueueSnackbar(`Swap performed successfully...`, {
      variant: `success`,
      action: () => <ViewOnAlgoExplorerButton chain={chain} txId={txId} />,
    });

    setShareSwapDialogOpen(true);
    resetLoading();
  };

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
      <Container maxWidth="sm" sx={{ textAlign: `center` }} component="main">
        {swapConfiguration ? (
          <>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <Card>
                  <CardHeader
                    title={`You provide`}
                    titleTypographyProps={{ align: `center` }}
                    sx={{}}
                  />
                  <CardContent>
                    <AssetListView
                      assets={swapConfiguration.requesting}
                      isOffering={false}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={6} xs={12}>
                <Card>
                  <CardHeader
                    title={`You receive`}
                    titleTypographyProps={{ align: `center` }}
                    sx={{}}
                  />
                  <CardContent>
                    <AssetListView
                      assets={swapConfiguration.offering}
                      isOffering={true}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Stack justifyContent={`center`} direction={`column`}>
                  {address ? (
                    <>{errorLabelsContent}</>
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
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                swapConfigsState.retry();
              }}
              fullWidth
              variant="contained"
              color="primary"
            >
              Click to retry loading
            </Button>
          </>
        )}
      </Container>

      <ConfirmDialog
        title="Setup AlgoWorld Swap"
        open={confirmSwapDialogOpen}
        setOpen={setConfirmSwapDialogOpen}
        onConfirm={async () => {
          await handlePerformSwap();
        }}
      >
        {`Proceeding with swap will perform transaction to send offering assets from swap's escrow to your wallet and will transfer requested asset to creator of the swap within a single atomic group. Additionally, platform charges a small 0.5 ALGO fee to keep the platform running and incentivise further development and support ❤️`}
      </ConfirmDialog>

      {swapConfiguration && (
        <ShareSwapDialog
          title="Share AlgoWorld Swap"
          open={shareSwapDialogOpen}
          swapConfiguration={swapConfiguration}
          setOpen={setShareSwapDialogOpen}
          onClose={() => {
            router.replace(`/`);
          }}
          onConfirm={() => {
            router.replace(`/`);
          }}
        >
          {`Success! Swap ${ellipseAddress(
            swapConfiguration?.escrow,
          )} was performed!`}
        </ShareSwapDialog>
      )}
    </>
  );
};

export default PerformSwap;
