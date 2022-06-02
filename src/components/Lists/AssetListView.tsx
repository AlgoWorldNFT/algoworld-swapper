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
              primary={
                isOffering
                  ? `${index + 1}. ${asset.index}: ${asset.name} (${
                      `x` + formatAmount(asset.offeringAmount, asset.decimals)
                    })`
                  : `${index + 1}. ${asset.index}: ${asset.name} (${
                      `x` + formatAmount(asset.requestingAmount, asset.decimals)
                    })`
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AssetListView;
