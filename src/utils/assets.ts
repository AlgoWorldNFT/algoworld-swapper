import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { indexerClient } from './algorand';
import { ipfsToProxyUrl } from './ipfsToProxyUrl';

import algosdk from 'algosdk';

export enum ChainType {
  MainNet = `mainnet`,
  TestNet = `testnet`,
}

const mainNetClient = new algosdk.Algodv2(
  ``,
  `https://mainnet-api.algonode.cloud`,
  ``,
);
const testNetClient = new algosdk.Algodv2(
  ``,
  `https://testnet-api.algonode.cloud`,
  ``,
);

function algodForChain(chain: ChainType): algosdk.Algodv2 {
  switch (chain) {
    case ChainType.MainNet:
      return mainNetClient;
    case ChainType.TestNet:
      return testNetClient;
    default:
      throw new Error(`Unknown chain type: ${chain}`);
  }
}

function indexerForChain(chain: ChainType): algosdk.Indexer {
  return indexerClient;
}

async function waitForTransaction(
  chain: ChainType,
  txId: string,
): Promise<number> {
  const client = algodForChain(chain);

  let lastStatus = await client.status().do();
  let lastRound = lastStatus[`last-round`];
  while (true) {
    const status = await client.pendingTransactionInformation(txId).do();
    if (status[`pool-error`]) {
      throw new Error(`Transaction Pool Error: ${status[`pool-error`]}`);
    }
    if (status[`confirmed-round`]) {
      return status[`confirmed-round`];
    }
    lastStatus = await client.statusAfterBlock(lastRound + 1).do();
    lastRound = lastStatus[`last-round`];
  }
}

export async function apiGetAccountAssets(
  chain: ChainType,
  address: string,
): Promise<Asset[]> {
  const client = algodForChain(chain);

  const accountInfo = await client
    .accountInformation(address)
    .setIntDecoding(algosdk.IntDecoding.BIGINT)
    .do();

  const algoBalance = accountInfo.amount.toString();
  const assetsFromRes: Array<{
    'asset-id': bigint;
    amount: bigint;
    'is-frozen': boolean;
  }> = accountInfo.assets;

  const assets: Asset[] = assetsFromRes.map(
    ({ 'asset-id': id, amount, 'is-frozen': frozen }) => ({
      creator: ``,
      index: Number(id),
      name: ``,
      imageUrl: EMPTY_ASSET_IMAGE_URL,
      decimals: 0,
      unitName: ``,
      amount: Number(amount),
      offeringAmount: 0,
      frozen: frozen,
      requestingAmount: 0,
    }),
  );

  assets.sort((a, b) => a.index - b.index);

  await Promise.all(
    assets.map((asset, i) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            const assetResponse = await client.getAssetByID(asset.index).do();
            const assetParams = assetResponse.asset[`params`];
            asset[`name`] = assetParams.hasOwnProperty(`name`)
              ? assetParams[`name`]
              : ``;
            asset[`imageUrl`] = assetParams.hasOwnProperty(`url`)
              ? ipfsToProxyUrl(assetParams[`url`])
              : EMPTY_ASSET_IMAGE_URL;
            asset[`decimals`] = assetParams[`decimals`];
            asset[`unitName`] = assetParams[`unit-name`];
            asset[`creator`] = assetParams[`creator`];
          } catch (error) {
            console.error(`asset:`, asset.index, error);
          }
          resolve();
        }, 25 * i);
      });
    }),
  );

  assets.unshift({
    index: 0,
    amount: algoBalance,
    creator: ``,
    frozen: false,
    imageUrl: EMPTY_ASSET_IMAGE_URL,
    decimals: 6,
    name: `Algo`,
    unitName: `Algo`,
    offeringAmount: 0,
    requestingAmount: 0,
  });

  return assets;
}

export async function apiGetTxnParams(
  chain: ChainType,
): Promise<algosdk.SuggestedParams> {
  const params = await algodForChain(chain).getTransactionParams().do();
  return params;
}

export async function apiSubmitTransactions(
  chain: ChainType,
  stxns: Uint8Array[],
): Promise<number> {
  const { txId } = await algodForChain(chain).sendRawTransaction(stxns).do();
  console.log(txId);
  return await waitForTransaction(chain, txId);
}

const lookupAsset = async (index: number) => {
  let loadedAsset = await indexerClient.lookupAssetByID(index).do();
  loadedAsset = loadedAsset.asset;
  const assetParams = loadedAsset[`params`];
  console.log(assetParams);
  const asset = {
    index: loadedAsset[`index`],
    name: assetParams.hasOwnProperty(`name`) ? assetParams[`name`] : ``,
    imageUrl: assetParams.hasOwnProperty(`url`)
      ? ipfsToProxyUrl(assetParams[`url`])
      : EMPTY_ASSET_IMAGE_URL,
    decimals: assetParams[`decimals`],
    unitName: assetParams[`unit-name`],
    amount: assetParams[`total`],
    offeringAmount: 0,
    requestingAmount: 0,
  } as Asset;

  return asset;
};

export const loadOwningAssets = async (address: string) => {
  const noteEncoded = Buffer.from(`awe_`).toString(`base64`);

  const response = await indexerClient
    .lookupAccountTransactions(address)
    .notePrefix(noteEncoded)
    .do();

  const assets: Asset[] = await Promise.all(
    response.assets.map((asset: Record<string, any>) => {
      return lookupAsset(asset[`asset-id`]);
    }),
  );

  return assets;
};
