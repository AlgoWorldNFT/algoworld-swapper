import { SwapConfiguration } from '@/models/Swap';
import swapExists from './swapExists';

describe(`swapExists`, () => {
  it(`should return true if there is at least one swap configuration with the specified escrow address`, () => {
    const swapConfigs = [
      { escrow: `0x123` },
      { escrow: `0x456` },
    ] as SwapConfiguration[];
    expect(swapExists(`0x123`, swapConfigs)).toBe(true);
  });

  it(`should return false if there are no swap configurations with the specified escrow address`, () => {
    const swapConfigs = [
      { escrow: `0x123` },
      { escrow: `0x456` },
    ] as SwapConfiguration[];
    expect(swapExists(`0x789`, swapConfigs)).toBe(false);
  });
});
