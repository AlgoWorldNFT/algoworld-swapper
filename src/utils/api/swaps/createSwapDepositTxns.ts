import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

export default async function createSwapDepositTxns(
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  escrow: LogicSigAccount,
  offeringAsset: Asset,
  fundingFee: number,
) {
  const suggestedParams = await getTransactionParams(chain);

  const txns = [];

  if (offeringAsset.amount > fundingFee) {
    const feeTxn = createTransactionToSign(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: creatorAddress,
        to: escrow.address(),
        amount: Math.abs(fundingFee - offeringAsset.amount),
        note: new Uint8Array(
          Buffer.from(
            `I am a fee transaction for configuring algoworld swapper escrow min balance, thank you for using AlgoWorld Swapper :-)`,
          ),
        ),
        suggestedParams,
      }),
      TransactionToSignType.UserFeeTransaction,
    );
    txns.push(feeTxn);
  }

  const depositTxn = createTransactionToSign(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
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
    }),
    TransactionToSignType.UserTransaction,
  );
  txns.push(depositTxn);

  return txns;
}
