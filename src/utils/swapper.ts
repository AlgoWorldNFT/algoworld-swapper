import { Asset } from '@/models/Asset';
import {
  LsigTransactionToSign,
  UserTransactionToSign,
} from '@/models/Transaction';
import { apiGetTxnParams } from '@/redux/helpers/api';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import { LogicSig } from 'algosdk/dist/types/src/logicsig';
import { ChainType } from './assets';

export const getAsaToAsaSwapCreateTxs = async (
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  escrowLsig: LogicSigAccount | LogicSig,
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
    amount: 1e6,
    assetIndex: offering.index,
    note: new Uint8Array(
      Buffer.from(
        ` I am an asset opt-in transaction for algoworld swapper escrow, thank you for using AlgoWorld Swapper (☞ ͡° ͜ʖ ͡°)☞`,
      ),
    ),
    suggestedParams,
  });

  return [
    { transaction: feeTxn, signer: creatorWallet } as UserTransactionToSign,
    { transaction: nftTxn, signer: escrowLsig } as LsigTransactionToSign,
  ];
};
