import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import ToSwapCard from '@/components/Cards/ToSwapCard';
import FromSwapCard from '@/components/Cards/FromSwapCard';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';

import { useContext, useMemo, useState } from 'react';
import { ConnectContext } from '@/redux/store/connector';

import {
  ASA_TO_ASA_FUNDING_FEE,
  SWAP_PROXY_VERSION,
  TXN_SIGNING_CANCELLED_MESSAGE,
} from '@/common/constants';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { useAsync } from 'react-use';
import { LogicSigAccount } from 'algosdk/dist/types/src/logicsig';
import ConfirmDialog from '@/components/Dialogs/ConfirmDialog';
import getCompiledSwap from '@/utils/api/swaps/getCompiledSwap';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import swapExists from '@/utils/api/swaps/swapExists';
import accountExists from '@/utils/api/accounts/accountExists';
import { ellipseAddress } from '@/redux/helpers/utilities';
import createInitSwapTxns from '@/utils/api/swaps/createInitSwapTxns';
import signTransactions from '@/utils/api/transactions/signTransactions';
import submitTransactions from '@/utils/api/transactions/submitTransactions';
import { Asset } from '@/models/Asset';
import createSaveSwapConfigTxns from '@/utils/api/swaps/createSaveSwapConfigTxns';
import saveSwapConfigurations from '@/utils/api/swaps/saveSwapConfigurations';
import createSwapDepositTxns from '@/utils/api/swaps/createSwapDepositTxns';
import { useSnackbar } from 'notistack';
import {
  getAccountSwaps,
  setOfferingAssets,
  setRequestingAssets,
} from '@/redux/slices/walletConnectSlice';
import ViewOnAlgoExplorerButton from '@/components/Buttons/ViewOnAlgoExplorerButton';
import ShareSwapDialog from '@/components/Dialogs/ShareSwapDialog';
import { LoadingButton } from '@mui/lab';
import useLoadingIndicator from '@/redux/hooks/useLoadingIndicator';

