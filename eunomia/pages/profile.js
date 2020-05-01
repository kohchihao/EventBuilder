import React from 'react';
import { withRouter } from 'next/router';
import SnackbarProvider from '../components/snackbar/SnackbarProvider';
import NavBar from '../components/Navbar';
import { withRedux } from '../src/helpers/redux';

import { makeStyles } from '@material-ui/core/styles';

import ProfilePage from '../components/profile/modules/ProfilePage';
import PageFooter from '../components/pageFooter';

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    minHeight: "100vh"
  }
}));

const Profile = (props, state) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SnackbarProvider>
        <NavBar />
        <ProfilePage />
      </SnackbarProvider>
      <PageFooter/>
    </div>
  );
};

export default withRedux(withRouter(Profile));
