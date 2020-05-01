import React from 'react';
import { withRouter } from 'next/router';
import NavBar from '../components/Navbar';
import EventTypeCard from '../components/EventTypeCard';
import PackageCard from '../components/PackagesCard';
import PastEvents from '../components/PastEvents';
import { withRedux } from '../src/helpers/redux';
import PageFooter from '../components/pageFooter';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    minHeight: "100vh"
  }
}));

const Home = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <NavBar />
        <EventTypeCard />
        {/* <PackageCard /> */}
        <PastEvents />
        <PageFooter/>
    </div>
  );
};

export default withRedux(withRouter(Home));
