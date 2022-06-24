import AlgoExplorerUrlType from '@/models/AlgoExplorerUrlType';
import { ChainType } from '@/models/Chain';
import createAlgoExplorerUrl from '@/utils/createAlgoExplorerUrl';

describe(`createAlgoExplorerUrl()`, () => {
  it.each([
    [
      `test`,
      ChainType.MainNet,
      AlgoExplorerUrlType.Address,
      `https://algoexplorer.io/address/test`,
    ],
    [
      `test`,
      ChainType.MainNet,
      AlgoExplorerUrlType.Asset,
      `https://algoexplorer.io/asset/test`,
    ],
    [
      `test`,
      ChainType.MainNet,
      AlgoExplorerUrlType.Transaction,
      `https://algoexplorer.io/tx/test`,
    ],
    [
      `test`,
      ChainType.TestNet,
      AlgoExplorerUrlType.Address,
      `https://testnet.algoexplorer.io/address/test`,
    ],
    [
      `test`,
      ChainType.TestNet,
      AlgoExplorerUrlType.Asset,
      `https://testnet.algoexplorer.io/asset/test`,
    ],
    [
      `test`,
      ChainType.TestNet,
      AlgoExplorerUrlType.Transaction,
      `https://testnet.algoexplorer.io/tx/test`,
    ],
  ])(
    `creates url for %p %p %p expecting url %p`,
    (
      input: string,
      chainType: ChainType,
      urlType: AlgoExplorerUrlType,
      expectedUrl: string,
    ) => {
      expect(createAlgoExplorerUrl(chainType, input, urlType)).toEqual(
        expectedUrl,
      );
    },
  );
});
