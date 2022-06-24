import formatAmount from '@/utils/formatAmount';

describe(`formatAmount()`, () => {
  it(`formats amount correctly`, () => {
    expect(formatAmount(54_000_000, 6)).toEqual(54);
    expect(formatAmount(0, 2)).toEqual(0);
    expect(formatAmount(554, 2)).toEqual(5.54);
  });
});
