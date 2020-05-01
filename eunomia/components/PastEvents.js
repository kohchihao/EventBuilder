import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";
import api from "../src/api";
import Carousel from "./Carousel";
import { CircularProgress } from "@material-ui/core";
import PackageDetails from "../components/packageDetails";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    minHeight: 340
  },
  root: {
    paddingTop: "50px",
    paddingBottom: "70px"
  },
  text: {
    color: "black",
    paddingBottom: "20px",
    [theme.breakpoints.up("md")]: {
      fontSize: "1.5rem"
    }
  },
  content: {
    height: 170,
  }
}));

export default function PastEvents() {
  const classes = useStyles();
  const [pastEventsList, setPastEventsList] = useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [nItems, setNItems] = React.useState(4);
  const [open, setOpen] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(null)

  React.useEffect(() => {
    api.curated_event
      .listPastEvents()
      .then(response => {
        setPastEventsList(response.data);
        setLoaded(true);
      })
      .catch(err => {});
  }, []);

  const renderPastEventsList = (event, index) => {
    return (
      <Grow
        key={index}
        in={Boolean(event)}
        style={{ transformOrigin: "0 0 0 0" }}
        {...(event ? { timeout: 1000 + (index % 4) * 500 } : {})}
      >
        <Grid item xs={12} sm={3}>
          <Card className={classes.card}>
            <Carousel handleClick={() => {setSelectedPackage(event); setOpen(true)}} imageHeight={170} imageList={event.images} />
            <CardActionArea onClick={() => {setSelectedPackage(event); setOpen(true)}}>
              <CardContent className={classes.content}>
                <Typography variant="subtitle1" component="h2">
                  {event.name}
                </Typography>
                <hr />
                <Typography variant="body2" color="textSecondary" component="p">
                  {event.description}
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
      <Container>
        <Typography
          align="left"
          className={classes.text}
          paragraph
          variant="h6"
        >
          Get inspiration from some of the successful events we have organised
        </Typography>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          {loaded ? (
            <>
              {pastEventsList.slice(0, nItems).map(renderPastEventsList)}
              <br />
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <span style={nItems === 8 || nItems >= pastEventsList.length ? { display: "none" } : {}}>
                  <Button
                    onClick={() => setNItems(8)}
                    color="secondary"
                    variant="contained"
                  >
                    View More
                  </Button>
                </span>
                <PackageDetails
        selectedPackage={selectedPackage}
        open={open}
        handleClose={() => setOpen(false)}
      />
              </Grid>
            </>
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </Container>
    </div>
  );
}
