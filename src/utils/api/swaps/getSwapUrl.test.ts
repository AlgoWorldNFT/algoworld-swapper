import { ChainType } from '@/models/Chain';
import { SwapConfiguration } from '@/models/Swap';
import getSwapUrl from './getSwapUrl';

describe(`getSwapUrl`, () => {
  it(`should return the correct URL for a mainnet swap`, () => {
    const swapConfiguration = {
      proxy: `proxy-address`,
      escrow: `escrow-address`,
    };
    const chain = ChainType.MainNet;

    const result = getSwapUrl(swapConfiguration as SwapConfiguration, chain);

    expect(result).toBe(
      `${window.location.origin}/swap/proxy-address/escrow-address?chain=mainnet`,
    );
  });

  it(`should return the correct URL for a testnet swap`, () => {
    const swapConfiguration = {
      proxy: `proxy-address`,
      escrow: `escrow-address`,
    };
    const chain = ChainType.TestNet;

    const result = getSwapUrl(swapConfiguration as SwapConfiguration, chain);

    expect(result).toBe(
      `${window.location.origin}/swap/proxy-address/escrow-address?chain=testnet`,
    );
  });
});
