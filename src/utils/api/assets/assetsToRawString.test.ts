import assetsToRowString from './assetsToRawString';

describe(`assetsToRawString`, () => {
  test(`assetsToRowString returns correct string for assets with non-zero offering amounts`, () => {
    const assets = [
      {
        creator: ``,
        index: 0,
        name: `Algo`,
        imageUrl: ``,
        decimals: 6,
        unitName: `Algo`,
        amount: 1000,
        offeringAmount: 500,
        requestingAmount: 0,
        frozen: false,
      },
      {
        creator: ``,
        index: 1,
        name: `Test Asset`,
        imageUrl: ``,
        decimals: 2,
        unitName: `units`,
        amount: 2000,
        offeringAmount: 1000,
        requestingAmount: 0,
        frozen: false,
      },
    ];

    const expectedString = `Algo x500\nTest Asset x1000\n`;

    const result = assetsToRowString(assets);

    expect(result).toEqual(expectedString);
  });
});
