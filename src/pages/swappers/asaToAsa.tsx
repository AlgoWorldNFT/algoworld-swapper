import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import ToSwapCard from '@/components/Cards/ToSwapCard';
import FromSwapCard from '@/components/Cards/FromSwapCard';
import ParticlesContainer from '@/components/Misc/ParticlesContainer';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { accountExists, getAccountInfo, getLogicSign } from '@/utils/accounts';
import { useContext, useState } from 'react';
import { ConnectContext } from '@/redux/store/connector';
import {
  getAsaToAsaInitSwapStxns,
  getCompiledSwap,
  getCompiledSwapProxy,
  getStoreSwapConfigurationTxns,
  getSwapDepositTxns,
  storeSwapConfiguration,
} from '@/utils/swapper';
import { apiSubmitTransactions } from '@/utils/assets';
import { SWAP_PROXY_VERSION } from '@/common/constants';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { useAsync } from 'react-use';
import { LogicSigAccount } from 'algosdk/dist/types/src/logicsig';
import ConfirmDialog from '@/components/Dialogs/ConfirmDialog';
import LoadingBackdrop from '@/components/Backdrops/Backdrop';
import ShareDialog from '@/components/Dialogs/ShareDialog';

export default function AsaToAsa() {
  const [confirmSwapDialogOpen, setConfirmSwapDialogOpen] =
    useState<boolean>(false);

  const [shareSwapDialogOpen, setShareSwapDialogOpen] =
    useState<boolean>(false);

  const offeringAssets = useAppSelector(
    (state) => state.walletConnect.selectedOfferingAssets,
  );

  const requestingAssets = useAppSelector(
    (state) => state.walletConnect.selectedRequestingAssets,
  );

  const [selectedSwapConfiguration, setSelectedSwapConfiguration] = useState<
    SwapConfiguration | undefined
  >(undefined);

  const [escrow, setEscrow] = useState<LogicSigAccount | undefined>(undefined);
  const [swapInitTx, setSwapInitTx] = useState<string | undefined>(undefined);
  const [proxyStoreTx, setProxyStoreTx] = useState<string | undefined>(
    undefined,
  );
  const [swapDepositTx, setSwapDepositTx] = useState<string | undefined>(
    undefined,
  );

  const connector = useContext(ConnectContext);
  const address = useAppSelector((state) => state.walletConnect.address);
  const chain = useAppSelector((state) => state.walletConnect.chain);

  const dispatch = useAppDispatch();

  const createSwapState = useAsync(async () => {
    if (!escrow) {
      return;
    }

    const offeringAsset = offeringAssets[0];
    const requestingAsset = requestingAssets[0];

    const fundingFee = Math.round((0.1 + 0.1 + 0.01) * 1e6);

    const stxns = await getAsaToAsaInitSwapStxns(
      chain,
      address,
      connector,
      escrow,
      fundingFee,
      offeringAsset,
    );

    const initSwapResponse = await apiSubmitTransactions(chain, stxns);
    setSwapInitTx(initSwapResponse.txId);

    const compiledSwapProxy = await getCompiledSwapProxy({
      swap_creator: address,
      version: SWAP_PROXY_VERSION,
    });
    const proxyData = await compiledSwapProxy.data;
    const proxyLsig = getLogicSign(proxyData[`result`]);
    const proxyExists = await accountExists(chain, proxyLsig.address());

    const cidResponse = await storeSwapConfiguration({
      //TODO: make sure entire array is passed
      version: SWAP_PROXY_VERSION,
      type: SwapType.ASA_TO_ASA,
      offering: [offeringAsset],
      requesting: [requestingAsset],
      creator: address,
      escrow: proxyLsig.address(),
    } as SwapConfiguration);
    const cidData = await cidResponse.data;

    const proxyStxns = await getStoreSwapConfigurationTxns(
      chain,
      address,
      connector,
      proxyLsig,
      proxyExists ? 10_000 : 110_000,
      cidData,
    );

    const proxyStoreResponse = await apiSubmitTransactions(chain, proxyStxns);
    setProxyStoreTx(proxyStoreResponse.txId);
  }, [escrow]);

  const escrowAccountInfoState = useAsync(async () => {
    if (!escrow || !swapInitTx) {
      return undefined;
    }

    return await getAccountInfo(chain, escrow.address());
  }, [chain, escrow, swapInitTx]);

  const depositSwapState = useAsync(async () => {
    if (
      !escrow ||
      !proxyStoreTx ||
      !swapInitTx ||
      escrowAccountInfoState.error ||
      escrowAccountInfoState.loading ||
      !escrowAccountInfoState.value
    ) {
      return;
    }

    const escrowAccountInfo = escrowAccountInfoState.value;
    const offeringAsset = offeringAssets[0];

    if (
      (`assets` in escrowAccountInfo &&
        escrowAccountInfo[`assets`].length === 0) ||
      (escrowAccountInfo[`assets`].length > 0 &&
        escrowAccountInfo[`assets`][0].amount > 0)
    ) {
      return;
    }

    const fundingFee = Math.round((0.1 + 0.1 + 0.01) * 1e6);

    const depositStxns = await getSwapDepositTxns(
      chain,
      address,
      connector,
      escrow,
      offeringAsset,
      fundingFee,
    );

    const swapDepositResponse = await apiSubmitTransactions(
      chain,
      depositStxns,
    );
    setSwapDepositTx(swapDepositResponse.txId);
    setShareSwapDialogOpen(true);
  }, [escrow, escrowAccountInfoState, proxyStoreTx, swapInitTx]);

  const handleSwap = async () => {
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
    const escrowLsig = getLogicSign(data[`result`]);

    setEscrow(escrowLsig);
    setSelectedSwapConfiguration({
      version: SWAP_PROXY_VERSION,
      type: SwapType.ASA_TO_ASA,
      offering: [offeringAsset],
      requesting: [requestingAsset],
      creator: address,
      escrow: escrowLsig.address(),
    } as SwapConfiguration);
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
                      requestingAssets.length === 0
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
        setOpen={setShareSwapDialogOpen}
        onConfirm={() => {
          setShareSwapDialogOpen(false);
        }} // TODO: Add dynamci fee calculation
      >
        {`Success - Your swap ${selectedSwapConfiguration?.escrow} ${swapDepositTx} has been created!`}
      </ShareDialog>

      <LoadingBackdrop
        open={createSwapState.loading || depositSwapState.loading}
      />
    </div>
  );
}
