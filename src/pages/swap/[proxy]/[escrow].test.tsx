import { PERFORM_SWAP_PAGE_HEADER_ID } from '@/common/constants';
import renderWithProviders from '@/__utils__/renderWithProviders';
import { act, queryByAttribute } from '@testing-library/react';

jest.mock(`@perawallet/connect`, () => {
  return jest.fn();
});

jest.mock(`next/router`, () => {
  return {
    useRouter: jest.fn().mockReturnValue({ query: { chain: `testnet` } }),
  };
});

import PerformSwap from './[escrow].page';

describe(`Perform Swap Page`, () => {
  it(`renders a heading`, async () => {
    let dom: ReturnType<typeof renderWithProviders> = {} as any;

    await act(async () => {
      dom = renderWithProviders(<PerformSwap />);
    });

    const getById = queryByAttribute.bind(null, `id`);
    const headerComponent = getById(dom.container, PERFORM_SWAP_PAGE_HEADER_ID);

    expect(headerComponent).toBeInTheDocument();
    expect(headerComponent?.textContent?.toLowerCase()).toContain(
      `⚡️ perform swap`,
    );
  });
});
