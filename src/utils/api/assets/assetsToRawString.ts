import { Asset } from '@/models/Asset';

const assetsToRowString = (assets: Asset[], offering = true) => {
  let response = ``;

  for (const asset of assets) {
    response += `${asset.name} x${
      offering ? asset.offeringAmount : asset.requestingAmount
    }\n`;
  }

  return response;
};

export default assetsToRowString;