export default function AsaToAsa() {
  const [confirmSwapDialogOpen, setConfirmSwapDialogOpen] =
    useState<boolean>(false);

  const [shareSwapDialogOpen, setShareSwapDialogOpen] =
    useState<boolean>(false);

  const connector = useContext(ConnectContext);
  const proxy = useAppSelector((state) => state.walletConnect.proxy);
  const offeringAssets = useAppSelector(
    (state) => state.walletConnect.selectedOfferingAssets,
  );
  const requestingAssets = useAppSelector(
    (state) => state.walletConnect.selectedRequestingAssets,
  );
  const existingSwaps = useAppSelector((state) => state.walletConnect.swaps);
  const address = useAppSelector((state) => state.walletConnect.address);
  const chain = useAppSelector((state) => state.walletConnect.chain);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const { setLoading, resetLoading } = useLoadingIndicator();

  const escrowState = useAsync(async () => {
    if (offeringAssets.length === 0 && requestingAssets.length === 0) {
      return;
    }

    const offeringAsset = offeringAssets[0];
    const requestingAsset = requestingAssets[0];

    console.log(offeringAsset);

    const response = await getCompiledSwap({
      creator_address: address,
      offered_asa_id: offeringAsset.index,
      offered_asa_amount: offeringAsset.offeringAmount,
      requested_asa_id: requestingAsset.index,
      requested_asa_amount: requestingAsset.requestingAmount,
    });

    const data = await response.data;
    const logicSig = getLogicSign(data[`result`]);
    return { logicSig, compiledProgram: data[`result`] };
  }, [address, offeringAssets, requestingAssets]);

  const swapConfiguration = useMemo(() => {
    if (
      offeringAssets.length !== 1 ||
      requestingAssets.length !== 1 ||
      escrowState.loading ||
      escrowState.error ||
      !escrowState.value
    ) {
      return undefined;
    }

    const escrow = escrowState.value.logicSig as LogicSigAccount;
    const offeringAsset = offeringAssets[0];
    const requestingAsset = requestingAssets[0];

    return {
      version: SWAP_PROXY_VERSION,
      type: SwapType.ASA_TO_ASA,
      offering: [offeringAsset],
      requesting: [requestingAsset],
      creator: address,
      escrow: escrow.address(),
      contract: escrowState.value.compiledProgram,
      proxy: proxy.address(),
    } as SwapConfiguration;
  }, [
    address,
    proxy,
    escrowState.error,
    escrowState.loading,
    escrowState.value,
    offeringAssets,
    requestingAssets,
  ]);

  const signAndSendSwapInitTxns = async (escrow: LogicSigAccount) => {
    const offeringAsset = offeringAssets[0];
    const initSwapTxns = await createInitSwapTxns(
      chain,
      address,
      connector,
      escrow,
      ASA_TO_ASA_FUNDING_FEE,
      offeringAsset,
    );

    const signedInitSwapTxns = await signTransactions(
      initSwapTxns,
      connector,
    ).catch(() => {
      enqueueSnackbar(TXN_SIGNING_CANCELLED_MESSAGE, {
        variant: `error`,
      });
      return undefined;
    });

    if (!signedInitSwapTxns) {
      return undefined;
    }

    const initSwapResponse = await submitTransactions(
      chain,
      signedInitSwapTxns,
    );

    return initSwapResponse.txId;
  };

  const signAndSendSaveSwapConfigTxns = async (
    proxy: LogicSigAccount,
    swapConfiguration: SwapConfiguration,
  ) => {
    const cidResponse = await saveSwapConfigurations([
      ...existingSwaps,
      swapConfiguration,
    ]);
    const cidData = await cidResponse.data;

    const saveSwapConfigTxns = await createSaveSwapConfigTxns(
      chain,
      address,
      connector,
      proxy,
      (await accountExists(chain, proxy.address())) ? 10_000 : 110_000,
      cidData,
    );
    const signedSaveSwapConfigTxns = await signTransactions(
      saveSwapConfigTxns,
      connector,
    ).catch(() => {
      enqueueSnackbar(TXN_SIGNING_CANCELLED_MESSAGE, {
        variant: `error`,
      });
      return undefined;
    });

    if (!signedSaveSwapConfigTxns) {
      return undefined;
    }

    const saveSwapConfigResponse = await submitTransactions(
      chain,
      signedSaveSwapConfigTxns,
    );

    return saveSwapConfigResponse.txId;
  };

  const signAndSendDepositSwapAssetTxns = async (
    escrow: LogicSigAccount,
    offeringAsset: Asset,
  ) => {
    const swapDepositTxns = await createSwapDepositTxns(
      chain,
      address,
      connector,
      escrow,
      offeringAsset,
      ASA_TO_ASA_FUNDING_FEE,
    );

    const signedSwapDepositTxns = await signTransactions(
      swapDepositTxns,
      connector,
    ).catch(() => {
      enqueueSnackbar(TXN_SIGNING_CANCELLED_MESSAGE, {
        variant: `error`,
      });
      return undefined;
    });

    if (!signedSwapDepositTxns) {
      return undefined;
    }

    const signedSwapDepositResponse = await submitTransactions(
      chain,
      signedSwapDepositTxns,
    );

    return signedSwapDepositResponse.txId;
  };

  const handleDepositSwap = async () => {
    if (escrowState.error || !escrowState.value) {
      resetLoading();
      return;
    }
    const escrow = escrowState.value.logicSig as LogicSigAccount;

    setLoading(
      `Setting up swap, please sign transaction to deposit offering asset and activate swap...`,
    );

    const depositTxnId = await signAndSendDepositSwapAssetTxns(
      escrow,
      offeringAssets[0],
    );
    if (!depositTxnId) {
      resetLoading();
      return;
    }

    enqueueSnackbar(`Deposit of offering asset performed...`, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton chain={chain} txId={depositTxnId} />
      ),
    });

    resetLoading();
    setShareSwapDialogOpen(true);
  };

  const handleStoreConfiguration = async () => {
    if (!swapConfiguration) {
      return;
    }

    setLoading(
      `Setting up swap, please sign transactions to store your new swap configuration...`,
    );

    const saveSwapTxnId = await signAndSendSaveSwapConfigTxns(
      proxy,
      swapConfiguration,
    );
    if (!saveSwapTxnId) {
      resetLoading();
      return;
    }

    enqueueSnackbar(`New swap configuration saved...`, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton chain={chain} txId={saveSwapTxnId} />
      ),
    });
  };

  const handleSwap = async () => {
    setLoading(`Setting up swap, please sign initialization transactions...`);

    if (escrowState.error || !escrowState.value) {
      resetLoading();
      return;
    }
    const escrow = escrowState.value.logicSig as LogicSigAccount;

    if (await accountExists(chain, escrow.address())) {
      if (!swapExists(escrow.address(), existingSwaps) && swapConfiguration) {
        await handleStoreConfiguration();
      }

      await handleDepositSwap();
      return;
    }

    const swapInitTxnId = await signAndSendSwapInitTxns(escrow);
    if (!swapInitTxnId) {
      resetLoading();
      return;
    }

    enqueueSnackbar(`Swap initiation transactions signed...`, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton chain={chain} txId={swapInitTxnId} />
      ),
    });

    if (!swapExists(escrow.address(), existingSwaps) && swapConfiguration) {
      await handleStoreConfiguration();
    }

    await handleDepositSwap();
  };

  const resetStates = () => {
    dispatch(getAccountSwaps({ chain, address }));
    setConfirmSwapDialogOpen(false);
    setShareSwapDialogOpen(false);
    resetLoading();
    dispatch(setOfferingAssets([]));
    dispatch(setRequestingAssets([]));
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
            🎴 ASA to ASA Swap
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            component="p"
          >
            Create a safe atomic swap powered by Algorand Smart Signatures.
            Currently supports ASA to ASA and multi ASA to Algo swaps. Choose
            and click on the required swap type below.
          </Typography>
        </Container>
        {/* End hero unit */}
        <Container maxWidth="sm" sx={{ textAlign: `center` }} component="main">
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <FromSwapCard cardTitle="From" maxAssets={1} />
            </Grid>

            <Grid item md={6} xs={12}>
              <ToSwapCard cardTitle="To" maxAssets={1} />
            </Grid>

            <Grid item xs={12}>
              <Stack justifyContent={`center`} direction={`column`}>
                {address ? (
                  <LoadingButton
                    disabled={
                      offeringAssets.length === 0 ||
                      requestingAssets.length === 0
                    }
                    loading={escrowState.loading}
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setConfirmSwapDialogOpen(true);
                    }}
                  >
                    Swap
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
      </div>

      <ConfirmDialog
        title="Setup AlgoWorld Swap"
        open={confirmSwapDialogOpen}
        setOpen={setConfirmSwapDialogOpen}
        onConfirm={handleSwap} // TODO: Add dynamci fee calculation
      >
        A swapper escrow contract will be created, a fixed fee of 0.21 algos
        will be charged to fund the wallet and your offering asa will be then
        deposited to the escrow. Press confirm to proceed.
      </ConfirmDialog>

      <ShareSwapDialog
        title="Share AlgoWorld Swap"
        open={shareSwapDialogOpen}
        swapConfiguration={swapConfiguration}
        setOpen={setShareSwapDialogOpen}
        onClose={() => {
          resetStates();
        }}
        onConfirm={() => {
          resetStates();
        }}
      >
        {`Success! Your swap ${ellipseAddress(
          swapConfiguration?.escrow,
        )} is initialized!`}
      </ShareSwapDialog>
    </>
  );
}
