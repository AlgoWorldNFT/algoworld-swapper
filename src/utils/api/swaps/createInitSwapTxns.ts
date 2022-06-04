import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

export default async function createInitSwapTxns(
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  escrowLsig: LogicSigAccount,
  fundingFee: number,
  offeringAssets: Asset[],
) {
  const suggestedParams = await getTransactionParams(chain);

  const txns = [];

  const feeTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creatorAddress,
      to: escrowLsig.address(),
      amount: fundingFee,
      note: new Uint8Array(
        Buffer.from(
          `I am a fee transaction for configuring algoworld swapper escrow, thank you for using AlgoWorld Swapper :-)`,
        ),
      ),
      suggestedParams,
    }),
    creatorWallet,
    TransactionToSignType.UserFeeTransaction,
  );

  txns.push(feeTxn);

  for (const asset of offeringAssets) {
    const nftTxn = createTransactionToSign(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: escrowLsig.address(),
        to: escrowLsig.address(),
        amount: 0,
        assetIndex: Number(asset.index),
        note: new Uint8Array(
          Buffer.from(
            ` I am an asset opt-in transaction for algoworld swapper escrow, thank you for using AlgoWorld Swapper (☞ ͡° ͜ʖ ͡°)☞`,
          ),
        ),
        suggestedParams,
      }),
      escrowLsig,
      TransactionToSignType.LsigTransaction,
    );
    txns.push(nftTxn);
  }

  return txns;
}
