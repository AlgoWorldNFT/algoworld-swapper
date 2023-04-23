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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
  Stack,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  CONFIRM_DIALOG_ID,
  CONFIRM_DIALOG_PUBLIC_SWAP_SWITCH_ID,
  DIALOG_CANCEL_BTN_ID,
  DIALOG_SELECT_BTN_ID,
} from './constants';
import {
  TXN_SIGNING_CANCELLED_MESSAGE,
  TXN_SUBMISSION_FAILED_MESSAGE,
} from '@/common/constants';
import { useAppSelector } from '@/redux/store/hooks';
import { useWallet } from '@txnlab/use-wallet';
import { LogicSigAccount } from 'algosdk';
import { useMemo, useState } from 'react';
import { useAsyncRetry } from 'react-use';
import loadSwapConfigurations from '@/utils/api/swaps/loadSwapConfigurations';
import { toast } from 'react-toastify';
import accountExists from '@/utils/api/accounts/accountExists';
import createSaveSwapConfigTxns from '@/utils/api/swaps/createSaveSwapConfigTxns';
import saveSwapConfigurations from '@/utils/api/swaps/saveSwapConfigurations';
import processTransactions from '@/utils/api/transactions/processTransactions';
import submitTransactions from '@/utils/api/transactions/submitTransactions';
import { LoadingButton } from '@mui/lab';

type Props = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  isPublicSwap?: boolean;
  onSwapVisibilityChange?: (isPublic: boolean) => void;
  transactionsFee?: number | string;
};

const ConfirmDialog = ({
  title,
  children,
  open,
  setOpen,
  onConfirm,
  isPublicSwap,
  onSwapVisibilityChange,
  transactionsFee,
}: Props) => {
  const { gateway, chain, proxy } = useAppSelector(
    (state) => state.application,
  );
  const [loading, setLoading] = useState(false);

  const { activeAddress, signTransactions } = useWallet();
  const address = useMemo(() => {
    return activeAddress || ``;
  }, [activeAddress]);

  const existingSwaps = useAppSelector((state) => state.application.swaps);

  const proxyExistsState = useAsyncRetry(async () => {
    return await accountExists(chain, proxy.address());
  }, [proxy]);

  const proxyExists = useMemo(() => {
    if (proxyExistsState.loading || proxyExistsState.error) return false;

    return proxyExistsState.value;
  }, [proxyExistsState]);

  const swapConfigsState = useAsyncRetry(async () => {
    return await loadSwapConfigurations(chain, gateway, proxy.address());
  }, [proxy]);

  const hasSwapConfigurations = useMemo(() => {
    console.log(swapConfigsState);
    if (swapConfigsState.loading || swapConfigsState.error) return false;

    console.log(swapConfigsState);
    const allConfigs = swapConfigsState.value;

    if (!allConfigs) return false;

    return allConfigs.length > 0;
  }, [swapConfigsState]);

  const signAndSendSaveSwapConfigTxns = async (proxy: LogicSigAccount) => {
    if (!address) {
      return undefined;
    }

    const cidData = await saveSwapConfigurations([...existingSwaps]);

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

  const handleInitSwapConfig = async () => {
    setLoading(true);

    const saveSwapTxnId = await signAndSendSaveSwapConfigTxns(proxy);
    if (!saveSwapTxnId) {
      setLoading(false);
      toast.error(TXN_SUBMISSION_FAILED_MESSAGE);
      return;
    }

    swapConfigsState.retry();
    proxyExistsState.retry();

    setLoading(false);
  };

  return (
    <Dialog
      id={CONFIRM_DIALOG_ID}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>
        {children}

        {transactionsFee && (
          <>
            <Divider sx={{ pt: 1 }}></Divider>
            <Typography sx={{ pt: 1, fontWeight: `bold` }}>
              Transaction fees: ~{transactionsFee} Algo
            </Typography>
          </>
        )}
        {isPublicSwap !== undefined && onSwapVisibilityChange && (
          <>
            <Divider sx={{ pt: 1 }}></Divider>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip
                title={`By default, each swap is not visible on public swaps table. To perform swap you have to manually share the url.`}
              >
                <Typography sx={{ fontWeight: `bold` }}>Private</Typography>
              </Tooltip>

              <Switch
                id={CONFIRM_DIALOG_PUBLIC_SWAP_SWITCH_ID}
                checked={isPublicSwap}
                onChange={() => {
                  onSwapVisibilityChange(!isPublicSwap);
                }}
              />

              <Tooltip
                title={`If you select this, it will make your swap visible on public swaps table. Anyone can perform your swap in first come first serve manner.`}
              >
                <Typography sx={{ fontWeight: `bold` }}>Public</Typography>
              </Tooltip>
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          id={DIALOG_CANCEL_BTN_ID}
          onClick={() => setOpen(false)}
          disabled={loading}
          color="secondary"
        >
          Cancel
        </Button>
        {!proxyExists && !hasSwapConfigurations ? (
          <Tooltip title="Create Swap Configuration to use Swapper. This is a one time only operation">
            <LoadingButton
              id={DIALOG_SELECT_BTN_ID}
              loading={loading}
              onClick={() => {
                handleInitSwapConfig();
              }}
            >
              Initialize
            </LoadingButton>
          </Tooltip>
        ) : (
          <Tooltip title="By confirming, you agree to our Terms of Service.">
            <Button
              id={DIALOG_SELECT_BTN_ID}
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              Proceed
            </Button>
          </Tooltip>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
