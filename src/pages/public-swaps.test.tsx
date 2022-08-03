import { queryByAttribute } from '@testing-library/react';
import renderWithProviders from '@/__utils__/renderWithProviders';
import PublicSwaps from '@/pages/public-swaps.page';
import { PUBLIC_SWAPS_PAGE_HEADER_ID } from '@/common/constants';

jest.mock(`next/router`, () => {
  return {
    useRouter: jest.fn().mockReturnValue({ query: { chain: `testnet` } }),
  };
});

describe(`Public Swaps`, () => {
  it(`renders a heading`, () => {
    const dom = renderWithProviders(<PublicSwaps />);

    const getById = queryByAttribute.bind(null, `id`);
    const headerComponent = getById(dom.container, PUBLIC_SWAPS_PAGE_HEADER_ID);

    expect(headerComponent).toBeInTheDocument();
    expect(headerComponent?.textContent?.toLowerCase()).toContain(
      `📣 public swaps`,
    );
  });
});
