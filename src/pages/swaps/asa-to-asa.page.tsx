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

import { useMemo, useState } from 'react';

import {
  ASA_TO_ASA_FUNDING_FEE,
  AWVT_ASSET_INDEX,
  GET_INCENTIVE_FEE,
  LATEST_SWAP_PROXY_VERSION,
  TXN_SIGNING_CANCELLED_MESSAGE,
  TXN_SUBMISSION_FAILED_MESSAGE,
} from '@/common/constants';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { useAsync } from 'react-use';
import ConfirmDialog from '@/components/Dialogs/ConfirmDialog';
import getCompiledSwap from '@/utils/api/swaps/getCompiledSwap';
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
import {
  getAccountAssets,
  getAccountSwaps,
  optAssets,
  setOfferingAssets,
  setRequestingAssets,
} from '@/redux/slices/applicationSlice';
import ShareSwapDialog from '@/components/Dialogs/ShareSwapDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import useLoadingIndicator from '@/redux/hooks/useLoadingIndicator';
import getAssetsToOptIn from '@/utils/api/assets/getAssetsToOptIn';
import PageHeader from '@/components/Headers/PageHeader';
import {
  ASA_TO_ASA_PAGE_HEADER_ID,
  CREATE_SWAP_BTN_ID,
} from '@/common/constants';
import { LogicSigAccount } from 'algosdk';
import { useWallet } from '@txnlab/use-wallet';
import processTransactions from '@/utils/api/transactions/processTransactions';

import { toast } from 'react-toastify';

