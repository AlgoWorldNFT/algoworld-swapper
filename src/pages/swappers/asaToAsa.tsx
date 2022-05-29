import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import ToSwapCard from '@/components/Cards/ToSwapCard';
import FromSwapCard from '@/components/Cards/FromSwapCard';
import ParticlesContainer from '@/components/Misc/ParticlesContainer';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';

import { useContext, useMemo, useState } from 'react';
import { ConnectContext } from '@/redux/store/connector';

import { SWAP_PROXY_VERSION } from '@/common/constants';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { useAsync } from 'react-use';
import { LogicSigAccount } from 'algosdk/dist/types/src/logicsig';
import ConfirmDialog from '@/components/Dialogs/ConfirmDialog';
import LoadingBackdrop from '@/components/Backdrops/Backdrop';
import ShareDialog from '@/components/Dialogs/ShareDialog';
import getCompiledSwap from '@/utils/api/swaps/getCompiledSwap';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import swapExists from '@/utils/api/swaps/swapExists';
import { LoadingIndicators } from '@/models/LoadingIndicators';
import accountExists from '@/utils/api/accounts/accountExists';
import { ellipseAddress } from '@/redux/helpers/utilities';
import createInitSwapTxns from '@/utils/api/swaps/createInitSwapTxns';
import signTransactions from '@/utils/api/transactions/signTransactions';
import submitTransactions from '@/utils/api/transactions/submitTransactions';
import { Asset } from '@/models/Asset';
import createSaveSwapConfigTxns from '@/utils/api/swaps/createSaveSwapConfigTxns';
import saveSwapConfigurations from '@/utils/api/swaps/saveSwapConfigurations';
import getCompiledProxy from '@/utils/api/swaps/getCompiledProxy';
import createSwapDepositTxns from '@/utils/api/swaps/createSwapDepositTxns';
import { useSnackbar } from 'notistack';
import { ChainType } from '@/models/Chain';
import {
  setOfferingAssets,
  setRequestingAssets,
} from '@/redux/slices/walletConnectSlice';

const ASA_TO_ASA_FUNDING_FEE = Math.round((0.1 + 0.1 + 0.01) * 1e6);

