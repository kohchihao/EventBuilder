import React, { useEffect, useState } from "react";
import api from "../../../src/api";
import {setCuratedEvent} from "../action";
import { useDispatch, useSelector } from "react-redux";
import useSnackbar from "../../snackbar/useSnackbar";
import LoadingIcon from "../../icons/LoadingIcon";
import { Grid, makeStyles, Paper, Typography} from "@material-ui/core";
import {getCuratedEvent, getEvent, getShowSummary} from "../selectors";
import ServicePanel from "../modules/buildPanel/ServicePanel";
import Summary from "../modules/summary/Summary";
import EventTitle from "../modules/EventTitle";
import PageFooter from "../../pageFooter";
import ProgressStepper from "../modules/ProgressStepper";
import Quotation from "../modules/quotation/Quotation";

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
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5
  },
  headerPaper: {
    margin: "15px 0 20px 0",
    padding: "20px 0"
  },
  quoted: {
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative"
  }
}));

const BuiltPage = props => {
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const showSummary = useSelector(getShowSummary);
  const curatedEvent = useSelector(getCuratedEvent);
  const event = useSelector(getEvent);

  useEffect(() => {
    if (event) {
      api.curated_event
        .retrieve(event.curated_event.id)
        .then(res => {
          dispatch(setCuratedEvent(res.data));
          setIsLoading(false);
        })
        .catch(error => {
          snackbar.showMessage(error.message);
        });
    }
  }, [event]);

  if (isLoading || !curatedEvent || !event) {
    return <LoadingIcon />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.headerPaper}>
        <EventTitle />
        <ProgressStepper/>
      </Paper>
      {(event.status === "PENDING" || event.status === 'CONTACTED' || event.status === 'ACCEPTED' || showSummary) && (
        <Grid container spacing={3}>
          <Grid item sm={12} md={8}>
            <ServicePanel />
          </Grid>
          <Grid item sm={12} md={4}>
            <Summary />
          </Grid>
        </Grid>
      )}

      {(event.status === 'QUOTED' && !showSummary) && (
        <div className={classes.quoted}>
          {event.quotation_token ? (
            <Quotation/>
          ) : (
            <Typography variant="h5" style={{textAlign: "center", marginTop: 40}}>
              Please wait for a quotation to be sent to you.
            </Typography>
          )}
        </div>
      )}
      <PageFooter />
    </div>
  );
};

export default BuiltPage;
