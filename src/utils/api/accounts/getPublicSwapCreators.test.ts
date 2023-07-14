import { ALGONODE_INDEXER_URL } from '@/common/constants';
import { ChainType } from '@/models/Chain';
import { IpfsGateway } from '@/models/Gateway';
import axios from 'axios';
import getPublicSwapCreators from './getPublicSwapCreators';

describe(`getPublicSwapCreators`, () => {
  test(`getPublicSwapCreators makes correct GET request without nextToken`, async () => {
    const mockAxios = jest.spyOn(axios, `get`);
    const assetId = 1;
    const gateway = {} as IpfsGateway;
    const chain = ChainType.TestNet;
    const limit = 10;
    const expectedUrl = `${ALGONODE_INDEXER_URL(
      chain,
    )}/v2/accounts?asset-id=${assetId}&limit=${limit}&exclude=all`;

    await getPublicSwapCreators(assetId, gateway, chain, limit);

    expect(mockAxios).toHaveBeenCalledWith(expectedUrl);
  });

  test(`getPublicSwapCreators makes correct GET request with nextToken`, async () => {
    const mockAxios = jest.spyOn(axios, `get`);
    const assetId = 1;
    const gateway = {} as IpfsGateway;
    const chain = ChainType.TestNet;
    const limit = 10;
    const nextToken = `abc`;
    const expectedUrl = `${ALGONODE_INDEXER_URL(
      chain,
    )}/v2/accounts?asset-id=${assetId}&limit=${limit}&exclude=all&next=${nextToken}`;

    await getPublicSwapCreators(assetId, gateway, chain, limit, nextToken);

    expect(mockAxios).toHaveBeenCalledWith(expectedUrl);
  });
});
