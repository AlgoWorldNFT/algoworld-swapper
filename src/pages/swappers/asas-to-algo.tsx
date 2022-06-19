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

import { Button, Container, Grid, Stack } from '@mui/material';
import ToSwapCard from '@/components/Cards/ToSwapCard';
import FromSwapCard from '@/components/Cards/FromSwapCard';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';

import { useContext, useMemo, useState } from 'react';
import { ConnectContext } from '@/redux/store/connector';

import {
  ASA_TO_ALGO_FUNDING_BASE_FEE,
  ASA_TO_ALGO_MAX_FEE,
  ASA_TO_ASA_FUNDING_FEE,
  SWAP_PROXY_VERSION,
  TXN_SIGNING_CANCELLED_MESSAGE,
  TXN_SUBMISSION_FAILED_MESSAGE,
} from '@/common/constants';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { useAsync } from 'react-use';
import { LogicSigAccount } from 'algosdk/dist/types/src/logicsig';
import ConfirmDialog from '@/components/Dialogs/ConfirmDialog';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import swapExists from '@/utils/api/swaps/swapExists';
import accountExists from '@/utils/api/accounts/accountExists';
import { ellipseAddress } from '@/redux/helpers/utilities';
import createInitSwapTxns from '@/utils/api/swaps/createInitSwapTxns';
import submitTransactions from '@/utils/api/transactions/submitTransactions';
import { Asset } from '@/models/Asset';
import createSaveSwapConfigTxns from '@/utils/api/swaps/createSaveSwapConfigTxns';
import saveSwapConfigurations from '@/utils/api/swaps/saveSwapConfigurations';
import createSwapDepositTxns from '@/utils/api/swaps/createSwapDepositTxns';
import { useSnackbar } from 'notistack';
import {
  getAccountAssets,
  getAccountSwaps,
  optInAssets,
  selectOfferingAssetAmounts,
  selectOfferingAssets,
  selectRequestingAssets,
  setOfferingAssets,
  setRequestingAssets,
} from '@/redux/slices/walletConnectSlice';
import ViewOnAlgoExplorerButton from '@/components/Buttons/ViewOnAlgoExplorerButton';
import ShareSwapDialog from '@/components/Dialogs/ShareSwapDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import useLoadingIndicator from '@/redux/hooks/useLoadingIndicator';
import getAssetsToOptIn from '@/utils/api/assets/getAssetsToOptIn';
import PageHeader from '@/components/Headers/PageHeader';
import { CoinType } from '@/models/CoinType';
import getCompiledMultiSwap from '@/utils/api/swaps/getCompiledMultiSwap';
import { ASAS_TO_ALGO_PAGE_HEADER_ID, CREATE_SWAP_BTN_ID } from '../_constants';

