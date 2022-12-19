import { PERFORM_SWAP_PAGE_HEADER_ID } from '@/common/constants';
import renderWithProviders from '@/__utils__/renderWithProviders';
import { queryByAttribute } from '@testing-library/react';

jest.mock(`@perawallet/connect`, () => {
  return jest.fn();
});

jest.mock(`next/router`, () => {
  return {
    useRouter: jest.fn().mockReturnValue({ query: { chain: `testnet` } }),
  };
});

jest.mock(`notistack`, () => {
  return {
    useSnackbar: jest.fn().mockReturnValue({ enqueueSnackbar: jest.fn() }),
  };
});

import PerformSwap from './[escrow].page';

describe(`Perform Swap Page`, () => {
  it(`renders a heading`, () => {
    const { container } = renderWithProviders(<PerformSwap />);

    const getById = queryByAttribute.bind(null, `id`);
    const headerComponent = getById(container, PERFORM_SWAP_PAGE_HEADER_ID);

    expect(headerComponent).toBeInTheDocument();
    expect(headerComponent?.textContent?.toLowerCase()).toContain(
      `⚡️ perform swap`,
    );
  });
});
