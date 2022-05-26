import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Icon from '@mui/material/Icon';
import Image from 'next/image';
import { useContext, useEffect } from 'react';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { ConnectContext } from '@/redux/store/connector';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
  onSessionUpdate,
  reset,
  getAccountAssets,
  selectAssets,
  getAccountSwaps,
} from '@/redux/slices/walletConnectSlice';
import { formatBigNumWithDecimals } from '@/redux/helpers/utilities';
import { Asset } from '@/models/Asset';
import ConnectWalletDialog from '../Dialogs/ConnectWalletDialog';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { WalletClient, WalletType } from '@/models/Wallet';

const pages = [`Create`, `Browse`, `About`];
const settings = [`My Swaps`, `Create Storefront`, `Logout`];

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const assets = useAppSelector(selectAssets);

  const {
    fetching: loading,
    address,
    chain,
  } = useAppSelector((state) => state.walletConnect);

  const isWalletPopupOpen = useAppSelector(
    (state) => state.application.isWalletPopupOpen,
  );

  const dispatch = useAppDispatch();

  const connector = useContext(ConnectContext);

  const connect = async () => {
    if (connector.connected) return;
    if (connector.pending) return QRCodeModal.open(connector.uri, null);
    await connector.createSession();
  };

  const disconnect = () => {
    connector
      .killSession()
      .catch((err: { message: any }) => console.error(err.message));
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickUserMenu = (event: any) => {
    setAnchorElUser(null);

    if (!event || !event.target) {
      return;
    }

    if (event.target.textContent === `Logout`) {
      disconnect();
    }
  };

  useEffect(() => {
    // Check if connection is already established
    if (connector.connected) {
      const { accounts } = connector;
      dispatch(onSessionUpdate(accounts));
    }

    // Subscribe to connection events
    console.log(`%cin subscribeToEvents`, `background: yellow`);
    connector.on(`connect`, (error, payload) => {
      console.log(`%cOn connect`, `background: yellow`);
      if (error) {
        throw error;
      }
      const { accounts } = payload.params[0];
      dispatch(onSessionUpdate(accounts));
      QRCodeModal.close();
    });

    connector.on(`session_update`, (error, payload) => {
      console.log(`%cOn session_update`, `background: yellow`);
      if (error) {
        throw error;
      }
      const { accounts } = payload.params[0];
      dispatch(onSessionUpdate(accounts));
    });

    connector.on(`disconnect`, (error) => {
      console.log(`%cOn disconnect`, `background: yellow`);
      if (error) {
        throw error;
      }
      dispatch(reset());
    });

    return () => {
      console.log(`%cin unsubscribeFromEvents`, `background: yellow`);
      connector.off(`connect`);
      connector.off(`session_update`);
      connector.off(`disconnect`);
    };
  }, [dispatch, connector]);

  useEffect(() => {
    // Retrieve assets info
    if (address?.length > 0) {
      console.log(`chain: `, chain);
      dispatch(getAccountAssets({ chain, address }));
      dispatch(getAccountSwaps({ chain, address }));
    }
  }, [dispatch, address, chain]);

  const nativeCurrency = assets.find(
    (asset: Asset) => asset.index === 0,
  ) as Asset;

  const handleOnClientSelected = (client: WalletClient) => {
    dispatch(setIsWalletPopupOpen(false));
    if (client.type === WalletType.PeraWallet) {
      connect();
    }
  };

  return (
    <>
      <ConnectWalletDialog
        open={isWalletPopupOpen}
        onClientSelected={handleOnClientSelected}
      ></ConnectWalletDialog>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Icon
              sx={{ display: { xs: `none`, md: `flex` }, mr: 1 }}
              fontSize="large"
            >
              <Image
                src="/algoworld_logo.svg"
                alt="AlgoWorld Swapper Logo"
                height={40}
                width={40}
              />
            </Icon>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: `none`, md: `flex` },
                fontWeight: 700,
                color: `inherit`,
                textDecoration: `none`,
              }}
            >
              SWAPPER
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: `flex`, md: `none` } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: `bottom`,
                  horizontal: `left`,
                }}
                keepMounted
                transformOrigin={{
                  vertical: `top`,
                  horizontal: `left`,
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: `block`, md: `none` },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Icon
              sx={{ display: { xs: `flex`, md: `none` }, mr: 1 }}
              fontSize="large"
            >
              <Image
                src="/algoworld_logo.svg"
                alt="AlgoWorld Swapper Logo"
                height={40}
                width={40}
              />
            </Icon>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: `flex`, md: `none` },
                flexGrow: 1,
                fontWeight: 700,
                color: `inherit`,
                textDecoration: `none`,
              }}
            >
              SWAPPER
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: `none`, md: `flex` } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: `white`, display: `block` }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {address ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {!loading && (
                        <span>
                          {formatBigNumWithDecimals(
                            BigInt(nativeCurrency.amount),
                            nativeCurrency.decimals,
                          )}
                          {` `}
                          {nativeCurrency.unitName || `units`}
                        </span>
                      )}
                      <AccountBalanceWalletOutlined />
                      {`${address?.slice(0, 4)}...${address?.slice(
                        address.length - 4,
                        address.length,
                      )} `}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: `45px` }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: `top`,
                      horizontal: `right`,
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: `top`,
                      horizontal: `right`,
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={handleClickUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    id="connect-wallet-button"
                    onClick={() => {
                      dispatch(setIsWalletPopupOpen(true));
                    }}
                    title="Connect Wallet"
                  >
                    Connect Wallet
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default NavBar;