export default function MultiAsaToAlgo() {
  const [confirmSwapDialogOpen, setConfirmSwapDialogOpen] =
    useState<boolean>(false);

  const [shareSwapDialogOpen, setShareSwapDialogOpen] =
    useState<boolean>(false);

  const connector = useContext(ConnectContext);
  const proxy = useAppSelector((state) => state.walletConnect.proxy);
  const offeringAssets = useAppSelector(selectOfferingAssets);
  const offeringAssetAmounts = useAppSelector(selectOfferingAssetAmounts);
  const existingAssets = useAppSelector((state) => state.walletConnect.assets);
  const requestingAssets = useAppSelector(selectRequestingAssets);
  const existingSwaps = useAppSelector((state) => state.walletConnect.swaps);
  const address = useAppSelector((state) => state.walletConnect.address);
  const chain = useAppSelector((state) => state.walletConnect.chain);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const { setLoading, resetLoading } = useLoadingIndicator();

  const escrowState = useAsync(async () => {
    if (
      Object.keys(offeringAssetAmounts ?? {}).length === 0 ||
      requestingAssets.length === 0
    ) {
      return;
    }

    const requestingAlgoAmount = requestingAssets[0].requestingAmount;

    const response = await getCompiledMultiSwap({
      creator_address: address,
      offered_asa_amounts: offeringAssetAmounts,
      requested_algo_amount: requestingAlgoAmount,
      max_fee: ASA_TO_ALGO_MAX_FEE,
      optin_funding_amount:
        ASA_TO_ALGO_FUNDING_BASE_FEE * offeringAssets.length,
      chain_type: chain,
    });

    const data = await response.data;
    const logicSig = getLogicSign(data[`result`]);
    return { logicSig, compiledProgram: data[`result`] };
  }, [address, offeringAssetAmounts, requestingAssets]);

  const swapConfiguration = useMemo(() => {
    if (
      offeringAssets.length === 0 ||
      requestingAssets.length !== 1 ||
      escrowState.loading ||
      escrowState.error ||
      !escrowState.value
    ) {
      return undefined;
    }

    const escrow = escrowState.value.logicSig as LogicSigAccount;

    return {
      version: SWAP_PROXY_VERSION,
      type: SwapType.MULTI_ASA_TO_ALGO,
      offering: offeringAssets,
      requesting: requestingAssets,
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

  const assetsToOptIn = useMemo(() => {
    return getAssetsToOptIn(offeringAssets, existingAssets);
  }, [existingAssets, offeringAssets]);

  const signAndSendSwapInitTxns = async (escrow: LogicSigAccount) => {
    const initSwapTxns = await createInitSwapTxns(
      chain,
      address,
      escrow,
      ASA_TO_ALGO_FUNDING_BASE_FEE * offeringAssets.length,
      offeringAssets,
    );

    const signedInitSwapTxns = await connector
      .signTransactions(initSwapTxns)
      .catch(() => {
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
      proxy,
      (await accountExists(chain, proxy.address())) ? 10_000 : 110_000,
      cidData,
    );
    const signedSaveSwapConfigTxns = await connector
      .signTransactions(saveSwapConfigTxns)
      .catch(() => {
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
    offeringAssets: Asset[],
  ) => {
    const swapDepositTxns = await createSwapDepositTxns(
      chain,
      address,
      escrow,
      offeringAssets,
      ASA_TO_ASA_FUNDING_FEE,
    );

    const signedSwapDepositTxns = await connector
      .signTransactions(swapDepositTxns)
      .catch(() => {
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
      offeringAssets,
    );
    if (!depositTxnId) {
      resetLoading();
      enqueueSnackbar(TXN_SUBMISSION_FAILED_MESSAGE, {
        variant: `error`,
      });
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
      enqueueSnackbar(TXN_SUBMISSION_FAILED_MESSAGE, {
        variant: `error`,
      });
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
      enqueueSnackbar(TXN_SUBMISSION_FAILED_MESSAGE, {
        variant: `error`,
      });
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
    dispatch(getAccountAssets({ chain, address: address }) as any);
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
        <PageHeader
          id={ASAS_TO_ALGO_PAGE_HEADER_ID}
          title="🎴💰 ASAs to Algo Swap"
          description="Select up to 5 assets to offer and requesting algo amount to create a multi ASA to Algo Swap"
        />

        <Container maxWidth="sm" sx={{ textAlign: `center` }} component="main">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FromSwapCard
                cardTitle="You provide"
                maxAssets={5}
                disabled={escrowState.loading}
              />
            </Grid>

            <Grid item xs={12}>
              <ToSwapCard
                cardTitle="You receive"
                maxAssets={1}
                coinType={CoinType.ALGO}
                disabled={escrowState.loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack
                justifyContent={`center`}
                direction={`column`}
                sx={{ pb: 5 }}
              >
                {address && assetsToOptIn.length === 0 ? (
                  <LoadingButton
                    id={CREATE_SWAP_BTN_ID}
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
                    Create Swap
                  </LoadingButton>
                ) : (
                  <>
                    {address && assetsToOptIn.length > 0 ? (
                      <LoadingButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          dispatch(
                            optInAssets({
                              assetIndexes: assetsToOptIn,
                              connector,
                            }),
                          );
                        }}
                      >
                        Opt-In
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
                  </>
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
        onConfirm={handleSwap}
        transactionsFee={(
          0.11 +
          (ASA_TO_ALGO_FUNDING_BASE_FEE * offeringAssets.length) / 1e6
        ).toFixed(2)}
      >
        A swapper escrow contract will be created, a small fixed fee in algos
        will be charged to fund the wallet and your offering asa will be then
        deposited to the escrow. Press confirm to proceed.
      </ConfirmDialog>

      <ShareSwapDialog
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
