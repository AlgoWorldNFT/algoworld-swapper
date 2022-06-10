import { INCENTIVE_FEE, INCENTIVE_WALLET } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

async function createAsaToAsaSwapPerformTxns(
  chain: ChainType,
  userAddress: string,
  userWallet: WalletConnect,
  creatorAddress: string,
  escrowLsig: LogicSigAccount,
  offering: Asset,
  requesting: Asset,
) {
  const suggestedParams = await getTransactionParams(chain);

  const note = `I am a asset transfer transaction to perform swap. thank you for using AlgoWorld Swapper! :-)`;

  const txns = [];

  const offeredAsaXferTxn = createTransactionToSign(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: escrowLsig.address(),
      to: userAddress,
      amount: offering.offeringAmount,
      assetIndex: offering.index,
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    escrowLsig,
    TransactionToSignType.LsigTransaction,
  );

  txns.push(offeredAsaXferTxn);

  const requestedAsaXferTxn = createTransactionToSign(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: creatorAddress,
      amount: requesting.requestingAmount,
      assetIndex: requesting.index,
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    userWallet,
    TransactionToSignType.UserTransaction,
  );
  txns.push(requestedAsaXferTxn);

  const incentiveFeeTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: INCENTIVE_WALLET,
      amount: INCENTIVE_FEE,
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    userWallet,
    TransactionToSignType.UserFeeTransaction,
  );
  txns.push(incentiveFeeTxn);

  return txns;
}

async function createAsasToAlgoSwapPerformTxns(
  chain: ChainType,
  userAddress: string,
  userWallet: WalletConnect,
  creatorAddress: string,
  escrowLsig: LogicSigAccount,
  offering: Asset[],
  requestingAlgoAmount: number,
) {
  const suggestedParams = await getTransactionParams(chain);

  const note = `I am a asset transfer transaction to perform swap. thank you for using AlgoWorld Swapper! :-)`;
  const txns = [];

  const incentiveFeeTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: INCENTIVE_WALLET,
      amount: INCENTIVE_FEE,
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    userWallet,
    TransactionToSignType.UserFeeTransaction,
  );
  txns.push(incentiveFeeTxn);

  const requestedAlgoTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: creatorAddress,
      amount: requestingAlgoAmount,
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    userWallet,
    TransactionToSignType.UserTransaction,
  );
  txns.push(requestedAlgoTxn);

  for (const asset of offering) {
    const offeredAsaXferTxn = createTransactionToSign(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: escrowLsig.address(),
        to: userAddress,
        amount: asset.offeringAmount,
        assetIndex: asset.index,
        note: new Uint8Array(Buffer.from(note)),
        suggestedParams,
      }),
      escrowLsig,
      TransactionToSignType.LsigTransaction,
    );

    txns.push(offeredAsaXferTxn);
  }

  return txns;
}

export default async function createPerformSwapTxns(
  chain: ChainType,
  userAddress: string,
  userWallet: WalletConnect,
  escrowLsig: LogicSigAccount,
  swapConfiguration: SwapConfiguration,
) {
  const txns =
    swapConfiguration.type === SwapType.ASA_TO_ASA
      ? await createAsaToAsaSwapPerformTxns(
          chain,
          userAddress,
          userWallet,
          swapConfiguration.creator,
          escrowLsig,
          swapConfiguration.offering[0],
          swapConfiguration.requesting[0],
        )
      : await createAsasToAlgoSwapPerformTxns(
          chain,
          userAddress,
          userWallet,
          swapConfiguration.creator,
          escrowLsig,
          swapConfiguration.offering,
          swapConfiguration.requesting[0].requestingAmount,
        );

  return txns;
}
