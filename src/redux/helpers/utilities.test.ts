import { capitalize, ellipseText, ellipseAddress } from './utilities';

describe(`capitalize`, () => {
  it(`should capitalize the first letter of each word in a string`, () => {
    expect(capitalize(`hello world`)).toBe(`Hello World`);
    expect(capitalize(`Hello World`)).toBe(`Hello World`);
    expect(capitalize(`hELLO wORLD`)).toBe(`Hello World`);
  });
});

describe(`ellipseText`, () => {
  it(`should return the text if it is shorter than the max length`, () => {
    expect(ellipseText(`Hello World`, 100)).toBe(`Hello World`);
  });

  it(`should return the text with an ellipse at the end if it is longer than the max length`, () => {
    expect(ellipseText(`Hello World`, 8)).toBe(`Hello...`);
  });
});

describe(`ellipseAddress`, () => {
  it(`should return the address with an ellipse in the middle`, () => {
    expect(ellipseAddress(`1234567890ABCDEFGHIJKLMNOPQRSTUV`)).toBe(
      `123456...QRSTUV`,
    );
  });
});
