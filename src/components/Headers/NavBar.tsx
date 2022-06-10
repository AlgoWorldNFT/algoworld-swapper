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
  getProxy,
  switchChain,
} from '@/redux/slices/walletConnectSlice';
import { formatBigNumWithDecimals } from '@/redux/helpers/utilities';
import { Asset } from '@/models/Asset';
import ConnectWalletDialog from '../Dialogs/ConnectWalletDialog';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { WalletClient, WalletType } from '@/models/Wallet';
import { useRouter } from 'next/router';
import { Divider, FormControlLabel, Grid, Stack, Switch } from '@mui/material';
import AboutDialog from '../Dialogs/AboutDialog';
import { ChainType } from '@/models/Chain';
import Link from 'next/link';

type PageConfiguration = {
  title: string;
  url: string;
  disabled?: boolean;
};

const pages = [{ title: `Home`, url: `/` }] as PageConfiguration[];

const settings = [`My Swaps`, `Logout`];

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const [isAboutPopupOpen, setIsAboutPopupOpen] =
    React.useState<boolean>(false);
  const router = useRouter();

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

    if (event.target.textContent === `My Swaps`) {
      router.push(`/swappers/my-swaps`);
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
      dispatch(getProxy({ address, chain }));
      dispatch(getAccountSwaps({ chain, address }));
    }

    if (typeof window !== `undefined`) {
      const persistedChainType = localStorage.getItem(`ChainType`);
      dispatch(switchChain(persistedChainType as ChainType));
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
      />
      <AboutDialog
        open={isAboutPopupOpen}
        setOpen={(state) => {
          setIsAboutPopupOpen(state);
        }}
      />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link href="/">
              <Image
                src="/algoworld_logo.svg"
                alt="AlgoWorld Swapper Logo"
                height={40}
                width={40}
              />
            </Link>

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
                  <Link key={page.title} href={page.url}>
                    <MenuItem>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  </Link>
                ))}
                <MenuItem
                  key={`about`}
                  onClick={() => {
                    setIsAboutPopupOpen(!isAboutPopupOpen);
                  }}
                >
                  <Typography textAlign="center">{`About`}</Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: `none`, md: `flex` } }}>
              {pages.map((page) => (
                <Link key={page.title} href={page.url}>
                  <Button
                    key={page.title}
                    disabled={page.disabled}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: `white`, display: `block` }}
                  >
                    {page.title}
                  </Button>
                </Link>
              ))}
              <Button
                key={`about`}
                onClick={() => {
                  setIsAboutPopupOpen(true);
                }}
                sx={{ my: 2, color: `white`, display: `block` }}
              >
                About
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {address ? (
                <>
                  <Grid container alignItems={`center`} spacing={1}>
                    <Grid item xs>
                      {!loading && (
                        <Tooltip title="Available balance">
                          <Stack
                            direction={`column`}
                            sx={{ alignItems: `center` }}
                          >
                            <Typography variant="subtitle2">
                              {formatBigNumWithDecimals(
                                BigInt(nativeCurrency.amount),
                                nativeCurrency.decimals,
                              )}
                              {` `}
                              {nativeCurrency.unitName || `units`}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              {`${
                                chain === ChainType.MainNet
                                  ? `MainNet`
                                  : `TestNet`
                              }`}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      )}
                    </Grid>
                    <Grid item xs>
                      <Tooltip title="Open settings">
                        <IconButton
                          onClick={handleOpenUserMenu}
                          sx={{ p: 0, borderRadius: 1 }}
                        >
                          <AccountBalanceWalletOutlined sx={{ pr: 0.5 }} />
                          <Typography variant="h6">
                            {`${address?.slice(0, 4)}...${address?.slice(
                              address.length - 4,
                              address.length,
                            )} `}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
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
                    <FormControlLabel
                      control={
                        <Switch
                          checked={chain === ChainType.MainNet}
                          onChange={() => {
                            const newValue =
                              chain === ChainType.MainNet
                                ? ChainType.TestNet
                                : ChainType.MainNet;

                            if (typeof window !== `undefined`) {
                              localStorage.setItem(`ChainType`, newValue);
                            }

                            dispatch(switchChain(newValue));
                          }}
                        />
                      }
                      label={
                        chain === ChainType.MainNet ? `MainNet` : `TestNet`
                      }
                      sx={{ ml: 1, mr: 2 }}
                    />
                    <Divider />
                    {settings.map((setting) => (
                      <MenuItem
                        sx={{ justifyContent: `center` }}
                        key={setting}
                        onClick={handleClickUserMenu}
                      >
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
