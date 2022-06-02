import { INCENTIVE_FEE, INCENTIVE_WALLET } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

export default async function createPerformSwapTxns(
  chain: ChainType,
  userAddress: string,
  userWallet: WalletConnect,
  creatorAddress: string,
  escrowLsig: LogicSigAccount,
  offering: Asset,
  requesting: Asset,
) {
  const suggestedParams = await getTransactionParams(chain);

  const note = `I am a asset transfer transaction to swap ${offering.index} x ${offering.offeringAmount} for ${requesting.index} x ${requesting.requestingAmount} - thank you for using AlgoWorld Swapper! :-)`;

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

  console.log(`requestedAsaXferTxn`, requestedAsaXferTxn.transaction.txID());
  console.log(`offeredAsaXferTxn`, offeredAsaXferTxn.transaction.txID());
  console.log(`incentiveFeeTxn`, incentiveFeeTxn.transaction.txID());

  return [offeredAsaXferTxn, requestedAsaXferTxn, incentiveFeeTxn];
}
