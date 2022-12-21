import React from 'react';
import Layout from './Layout';
import renderWithProviders from '@/__utils__/renderWithProviders';
import { act } from '@testing-library/react';

jest.mock(`next/dist/client/router`, () => ({
  __esModule: true,
  useRouter: () => ({
    query: {},
    pathname: `/`,
    asPath: `/`,
    events: {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
    push: jest.fn(() => Promise.resolve(true)),
    prefetch: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
  }),
}));

describe(`Layout`, () => {
  it(`should render the children in the main`, () => {
    let byText: any;
    act(() => {
      const { getByText } = renderWithProviders(
        <Layout>
          <p>Test Children</p>
        </Layout>,
      );

      byText = getByText;
    });

    expect(byText(`Test Children`)).toBeInTheDocument();
  });
});
