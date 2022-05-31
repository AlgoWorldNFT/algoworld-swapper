import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

export default async function createSwapDeactivateTxns(
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  escrow: LogicSigAccount,
  offeringAsset: Asset,
) {
  const suggestedParams = await getTransactionParams(chain);

  const txns = [];

  const closeAsaTxn = createTransactionToSign(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: escrow.address(),
      to: creatorAddress,
      amount: 0,
      assetIndex: offeringAsset.index,
      closeRemainderTo: creatorAddress,
      note: new Uint8Array(
        Buffer.from(
          `I am a fee transaction for closing algoworld swapper escrow, thank you for using AlgoWorld Swapper :-)`,
        ),
      ),
      suggestedParams,
    }),
    escrow,
    TransactionToSignType.LsigFeeTransaction,
  );
  txns.push(closeAsaTxn);

  const closeSwapTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: escrow.address(),
      to: creatorAddress,
      amount: 0,
      closeRemainderTo: creatorAddress,
      note: new Uint8Array(
        Buffer.from(
          `Transcation for the closing algoworld swapper escrow, thank you for using AlgoWorld Swapper :-)`,
        ),
      ),
      suggestedParams,
    }),
    escrow,
    TransactionToSignType.UserTransaction,
  );
  txns.push(closeSwapTxn);

  const proofTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creatorAddress,
      to: creatorAddress,
      amount: 0,
      note: new Uint8Array(
        Buffer.from(
          `Transcation for the closing algoworld swapper escrow, thank you for using AlgoWorld Swapper :-)`,
        ),
      ),
      suggestedParams,
    }),
    creatorWallet,
    TransactionToSignType.UserTransaction,
  );
  txns.push(proofTxn);

  return txns;
}
