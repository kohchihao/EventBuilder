import { Typography, Grid } from '@material-ui/core';
import MuiLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: '10px 0'
  }
}));

const PageFooter = props => {
  const classes = useStyles();
  return (
    <Typography
      className={classes.footer}
      variant="body2"
      color={props.textColor || 'textSecondary'}
      align="center"
    >
      {'Copyright © '}
      <MuiLink color="inherit" href="https://buildevents.today/">
        Build Events
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};
export default PageFooter;
