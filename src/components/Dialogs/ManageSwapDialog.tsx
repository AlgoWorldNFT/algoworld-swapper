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
import { connector } from '@/redux/store/connector';
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
} from '@mui/material';
import { LogicSigAccount } from 'algosdk';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import ViewOnAlgoExplorerButton from '../Buttons/ViewOnAlgoExplorerButton';
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

type Props = {
  open: boolean;
  onClose: () => void;
  onShare: () => void;
};

const ManageSwapDialog = ({ open, onClose, onShare }: Props) => {
  const selectedManageSwap = useAppSelector(
    (state) => state.application.selectedManageSwap,
  );
  const chain = useAppSelector((state) => state.walletConnect.chain);
  const existingSwaps = useAppSelector((state) => state.walletConnect.swaps);
  const proxy = useAppSelector((state) => state.walletConnect.proxy);

  const { enqueueSnackbar } = useSnackbar();
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const swapAssetsState = useAsync(async () => {
    if (!selectedManageSwap) {
      return undefined;
    }

    return await getAssetsForAccount(chain, selectedManageSwap.escrow);
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
    enqueueSnackbar(SIGN_DEPOSIT_TXN_MESSAGE, {
      variant: `info`,
    });

    const swapDepositTxns = await createSwapDepositTxns(
      chain,
      selectedManageSwap.creator,
      escrow,
      selectedManageSwap.offering,
      ASA_TO_ASA_FUNDING_FEE,
    );

    const signedSwapDepositTxns = await connector
      .signTransactions(swapDepositTxns)
      .catch(() => {
        setDepositLoading(false);
        enqueueSnackbar(TXN_SIGNING_CANCELLED_MESSAGE, {
          variant: `error`,
        });
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
      enqueueSnackbar(TXN_SUBMISSION_FAILED_MESSAGE, {
        variant: `error`,
      });
      return;
    }

    enqueueSnackbar(SWAP_DEPOSIT_PERFORMED_MESSAGE, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton chain={chain} txId={depositTxnId} />
      ),
    });

    setDepositLoading(false);
    return;
  };

  const manageDeleteSwap = async () => {
    if (!selectedManageSwap || !escrow) {
      return;
    }
    setDeleteLoading(true);
    enqueueSnackbar(
      `Open your wallet to sign the delete transaction 1 of 2...`,
      {
        variant: `info`,
      },
    );

    const swapDeactivateTxns = await createSwapDeactivateTxns(
      chain,
      selectedManageSwap.creator,
      escrow,
      selectedManageSwap.offering,
    );

    const signedSwapDeactivateTxns = await connector
      .signTransactions(swapDeactivateTxns)
      .catch(() => {
        setDeleteLoading(false);
        enqueueSnackbar(TXN_SIGNING_CANCELLED_MESSAGE, {
          variant: `error`,
        });
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
      enqueueSnackbar(TXN_SUBMISSION_FAILED_MESSAGE, {
        variant: `error`,
      });
      return;
    }

    const newSwapConfigs = existingSwaps.filter((swapConfig) => {
      return swapConfig.escrow !== selectedManageSwap.escrow;
    });
    const cidResponse = await saveSwapConfigurations(newSwapConfigs);
    const cidData = await cidResponse.data;

    enqueueSnackbar(
      `Open your wallet to sign the delete transaction 2 of 2...`,
      {
        variant: `info`,
      },
    );

    const saveSwapConfigTxns = await createSaveSwapConfigTxns(
      chain,
      selectedManageSwap.creator,
      proxy,
      (await accountExists(chain, proxy.address())) ? 10_000 : 110_000,
      cidData,
    );

    const signedSaveSwapConfigTxns = await connector
      .signTransactions(saveSwapConfigTxns)
      .catch(() => {
        setDeleteLoading(false);
        enqueueSnackbar(TXN_SIGNING_CANCELLED_MESSAGE, {
          variant: `error`,
        });
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
      enqueueSnackbar(TXN_SUBMISSION_FAILED_MESSAGE, {
        variant: `error`,
      });
      return;
    }

    enqueueSnackbar(SWAP_REMOVED_FROM_PROXY_MESSAGE, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton
          chain={chain}
          txId={saveSwapConfigResponseTxn}
        />
      ),
    });

    enqueueSnackbar(SWAP_DEACTIVATION_PERFORMED_MESSAGE, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton chain={chain} txId={deactivateTxnId} />
      ),
    });

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
        {swapZeroBalanceAssets.length > 0 && swapAlgoBalance > 0 && (
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
