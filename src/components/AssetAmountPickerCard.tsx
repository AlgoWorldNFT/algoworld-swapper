import { Asset } from '@/models/Asset';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
  Card,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

import Image from 'next/image';

type Props = {
  asset: Asset;
};

const AssetAmountPickerCard = ({ asset }: Props) => {
  return (
    <Card
      sx={{
        backgroundColor: `black`,
        maxWidth: 345,
      }}
    >
      {/* <CardMedia>
        <div
          style={{
            marginTop: 5,
            width: `100%`,
            height: `100%`,
          }}
        >
          <Image
            src={asset.imageUrl}
            alt="asa image"
            width={175}
            height={175}
            objectFit="contain"
          />
        </div>
      </CardMedia> */}
      <CardContent>
        <Typography variant="h5" component="div">
          {asset.name}
        </Typography>

        <Typography variant="h6" component="div">
          {`x${asset.amount} available`}
        </Typography>
      </CardContent>
      <CardActions>
        <FormControl sx={{}} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={`password`}
            value={`values.password`}
            onChange={() => {
              console.log(`test`);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" edge="end">
                  <Visibility />
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      </CardActions>
    </Card>
  );
};

export default AssetAmountPickerCard;
