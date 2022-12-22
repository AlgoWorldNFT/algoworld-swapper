import { ChainType } from '@/models/Chain';
import { IpfsGateway } from '@/models/Gateway';
import { generateAccount } from 'algosdk';
import getAssetsForAccount from './getAssetsForAccount';

describe(`getAssetsForAccount`, () => {
  test(`returns assets for given account`, async () => {
    const account = generateAccount();
    const chain = ChainType.TestNet;
    const output = await getAssetsForAccount(
      chain,
      IpfsGateway.ALGONODE_IO,
      account.addr,
    );
    expect(output[0].name).toEqual(`Algo`);
  });
});
