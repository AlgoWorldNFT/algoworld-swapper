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
import { AlgoConnectButton } from '../Buttons/AlgoConnectButton';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useMemo } from 'react';
import { logoutWalletClient } from '@/redux/slices/userSlice';

const pages = [`Create`, `Browse`, `About`];
const settings = [`My Swaps`, `Create Storefront`, `Logout`];

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const walletAddress = useAppSelector((state) => state.user.walletAddress);

  const dispatch = useAppDispatch();

  const isConnected = useMemo(() => {
    return walletAddress !== undefined;
  }, [walletAddress]);

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
      dispatch(logoutWalletClient());
    }
  };

  return (
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
            {isConnected ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <AccountBalanceWalletOutlined />
                    {`${walletAddress?.slice(0, 4)}...${walletAddress?.slice(
                      walletAddress.length - 4,
                      walletAddress.length,
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
              <AlgoConnectButton />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
