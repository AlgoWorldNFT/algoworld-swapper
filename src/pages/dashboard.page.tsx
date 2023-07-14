/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Container, Stack } from '@mui/material';
import SwapTypePickerCard from '@/components/Cards/SwapTypePickerCard';
import { SwapType } from '@/models/Swap';
import PageHeader from '@/components/Headers/PageHeader';
import { LATEST_SWAP_PROXY_VERSION } from '@/common/constants';
import { isSafeVersion } from '@/utils/isSafeVersion';

export default function Dashboard() {
  const pageContent = [
    {
      title: `ASA to ASA`,
      description: `Secure & Simple 1 to 1 asset swaps with minimal fees.`,
      type: SwapType.ASA_TO_ASA,
      emoji: `🎴↔️🎴`,
      disabled: !isSafeVersion(LATEST_SWAP_PROXY_VERSION),
      swapPageUrl: `/swaps/asa-to-asa`,
    },
    {
      title: `ASAs to Algo`,
      description: `Swap up to five Assets for the desired Algo amount.`,
      type: SwapType.MULTI_ASA_TO_ALGO,
      emoji: `x🎴↔️💰`,
      swapPageUrl: `/swaps/asas-to-algo`,
      disabled: !isSafeVersion(LATEST_SWAP_PROXY_VERSION),
    },
  ];

  return (
    <div>
      <PageHeader
        title="🏠 Dashboard"
        description="⚠️ Creation of new swaps is disabled until the next version of AlgoWorld contracts is available, the update will introduce important security updates.
        "
      />

      <Container component="main" sx={{ pt: 5, pb: 15 }}>
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
