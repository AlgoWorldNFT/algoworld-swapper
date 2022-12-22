import { ChainType } from '@/models/Chain';
import { generateAccount } from 'algosdk';
import getAssetBalance from './getAssetBalance';

describe(`getAssetBalance`, () => {
  test(`returns asset balance for given index and account`, async () => {
    const account = generateAccount();
    const index = 123;
    const chain = ChainType.TestNet;
    const output = await getAssetBalance(index, account.addr, chain);
    expect(output).toEqual(-1);
  });
});
