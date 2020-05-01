import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import Link from 'next/link';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    height: '100%'
  },
  media: {
    height: 140
  },
  root: {
    paddingTop: '70px'
  },
  text: {
    color: 'black',
    paddingBottom: '20px',
    [theme.breakpoints.up('md')]: {
      fontSize: '1.5rem'
    }
  }
}));

const dummyPackageList = [
  {
    name: 'Halloween theme D&D',
    description: 'Get ready for a night of screams and laughter.',
    price: '20000',
    amount: '200',
    image: "https://images.unsplash.com/photo-1477241219470-e4f7fa400a9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
  },
  {
    name: 'Family fun on the beach',
    description:
      'Leave the kids bouncing on the bouncy castles while the parents sip pina colada on the beach.',
    price: '12000',
    amount: '150',
    image: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
  },
  {
    name: 'Team getaway to Bali',
    description:
      'Escape from the hectic office and kick back with your colleagues by a pool in Bali.',
    price: '15000',
    amount: '50', 
    image: "https://images.unsplash.com/photo-1554481923-a6918bd997bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=802&q=80"
  },
  {
    name: 'Strength through games',
    description:
      'Through interactive activities, our experienced coordinators will help your team forge a indomitable team spirit.',
    price: '1000',
    amount: '30',
    image: "https://images.unsplash.com/photo-1475823575816-e881ac8720d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
  }
];

export default function PackageCard() {
  const classes = useStyles();
  const [packageList, setPackageList] = useState([]);

  const renderPackageList = (pack, index) => {
    return (
      <Grow
      key={index}
        in={Boolean(pack)}
        style={{ transformOrigin: '0 0 0 0' }}
        {...(pack ? { timeout: 1000 + index * 500 } : {})}
      >
        <Grid item xs={12} sm={3}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={pack.image}
                title={pack.name}
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  {pack.name}
                </Typography>
                <hr />
                <Typography variant="body2" color="textSecondary" component="p">
                  {pack.description}
                </Typography>
                <br />
                <Typography variant="body2" color="textSecondary" component="p">
                  Starting from ${pack.price} for {pack.amount} pax
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grow>
    );
  };

  return (
    <div className={classes.root}>
      <Container >
        <Typography
          align="left"
          className={classes.text}
          paragraph
          variant="h6"
        >
          Take your pick from our most popular events
        </Typography>
        <Grid container spacing={1}>
          {dummyPackageList.map(renderPackageList)}
        </Grid>
        <br />
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <Link href="/browse">
          <Button color="secondary" variant="contained">
            Browse All
          </Button>
          </Link>
        </Grid>
      </Container>
    </div>
  );
}
