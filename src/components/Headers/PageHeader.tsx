import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

type Props = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: Props) => {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        pt: 5,
        pb: 5,
      }}
    >
      <Typography
        component="h1"
        variant={`h4`}
        align="center"
        color="text.primary"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        variant={`body1`}
        align="center"
        color="text.secondary"
        component="p"
      >
        {description}
      </Typography>
    </Container>
  );
};

export default PageHeader;
