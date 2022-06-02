import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import getAccountInfo from '../accounts/getAccountInfo';
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
  const escrowAccountInfo = await getAccountInfo(chain, escrow.address());

  const escrowBalance =
    escrowAccountInfo && `account` in escrowAccountInfo
      ? escrowAccountInfo.account.amount
      : 0;

  if (offeringAsset.amount > fundingFee) {
    const feeTxn = createTransactionToSign(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: creatorAddress,
        to: escrow.address(),
        amount: Math.abs(fundingFee - escrowBalance),
        note: new Uint8Array(
          Buffer.from(
            `I am a fee transaction for configuring algoworld swapper escrow min balance, thank you for using AlgoWorld Swapper :-)`,
          ),
        ),
        suggestedParams,
      }),
      creatorWallet,
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
    creatorWallet,
    TransactionToSignType.UserTransaction,
  );
  txns.push(depositTxn);

  return txns;
}
