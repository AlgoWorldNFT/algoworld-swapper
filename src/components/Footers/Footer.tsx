import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';

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

function ReferenceButtons() {
  return (
    <Stack justifyContent={`center`} direction="row">
      <IconButton>
        <TelegramIcon />
      </IconButton>
      <IconButton>
        <TwitterIcon />
      </IconButton>
      <IconButton>
        <GitHubIcon />
      </IconButton>
    </Stack>
  );
}

const Footer = () => (
  <Box
    sx={{
      py: 2,
      px: 2,
      mt: `auto`,
      bgcolor: `background.paper`,
    }}
    alignItems="center"
    justifyContent="center"
    component="footer"
  >
    <Container>
      <ReferenceButtons />
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
