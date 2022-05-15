import React, { ReactNode } from 'react';
import Head from 'next/head';
import NavBar from '../Headers/NavBar';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = `This is the default title` }: Props) => (
  <div className="flex flex-col h-screen justify-between">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <NavBar />
    </header>
    <main>{children}</main>
  </div>
);

export default Layout;
