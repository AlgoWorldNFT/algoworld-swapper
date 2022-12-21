import * as React from 'react';
import MySwapsTable from './MySwapsTable';
import renderWithProviders from '@/__utils__/renderWithProviders';

describe(`MySwapsTable`, () => {
  it(`should render the assets table`, () => {
    const { container } = renderWithProviders(
      <MySwapsTable swapConfigurations={[]} />,
    );
    expect(container).toBeDefined();
  });
});
