import { ChainType } from '@/models/Chain';

export const CHAIN_TYPE: ChainType =
  (process.env.NEXT_PUBLIC_CHAIN_TYPE ?? `TestNet`) === `TestNet`
    ? ChainType.TestNet
    : ChainType.MainNet;

export const ALGOEXPLORER_API_URL = (chain: ChainType) => {
  return chain.toLowerCase() === `mainnet`
    ? `https://node.algoexplorerapi.io`
    : `https://node.testnet.algoexplorerapi.io`;
};

export const ALGOEXPLORER_INDEXER_URL = (chain: ChainType) => {
  return chain.toLowerCase() === `mainnet`
    ? `https://algoindexer.algoexplorerapi.io`
    : `https://algoindexer.testnet.algoexplorerapi.io`;
};

export const ALGOEXPLORER_URL = (chain: ChainType) => {
  return chain.toLowerCase() === `mainnet`
    ? `https://algoexplorer.io`
    : `https://testnet.algoexplorer.io`;
};

export const EMPTY_ASSET_IMAGE_URL = `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`;
export const SWAP_PROXY_VERSION = `0.0.2`;

export const ASA_TO_ASA_FUNDING_FEE = Math.round((0.1 + 0.1 + 0.01) * 1e6);
export const ASA_TO_ALGO_MAX_FEE = 1_000;
export const ASA_TO_ALGO_FUNDING_BASE_FEE = ASA_TO_ASA_FUNDING_FEE;

export const INCENTIVE_WALLET = `RJVRGSPGSPOG7W3V7IMZZ2BAYCABW3YC5MWGKEOPAEEI5ZK5J2GSF6Y26A`;
export const INCENTIVE_FEE = 0.5 * 1e6;

export const TXN_SIGNING_CANCELLED_MESSAGE = `You have cancelled transactions signing...`;
