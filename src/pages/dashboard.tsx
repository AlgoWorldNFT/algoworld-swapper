import ParticlesContainer from '@/components/ParticlesContainer';
import { Container, Typography } from '@mui/material';
import SwapCard from '@/components/SwapCard';

export default function Dashboard() {
  return (
    <div>
      <ParticlesContainer />

      <div>
        {/* Hero unit */}
        <Container
          disableGutters
          maxWidth="sm"
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
            ⚡️ Create Swap
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            component="p"
          >
            Create a safe atomic swap powered by Algorand Smart Signatures.
            Currently supports ASA to ASA and multi ASA to multi ASA swaps.
          </Typography>
        </Container>
        {/* End hero unit */}

        <Container maxWidth="md" component="main">
          <SwapCard cardTitle="Swap" />
        </Container>
      </div>
    </div>
  );
}
