import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { useState } from 'react';
import { NAV_BAR_FOOTER_ITEM_ID } from './constants';
import { setIsAboutPopupOpen } from '@/redux/slices/applicationSlice';
import { useAppDispatch } from '@/redux/store/hooks';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {`Copyright © `}
      <MuiLink color="inherit" href="https://algoworld.io">
        {`AlgoWorld ${new Date().getFullYear()}`}
      </MuiLink>
    </Typography>
  );
}

function ReferenceButtons() {
  return (
    <Stack justifyContent={`center`} direction="row">
      <IconButton
        size="small"
        target={`_blank`}
        href="https://t.me/algoworld_nft"
      >
        <TelegramIcon />
      </IconButton>
      <IconButton
        size="small"
        target={`_blank`}
        href="https://twitter.com/algoworld_nft"
      >
        <TwitterIcon />
      </IconButton>
      <IconButton
        size="small"
        target={`_blank`}
        href="https://github.com/AlgoWorldNFT"
      >
        <GitHubIcon />
      </IconButton>

      <IconButton
        size="small"
        target={`_blank`}
        href="https://algoworldexplorer.io"
      >
        <TravelExploreIcon />
      </IconButton>
    </Stack>
  );
}

const navBarItems = [
  {
    id: `home`,
    url: `/`,
    label: `Home`,
    icon: HomeIcon,
  },
  {
    id: `mySwaps`,
    url: `/swaps/my-swaps`,
    label: `My Swaps`,
    icon: SwapHorizontalCircleIcon,
  },
  {
    id: `about`,
    url: ``,
    label: `About`,
    action: setIsAboutPopupOpen,
    icon: HelpIcon,
  },
];

const Footer = () => {
  const [navBarValue, setNavBarValue] = useState(0);
  const dispatch = useAppDispatch();

  return (
    <>
      <Box
        sx={{
          py: 2,
          px: 2,
          mt: `auto`,
          bgcolor: `background.paper`,
          display: { xs: `none`, md: `flex` },
        }}
        alignItems="center"
        justifyContent="center"
        component="footer"
      >
        <Container>
          <ReferenceButtons />
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Powered by Algorand ❤️
          </Typography>
          <Copyright />
        </Container>
      </Box>
      <BottomNavigation
        showLabels
        sx={{
          position: `fixed`,
          bottom: 0,
          left: 0,
          right: 0,
          display: { md: `none`, xs: `flex` },
        }}
        value={navBarValue}
        onChange={(event, newValue) => {
          if (newValue === navBarItems.length - 1) {
            dispatch(setIsAboutPopupOpen(true));
          } else {
            setNavBarValue(newValue);
          }
        }}
      >
        {navBarItems.map((item) => {
          return (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={
                <>
                  {item.url ? (
                    <Link
                      legacyBehavior
                      id={NAV_BAR_FOOTER_ITEM_ID(item.id)}
                      href={item.url}
                    >
                      <item.icon />
                    </Link>
                  ) : (
                    <item.icon />
                  )}
                </>
              }
            />
          );
        })}
      </BottomNavigation>
    </>
  );
};

export default Footer;
