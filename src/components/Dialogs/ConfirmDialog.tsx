import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
} from '@mui/material';

type Props = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  transactionsFee?: number | string;
};

const ConfirmDialog = ({
  title,
  children,
  open,
  setOpen,
  onConfirm,
  transactionsFee,
}: Props) => {
  return (
    <Dialog
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
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
