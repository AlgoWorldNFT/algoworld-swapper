import { ipfsToProxyUrl } from '@/utils/ipfsToProxyUrl';

describe(`ipfsToProxyUrl()`, () => {
  it(`converts ipfs url correctly`, () => {
    const url = ipfsToProxyUrl(
      `ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu`,
    );

    expect(url).toEqual(
      `https://cf-ipfs.com/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu`,
    );
  });
});
