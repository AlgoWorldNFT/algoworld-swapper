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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
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
import { useAppSelector } from '@/redux/store/hooks';
import LoadingBackdrop from '../Backdrops/Backdrop';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = `This is the default title` }: Props) => {
  const loadingIndicator = useAppSelector(
    (state) => state.application.loadingIndicator,
  );

  return (
    <Box
      sx={{
        display: `flex`,
        flexDirection: `column`,
        minHeight: `100vh`,
      }}
    >
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
      <Footer />
    </Box>
  );
};
export default Layout;
