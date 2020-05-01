import React from 'react';
import { withRouter } from 'next/router';
import SnackbarProvider from '../components/snackbar/SnackbarProvider';
import NavBar from '../components/Navbar';
import { withRedux } from '../src/helpers/redux';

import { makeStyles } from '@material-ui/core/styles';

import EventsPage from '../components/events/modules/EventsPage';
import PageFooter from '../components/pageFooter';

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    minHeight: "100vh"
  }
}));

const Events = (props, state) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SnackbarProvider>
        <NavBar />
        <EventsPage />
      </SnackbarProvider>
      <PageFooter/>
    </div>
  );
};

export default withRedux(withRouter(Events));