export default function AsaToAsa() {
  const [confirmSwapDialogOpen, setConfirmSwapDialogOpen] =
    useState<boolean>(false);

  const [shareSwapDialogOpen, setShareSwapDialogOpen] =
    useState<boolean>(false);

  const [loadingIndicators, setLoadingIndicators] = useState<LoadingIndicators>(
    {
      loading: false,
      loadingText: `Loading`,
      showLoading: false,
      closeAfter: undefined,
    },
  );

  const offeringAssets = useAppSelector(
    (state) => state.walletConnect.selectedOfferingAssets,
  );

  const requestingAssets = useAppSelector(
    (state) => state.walletConnect.selectedRequestingAssets,
  );

  const { enqueueSnackbar } = useSnackbar();

  const existingSwaps = useAppSelector((state) => state.walletConnect.swaps);

  const connector = useContext(ConnectContext);
  const address = useAppSelector((state) => state.walletConnect.address);
  const chain = useAppSelector((state) => state.walletConnect.chain);

  const dispatch = useAppDispatch();

  const escrowState = useAsync(async () => {
    if (offeringAssets.length === 0 && requestingAssets.length === 0) {
      return;
    }

    const offeringAsset = offeringAssets[0];
    const requestingAsset = requestingAssets[0];

    const response = await getCompiledSwap({
      creator_address: address,
      offered_asa_id: offeringAsset.index,
      offered_asa_amount: offeringAsset.offeringAmount,
      requested_asa_id: requestingAsset.index,
      requested_asa_amount: requestingAsset.requestingAmount,
    });

    const data = await response.data;
    const logicSig = getLogicSign(data[`result`]);

    console.log({
      creator_address: address,
      offered_asa_id: offeringAsset.index,
      offered_asa_amount: offeringAsset.offeringAmount,
      requested_asa_id: requestingAsset.index,
      requested_asa_amount: requestingAsset.requestingAmount,
    });
    console.log(`escrow: ` + logicSig.address());
    return logicSig;
  }, [address, offeringAssets, requestingAssets]);

  const proxyState = useAsync(async () => {
    if (!address) {
      return;
    }

    const response = await getCompiledProxy({
      swap_creator: address,
      version: SWAP_PROXY_VERSION,
    });

    const data = await response.data;
    return getLogicSign(data[`result`]);
  }, [address]);

  const swapConfiguration = useMemo(() => {
    if (
      offeringAssets.length !== 1 ||
      requestingAssets.length !== 1 ||
      escrowState.loading ||
      escrowState.error
    ) {
      return undefined;
    }

    const escrow = escrowState.value as LogicSigAccount;
    const offeringAsset = offeringAssets[0];
    const requestingAsset = requestingAssets[0];

    return {
      version: SWAP_PROXY_VERSION,
      type: SwapType.ASA_TO_ASA,
      offering: [offeringAsset],
      requesting: [requestingAsset],
      creator: address,
      escrow: escrow.address(),
    } as SwapConfiguration;
  }, [address, escrowState, offeringAssets, requestingAssets]);

  const signAndSendSwapInitTxns = async (escrow: LogicSigAccount) => {
    const offeringAsset = offeringAssets[0];
    const initSwapTxns = await createInitSwapTxns(
      chain,
      address,
      escrow,
      ASA_TO_ASA_FUNDING_FEE,
      offeringAsset,
    );

    console.log(initSwapTxns);
    const signedInitSwapTxns = await signTransactions(initSwapTxns, connector);

    console.log(`shouldnt be here`);
    const initSwapResponse = await submitTransactions(
      chain,
      signedInitSwapTxns,
    );
    console.log(initSwapResponse);
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
      ASA_TO_ASA_FUNDING_FEE,
      cidData,
    );
    const signedSaveSwapConfigTxns = await signTransactions(
      saveSwapConfigTxns,
      connector,
    );

    const saveSwapConfigResponse = await submitTransactions(
      chain,
      signedSaveSwapConfigTxns,
    );
    console.log(saveSwapConfigResponse);
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
    );

    const signedSwapDepositResponse = await submitTransactions(
      chain,
      signedSwapDepositTxns,
    );
    console.log(signedSwapDepositResponse);
    return signedSwapDepositResponse.txId;
  };

  const handleSwap = async () => {
    setLoadingIndicators({
      loading: true,
      loadingText: `Initiating swap creation...`,
    });

    if (escrowState.error || proxyState.error) {
      setLoadingIndicators({
        loading: false,
      });
      return;
    }
    const escrow = escrowState.value as LogicSigAccount;
    const proxy = proxyState.value as LogicSigAccount;

    console.log(escrow.address());

    if (await accountExists(chain, escrow.address())) {
      setLoadingIndicators({
        loading: true,
        loadingText: `Swap already exists.`,
        closeAfter: 2000,
      });

      setShareSwapDialogOpen(true);
    }

    const swapInitTxnId = await signAndSendSwapInitTxns(escrow);

    enqueueSnackbar(`Swap initiation transactions signed...`, {
      variant: `success`,
      action: () => (
        <Button
          href={`https://${
            chain === ChainType.TestNet ? `testnet` : ``
          }.algoexplorer.io/tx/${swapInitTxnId}`}
        >
          View on AlgoExplorer
        </Button>
      ),
    });

    if (!swapExists(escrow.address(), existingSwaps) && swapConfiguration) {
      const saveSwapTxnId = await signAndSendSaveSwapConfigTxns(
        proxy,
        swapConfiguration,
      );

      enqueueSnackbar(`New swap configuration saved...`, {
        variant: `success`,
        action: () => (
          <Button
            href={`https://${
              chain === ChainType.TestNet ? `testnet` : ``
            }.algoexplorer.io/tx/${saveSwapTxnId}`}
          >
            View on AlgoExplorer
          </Button>
        ),
      });
    }

    const depositTxnId = await signAndSendDepositSwapAssetTxns(
      escrow,
      offeringAssets[0],
    );

    enqueueSnackbar(`Deposit of offering asset performed...`, {
      variant: `success`,
      action: () => (
        <Button
          href={`https://${
            chain === ChainType.TestNet ? `testnet` : ``
          }.algoexplorer.io/tx/${depositTxnId}`}
        >
          View on AlgoExplorer
        </Button>
      ),
    });

    setShareSwapDialogOpen(true);
  };

  const resetStates = () => {
    setConfirmSwapDialogOpen(false);
    setShareSwapDialogOpen(false);
    setLoadingIndicators({ loading: false });
    dispatch(setOfferingAssets([]));
    dispatch(setRequestingAssets([]));
  };

  return (
    <div>
      <ParticlesContainer />

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
            ⚡️ Create Swap
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
                  <Button
                    disabled={
                      offeringAssets.length === 0 ||
                      requestingAssets.length === 0 ||
                      escrowState.loading ||
                      proxyState.loading
                    }
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setConfirmSwapDialogOpen(true);
                    }}
                  >
                    Swap
                  </Button>
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

      <ShareDialog
        title="Share AlgoWorld Swap"
        open={shareSwapDialogOpen}
        contentToCopy={
          `https://localhost:3000/swappers/` + swapConfiguration?.escrow
        }
        setOpen={setShareSwapDialogOpen}
        onConfirm={() => {
          resetStates();
        }}
      >
        {`Success! Your swap ${ellipseAddress(
          swapConfiguration?.escrow,
        )} is initialized!`}
      </ShareDialog>

      <LoadingBackdrop
        open={loadingIndicators.loading}
        setOpen={(state) => {
          setLoadingIndicators({ ...loadingIndicators, loading: state });
        }}
        loadingText={loadingIndicators.loadingText}
        noCircularProgress={loadingIndicators.showLoading}
        closeAfter={loadingIndicators.closeAfter}
      />
    </div>
  );
}
