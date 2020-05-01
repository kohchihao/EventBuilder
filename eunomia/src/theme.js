import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7256c8',
      main: '#3f2b96',
      dark: '#000367',
      contrastText: '#fff'
    },
    secondary: {
      light: '#dbf3ff',
      main: '#a8c0ff',
      dark: '#7790cc',
      contrastText: '#000'
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F5F5F5'
    }
  },
});

export default theme;
