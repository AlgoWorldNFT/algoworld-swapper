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
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  contentToCopy?: string;
};

const ShareDialog = ({
  title,
  children,
  open,
  setOpen,
  onClose,
  onConfirm,
  contentToCopy = undefined,
}: Props) => {
  const [, copyToClipboard] = useCopyToClipboard();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onClose();
          }}
          color="secondary"
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (contentToCopy) {
              copyToClipboard(contentToCopy);
            }
          }}
          color="secondary"
        >
          Copy URL
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
        >
          Manage Swap
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
