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
          color="secondary"
        >
          Cancel
        </Button>
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
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
