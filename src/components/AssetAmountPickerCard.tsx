import { Asset } from '@/models/Asset';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
} from '@mui/material';
import { observer } from 'mobx-react-lite';

type Props = {
  asset: Asset;
};

const AssetAmountPickerCard = observer(({ asset }: Props) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" image={asset.image_url} alt="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {asset.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
});

export default AssetAmountPickerCard;
