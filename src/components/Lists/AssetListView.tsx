import { Asset } from '@/models/Asset';
import { IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';

import DeleteIcon from '@mui/icons-material/DeleteOutlined';

type Props = {
  assets: Asset[];
  onAssetDeselected: (asset: Asset) => void;
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
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  onAssetDeselected(asset);
                }}
              >
                <DeleteIcon sx={{ color: `secondary.main` }} />
              </IconButton>
            }
          >
            <ListItemText
              sx={{ textAlign: `center`, color: `primary.main` }}
              primary={
                isOffering
                  ? `${asset.name} (${
                      `x` + asset.offeringAmount + ` offering`
                    })`
                  : `${asset.name} (${
                      `x` + asset.requestingAmount + ` requesting`
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
