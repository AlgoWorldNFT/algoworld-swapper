import * as React from 'react';
import { render } from '@testing-library/react';
import LoadingBackdrop from './Backdrop';

describe(`Backdrop`, () => {
  it(`should render the loading message and progress bar when isLoading is true`, () => {
    const { getByText, queryByText } = render(
      <LoadingBackdrop isLoading={true} />,
    );
    expect(getByText(`Loading...`)).toBeInTheDocument();
    expect(queryByText(`Custom message`)).not.toBeInTheDocument();
    expect(
      queryByText(`Custom message`, { exact: false }),
    ).not.toBeInTheDocument();
  });

  it(`should not render the loading message or progress bar when isLoading is false`, () => {
    const { queryByText } = render(
      <LoadingBackdrop isLoading={false} message={``} />,
    );
    expect(queryByText(`Loading...`)).not.toBeInTheDocument();
    expect(queryByText(/linear/i)).not.toBeInTheDocument();
  });

  it(`should render a custom message if provided`, () => {
    const { getByText } = render(
      <LoadingBackdrop isLoading={true} message="Custom message" />,
    );
    expect(getByText(`Custom message`)).toBeInTheDocument();
  });
});
