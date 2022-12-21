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

import { SwapConfiguration } from '@/models/Swap';
import { useAppSelector } from '@/redux/store/hooks';
import getSwapUrl from '@/utils/api/swaps/getSwapUrl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import { toast } from 'react-toastify';
import { useCopyToClipboard } from 'react-use';
import {
  DIALOG_CANCEL_BTN_ID,
  SHARE_SWAP_COPY_BTN_ID,
  SHARE_SWAP_DIALOG_ID,
} from './constants';

type Props = {
  children: React.ReactNode;
  open: boolean;
  swapConfiguration?: SwapConfiguration;
  title?: string;
  setOpen?: (open: boolean) => void;
  onClose?: () => void;
  onConfirm?: () => void;
  showManageSwapBtn?: boolean;
};

const ShareSwapDialog = ({
  children,
  open,
  swapConfiguration,
  title = `Share AlgoWorld Swap`,
  setOpen,
  onClose,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_result, copyToClipboard] = useCopyToClipboard();
  const selectedChain = useAppSelector((state) => state.application.chain);
  return (
    <Dialog
      id={SHARE_SWAP_DIALOG_ID}
      open={open}
      sx={{ visibility: open ? `visible` : `hidden` }}
      onClose={() => {
        if (setOpen) setOpen(false);
      }}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          id={DIALOG_CANCEL_BTN_ID}
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
          id={SHARE_SWAP_COPY_BTN_ID}
          onClick={() => {
            if (swapConfiguration) {
              copyToClipboard(getSwapUrl(swapConfiguration, selectedChain));
              toast.success(`Copied to clipboard...`);
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
