import React, { useState, useEffect } from 'react';
import useSnackbar from '../../snackbar/useSnackbar';
import { makeStyles, Grid, Typography, Container } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../selectors';
import ProfilePanel from './ProfilePanel';
import EventsPanel from './EventsPanel';
import { isLoggedIn, isAuthenticating } from '../../session/selectors';
import LoadingIcon from '../../icons/LoadingIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 15,
    maxWidth: 1400,
    margin: '0 auto',
    paddingBottom: 50,
    height: '100%'
  }
}));

const ProfilePage = () => {
  const snackbar = useSnackbar();
  const classes = useStyles();
  const userDetails = useSelector(getUserDetails);
  const isAuthenticated = useSelector(isLoggedIn);
  const isLoggingIn = useSelector(isAuthenticating);

  if (isLoggingIn) {
    return (
      <>
        <LoadingIcon />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Typography variant="h5" style={{ textAlign: 'center', marginTop: 50 }}>
          You do not have the permission to view this. <br />
          Please log in if you have not.
        </Typography>
      </>
    );
  }

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProfilePanel />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
