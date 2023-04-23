/* eslint-disable @typescript-eslint/quotes */
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

import React, { ReactNode } from 'react';
import Head from 'next/head';
import NavBar from '../Headers/NavBar';
import ParticlesContainer from '../Misc/ParticlesContainer';
import Footer from '../Footers/Footer';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import LoadingBackdrop from '../Backdrops/Backdrop';
import AboutDialog from '../Dialogs/AboutDialog';
import {
  setIsAboutPopupOpen,
  setIsLoadedFromTelegram,
} from '@/redux/slices/applicationSlice';
import TelegramFooter from '../Footers/TelegramFooter';
import axios from 'axios';
import { useDispatch } from 'react-redux';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = `This is the default title` }: Props) => {
  const loadingIndicator = useAppSelector(
    (state) => state.application.loadingIndicator,
  );
  const dispatch = useAppDispatch();

  const isAboutPopupOpen = useAppSelector(
    (state) => state.application.isAboutPopupOpen,
  );

  const isLoadedFromTelegram = useAppSelector(
    (state) => state.application.isLoadedFromTelegram,
  );

  const dispath = useDispatch();

  React.useEffect(() => {
    if (typeof window !== `undefined`) {
      if (Object.hasOwnProperty.call(window, `Telegram`)) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        axios
          .post('/api/storage/validate-hash', {
            hash: window.Telegram.WebApp.initData,
          })
          .then(() => dispath(setIsLoadedFromTelegram(true)))
          .catch(() => {
            dispath(setIsLoadedFromTelegram(false));
          });
      }
    }
  }, [dispath]);

  return (
    <Box
      sx={{
        display: `flex`,
        flexDirection: `column`,
      }}
    >
      <AboutDialog
        open={isAboutPopupOpen}
        changeState={(state) => {
          dispatch(setIsAboutPopupOpen(state));
        }}
      />
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <NavBar />
      </header>
      <main>
        <>
          <LoadingBackdrop
            isLoading={loadingIndicator.isLoading}
            message={loadingIndicator.message}
          />
          <ParticlesContainer />
          {children}
        </>
      </main>
      {isLoadedFromTelegram ? <TelegramFooter /> : <Footer />}
    </Box>
  );
};
export default Layout;
