import { Button } from '@mui/material';

import { ChainType } from '@/models/Chain';
import createAlgoExplorerUrl from '@/utils/createAlgoExplorerUrl';
import AlgoExplorerUrlType from '@/models/AlgoExplorerUrlType';

type Props = {
  txId: string;
  chain: ChainType;
};

const ViewOnAlgoExplorerButton = ({ txId, chain }: Props) => {
  return (
    <Button
      target={`_blank`}
      href={createAlgoExplorerUrl(chain, txId, AlgoExplorerUrlType.Transaction)}
    >
      View on AlgoExplorer
    </Button>
  );
};

export default ViewOnAlgoExplorerButton;
