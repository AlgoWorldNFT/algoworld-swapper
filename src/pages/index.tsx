import Layout from '@/components/Layout';
import Dashboard from './dashboard';
import { Provider } from '../stores';

export default function Home() {
  return (
    <Provider>
      <Layout title="AlgoWorld Swapper">
        <Dashboard></Dashboard>
      </Layout>
    </Provider>
  );
}
