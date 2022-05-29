import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import WalletConnect from '@walletconnect/client';
import {
  assignGroupID,
  LogicSigAccount,
  signLogicSigTransactionObject,
} from 'algosdk';
import getWalletConnectTxn from './walletConnect/getWalletConnectTxn';

export default async function signTransactions(
  transactions: TransactionToSign[],
  userWallet: WalletConnect,
) {
  console.log(transactions);

  const rawTxns = [...transactions.map((txn) => txn.transaction)];
  const txnGroup = assignGroupID(rawTxns);
  console.log(rawTxns);
  console.log(txnGroup);
  const rpcRequestTxns = [
    ...txnGroup.map((value, index) => {
      if (
        transactions[index].type === TransactionToSignType.UserTransaction ||
        transactions[index].type === TransactionToSignType.UserFeeTransaction
      ) {
        console.log(`inside` + value);
        return getWalletConnectTxn(value, true);
      } else {
        return getWalletConnectTxn(value, false);
      }
    }),
  ];

  const userRequest = formatJsonRpcRequest(`algo_signTxn`, rpcRequestTxns);

  console.log(userRequest);
  const signedUserTransactionsResult = await userWallet.sendCustomRequest(
    userRequest,
  );
  console.log(`send request`);

  const signedUserTransactions: (Uint8Array | null)[] =
    signedUserTransactionsResult.map((element: string) => {
      return element ? new Uint8Array(Buffer.from(element, `base64`)) : null;
    });

  const signedTxs = signedUserTransactions.map((signedTx, index) => {
    if (signedTx === null) {
      return signLogicSigTransactionObject(
        txnGroup[index],
        transactions[index].signer as LogicSigAccount,
      ).blob;
    }
  }) as Uint8Array[];

  return signedTxs;
}

// export const getStoreSwapConfigurationTxns = async (
//   chain: ChainType,
//   creatorAddress: string,
//   creatorWallet: WalletConnect,
//   proxyLsig: LogicSigAccount,
//   fundingFee: number,
//   swapConfigurationCID: string,
// ) => {
//   const suggestedParams = await apiGetTxnParams(chain);

//   const feeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
//     from: creatorAddress,
//     to: proxyLsig.address(),
//     amount: fundingFee,
//     note: new Uint8Array(
//       Buffer.from(
//         `I am a fee transaction for configuring algoworld swapper proxy, thank you for using AlgoWorld Swapper :-)`,
//       ),
//     ),
//     suggestedParams,
//   });

//   const storeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
//     from: proxyLsig.address(),
//     to: proxyLsig.address(),
//     amount: 0,
//     note: new Uint8Array(Buffer.from(`ipfs://${swapConfigurationCID}`)),
//     suggestedParams,
//   });

//   const txnGroup = algosdk.assignGroupID([feeTxn, storeTxn]);

//   const userRequest = formatJsonRpcRequest(`algo_signTxn`, [
//     [
//       getWalletConnectTxn(txnGroup[0], true),
//       getWalletConnectTxn(txnGroup[1], false),
//     ],
//   ]);

//   const signedUserTransactionsaResult = await creatorWallet.sendCustomRequest(
//     userRequest,
//   );
//   const signedUserTransactions = signedUserTransactionsaResult.map(
//     (element: string) => {
//       return element ? new Uint8Array(Buffer.from(element, `base64`)) : null;
//     },
//   );

//   const signedEscrowTx = algosdk.signLogicSigTransactionObject(
//     txnGroup[1],
//     proxyLsig,
//   );

//   const signedTxs = [signedUserTransactions[0], signedEscrowTx.blob];

//   return signedTxs;
// };
