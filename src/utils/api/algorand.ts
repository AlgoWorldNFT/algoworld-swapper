import { ChainType } from '@/models/Chain';
import algosdk from 'algosdk';

const mainNetAlgodClient = new algosdk.Algodv2(
  ``,
  `https://mainnet-api.algonode.cloud`,
  ``,
);
const testNetAlgodClient = new algosdk.Algodv2(
  ``,
  `https://testnet-api.algonode.cloud`,
  ``,
);

const mainNetIndexerClient = new algosdk.Indexer(
  ``,
  `https://mainnet-idx.algonode.cloud`,
  ``,
);
const testNetIndexerClient = new algosdk.Indexer(
  ``,
  `https://testnet-idx.algonode.cloud`,
  ``,
);

export const algodForChain = (chain: ChainType): algosdk.Algodv2 => {
  switch (chain) {
    case ChainType.MainNet:
      return mainNetAlgodClient;
    case ChainType.TestNet:
      return testNetAlgodClient;
    default:
      throw new Error(`Unknown chain type: ${chain}`);
  }
};

export const indexerForChain = (chain: ChainType): algosdk.Indexer => {
  switch (chain) {
    case ChainType.MainNet:
      return mainNetIndexerClient;
    case ChainType.TestNet:
      return testNetIndexerClient;
    default:
      throw new Error(`Unknown chain type: ${chain}`);
  }
};
