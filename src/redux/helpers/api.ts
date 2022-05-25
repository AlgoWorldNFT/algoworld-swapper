import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { getLogicSign } from '@/utils/accounts';
import { ipfsToProxyUrl } from '@/utils/ipfsToProxyUrl';
import { getCompiledSwapProxy } from '@/utils/swapper';
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

const algodForChain = (chain: ChainType): algosdk.Algodv2 => {
  switch (chain) {
    case ChainType.MainNet:
      return mainNetClient;
    case ChainType.TestNet:
      return testNetClient;
    default:
      throw new Error(`Unknown chain type: ${chain}`);
  }
};

export const apiGetAccountAssets = async (
  chain: ChainType,
  address: string,
): Promise<Asset[]> => {
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
            console.log(assetResponse);
            const assetParams = assetResponse[`params`];
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
};

export const apiGetTxnParams = async (
  chain: ChainType,
): Promise<algosdk.SuggestedParams> => {
  const params = await algodForChain(chain).getTransactionParams().do();
  return params;
};

export const waitForTransaction = async (
  chain: ChainType,
  txId: string,
): Promise<number> => {
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
};

export const apiSubmitTransactions = async (
  chain: ChainType,
  stxns: Uint8Array[],
): Promise<number> => {
  const { txId } = await algodForChain(chain).sendRawTransaction(stxns).do();
  return await waitForTransaction(chain, txId);
};

export const apiLoadSwaps = async (chain: ChainType, address: string) => {
  const compiledSwapProxy = await getCompiledSwapProxy({
    swap_creator: address,
  });
  const data = await compiledSwapProxy.data;

  const escrowLsig = getLogicSign(data[`result`]);

  const client = algodForChain(chain);

  // const accountInfo = await client
  //   .setIntDecoding(algosdk.IntDecoding.BIGINT)
  //   .do();
};
