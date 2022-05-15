import { Asset } from '@/models/Asset';
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AssetAmountPickerCard from './AssetAmountPickerCard';

import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

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
    <List sx={{ width: `100%`, maxWidth: 360, bgcolor: `background.paper` }}>
      {assets.map((asset, index) => (
        <ListItem
          key={index}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(asset) => {
                onAssetDeselected(asset);
              }}
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText
            sx={{ textAlign: `center` }}
            primary={
              isOffering
                ? `${asset.name} (${
                    `x` + isOffering
                      ? asset.offeringAmount + ` offering`
                      : asset.requestingAmount + ` requesting`
                  })`
                : `${asset.name}`
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default AssetListView;
