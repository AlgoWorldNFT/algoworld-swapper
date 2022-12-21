import * as React from 'react';
import renderWithProviders from '@/__utils__/renderWithProviders';
import PublicSwapAssetsTable from './PublicSwapAssetsTable';
import { ChainType } from '@/models/Chain';
import { IpfsGateway } from '@/models/Gateway';

describe(`PublicSwapAssetsTable`, () => {
  it(`should render the assets table`, () => {
    const { container } = renderWithProviders(
      <PublicSwapAssetsTable
        address="test"
        gateway={IpfsGateway.ALGONODE_IO}
        chain={ChainType.TestNet}
      />,
    );
    expect(container).toBeDefined();
  });
});
