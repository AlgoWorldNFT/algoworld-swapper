export type Asset = {
  index: number;
  name: string;
  image_url: string;
  decimals: number;
  unit_name: string;
  availableAmount: number;
};

type Offering = {
  amount: number;
};

export type OfferingAsset = Asset & Offering;

type Requesting = {
  amount: number;
};

export type RequestingAsset = Asset & Requesting;
