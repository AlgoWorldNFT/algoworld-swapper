import filterAsync from './filterAsync';

describe(`filterAsync`, () => {
  test(`filters array based on callback`, async () => {
    const input = [1, 2, 3, 4, 5, 6];
    const output = await filterAsync(input, async (x) => x % 2 === 0);
    expect(output).toEqual([2, 4, 6]);
  });
});
