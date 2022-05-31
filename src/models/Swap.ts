import { Asset } from './Asset';

export enum SwapType {
  ASA_TO_ASA,
  MULTI_ASA_TO_ALGO,
}

export type SwapConfiguration = {
  version: string;
  type: SwapType;
  offering: Asset[];
  requesting: Asset[];
  creator: string;
  proxy: string;
  escrow: string;
};
