import { Asset } from '@/models/Asset';
import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import AssetAmountPickerCard from './AssetAmountPickerCard';

import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

import ImageIcon from '@mui/icons-material/Image';

type Props = {
  assets: Asset[];
};

const AssetGridView = ({ assets }: Props) => {
  return (
    <List sx={{ width: `100%`, maxWidth: 360, bgcolor: `background.paper` }}>
      {assets.map((asset, index) => (
        <ListItem key={index}>
          <Stack>
            <ListItemText
              sx={{ textAlign: `center` }}
              primary={`${asset.name} x${
                asset.amount - asset.offeringAmount
              } available`}
            />

            <Stack direction={`row`}>
              <TextField
                variant="outlined"
                inputProps={{ inputMode: `numeric`, pattern: `[0-9]*` }}
              />
              <Button>max</Button>
            </Stack>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};

export default AssetGridView;
