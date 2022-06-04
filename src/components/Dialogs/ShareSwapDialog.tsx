import { SwapConfiguration } from '@/models/Swap';
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
                `${window.location.origin}/swap/${swapConfiguration.proxy}/${swapConfiguration.escrow}`,
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
