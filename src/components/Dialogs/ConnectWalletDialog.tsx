import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { WalletClient, WalletType } from '@/models/Wallet';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { useAppDispatch } from '@/redux/store/hooks';
import { DialogActions, Button } from '@mui/material';

const walletClients = [
  { type: WalletType.PeraWallet, title: `PeraWallet`, supported: true },
  { type: WalletType.MyAlgoWallet, title: `🚧 MyAlgoWallet`, supported: false },
] as WalletClient[];

type Props = {
  open: boolean;
  onClientSelected: (client: WalletClient) => void;
};

const ConnectWalletDialog = ({ open, onClientSelected }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <Dialog open={open}>
      <DialogTitle>Select wallet client:</DialogTitle>
      <List sx={{ pt: 0 }}>
        {walletClients.map((client) => (
          <ListItem
            button
            onClick={() => onClientSelected(client)}
            key={client.title}
            disabled={!client.supported}
          >
            <ListItemText primary={client.title} />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(setIsWalletPopupOpen(false));
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectWalletDialog;
