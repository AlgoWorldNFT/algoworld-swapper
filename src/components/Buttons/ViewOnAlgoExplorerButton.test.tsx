import React from 'react';
import { render, queryByAttribute } from '@testing-library/react';
import ViewOnAlgoExplorerButton from './ViewOnAlgoExplorerButton';
import { ChainType } from '@/models/Chain';
import { VIEW_ON_EXPLORER_BTN_ID } from './constants';

const getById = queryByAttribute.bind(null, `id`);

describe(`ViewOnAlgoExplorerButton`, () => {
  it(`renders the button with the correct text and href`, () => {
    const txId = `abc123`;
    const chain = ChainType.MainNet;
    const result = render(
      <ViewOnAlgoExplorerButton txId={txId} chain={chain} />,
    );

    const button = getById(
      result.container,
      VIEW_ON_EXPLORER_BTN_ID,
    ) as Element;
    expect(button).toHaveTextContent(`View on AlgoExplorer`);
    expect(button).toHaveAttribute(
      `href`,
      `https://algoexplorer.io/tx/${txId}`,
    );
  });
});
