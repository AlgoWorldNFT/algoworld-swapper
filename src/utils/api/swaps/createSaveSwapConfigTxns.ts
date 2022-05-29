import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

export default async function createSaveSwapConfigTxns(
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  proxyLsig: LogicSigAccount,
  fundingFee: number,
  swapConfigurationCID: string,
) {
  const suggestedParams = await getTransactionParams(chain);

  const feeTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creatorAddress,
      to: proxyLsig.address(),
      amount: fundingFee,
      note: new Uint8Array(
        Buffer.from(
          `I am a fee transaction for configuring algoworld swapper proxy, thank you for using AlgoWorld Swapper :-)`,
        ),
      ),
      suggestedParams,
    }),
    TransactionToSignType.UserFeeTransaction,
  );

  const storeTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: proxyLsig.address(),
      to: proxyLsig.address(),
      amount: 0,
      note: new Uint8Array(Buffer.from(`ipfs://${swapConfigurationCID}`)),
      suggestedParams,
    }),
    TransactionToSignType.LsigTransaction,
  );

  return [feeTxn, storeTxn];
}
