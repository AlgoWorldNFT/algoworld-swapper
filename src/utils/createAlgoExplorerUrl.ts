import { ALGOEXPLORER_URL } from '@/common/constants';
import AlgoExplorerUrlType from '@/models/AlgoExplorerUrlType';
import { ChainType } from '@/models/Chain';

function algoExplorerUrlTypeToPath(type: AlgoExplorerUrlType) {
  switch (type) {
    case AlgoExplorerUrlType.Transaction:
      return `tx`;
    case AlgoExplorerUrlType.Address:
      return `address`;
    case AlgoExplorerUrlType.Asset:
      return `asset`;
  }
}

export default function createAlgoExplorerUrl(
  chain: ChainType,
  input: string,
  type: AlgoExplorerUrlType,
) {
  return `${ALGOEXPLORER_URL(chain)}/${algoExplorerUrlTypeToPath(
    type,
  )}/${input}`;
}
