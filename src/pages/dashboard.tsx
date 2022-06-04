import { Container, Stack } from '@mui/material';
import SwapTypePickerCard from '@/components/Cards/SwapTypePickerCard';
import { SwapType } from '@/models/Swap';
import PageHeader from '@/components/Headers/PageHeader';

export default function Dashboard() {
  const pageContent = [
    {
      title: `ASA to ASA`,
      description: `Secury & Simple 1 to 1 asset swaps with minimal fees.`,
      type: SwapType.ASA_TO_ASA,
      emoji: `🎴↔️🎴`,
      disabled: false,
      swapPageUrl: `/swappers/asa-to-asa`,
    },
    {
      title: `Multi ASA to Algo `,
      description: `Swap up to 5 Assets for desired Algo amount or vice versa.`,
      type: SwapType.MULTI_ASA_TO_ALGO,
      emoji: `x🎴↔️💰`,
      swapPageUrl: `/swappers/asas-to-algo`,
      disabled: false,
    },
  ];

  return (
    <div>
      <PageHeader
        title="🏠 Dashboard"
        description="Create atomic swaps powered by Algorand Smart Signatures.
        Currently supports ASA to ASA and multi ASA to Algo swaps."
      />

      <Container component="main" sx={{ pt: 5, pb: 5 }}>
        <Stack
          justifyContent={`center`}
          alignItems={`center`}
          direction={{ xs: `column`, sm: `row` }}
          spacing={4}
        >
          {pageContent.map((content, index) => (
            <SwapTypePickerCard
              key={`${content.title}-${index}`}
              title={content.title}
              description={content.description}
              swapPageUrl={content.swapPageUrl}
              emojiContent={content.emoji}
              disabled={content.disabled}
            />
          ))}
        </Stack>
      </Container>
    </div>
  );
}
