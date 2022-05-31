import { SwapConfiguration } from '@/models/Swap';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
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
  onConfirm,
  showManageSwapBtn = true,
}: Props) => {
  const [, copyToClipboard] = useCopyToClipboard();

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
          variant="contained"
          onClick={() => {
            if (setOpen) {
              setOpen(false);
            }
            if (onClose) {
              onClose();
            }
          }}
          color="secondary"
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (swapConfiguration)
              copyToClipboard(
                `https://localhost:3000/swap/${swapConfiguration.proxy}/${swapConfiguration.escrow}`,
              );
          }}
          color="secondary"
        >
          Copy URL
        </Button>
        {showManageSwapBtn && (
          <Button
            variant="contained"
            onClick={() => {
              if (setOpen) setOpen(false);
              if (onConfirm) onConfirm();
            }}
          >
            Manage Swap
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ShareSwapDialog;
