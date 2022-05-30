import { Button } from '@mui/material';

import { ChainType } from '@/models/Chain';

type Props = {
  txId: string;
  chain: ChainType;
};

const ViewOnAlgoExplorerButton = ({ txId, chain }: Props) => {
  return (
    <Button
      target={`_blank`}
      href={`https://${
        chain === ChainType.TestNet ? `testnet` : ``
      }.algoexplorer.io/tx/${txId}`}
    >
      View on AlgoExplorer
    </Button>
  );
};

export default ViewOnAlgoExplorerButton;
