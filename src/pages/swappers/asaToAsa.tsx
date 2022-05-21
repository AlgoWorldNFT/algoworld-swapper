import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import ToSwapCard from '@/components/Cards/ToSwapCard';
import FromSwapCard from '@/components/Cards/FromSwapCard';
import ParticlesContainer from '@/components/Misc/ParticlesContainer';
import { useAppSelector } from '@/redux/store/hooks';

export default function AsaToAsa() {
  const offeringAssets = useAppSelector(
    (state) => state.walletConnect.selectedOfferingAssets,
  );

  const requestingAssets = useAppSelector(
    (state) => state.walletConnect.selectedRequestingAssets,
  );

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
            Currently supports ASA to ASA and multi ASA to Algo swaps. Choose
            and click on the required swap type below.
          </Typography>
        </Container>
        {/* End hero unit */}

        <Container sx={{ textAlign: `center` }} component="main">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FromSwapCard cardTitle="From" maxAssets={1} />
            </Grid>

            <Grid item xs={6}>
              <ToSwapCard cardTitle="To" maxAssets={1} />
            </Grid>

            <Grid item xs={12}>
              <Stack justifyContent={`center`} direction={`column`}>
                <Button
                  disabled={
                    offeringAssets.length === 0 && requestingAssets.length === 0
                  }
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Swap
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
}
