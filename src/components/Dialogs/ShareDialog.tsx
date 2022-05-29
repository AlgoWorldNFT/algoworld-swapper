import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import { useCopyToClipboard } from 'react-use';

type Props = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  contentToCopy?: string;
};

const ShareDialog = ({
  title,
  children,
  open,
  setOpen,
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
          onClick={() => setOpen(false)}
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
