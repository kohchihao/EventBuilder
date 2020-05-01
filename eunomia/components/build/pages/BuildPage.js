import React, { useEffect, useState } from "react";
import LoadingIcon from "../../icons/LoadingIcon";
import useSnackbar from "../../snackbar/useSnackbar";
import api from "../../../src/api";
import { makeStyles, Grid, Typography, Paper } from "@material-ui/core";
import Summary from "../modules/summary/Summary";
import ServicePanel from "../modules/buildPanel/ServicePanel";
import HorizontalScroll from "../../lib/HorizontalScroll";
import { useDispatch, useSelector } from "react-redux";
import {setCuratedEvent, setInitialState} from "../action";
import { getCuratedEvent } from "../selectors";
import PageFooter from "../../pageFooter";
import { withRouter } from "next/router";

const useStyles = makeStyles(theme => ({
  root: {
    padding: 15,
    maxWidth: 1400,
    margin: "0 auto",
    paddingBottom: 50,
    height: "100%",
    position: "relative"
  },
  horizontalScroll: {
    marginTop: 15,
    marginBottom: 15
  },
  headerPaper: {
    margin: "10px 0 20px 15px",
    padding: "20px 0"
  },
  headerText: {
    textAlign: "center",
    marginBottom: 15
  }
}));

const BuildPage = (props, state) => {
  const [isLoading, setIsLoading] = useState(true);
  const snackbar = useSnackbar();
  const classes = useStyles();
  const { curatedEventId } = props;
  const dispatch = useDispatch();
  const curatedEvent = useSelector(getCuratedEvent);

  useEffect(() => {
    if (curatedEventId) {
      api.curated_event
        .retrieve(curatedEventId)
        .then(res => {
          dispatch(setInitialState());
          dispatch(setCuratedEvent(res.data));
          setIsLoading(false);
        })
        .catch(error => {
          snackbar.showMessage(error.message);
        });
    }
    return () => {
      dispatch(setInitialState());
    }
  }, [curatedEventId]);

  if (isLoading || !curatedEvent) {
    return <LoadingIcon />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.headerPaper}>
        <Typography variant="h4" className={classes.headerText}>
          {curatedEvent.name}
        </Typography>
        <HorizontalScroll
          className={classes.horizontalScroll}
          urls={curatedEvent.images.map(e => e.url)}
        />
      </Paper>
      <Grid container spacing={3}>
        <Grid item sm={12} md={8}>
          <ServicePanel />
        </Grid>
        <Grid item sm={12} md={4}>
          <Summary />
        </Grid>
      </Grid>
      <PageFooter />
    </div>
  );
};

export default withRouter(BuildPage);
