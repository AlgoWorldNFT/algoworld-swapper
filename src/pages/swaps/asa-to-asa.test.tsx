import { queryByAttribute } from '@testing-library/react';

jest.mock(`algorand-walletconnect-qrcode-modal`, () => {
  return jest.fn();
});

import AsaToAsa from '@/pages/swaps/asa-to-asa.page';
import renderWithProviders from '@/__utils__/renderWithProviders';
import { ASA_TO_ASA_PAGE_HEADER_ID } from '@/common/constants';

jest.mock(`notistack`, () => {
  return {
    useSnackbar: jest.fn().mockReturnValue({ enqueueSnackbar: jest.fn() }),
  };
});

describe(`Asa to Asa`, () => {
  it(`renders a heading`, () => {
    const dom = renderWithProviders(<AsaToAsa />);

    const getById = queryByAttribute.bind(null, `id`);
    const headerComponent = getById(dom.container, ASA_TO_ASA_PAGE_HEADER_ID);

    expect(headerComponent).toBeInTheDocument();
    expect(headerComponent?.textContent?.toLowerCase()).toContain(
      `🎴 asa to asa swap`,
    );
  });
});
