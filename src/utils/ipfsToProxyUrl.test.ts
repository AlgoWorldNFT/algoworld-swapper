import { IpfsGateway } from '@/models/Gateway';
import { ipfsToProxyUrl } from '@/utils/ipfsToProxyUrl';

describe(`ipfsToProxyUrl()`, () => {
  it(`converts ipfs url correctly`, () => {
    const url = ipfsToProxyUrl(
      `ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu`,
      IpfsGateway.ALGONODE_IO,
    );

    expect(url).toEqual(
      `https://ipfs.algonode.xyz/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu`,
    );
  });
});
