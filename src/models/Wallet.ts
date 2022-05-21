export enum WalletType {
  PeraWallet,
  MyAlgoWallet,
}

export type WalletClient = {
  type: WalletType;
  supported: boolean;
  title: string;
};
