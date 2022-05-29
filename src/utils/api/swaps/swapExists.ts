import { SwapConfiguration } from '@/models/Swap';

export default function swapExists(
  escrow: string,
  swapConfigs: SwapConfiguration[],
) {
  return swapConfigs.filter((config) => config.escrow === escrow).length > 0;
}
