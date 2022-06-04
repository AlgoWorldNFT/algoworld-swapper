import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: `dark`,
    primary: {
      main: `#8aff80`,
    },
    secondary: {
      main: `#ff80bf`,
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
      main: `#80FFEA`,
    },
    success: {
      main: `#8aff80`,
    },
  },
});

export default darkTheme;
