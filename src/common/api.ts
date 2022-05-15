import axios from 'axios';

export const axiosFetcher = (url: string) =>
  axios.get(url).then((res) => res.data);

export const ALGORAND_LEDGER: string =
  process.env.VUE_APP_ALGORAND_LEDGER ?? `TestNet`;
export const ALGOEXPLORER_API_URL: string =
  ALGORAND_LEDGER.toLowerCase() === `mainnet`
    ? `https://node.algoexplorerapi.io`
    : `https://node.testnet.algoexplorerapi.io`;
export const ALGOEXPLORER_INDEXER_URL: string =
  ALGORAND_LEDGER.toLowerCase() === `mainnet`
    ? `https://algoindexer.algoexplorerapi.io`
    : `https://algoindexer.testnet.algoexplorerapi.io`;
export const ALGOEXPLORER_URL: string =
  ALGORAND_LEDGER.toLowerCase() === `mainnet`
    ? `https://algoexplorer.io`
    : `https://testnet.algoexplorer.io`;
