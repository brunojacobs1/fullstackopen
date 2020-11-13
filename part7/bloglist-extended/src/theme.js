import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#104F55',
    },
    background: {
      default: '#E5DADA',
    },
  },
});

export const useStyles = makeStyles((theme) => ({
  title: {
    marginRight: theme.spacing(2),
  },
  tableButton: {
    marginRight: theme.spacing(4),
    background: theme.palette.primary.main,
    color: 'white'
  },
}));

export default theme;
