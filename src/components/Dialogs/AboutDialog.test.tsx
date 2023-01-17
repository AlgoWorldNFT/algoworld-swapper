import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AboutDialog from './AboutDialog';

jest.mock(`react-markdown`, () => jest.fn());

describe(`AboutDialog`, () => {
  it(`renders the correct content and handles the close button correctly`, () => {
    const changeStateMock = jest.fn();
    const { getByText } = render(
      <AboutDialog open={true} changeState={changeStateMock} />,
    );

    // Check that the dialog renders with the correct title and content
    expect(
      getByText(
        `AlgoWorld Swapper is a free and open-source tool for swapping assets on Algorand blockchain.`,
        { exact: false },
      ),
    ).toBeInTheDocument();

    // Check that clicking the close button calls the changeState function with the correct argument
    fireEvent.click(getByText(`Close`));
    expect(changeStateMock).toHaveBeenCalledWith(false);
  });
});
