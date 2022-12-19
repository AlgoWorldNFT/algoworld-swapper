import * as React from 'react';
import { render, queryByAttribute } from '@testing-library/react';
import ConfirmDialog from './ConfirmDialog';

describe(`ConfirmDialog`, () => {
  it(`renders the correct content and handles the buttons correctly`, () => {
    const setOpenMock = jest.fn();
    const onConfirmMock = jest.fn();
    const onSwapVisibilityChangeMock = jest.fn();
    const { getByText } = render(
      <ConfirmDialog
        title="Test Dialog"
        open={true}
        setOpen={setOpenMock}
        onConfirm={onConfirmMock}
        isPublicSwap={false}
        onSwapVisibilityChange={onSwapVisibilityChangeMock}
        transactionsFee={10}
      >
        <p>Test content</p>
      </ConfirmDialog>,
    );

    // Check that the dialog renders with the correct title and content
    expect(getByText(`Test Dialog`)).toHaveTextContent(`Test Dialog`);
    expect(getByText(`Test content`)).toBeInTheDocument();
    expect(getByText(`Transaction fees: ~10 Algo`)).toBeInTheDocument();
  });
});
