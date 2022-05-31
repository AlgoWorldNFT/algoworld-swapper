import { ASA_TO_ASA_FUNDING_FEE } from '@/common/constants';
import { connector } from '@/redux/store/connector';
import { useAppSelector } from '@/redux/store/hooks';
import getAccountInfo from '@/utils/api/accounts/getAccountInfo';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import createSwapDepositTxns from '@/utils/api/swaps/createSwapDepositTxns';
import getCompiledSwap from '@/utils/api/swaps/getCompiledSwap';
import LoadingButton from '@mui/lab/LoadingButton';
import signTransactions from '@/utils/api/transactions/signTransactions';
import submitTransactions from '@/utils/api/transactions/submitTransactions';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import { LogicSigAccount } from 'algosdk';
import { useSnackbar } from 'notistack';
import { Key, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import ViewOnAlgoExplorerButton from '../Buttons/ViewOnAlgoExplorerButton';
import createSwapDeactivateTxns from '@/utils/api/swaps/createSwapDeactivateTxns';
import accountExists from '@/utils/api/accounts/accountExists';
import createSaveSwapConfigTxns from '@/utils/api/swaps/createSaveSwapConfigTxns';
import saveSwapConfigurations from '@/utils/api/swaps/saveSwapConfigurations';

type Props = {
  open: boolean;
  onClose: () => void;
  onShare: () => void;
  title?: string;
};

const ManageSwapDialog = ({
  open,
  onClose,
  onShare,
  title = `Manage Swap`,
}: Props) => {
  const selectedManageSwap = useAppSelector(
    (state) => state.application.selectedManageSwap,
  );
  const chain = useAppSelector((state) => state.walletConnect.chain);
  const existingSwaps = useAppSelector((state) => state.walletConnect.swaps);
  const proxy = useAppSelector((state) => state.walletConnect.proxy);

  const { enqueueSnackbar } = useSnackbar();
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const swapAccountInfoState = useAsync(async () => {
    if (!selectedManageSwap) {
      return undefined;
    }

    return await getAccountInfo(chain, selectedManageSwap.escrow);
  }, [selectedManageSwap]);

  const escrowState = useAsync(async () => {
    if (!selectedManageSwap) {
      return;
    }

    const offeringAsset = selectedManageSwap.offering[0];
    const requestingAsset = selectedManageSwap.requesting[0];

    const response = await getCompiledSwap({
      creator_address: selectedManageSwap.creator,
      offered_asa_id: offeringAsset.index,
      offered_asa_amount: offeringAsset.offeringAmount,
      requested_asa_id: requestingAsset.index,
      requested_asa_amount: requestingAsset.requestingAmount,
    });

    const data = await response.data;
    const logicSig = getLogicSign(data[`result`]);

    return logicSig;
  }, [selectedManageSwap]);

  const manageDepositSwap = async () => {
    if (!selectedManageSwap) {
      return;
    }
    setDepositLoading(true);

    const escrow = escrowState.value as LogicSigAccount;
    console.log(escrow);
    const swapDepositTxns = await createSwapDepositTxns(
      chain,
      selectedManageSwap.creator,
      connector,
      escrow,
      selectedManageSwap.offering[0],
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
    if (!selectedManageSwap) {
      return;
    }
    setDeleteLoading(true);

    const escrow = escrowState.value as LogicSigAccount;
    console.log(escrow);
    const swapDeactivateTxns = await createSwapDeactivateTxns(
      chain,
      selectedManageSwap.creator,
      connector,
      escrow,
      selectedManageSwap.offering[0],
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

  const swapAlgoBalance = useMemo(() => {
    if (swapAccountInfoState.loading || swapAccountInfoState.error) {
      return 0;
    }

    const swapAccountInfo = swapAccountInfoState.value;

    return swapAccountInfo && `account` in swapAccountInfo
      ? swapAccountInfo[`account`][`amount`] / 1e6
      : 0;
  }, [
    swapAccountInfoState.error,
    swapAccountInfoState.loading,
    swapAccountInfoState.value,
  ]);

  const swapAccountAssets = useMemo(() => {
    if (swapAccountInfoState.loading || swapAccountInfoState.error) {
      return [];
    }

    const swapAccountInfo = swapAccountInfoState.value;

    return swapAccountInfo &&
      `account` in swapAccountInfo &&
      `assets` in swapAccountInfo[`account`]
      ? swapAccountInfo[`account`][`assets`]
      : [];
  }, [
    swapAccountInfoState.error,
    swapAccountInfoState.loading,
    swapAccountInfoState.value,
  ]);

  const swapAccountZeroBalanceAssets = useMemo(() => {
    console.log(swapAccountAssets);
    return swapAccountAssets.filter(
      (asset: { amount: number }) => asset.amount === 0,
    );
  }, [swapAccountAssets]);

  return (
    <Dialog open={open} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Chip
            variant="outlined"
            color="primary"
            label={`Algo Balance: ${swapAlgoBalance}`}
          />
          {swapAccountAssets.map(
            (asset: {
              [x: string]: Key | null | undefined;
              name: any;
              amount: any;
            }) => {
              return (
                <Chip
                  variant="outlined"
                  color="primary"
                  key={asset[`asset-id`]}
                  label={`${asset[`asset-id`]}'s balance: ${asset.amount}`}
                />
              );
            },
          )}
          <Divider></Divider>
          {swapAccountZeroBalanceAssets.length > 0 && swapAlgoBalance > 0 && (
            <LoadingButton
              onClick={async () => {
                await manageDepositSwap();
                onClose();
              }}
              loading={depositLoading}
              variant="contained"
              fullWidth
            >
              Deposit Asset
            </LoadingButton>
          )}
          {swapAccountZeroBalanceAssets.length >= 0 && swapAlgoBalance > 0 && (
            <LoadingButton
              loading={deleteLoading}
              color="error"
              variant="contained"
              fullWidth
              onClick={async () => {
                await manageDeleteSwap();
                onClose();
              }}
            >
              Delete Swap
            </LoadingButton>
          )}
        </Stack>
      </DialogContent>
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
      </DialogActions>
    </Dialog>
  );
};

export default ManageSwapDialog;
