import { Box, Container, Link, Typography } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {`Copyright © `}
      <Link color="inherit" href="https://algoworld.io">
        {`AlgoWorld ${new Date().getFullYear()}`}
      </Link>
    </Typography>
  );
}

const Footer = () => (
  <Box
    sx={{
      py: 3,
      px: 2,
      mt: `auto`,
    }}
    alignItems="center"
    justifyContent="center"
    component="footer"
  >
    <Container maxWidth="sm">
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Powered by Algorand ❤️
      </Typography>
      <Copyright />
    </Container>
  </Box>
);

export default Footer;
