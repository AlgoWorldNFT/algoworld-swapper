export type Asset = {
  index: number;
  creator: string;
  name: string;
  imageUrl: string;
  decimals: number;
  unitName: string;
  amount: number;
  frozen: boolean;
  offeringAmount: number;
  requestingAmount: number;
};
