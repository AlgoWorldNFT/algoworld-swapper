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

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import { useContext, useEffect } from 'react';
import { ConnectContext } from '@/redux/store/connector';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
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
import { CONNECTED_WALLET_TYPE } from '@/common/constants';
import { useEffectOnce } from 'react-use';
import createAlgoExplorerUrl from '@/utils/createAlgoExplorerUrl';
import AlgoExplorerUrlType from '@/models/AlgoExplorerUrlType';
import {
  NAV_BAR_CHAIN_SWITCH_ID,
  NAV_BAR_CONNECT_BTN_ID,
  NAV_BAR_HOME_BTN_ID,
  NAV_BAR_ID,
  NAV_BAR_MENU_APPBAR_ID,
  NAV_BAR_MENU_APPBAR_ITEM_ID,
  NAV_BAR_SETTINGS_BTN_ID,
  NAV_BAR_SETTINGS_MENU_ITEM_ID,
} from './constants';

type PageConfiguration = {
  title: string;
  url: string;
  target?: string;
  disabled?: boolean;
};

const pages = [
  { title: `Home`, url: `/` },
  { title: `Docs`, url: `https://docs.algoworld.io`, target: `_blank` },
] as PageConfiguration[];

const settings = [`AlgoExplorer`, `My Swaps`, `Logout`];

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
  const { chain } = router.query as {
    chain?: string;
  };

  const assets = useAppSelector(selectAssets);

  const { fetching: loading, address } = useAppSelector(
    (state) => state.walletConnect,
  );

  const selectedChain = useAppSelector((state) => state.walletConnect.chain);

  const isWalletPopupOpen = useAppSelector(
    (state) => state.application.isWalletPopupOpen,
  );

  const dispatch = useAppDispatch();

  const connector = useContext(ConnectContext);

  const connect = async (clientType: WalletType) => {
    if (connector.connected) return;
    await connector.setWalletClient(clientType);
    await connector.connect();
  };

  const disconnect = async () => {
    await connector
      .disconnect()
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

  const handleClickUserMenu = async (event: any) => {
    setAnchorElUser(null);

    if (!event || !event.target) {
      return;
    }

    if (event.target.textContent === `AlgoExplorer`) {
      window.open(
        createAlgoExplorerUrl(
          selectedChain,
          address,
          AlgoExplorerUrlType.Address,
        ),
        `_blank`,
      );
    }

    if (event.target.textContent === `My Swaps`) {
      router.push(`/swappers/my-swaps`);
    }

    if (event.target.textContent === `Logout`) {
      await disconnect();
    }
  };

  useEffectOnce(() => {
    // Check if connection is already established
    const connectedWalletType = localStorage.getItem(CONNECTED_WALLET_TYPE);
    if (!connectedWalletType || connectedWalletType === ``) {
      return;
    }
    connect(connectedWalletType as WalletType);
  });

  useEffect(() => {
    if (typeof window !== `undefined`) {
      const persistedChainType =
        chain !== undefined
          ? chain.toLowerCase() === `mainnet`
            ? ChainType.MainNet
            : ChainType.TestNet
          : (localStorage.getItem(`ChainType`) as ChainType) ??
            ChainType.TestNet;
      dispatch(switchChain(persistedChainType));
    }

    // Retrieve assets info
    if (address?.length > 0) {
      console.log(`chain: `, selectedChain);

      dispatch(getAccountAssets({ chain: selectedChain, address }));
      dispatch(getProxy({ address, chain: selectedChain }));
      dispatch(getAccountSwaps({ chain: selectedChain, address }));
    }
  }, [dispatch, connector, address, selectedChain, chain]);

  const nativeCurrency = assets.find(
    (asset: Asset) => asset.index === 0,
  ) as Asset;

  const handleOnClientSelected = (client: WalletClient) => {
    dispatch(setIsWalletPopupOpen(false));
    connect(client.type);
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
      <AppBar id={NAV_BAR_ID} position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link href="/">
              <IconButton
                id={NAV_BAR_HOME_BTN_ID}
                size="medium"
                sx={{ display: { xs: `none`, md: `flex` }, mr: 1 }}
                aria-label="home icon"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <Image
                  src="/algoworld_logo.svg"
                  alt="AlgoWorld Swapper Logo"
                  height={40}
                  width={40}
                />
              </IconButton>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: `flex`, md: `none` } }}>
              <IconButton
                id={NAV_BAR_HOME_BTN_ID}
                size="large"
                aria-label="home button"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <Image
                  src="/algoworld_logo.svg"
                  alt="AlgoWorld Swapper Logo"
                  height={40}
                  width={40}
                />
              </IconButton>
              <Menu
                id={NAV_BAR_MENU_APPBAR_ID}
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
                  <Link
                    id={NAV_BAR_MENU_APPBAR_ITEM_ID(page.title)}
                    key={page.title}
                    href={page.url}
                    passHref
                  >
                    <a
                      target={page.target}
                      rel="noopener noreferrer"
                      style={{ textDecoration: `none`, color: `white` }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleCloseNavMenu();
                        }}
                      >
                        <Typography textAlign="center">{page.title}</Typography>
                      </MenuItem>
                    </a>
                  </Link>
                ))}
                <MenuItem
                  id={NAV_BAR_MENU_APPBAR_ITEM_ID(`about`)}
                  key={`about`}
                  onClick={() => {
                    setIsAboutPopupOpen(!isAboutPopupOpen);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">{`About`}</Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: `none`, md: `flex` } }}>
              {pages.map((page) => (
                <Link
                  id={NAV_BAR_MENU_APPBAR_ITEM_ID(page.title)}
                  key={page.title}
                  href={page.url}
                  passHref
                >
                  <a
                    target={page.target}
                    rel="noopener noreferrer"
                    style={{ textDecoration: `none`, color: `white` }}
                  >
                    <Button
                      key={page.title}
                      disabled={page.disabled}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: `white`, display: `block` }}
                    >
                      {page.title}
                    </Button>
                  </a>
                </Link>
              ))}
              <Button
                id={NAV_BAR_MENU_APPBAR_ITEM_ID(`about`)}
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
              {connector.connected ? (
                <>
                  <Grid container alignItems={`center`} spacing={1}>
                    <Grid item xs>
                      {!loading && (
                        <Tooltip title="Available balance">
                          <Stack
                            direction={`column`}
                            sx={{
                              alignItems: `center`,
                              display: { xs: `none`, md: `flex` },
                            }}
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
                                selectedChain === `mainnet`
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
                          id={NAV_BAR_SETTINGS_BTN_ID}
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
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: `center`, color: `primary.main` }}
                    >
                      {formatBigNumWithDecimals(
                        BigInt(nativeCurrency.amount),
                        nativeCurrency.decimals,
                      )}
                      {` `}
                      {nativeCurrency.unitName || `units`}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          id={NAV_BAR_CHAIN_SWITCH_ID}
                          checked={selectedChain === ChainType.MainNet}
                          onChange={() => {
                            const newValue =
                              selectedChain === ChainType.MainNet
                                ? ChainType.TestNet
                                : ChainType.MainNet;

                            dispatch(switchChain(newValue));
                          }}
                        />
                      }
                      label={
                        selectedChain === `mainnet` ? `MainNet` : `TestNet`
                      }
                      sx={{ ml: 1, mr: 2 }}
                    />
                    <Divider />
                    {settings.map((setting) => (
                      <MenuItem
                        id={NAV_BAR_SETTINGS_MENU_ITEM_ID(setting)}
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
                <Stack
                  direction="column"
                  sx={{
                    alignItems: `center`,
                    pb: 1,
                    pt: 1,
                  }}
                >
                  <FormControlLabel
                    labelPlacement="start"
                    control={
                      <Switch
                        id={NAV_BAR_CHAIN_SWITCH_ID}
                        size="small"
                        checked={selectedChain === ChainType.MainNet}
                        onChange={() => {
                          const newValue =
                            selectedChain === ChainType.MainNet
                              ? ChainType.TestNet
                              : ChainType.MainNet;

                          dispatch(switchChain(newValue));
                        }}
                      />
                    }
                    sx={{ color: `primary.main` }}
                    label={selectedChain === `mainnet` ? `MainNet` : `TestNet`}
                  />
                  <Button
                    id={NAV_BAR_CONNECT_BTN_ID}
                    onClick={() => {
                      dispatch(setIsWalletPopupOpen(true));
                    }}
                    title="Connect Wallet"
                  >
                    Connect Wallet
                  </Button>
                </Stack>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default NavBar;
