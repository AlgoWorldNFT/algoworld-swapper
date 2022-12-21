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

import {
  ASA_TO_ASA_FUNDING_FEE,
  TXN_SIGNING_CANCELLED_MESSAGE,
  TXN_SUBMISSION_FAILED_MESSAGE,
} from '@/common/constants';
import { useAppSelector } from '@/redux/store/hooks';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import createSwapDepositTxns from '@/utils/api/swaps/createSwapDepositTxns';
import LoadingButton from '@mui/lab/LoadingButton';
import submitTransactions from '@/utils/api/transactions/submitTransactions';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
  Link,
} from '@mui/material';
import { LogicSigAccount } from 'algosdk';

import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import createSwapDeactivateTxns from '@/utils/api/swaps/createSwapDeactivateTxns';
import accountExists from '@/utils/api/accounts/accountExists';
import createSaveSwapConfigTxns from '@/utils/api/swaps/createSaveSwapConfigTxns';
import saveSwapConfigurations from '@/utils/api/swaps/saveSwapConfigurations';
import getAssetsForAccount from '@/utils/api/accounts/getAssetsForAccount';
import { Asset } from '@/models/Asset';
import { ellipseAddress } from '@/redux/helpers/utilities';
import AssetsTable from '../Tables/AssetsTable';
import {
  SIGN_DEPOSIT_TXN_MESSAGE,
  SWAP_DEACTIVATION_PERFORMED_MESSAGE,
  SWAP_DEPOSIT_PERFORMED_MESSAGE,
  SWAP_REMOVED_FROM_PROXY_MESSAGE,
} from './constants';
import createInitSwapTxns from '@/utils/api/swaps/createInitSwapTxns';
import { SwapType } from '@/models/Swap';
import createAlgoExplorerUrl from '@/utils/createAlgoExplorerUrl';
import AlgoExplorerUrlType from '@/models/AlgoExplorerUrlType';
import processTransactions from '@/utils/api/transactions/processTransactions';
import { useWallet } from '@txnlab/use-wallet';

type Props = {
  open: boolean;
  onClose: () => void;
  onShare: () => void;
};

