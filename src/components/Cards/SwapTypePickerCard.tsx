import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';

type Props = {
  title: string;
  description: string;
  emojiContent: string;
  swapPageUrl: string;
  disabled?: boolean;
};

const SwapTypePickerCard = ({
  title,
  description,
  emojiContent,
  swapPageUrl,
  disabled = false,
}: Props) => {
  return (
    <Card
      sx={{
        width: 345,
      }}
    >
      <CardActionArea disabled={disabled} href={swapPageUrl}>
        <CardContent>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: `20vh` }}
          >
            <Grid item xs={3}>
              <Typography
                sx={{ width: `100%`, textAlign: `center` }}
                component="div"
                variant="h2"
              >
                {emojiContent}
              </Typography>
            </Grid>
          </Grid>

          <Typography
            textAlign={`center`}
            gutterBottom
            variant="h5"
            component="div"
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SwapTypePickerCard;
