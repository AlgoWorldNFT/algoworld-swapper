import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import ToSwapCard from '@/components/Cards/ToSwapCard';
import FromSwapCard from '@/components/Cards/FromSwapCard';
import ParticlesContainer from '@/components/Misc/ParticlesContainer';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { getAsaToAsaSwapCreateTxs } from '@/utils/swapper';
import { getLogicSign } from '@/utils/accounts';
import { useContext } from 'react';
import { ConnectContext } from '@/redux/store/connector';

export default function AsaToAsa() {
  const offeringAssets = useAppSelector(
    (state) => state.walletConnect.selectedOfferingAssets,
  );

  const requestingAssets = useAppSelector(
    (state) => state.walletConnect.selectedRequestingAssets,
  );

  const connector = useContext(ConnectContext);
  const address = useAppSelector((state) => state.walletConnect.address);
  const chain = useAppSelector((state) => state.walletConnect.chain);

  const dispatch = useAppDispatch();

  const handleSwap = async () => {
    const offeringAsset = offeringAssets[0];
    const requestingAsset = requestingAssets[0];

    fetch(
      `/api/swappers/compile_swap?` +
        new URLSearchParams({
          creator_address: address,
          offered_asa_id: String(offeringAsset.index),
          offered_asa_amount: String(offeringAsset.offeringAmount),
          requested_asa_id: String(requestingAsset.index),
          requested_asa_amount: String(requestingAsset.requestingAmount),
        }),
    ).then(async (response) => {
      console.log(response);
      const data = await response.json();

      const escrowLsig = getLogicSign(data);
      const fundingFee = Math.round((0.1 + 0.1 + 0.01) * 1e6);

      const txs = getAsaToAsaSwapCreateTxs(
        chain,
        address,
        connector,
        escrowLsig,
        fundingFee,
        offeringAsset,
      );
    });
  };

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
                {address ? (
                  <Button
                    disabled={
                      offeringAssets.length === 0 ||
                      requestingAssets.length === 0
                    }
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleSwap();
                    }}
                  >
                    Swap
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      dispatch(setIsWalletPopupOpen(true));
                    }}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Connect Wallet
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
}
