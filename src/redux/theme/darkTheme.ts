import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: `dark`,
    primary: {
      main: `#ff80bf`,
    },
    secondary: {
      main: `#f8f8f2`,
    },
    background: {
      default: `#282a36`,
      paper: `#44475a`,
    },
    text: {
      primary: `#f8f8f2`,
    },
    error: {
      main: `#FF9580`,
    },
    warning: {
      main: `#FFFF80`,
    },
    info: {
      main: `#8aff80`,
    },
    success: {
      main: `#8aff80`,
    },
  },
});

export default darkTheme;
