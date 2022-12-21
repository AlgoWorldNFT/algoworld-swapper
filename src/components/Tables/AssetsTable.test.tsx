import * as React from 'react';
import AssetsTable from './AssetsTable';
import renderWithProviders from '@/__utils__/renderWithProviders';

describe(`AssetsTable`, () => {
  it(`should render the assets table`, () => {
    const { container } = renderWithProviders(<AssetsTable assets={[]} />);
    expect(container).toBeDefined();
  });
});
