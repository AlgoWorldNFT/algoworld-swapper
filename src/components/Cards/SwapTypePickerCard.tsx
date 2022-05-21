import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import { SwapType } from '@/models/Swap';

type Props = {
  title: string;
  description: string;
  emojiContent: string;
  swapPageUrl: string;
};

const SwapTypePickerCard = ({
  title,
  description,
  emojiContent,
  swapPageUrl,
}: Props) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        bgcolor: `black`,
      }}
    >
      <CardActionArea href={swapPageUrl}>
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