const ManageSwapDialog = ({ open, onClose, onShare }: Props) => {
  const selectedManageSwap = useAppSelector(
    (state) => state.application.selectedManageSwap,
  );
  const { chain, swaps, proxy, gateway } = useAppSelector(
    (state) => state.application,
  );

  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { signTransactions, activeAccount } = useWallet();
  const address = useMemo(
    () => activeAccount?.address as string,
    [activeAccount],
  );

  const swapAssetsState = useAsync(async () => {
    if (!selectedManageSwap) {
      return undefined;
    }

    return await getAssetsForAccount(chain, gateway, selectedManageSwap.escrow);
  }, [selectedManageSwap]);

  const swapAssets = useMemo(() => {
    if (swapAssetsState.loading || swapAssetsState.error) {
      return [];
    }

    return swapAssetsState.value ?? [];
  }, [swapAssetsState.error, swapAssetsState.loading, swapAssetsState.value]);

  const swapAlgoBalance = useMemo(() => {
    return swapAssets.length > 0 ? swapAssets[0].amount / 1e6 : 0;
  }, [swapAssets]);

  const swapZeroBalanceAssets = useMemo(() => {
    return swapAssets.filter(
      (asset: Asset) => asset.amount === 0 && asset.index != 0,
    );
  }, [swapAssets]);

  const escrow = useMemo(() => {
    if (!selectedManageSwap) {
      return;
    }

    return getLogicSign(selectedManageSwap.contract) as LogicSigAccount;
  }, [selectedManageSwap]);

  const manageDepositSwap = async () => {
    if (!selectedManageSwap || !escrow) {
      return;
    }
    setDepositLoading(true);
    toast.info(SIGN_DEPOSIT_TXN_MESSAGE);

    if (!(await accountExists(chain, selectedManageSwap.escrow))) {
      const initSwapTxns = await createInitSwapTxns(
        chain,
        address,
        escrow,
        ASA_TO_ASA_FUNDING_FEE *
          (selectedManageSwap.type === SwapType.ASA_TO_ASA
            ? 1
            : selectedManageSwap.offering.length),
        selectedManageSwap.offering,
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

      const initTxnId = initSwapResponse.txId || ``;
      const algoexplorerUrl = createAlgoExplorerUrl(
        chain,
        initTxnId,
        AlgoExplorerUrlType.Transaction,
      );
      if (initTxnId !== undefined) {
        toast.success(
          <>
            {`${SWAP_DEPOSIT_PERFORMED_MESSAGE}\n`}
            <Link href={algoexplorerUrl} target={`_blank`}>
              View on AlgoExplorer
            </Link>
          </>,
        );
      }
    }

    const swapDepositTxns = await createSwapDepositTxns(
      chain,
      selectedManageSwap.creator,
      escrow,
      selectedManageSwap.offering,
      ASA_TO_ASA_FUNDING_FEE,
    );

    const signedSwapDepositTxns = await processTransactions(
      swapDepositTxns,
      signTransactions,
    ).catch(() => {
      setDepositLoading(false);
      toast.error(TXN_SIGNING_CANCELLED_MESSAGE);
      return;
    });

    if (!signedSwapDepositTxns) {
      return;
    }

    const signedSwapDepositResponse = await submitTransactions(
      chain,
      signedSwapDepositTxns,
    );

    const depositTxnId = signedSwapDepositResponse.txId;
    if (!depositTxnId) {
      setDepositLoading(false);
      toast.error(TXN_SUBMISSION_FAILED_MESSAGE);
      return;
    }

    const algoexplorerUrl = createAlgoExplorerUrl(
      chain,
      depositTxnId,
      AlgoExplorerUrlType.Transaction,
    );

    toast.success(
      <>
        {`${SWAP_DEPOSIT_PERFORMED_MESSAGE}\n`}
        <Link target={`_blank`} href={algoexplorerUrl}>
          View on AlgoExplorer
        </Link>
      </>,
    );

    setDepositLoading(false);
    return;
  };

  const manageDeleteSwap = async () => {
    if (!selectedManageSwap || !escrow) {
      return;
    }
    setDeleteLoading(true);
    toast.info(`Open your wallet to sign the delete transaction 1 of 2...`);

    const swapDeactivateTxns = await createSwapDeactivateTxns(
      chain,
      selectedManageSwap.creator,
      escrow,
      selectedManageSwap.offering,
    );

    const signedSwapDeactivateTxns = await processTransactions(
      swapDeactivateTxns,
      signTransactions,
    ).catch(() => {
      setDeleteLoading(false);
      toast.error(TXN_SIGNING_CANCELLED_MESSAGE);
      return;
    });

    if (!signedSwapDeactivateTxns) {
      return;
    }

    const signedSwapDeactivateResponse = await submitTransactions(
      chain,
      signedSwapDeactivateTxns,
    );
    const deactivateTxnId = signedSwapDeactivateResponse.txId;
    if (!deactivateTxnId) {
      setDeleteLoading(false);
      toast.error(TXN_SUBMISSION_FAILED_MESSAGE);
      return;
    }

    const newSwapConfigs = swaps.filter((swapConfig) => {
      return swapConfig.escrow !== selectedManageSwap.escrow;
    });
    const cidResponse = await saveSwapConfigurations(newSwapConfigs);
    const cidData = await cidResponse.data;

    toast.info(`Open your wallet to sign the delete transaction 2 of 2...`);

    const saveSwapConfigTxns = await createSaveSwapConfigTxns(
      chain,
      selectedManageSwap.creator,
      proxy,
      (await accountExists(chain, proxy.address())) ? 10_000 : 110_000,
      cidData,
    );

    const signedSaveSwapConfigTxns = await processTransactions(
      saveSwapConfigTxns,
      signTransactions,
    ).catch(() => {
      setDeleteLoading(false);
      toast.error(TXN_SIGNING_CANCELLED_MESSAGE);
      return;
    });

    if (!signedSaveSwapConfigTxns) {
      return;
    }

    const saveSwapConfigResponse = await submitTransactions(
      chain,
      signedSaveSwapConfigTxns,
    );
    const saveSwapConfigResponseTxn = saveSwapConfigResponse.txId;
    if (!saveSwapConfigResponseTxn) {
      setDeleteLoading(false);
      toast.error(TXN_SUBMISSION_FAILED_MESSAGE);
      return;
    }

    toast.success(
      <>
        {`${SWAP_REMOVED_FROM_PROXY_MESSAGE}\n`}
        <Link
          target="_blank"
          href={createAlgoExplorerUrl(
            chain,
            saveSwapConfigResponseTxn,
            AlgoExplorerUrlType.Transaction,
          )}
        >
          View on AlgoExplorer
        </Link>
      </>,
    );

    toast.success(
      <>
        {`${SWAP_DEACTIVATION_PERFORMED_MESSAGE}\n`}
        <Link
          target="_blank"
          href={createAlgoExplorerUrl(
            chain,
            deactivateTxnId,
            AlgoExplorerUrlType.Transaction,
          )}
        >
          View on AlgoExplorer
        </Link>
      </>,
    );

    setDeleteLoading(false);
  };

  return (
    <Dialog open={open} aria-labelledby="confirm-dialog">
      {selectedManageSwap && (
        <>
          <DialogTitle>
            <Typography textAlign={`center`} variant="h5" component="div">
              {ellipseAddress(selectedManageSwap?.escrow)}
            </Typography>
            <Typography
              textAlign={`center`}
              sx={{ fontWeight: `bold` }}
              color="text.secondary"
            >
              Balance: {swapAlgoBalance} Algos
            </Typography>

            <Typography
              textAlign={`center`}
              sx={{ fontWeight: `bold` }}
              color="text.secondary"
            >
              Status: {swapZeroBalanceAssets.length > 0 ? `Disabled` : `Active`}
            </Typography>

            <Typography
              textAlign={`center`}
              sx={{ mb: 1.5, fontWeight: `bold` }}
              color="text.secondary"
            >
              Type: {selectedManageSwap.isPublic ? `Public` : `Private`}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <AssetsTable
              assets={[
                ...selectedManageSwap.offering,
                ...selectedManageSwap.requesting,
              ]}
              width={400}
              escrowAddress={selectedManageSwap.escrow}
            />
          </DialogContent>
        </>
      )}
      <Divider></Divider>
      <DialogActions>
        <Button
          disabled={depositLoading || deleteLoading}
          color="primary"
          onClick={() => onClose()}
        >
          Close
        </Button>
        <Button
          disabled={depositLoading || deleteLoading}
          onClick={() => onShare()}
        >
          Share
        </Button>
        {swapZeroBalanceAssets.length >= 0 && swapAlgoBalance > 0 && (
          <LoadingButton
            loading={deleteLoading}
            disabled={depositLoading || deleteLoading}
            color="error"
            onClick={async () => {
              await manageDeleteSwap();
              onClose();
            }}
          >
            Delete
          </LoadingButton>
        )}
        {((swapZeroBalanceAssets.length > 0 && swapAlgoBalance > 0) ||
          swapAlgoBalance === 0) && (
          <LoadingButton
            onClick={async () => {
              await manageDepositSwap();
              onClose();
            }}
            disabled={depositLoading || deleteLoading}
            loading={depositLoading}
            color="info"
          >
            Activate
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ManageSwapDialog;
