import { ALGOEXPLORER_API_URL, ALGOEXPLORER_INDEXER_URL } from '@/common/api';
import { Algodv2, Indexer } from 'algosdk';

export const algodClient = new Algodv2(ALGOEXPLORER_API_URL);
export const indexerClient = new Indexer(ALGOEXPLORER_INDEXER_URL);
