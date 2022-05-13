import ParticlesContainer from '@/components/ParticlesContainer';
import { Button, Container, Stack, Typography } from '@mui/material';
import FromSwapCard from '@/components/FromSwapCard';
import ToSwapCard from '@/components/ToSwapCard';

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

        <Container maxWidth="md" sx={{ textAlign: `center` }} component="main">
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <FromSwapCard cardTitle="From" />
              <ToSwapCard cardTitle="To" />
            </Stack>
            <Button variant="contained" color="primary">
              Swap
            </Button>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
