import { Container, Stack, Typography } from '@mui/material';
import ParticlesContainer from '@/components/Misc/ParticlesContainer';
import SwapTypePickerCard from '@/components/Cards/SwapTypePickerCard';
import { SwapType } from '@/models/Swap';

export default function Dashboard() {
  const pageContent = [
    {
      title: `ASA to ASA`,
      description: `Secury & Simple 1 to 1 asset swaps with minimal fees.`,
      type: SwapType.ASA_TO_ASA,
      emoji: `🎴↔️🎴`,
      swapPageUrl: `/swappers/asaToAsa`,
    },
    {
      title: `Multi ASA to Algo`,
      description: `Swap up to 5 Assets for desired Algo amount or vice versa`,
      type: SwapType.MULTI_ASA_TO_ALGO,
      emoji: `x🎴↔️💰`,
      swapPageUrl: `/swappers/multiAsaToAlgo`,
    },
  ];

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
            Currently supports ASA to ASA and multi ASA to Algo swaps.
          </Typography>
        </Container>
        {/* End hero unit */}

        <Container component="main">
          <Stack justifyContent={`center`} direction={`row`} spacing={4}>
            {pageContent.map((content, index) => (
              <SwapTypePickerCard
                key={`${content.title}-${index}`}
                title={content.title}
                description={content.description}
                swapPageUrl={content.swapPageUrl}
                emojiContent={content.emoji}
              />
            ))}
          </Stack>
        </Container>
      </div>
    </div>
  );
}
