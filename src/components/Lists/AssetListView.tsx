/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Asset } from '@/models/Asset';
import { IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';

import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import formatAmount from '@/utils/formatAmount';

type Props = {
  assets: Asset[];
  onAssetDeselected?: (asset: Asset) => void;
  isOffering?: boolean;
};

const AssetListView = ({
  assets,
  onAssetDeselected,
  isOffering = true,
}: Props) => {
  const getLabelContent = (index: number, asset: Asset) => {
    return asset.unitName === `Algo`
      ? `${formatAmount(
          isOffering ? asset.offeringAmount : asset.requestingAmount,
          asset.decimals,
        )} ${asset.name}`
      : `${index + 1}. ${asset.index}: ${asset.name} (${
          `x` +
          formatAmount(
            isOffering ? asset.offeringAmount : asset.requestingAmount,
            asset.decimals,
          )
        })`;
  };

  return (
    <Paper sx={{ bgcolor: `background.default` }}>
      <List sx={{ width: `100%` }}>
        {assets.map((asset, index) => (
          <ListItem
            key={index}
            secondaryAction={
              onAssetDeselected && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    onAssetDeselected(asset);
                  }}
                >
                  <DeleteIcon sx={{ color: `secondary.main` }} />
                </IconButton>
              )
            }
          >
            <ListItemText
              sx={{
                textAlign: `left`,
                color: `primary.main`,
                textOverflow: `ellipsis`,
                overflow: `hidden`,
              }}
              primary={getLabelContent(index, asset)}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AssetListView;
