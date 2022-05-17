import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loadUserAssets, setWalletAddress } from '@/redux/slices/userSlice';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

export const AlgoConnectButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const walletClient = useAppSelector((state) => state.user.walletClient);
  const walletAddress = useAppSelector(
    (state) => state.user.walletAddress,
  ) as string;
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnectWallet = () => {
    if (!walletClient) {
      return;
    }

    walletClient.disconnect();

    // setAccountAddress(null);
  };

  const handleSession = (newAccounts: string[] | undefined) => {
    if (!walletClient || !newAccounts || newAccounts.length === 0) {
      handleDisconnectWallet();
      return;
    }

    walletClient.connector?.on(`disconnect`, handleDisconnectWallet);
    dispatch(setWalletAddress(newAccounts[0]));
    dispatch<any>(loadUserAssets(newAccounts[0]));
  };

  const handleConnect = async () => {
    dispatch<any>(loadUserAssets(walletAddress));
    // if (!walletClient) {
    //   return;
    // }

    // handleClose();
    // let response = undefined;
    // try {
    //   response = await walletClient.reconnectSession();
    // } catch (error) {
    //   response = await walletClient.connect();
    // }

    // handleSession(response);
  };

  return (
    <>
      <Button
        id="connect-wallet-button"
        aria-controls={open ? `connect-wallet` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? `true` : undefined}
        // onClick={(event) => {
        //   setAnchorEl(event.currentTarget);
        // }}
        onClick={handleConnect}
        title="Connect Wallet"
      >
        Connect Wallet
      </Button>
      <Menu
        id="connect-wallet-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `connect-wallet-button`,
        }}
      >
        <MenuItem onClick={handleConnect}>Pera Wallet</MenuItem>
        <MenuItem onClick={handleConnect} disabled>
          🚧 My Algo Wallet
        </MenuItem>
      </Menu>
    </>
  );
};
