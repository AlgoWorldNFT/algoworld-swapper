import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { SwapConfiguration } from '@/models/Swap';
import { apiGetTxnParams } from '@/redux/helpers/api';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount, Transaction } from 'algosdk';
import axios from 'axios';

const getWalletConnectTxn = (txn: Transaction, sign: boolean) => {
  const encodedTxn = Buffer.from(
    algosdk.encodeUnsignedTransaction(txn),
  ).toString(`base64`);

  return {
    txn: encodedTxn,
    message: `Description of transaction being signed`,
    // Note: if the transaction does not need to be signed (because it's part of an atomic group
    // that will be signed by another party), specify an empty singers array like so:
    signers: sign ? undefined : [],
  };
};

export const getCompiledSwap = (params: { [key: string]: string | number }) => {
  return axios.get(`/api/swappers/compileSwap`, {
    params: params,
  });
};

export const getCompiledSwapProxy = (params: {
  [key: string]: string | number;
}) => {
  return axios.get(`/api/swappers/compileSwapProxy`, {
    params: params,
  });
};

export const getAsaToAsaInitSwapStxns = async (
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  escrowLsig: LogicSigAccount,
  fundingFee: number,
  offering: Asset,
) => {
  const suggestedParams = await apiGetTxnParams(chain);

  const feeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: creatorAddress,
    to: escrowLsig.address(),
    amount: fundingFee,
    note: new Uint8Array(
      Buffer.from(
        `I am a fee transaction for configuring algoworld swapper escrow, thank you for using AlgoWorld Swapper :-)`,
      ),
    ),
    suggestedParams,
  });

  const nftTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: escrowLsig.address(),
    to: escrowLsig.address(),
    amount: 0,
    assetIndex: offering.index,
    note: new Uint8Array(
      Buffer.from(
        ` I am an asset opt-in transaction for algoworld swapper escrow, thank you for using AlgoWorld Swapper (☞ ͡° ͜ʖ ͡°)☞`,
      ),
    ),
    suggestedParams,
  });

  const txnGroup = algosdk.assignGroupID([feeTxn, nftTxn]);

  const userRequest = formatJsonRpcRequest(`algo_signTxn`, [
    [
      getWalletConnectTxn(txnGroup[0], true),
      getWalletConnectTxn(txnGroup[1], false),
    ],
  ]);

  const signedUserTransactionsaResult = await creatorWallet.sendCustomRequest(
    userRequest,
  );
  const signedUserTransactions = signedUserTransactionsaResult.map(
    (element: string) => {
      return element ? new Uint8Array(Buffer.from(element, `base64`)) : null;
    },
  );

  const signedEscrowTx = algosdk.signLogicSigTransactionObject(
    txnGroup[1],
    escrowLsig,
  );

  const signedTxs = [signedUserTransactions[0], signedEscrowTx.blob];

  return signedTxs;
};

export const storeSwapConfiguration = (configuration: SwapConfiguration) => {
  return axios.post(`/api/storage/storeConfiguration`, configuration);
};

export const getStoreSwapConfigurationTxns = async (
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  proxyLsig: LogicSigAccount,
  fundingFee: number,
  swapConfigurationCID: string,
) => {
  const suggestedParams = await apiGetTxnParams(chain);

  const feeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: creatorAddress,
    to: proxyLsig.address(),
    amount: fundingFee,
    note: new Uint8Array(
      Buffer.from(
        `I am a fee transaction for configuring algoworld swapper proxy, thank you for using AlgoWorld Swapper :-)`,
      ),
    ),
    suggestedParams,
  });

  const storeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: proxyLsig.address(),
    to: proxyLsig.address(),
    amount: 0,
    note: new Uint8Array(Buffer.from(`ipfs://${swapConfigurationCID}`)),
    suggestedParams,
  });

  const txnGroup = algosdk.assignGroupID([feeTxn, storeTxn]);

  const userRequest = formatJsonRpcRequest(`algo_signTxn`, [
    [
      getWalletConnectTxn(txnGroup[0], true),
      getWalletConnectTxn(txnGroup[1], false),
    ],
  ]);

  const signedUserTransactionsaResult = await creatorWallet.sendCustomRequest(
    userRequest,
  );
  const signedUserTransactions = signedUserTransactionsaResult.map(
    (element: string) => {
      return element ? new Uint8Array(Buffer.from(element, `base64`)) : null;
    },
  );

  const signedEscrowTx = algosdk.signLogicSigTransactionObject(
    txnGroup[1],
    proxyLsig,
  );

  const signedTxs = [signedUserTransactions[0], signedEscrowTx.blob];

  return signedTxs;
};

export const getSwapDepositTxns = async (
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  escrow: LogicSigAccount,
  offeringAsset: Asset,
  fundingFee: number,
) => {
  const suggestedParams = await apiGetTxnParams(chain);

  const txns = [];

  if (offeringAsset.amount > fundingFee) {
    const feeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creatorAddress,
      to: escrow.address(),
      amount: Math.abs(fundingFee - offeringAsset.amount),
      note: new Uint8Array(
        Buffer.from(
          `I am a fee transaction for configuring algoworld swapper escrow min balance, thank you for using AlgoWorld Swapper :-)`,
        ),
      ),
      suggestedParams,
    });
    txns.push(feeTxn);
  }

  const depositTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: creatorAddress,
    to: escrow.address(),
    amount: offeringAsset.offeringAmount,
    assetIndex: offeringAsset.index,
    note: new Uint8Array(
      Buffer.from(
        `Transcation for the depositing asset ${
          offeringAsset.index
        } to swapper ${escrow.address()}, thank you for using AlgoWorld Swapper :-)`,
      ),
    ),
    suggestedParams,
  });
  txns.push(depositTxn);

  const txnGroup = algosdk.assignGroupID(txns);

  const userRequest = formatJsonRpcRequest(`algo_signTxn`, [
    [
      ...txnGroup.map((txn) => {
        return getWalletConnectTxn(txn, true);
      }),
    ],
  ]);

  const signedUserTransactionsaResult = await creatorWallet.sendCustomRequest(
    userRequest,
  );

  return signedUserTransactionsaResult.map((element: string) => {
    return element ? new Uint8Array(Buffer.from(element, `base64`)) : null;
  });
};
