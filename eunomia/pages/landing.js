import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button
} from '@material-ui/core';

import Link from 'next/link';
import PageFooter from '../components/pageFooter';
import logo from '../src/assets/images/build-events-logo.png';
import MuiLink from '@material-ui/core/Link';
import landing from '../src/assets/images/landing.jpg';

const useStyles = makeStyles(theme => ({
  page: {
    background: `linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${landing})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    color: 'white',
    width: '100%',
    opacity: 1,
    visibility: 'inherit',
    zIndex: 20,
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      height: '100vh'
    }
  },
  container: {
    maxWidth: 1440
  },
  card: {
    maxWidth: 345,
    height: '100%'
  },
  purpleAvatar: {
    color: '#fff',
    backgroundColor: theme.palette.primary.main
  },
  gridContainer: {
    marginTop: 50
  },
  grid: {
    [theme.breakpoints.up('md')]: {
      height: '100vh'
    }
  },
  header: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 50
  },
  gridButtonContainer: {
    paddingBottom: 50
  }
}));

const details = [
  {
    id: 1,
    name: 'Provide basic details - event type, pax, total budget and duration.'
  },
  {
    id: 2,
    name: 'Smart filter will recommend you the perfect event package!'
  },
  {
    id: 3,
    name: 'Build your dream event and get an instant quote from us!'
  }
];

const Landing = props => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.page}>
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Container className={classes.container}>
            <Typography className={classes.header} align="center" variant="h2">
              <img style={{ marginLeft: '0px', width: '200px' }} src={logo} />
              <Typography variant="subtitle1">
                In partnership with{' '}
                <MuiLink color="inherit" href="https://getout.sg/">
                  GetOut! Events
                </MuiLink>
              </Typography>
            </Typography>
            <Typography align="center" variant="h3">
              Building an event is as easy as 1, 2, 3.
            </Typography>
            <Grid
              className={classes.gridContainer}
              container
              spacing={2}
              justify="center"
              align="center"
            >
              {details.map(detail => (
                <Grid item xs={12} sm={4}>
                  <React.Fragment>
                    <CardContent align="center">
                      <Avatar className={classes.purpleAvatar}>
                        {detail.id}
                      </Avatar>
                      <h2>{detail.name}</h2>
                    </CardContent>
                  </React.Fragment>
                </Grid>
              ))}
            </Grid>

            <Grid
              className={classes.gridButtonContainer}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Link href="/">
                <Button color="primary" variant="contained" size="large">
                  Get Started
                </Button>
              </Link>
            </Grid>
          </Container>
        </Grid>
        <PageFooter textColor={'inherit'} />
      </div>
    </div>
  );
};

export default Landing;
