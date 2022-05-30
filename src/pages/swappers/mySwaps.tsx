import MySwapsTable from '@/components/Tables/MySwapsTable';
import { useAppSelector } from '@/redux/store/hooks';
import { Container, Typography } from '@mui/material';

export default function MySwaps() {
  const swaps = useAppSelector((state) => state.walletConnect.swaps);

  return (
    <>
      {/* Hero unit */}
      <Container
        disableGutters
        maxWidth="md"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          ⚡️ Manage existing swaps
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          component="p"
        >
          Activate, update or deactivate your existing swaps.
        </Typography>
      </Container>
      {/* End hero unit */}

      <Container maxWidth="md" sx={{ textAlign: `center` }} component="main">
        <MySwapsTable swapConfigurations={swaps}></MySwapsTable>
      </Container>
    </>
  );
}
