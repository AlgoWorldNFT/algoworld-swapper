import { act, queryByAttribute } from '@testing-library/react';

jest.mock(`@perawallet/connect`, () => {
  return jest.fn();
});

import renderWithProviders from '@/__utils__/renderWithProviders';
import { MY_SWAPS_PAGE_HEADER_ID } from '@/common/constants';

import MySwaps from './my-swaps.page';

describe(`My Swaps`, () => {
  it(`renders a heading`, async () => {
    let dom: ReturnType<typeof renderWithProviders> = {} as any;

    await act(async () => {
      dom = renderWithProviders(<MySwaps />);
    });

    const getById = queryByAttribute.bind(null, `id`);
    const headerComponent = getById(dom.container, MY_SWAPS_PAGE_HEADER_ID);

    expect(headerComponent).toBeInTheDocument();
    expect(headerComponent?.textContent?.toLowerCase()).toContain(
      `📜 my swaps`,
    );
  });
});
