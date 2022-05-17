import Layout from '@/components/Layouts/Layout';
import { useAppDispatch } from '@/redux/hooks';
import { setWalletAddress, setWalletClient } from '@/redux/slices/userSlice';
import { useEffect } from 'react';
import Dashboard from './dashboard';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // This will be executed in the browser (client-side).
    const clientSideInitialization = async () => {
      // load modules in browser
      // const { PeraWalletConnect } = await import(`@perawallet/connect`);
      dispatch(
        setWalletAddress(
          `M7WSR7LX5DDT523QRB2XGGXU35X26S5ZKANN4GM4MRAZPA3RX2HUXJQ56A`,
        ),
      );
    };
    clientSideInitialization();
  });

  return (
    <Layout title="AlgoWorld Swapper">
      <Dashboard></Dashboard>
    </Layout>
  );
}
