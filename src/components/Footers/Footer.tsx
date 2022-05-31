import { Box, Link, Typography } from '@mui/material';

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
      bgcolor: `background.paper`,
      p: 2,
      position: `fixed`,
      bottom: 0,
      left: 0,
      right: 0,
    }}
    alignItems="center"
    justifyContent="center"
    component="footer"
  >
    <Typography
      variant="subtitle1"
      align="center"
      color="text.secondary"
      component="p"
    >
      Powered by Algorand ❤️
    </Typography>
    <Copyright />
  </Box>
);

export default Footer;
