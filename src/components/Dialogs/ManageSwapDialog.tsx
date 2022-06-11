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

import { ASA_TO_ASA_FUNDING_FEE } from '@/common/constants';
import { connector } from '@/redux/store/connector';
import { useAppSelector } from '@/redux/store/hooks';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import createSwapDepositTxns from '@/utils/api/swaps/createSwapDepositTxns';
import LoadingButton from '@mui/lab/LoadingButton';
import signTransactions from '@/utils/api/transactions/signTransactions';
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
    enqueueSnackbar(`Open your wallet to sign the deposit transactions...`, {
      variant: `info`,
    });

    const swapDepositTxns = await createSwapDepositTxns(
      chain,
      selectedManageSwap.creator,
      connector,
      escrow,
      selectedManageSwap.offering,
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

    const depositTxnId = signedSwapDepositResponse.txId;
    enqueueSnackbar(`Deposit of offering asset performed...`, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton chain={chain} txId={depositTxnId} />
      ),
    });

    setDepositLoading(false);
    return depositTxnId;
  };

  const manageDeleteSwap = async () => {
    if (!selectedManageSwap || !escrow) {
      return;
    }
    setDeleteLoading(true);
    enqueueSnackbar(`Open your wallet to sign the delete transactions...`, {
      variant: `info`,
    });

    const swapDeactivateTxns = await createSwapDeactivateTxns(
      chain,
      selectedManageSwap.creator,
      connector,
      escrow,
      selectedManageSwap.offering,
    );

    const signedSwapDeactivateTxns = await signTransactions(
      swapDeactivateTxns,
      connector,
    );

    const signedSwapDeactivateResponse = await submitTransactions(
      chain,
      signedSwapDeactivateTxns,
    );

    const newSwapConfigs = existingSwaps.filter((swapConfig) => {
      return swapConfig.escrow !== selectedManageSwap.escrow;
    });
    const cidResponse = await saveSwapConfigurations(newSwapConfigs);
    const cidData = await cidResponse.data;

    const saveSwapConfigTxns = await createSaveSwapConfigTxns(
      chain,
      selectedManageSwap.creator,
      connector,
      proxy,
      (await accountExists(chain, proxy.address())) ? 10_000 : 110_000,
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
    enqueueSnackbar(`Swap removed from proxy configuration...`, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton
          chain={chain}
          txId={saveSwapConfigResponse.txId}
        />
      ),
    });

    const deactivateTxnId = signedSwapDeactivateResponse.txId;
    enqueueSnackbar(`Deactivation of swap performed...`, {
      variant: `success`,
      action: () => (
        <ViewOnAlgoExplorerButton
          chain={chain}
          txId={signedSwapDeactivateResponse.txId}
        />
      ),
    });

    setDeleteLoading(false);
    return deactivateTxnId;
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
              sx={{ mb: 1.5, fontWeight: `bold` }}
              color="text.secondary"
            >
              Status: {swapZeroBalanceAssets.length > 0 ? `Disabled` : `Active`}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <AssetsTable
              assets={[
                ...selectedManageSwap.offering,
                ...selectedManageSwap.requesting,
              ]}
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
