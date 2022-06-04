export interface IAssetData {
  id: number;
  amount: bigint | string;
  creator: string;
  frozen: boolean;
  decimals: number;
  name?: string;
  unitName?: string;
  url?: string;
}

export interface IChainData {
  name: string;
  short_name: string;
  chain: string;
  network: string;
  chain_id: number;
  network_id: number;
  rpc_url: string;
  native_currency: IAssetData;
}

export interface ITxData {
  from: string;
  to: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  value: string;
  data: string;
}

export interface IBlockScoutTx {
  value: string;
  txreceipt_status: string;
  transactionIndex: string;
  to: string;
  timeStamp: string;
  nonce: string;
  isError: string;
  input: string;
  hash: string;
  gasUsed: string;
  gasPrice: string;
  gas: string;
  from: string;
  cumulativeGasUsed: string;
  contractAddress: string;
  confirmations: string;
  blockNumber: string;
  blockHash: string;
}

export interface IBlockScoutTokenTx {
  value: string;
  transactionIndex: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: string;
  to: string;
  timeStamp: string;
  nonce: string;
  input: string;
  hash: string;
  gasUsed: string;
  gasPrice: string;
  gas: string;
  from: string;
  cumulativeGasUsed: string;
  contractAddress: string;
  confirmations: string;
  blockNumber: string;
  blockHash: string;
}

export interface IParsedTx {
  timestamp: string;
  hash: string;
  from: string;
  to: string;
  nonce: string;
  gasPrice: string;
  gasUsed: string;
  fee: string;
  value: string;
  input: string;
  error: boolean;
  asset: IAssetData;
  operations: ITxOperation[];
}

export interface ITxOperation {
  asset: IAssetData;
  value: string;
  from: string;
  to: string;
  functionName: string;
}

export interface IGasPricesResponse {
  fastWait: number;
  avgWait: number;
  blockNum: number;
  fast: number;
  fastest: number;
  fastestWait: number;
  safeLow: number;
  safeLowWait: number;
  speed: number;
  block_time: number;
  average: number;
}

export interface IGasPrice {
  time: number;
  price: number;
}

export interface IGasPrices {
  timestamp: number;
  slow: IGasPrice;
  average: IGasPrice;
  fast: IGasPrice;
}

export interface IMethodArgument {
  type: string;
}

export interface IMethod {
  signature: string;
  name: string;
  args: IMethodArgument[];
}

/**
 * Options for creating and using a multisignature account.
 */
export interface IMultisigMetadata {
  /**
   * Multisig version.
   */
  version: number;

  /**
   * Multisig threshold value. Authorization requires a subset of
   * signatures, equal to or greater than the threshold value.
   */
  threshold: number;

  /**
   * List of Algorand addresses of possible signers for this
   * multisig. Order is important.
   */
  addrs: string[];
}

export interface IWalletTransaction {
  /**
   * Base64 encoding of the canonical msgpack encoding of a
   * Transaction.
   */
  txn: string;

  /**
   * Optional authorized address used to sign the transaction when
   * the account is rekeyed. Also called the signor/sgnr.
   */
  authAddr?: string;

  /**
   * Optional multisig metadata used to sign the transaction
   */
  msig?: IMultisigMetadata;

  /**
   * Optional list of addresses that must sign the transactions
   */
  signers?: string[];

  /**
   * Optional message explaining the reason of the transaction
   */
  message?: string;
}

export interface ISignTxnOpts {
  /**
   * Optional message explaining the reason of the group of
   * transactions.
   */
  message?: string;

  // other options may be present, but are not standard
}

export type SignTxnParams = [IWalletTransaction[], ISignTxnOpts?];

/* eslint-enable */
