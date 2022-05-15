import Layout from '@/components/Layouts/Layout';
import { useAppDispatch } from '@/redux/hooks';
import { setWalletClient } from '@/redux/slices/userSlice';
import { useEffect } from 'react';
import Dashboard from './dashboard';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // This will be executed in the browser (client-side).
    const clientSideInitialization = async () => {
      // load modules in browser
      const { PeraWalletConnect } = await import(`@perawallet/connect`);
      dispatch(setWalletClient(new PeraWalletConnect()));
    };
    clientSideInitialization();
  });

  return (
    <Layout title="AlgoWorld Swapper">
      <Dashboard></Dashboard>
    </Layout>
  );
}
