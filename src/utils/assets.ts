import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { ipfsToProxyUrl } from './ipfsToProxyUrl';

import algosdk from 'algosdk';
import { ChainType } from '@/models/Chain';
import { algodForChain } from './algorand';
import { SubmitTransactionResponse } from '@/models/Transaction';

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
          } catch (error) {}
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
): Promise<SubmitTransactionResponse> {
  const { txId } = await algodForChain(chain).sendRawTransaction(stxns).do();

  return {
    confirmedRound: await waitForTransaction(chain, txId),
    txId: txId,
  } as SubmitTransactionResponse;
}

// const lookupAsset = async (index: number) => {
//   let loadedAsset = await indexerClient.lookupAssetByID(index).do();
//   loadedAsset = loadedAsset.asset;
//   const assetParams = loadedAsset[`params`];
//
//   const asset = {
//     index: loadedAsset[`index`],
//     name: assetParams.hasOwnProperty(`name`) ? assetParams[`name`] : ``,
//     imageUrl: assetParams.hasOwnProperty(`url`)
//       ? ipfsToProxyUrl(assetParams[`url`])
//       : EMPTY_ASSET_IMAGE_URL,
//     decimals: assetParams[`decimals`],
//     unitName: assetParams[`unit-name`],
//     amount: assetParams[`total`],
//     offeringAmount: 0,
//     requestingAmount: 0,
//   } as Asset;

//   return asset;
// };