export default function AsaToAsa() {
  const [confirmSwapDialogOpen, setConfirmSwapDialogOpen] =
    useState<boolean>(false);

  const [shareSwapDialogOpen, setShareSwapDialogOpen] =
    useState<boolean>(false);

  const { gateway, chain, proxy } = useAppSelector(
    (state) => state.application,
  );

  const { activeAddress, signTransactions } = useWallet();
  const address = useMemo(() => {
    return activeAddress || ``;
  }, [activeAddress]);

  const hasAwvt = useAppSelector((state) => state.application.hasAwvt);
  const offeringAssets = useAppSelector(
    (state) => state.application.selectedOfferingAssets,
  );
  const existingAssets = useAppSelector((state) => state.application.assets);
  const requestingAssets = useAppSelector(
    (state) => state.application.selectedRequestingAssets,
  );
  const existingSwaps = useAppSelector((state) => state.application.swaps);
  const dispatch = useAppDispatch();

  const { setLoading, resetLoading } = useLoadingIndicator();
  const [isPublicSwap, setIsPublicSwap] = useState(false);

  const escrowState = useAsync(async () => {
    if (
      offeringAssets.length === 0 ||
      requestingAssets.length === 0 ||
      !address
    ) {
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
      chain_type: chain,
      version: LATEST_SWAP_PROXY_VERSION,
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
      !proxy ||
      !escrowState.value ||
      !address
    ) {
      return undefined;
    }

    const escrow = escrowState.value.logicSig as LogicSigAccount;
    const offeringAsset = offeringAssets[0];
    const requestingAsset = requestingAssets[0];

    return {
      version: LATEST_SWAP_PROXY_VERSION,
      type: SwapType.ASA_TO_ASA,
      offering: [offeringAsset],
      requesting: [requestingAsset],
      creator: address,
      escrow: escrow.address(),
      contract: escrowState.value.compiledProgram,
      proxy: proxy.address(),
      isPublic: isPublicSwap,
    } as SwapConfiguration;
  }, [
    offeringAssets,
    requestingAssets,
    escrowState.loading,
    escrowState.error,
    escrowState.value,
    address,
    proxy,
    isPublicSwap,
  ]);

  const assetsToOptIn = useMemo(() => {
    return getAssetsToOptIn(
      [...offeringAssets, ...requestingAssets],
      existingAssets,
    );
  }, [existingAssets, offeringAssets, requestingAssets]);

  const signAndSendSwapInitTxns = async (escrow: LogicSigAccount) => {
    if (!address) {
      return undefined;
    }

    const offeringAsset = offeringAssets[0];
    const initSwapTxns = await createInitSwapTxns(
      chain,
      address,
      escrow,
      ASA_TO_ASA_FUNDING_FEE,
      [offeringAsset],
    );

    const signedInitSwapTxns = await processTransactions(
      initSwapTxns,
      signTransactions,
    ).catch(() => {
      toast.error(TXN_SIGNING_CANCELLED_MESSAGE);
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
    if (!address) {
      return undefined;
    }

    const cidData = await saveSwapConfigurations([
      ...existingSwaps,
      swapConfiguration,
    ]);

    if (cidData) {
      const saveSwapConfigTxns = await createSaveSwapConfigTxns(
        chain,
        address,
        proxy,
        (await accountExists(chain, proxy.address())) ? 10_000 : 110_000,
        cidData,
      );
      const signedSaveSwapConfigTxns = await processTransactions(
        saveSwapConfigTxns,
        signTransactions,
      ).catch(() => {
        toast.error(TXN_SIGNING_CANCELLED_MESSAGE);
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
    }
  };

  const signAndSendDepositSwapAssetTxns = async (
    escrow: LogicSigAccount,
    offeringAsset: Asset,
  ) => {
    if (!address) {
      return undefined;
    }

    const swapDepositTxns = await createSwapDepositTxns(
      chain,
      address,
      escrow,
      [offeringAsset],
      ASA_TO_ASA_FUNDING_FEE,
    );

    const signedSwapDepositTxns = await processTransactions(
      swapDepositTxns,
      signTransactions,
    ).catch(() => {
      toast.error(TXN_SIGNING_CANCELLED_MESSAGE);
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
      toast.error(TXN_SUBMISSION_FAILED_MESSAGE);
      return;
    }

    toast.success(`Deposit of offering asset performed...`);

    resetLoading();
    setShareSwapDialogOpen(true);
  };

  const handleStoreConfiguration = async () => {
    if (!swapConfiguration) {
      return;
    }

    if (!hasAwvt) {
      await dispatch(
        optAssets({
          assetIndexes: [AWVT_ASSET_INDEX(chain)],
          gateway,
          chain,
          activeAddress: address,
          signTransactions,
        }),
      );
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
      toast.error(TXN_SUBMISSION_FAILED_MESSAGE);
      return;
    }

    toast.success(`New swap configuration saved...`);
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
      toast.error(TXN_SUBMISSION_FAILED_MESSAGE);
      return;
    }

    toast.success(`Swap initiation transactions signed...`);

    if (!swapExists(escrow.address(), existingSwaps) && swapConfiguration) {
      await handleStoreConfiguration();
    }

    await handleDepositSwap();
  };

  const resetStates = () => {
    if (address) {
      dispatch(getAccountAssets({ chain, gateway, address }) as any);
      dispatch(getAccountSwaps({ chain, gateway, address }));
    }

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
          id={ASA_TO_ASA_PAGE_HEADER_ID}
          title="🎴 ASA to ASA Swap"
          description="Create a simple single ASA to ASA swap"
        />

        <Container maxWidth="sm" sx={{ textAlign: `center` }} component="main">
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <FromSwapCard
                cardTitle="You provide"
                maxAssets={1}
                disabled={escrowState.loading}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <ToSwapCard
                cardTitle="You receive"
                maxAssets={1}
                disabled={escrowState.loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack
                justifyContent={`center`}
                direction={`column`}
                sx={{ pb: 10 }}
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
                            optAssets({
                              assetIndexes: assetsToOptIn,
                              gateway,
                              chain,
                              activeAddress: address,
                              signTransactions,
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
        transactionsFee={
          0.32 +
          GET_INCENTIVE_FEE(
            swapConfiguration?.version ?? LATEST_SWAP_PROXY_VERSION,
            true,
          )
        }
        isPublicSwap={isPublicSwap}
        onSwapVisibilityChange={(newState) => {
          setIsPublicSwap(newState);
        }}
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
