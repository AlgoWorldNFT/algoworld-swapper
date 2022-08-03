import { Asset } from '@/models/Asset';

const assetsToRowString = (assets: Asset[], offering = true) => {
  let response = ``;

  let index = 1;
  for (const asset of assets) {
    response += `${asset.name} x${
      offering ? asset.offeringAmount : asset.requestingAmount
    }\n`;
    index += 1;
  }

  return response;
};

export default assetsToRowString;
