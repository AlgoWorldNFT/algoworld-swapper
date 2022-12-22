import { act, queryByAttribute } from '@testing-library/react';

jest.mock(`@perawallet/connect`, () => {
  return jest.fn();
});

import renderWithProviders from '@/__utils__/renderWithProviders';
import { ASAS_TO_ALGO_PAGE_HEADER_ID } from '@/common/constants';
import MultiAsaToAlgo from './asas-to-algo.page';

describe(`Asas to Algo`, () => {
  it(`renders a heading`, async () => {
    let dom: ReturnType<typeof renderWithProviders> = {} as any;

    await act(async () => {
      dom = renderWithProviders(<MultiAsaToAlgo />);
    });

    const getById = queryByAttribute.bind(null, `id`);
    const headerComponent = getById(dom.container, ASAS_TO_ALGO_PAGE_HEADER_ID);

    expect(headerComponent).toBeInTheDocument();
    expect(headerComponent?.textContent?.toLowerCase()).toContain(
      `🎴💰 asas to algo swap`,
    );
  });
});
