import { queryByAttribute } from '@testing-library/react';

jest.mock(`algorand-walletconnect-qrcode-modal`, () => {
  return jest.fn();
});

import renderWithProviders from '@/__utils__/renderWithProviders';
import { ASAS_TO_ALGO_PAGE_HEADER_ID } from '@/common/constants';
import MultiAsaToAlgo from './asas-to-algo.page';

jest.mock(`notistack`, () => {
  return {
    useSnackbar: jest.fn().mockReturnValue({ enqueueSnackbar: jest.fn() }),
  };
});

describe(`Asas to Algo`, () => {
  it(`renders a heading`, () => {
    const dom = renderWithProviders(<MultiAsaToAlgo />);

    const getById = queryByAttribute.bind(null, `id`);
    const headerComponent = getById(dom.container, ASAS_TO_ALGO_PAGE_HEADER_ID);

    expect(headerComponent).toBeInTheDocument();
    expect(headerComponent?.textContent?.toLowerCase()).toContain(
      `🎴💰 asas to algo swap`,
    );
  });
});
