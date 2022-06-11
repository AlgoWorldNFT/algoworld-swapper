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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ChainType } from '@/models/Chain';
import { SwapConfiguration } from '@/models/Swap';
import { useAppSelector } from '@/redux/store/hooks';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCopyToClipboard } from 'react-use';

type Props = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  swapConfiguration?: SwapConfiguration;
  setOpen?: (open: boolean) => void;
  onClose?: () => void;
  onConfirm?: () => void;
  showManageSwapBtn?: boolean;
};

const ShareSwapDialog = ({
  title,
  children,
  open,
  swapConfiguration,
  setOpen,
  onClose,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_result, copyToClipboard] = useCopyToClipboard();
  const selectedChain = useAppSelector((state) => state.walletConnect.chain);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (setOpen) setOpen(false);
      }}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (setOpen) {
              setOpen(false);
            }
            if (onClose) {
              onClose();
            }
          }}
        >
          Close
        </Button>
        <Button
          onClick={() => {
            if (swapConfiguration) {
              copyToClipboard(
                `${window.location.origin}/swap/${swapConfiguration.proxy}/${
                  swapConfiguration.escrow
                }${
                  selectedChain === ChainType.TestNet ? `?chain=testnet` : ``
                }`,
              );
              enqueueSnackbar(`Copied to clipboard...`, {
                variant: `success`,
              });
            }
          }}
        >
          Copy URL
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareSwapDialog;
