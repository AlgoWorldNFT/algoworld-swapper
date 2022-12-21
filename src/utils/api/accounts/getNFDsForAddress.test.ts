import { ChainType } from '@/models/Chain';
import axios from 'axios';
import getNFDsForAddress from './getNFDsForAddress';

jest.mock(`axios`);

describe(`getNFDsForAddress`, () => {
  it(`should return the NFD for the given address on mainnet`, async () => {
    const address = `tnaq9cjf54ct59bmua78iuv6gtpjtdunc78q8jebwgmxyacb`;
    const chain = ChainType.MainNet;
    const nfd = { name: `test-nfd` };
    const response = { data: [nfd] };

    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(
      response,
    );

    const result = await getNFDsForAddress(address, chain);
    expect(result).toEqual(nfd);
  });

  it(`should return the NFD for the given address on testnet`, async () => {
    const address = `tnaq9cjf54ct59bmua78iuv6gtpjtdunc78q8jebwgmxyacb`;
    const chain = ChainType.TestNet;
    const nfd = { name: `test-nfd` };
    const response = { data: [nfd] };

    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(
      response,
    );

    const result = await getNFDsForAddress(address, chain);
    expect(result).toEqual(nfd);
  });

  it(`should return null if the NFD is not found`, async () => {
    const address = `tnaq9cjf54ct59bmua78iuv6gtpjtdunc78q8jebwgmxyacb`;
    const chain = ChainType.MainNet;
    const response = { data: [] };

    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(
      response,
    );

    const result = await getNFDsForAddress(address, chain);
    expect(result).toBeNull();
  });

  it(`should return null if the request fails`, async () => {
    const address = `tnaq9cjf54ct59bmua78iuv6gtpjtdunc78q8jebwgmxyacb`;
    const chain = ChainType.MainNet;

    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(
      new Error(`Request failed`),
    );

    const result = await getNFDsForAddress(address, chain);
    expect(result).toBeNull();
  });
});
