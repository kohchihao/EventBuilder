import React from "react";
import {Grid, makeStyles, Typography} from '@material-ui/core'
import {useSelector} from "react-redux";
import {getCuratedEvent, getDuration, getEventDate, getNumberAttendees, isEventEditable} from "../../selectors";
import {formatMoney} from "../../../../src/helpers/utils";
import {People, Event, Timer} from "@material-ui/icons";

const useStyle = makeStyles(() => ({
  name: {
    display: "flex",
    marginRight: "auto",
    alignItems: "center"
  },
  value: {
    display: "flex",
    marginLeft: "auto",
    alignItems: "center"
  },
  alignIconText: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginLeft: 5,
  }
}));

const PackageDescription = (props) => {
  const classes = useStyle();
  const curatedEvent = useSelector(getCuratedEvent);
  const isEditable = useSelector(isEventEditable);
  const attendees = useSelector(getNumberAttendees);
  const eventDate = useSelector(getEventDate);
  const duration = useSelector(getDuration);

  return (
    <div>
      <Grid container spacing={1} wrap="nowrap">
        <Grid item zeroMinWidth className={classes.name}>
          <Typography style={{fontSize: "1.2rem"}}>
            Event Type
          </Typography>
          &nbsp;:
        </Grid>
        <Grid item zeroMinWidth className={classes.value}>
          <Typography >
            {curatedEvent.type.name}
          </Typography>
        </Grid>
      </Grid>

      {!isEditable && (
        <>
          <Grid container spacing={1} wrap="nowrap">
            <Grid item zeroMinWidth className={classes.name}>
              <Typography style={{fontSize: "1.2rem"}}>
                Attendees
              </Typography>
              &nbsp;:
            </Grid>
            <Grid item zeroMinWidth className={classes.value}>
              <Typography className={classes.alignIconText}>
                {attendees} <People className={classes.icon}/>
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1} wrap="nowrap">
            <Grid item zeroMinWidth className={classes.name}>
              <Typography style={{fontSize: "1.2rem"}}>
                Event Date
              </Typography>
              &nbsp;:
            </Grid>
            <Grid item zeroMinWidth className={classes.value}>
              <Typography className={classes.alignIconText}>
                {eventDate.format("DD/MM/YYYY - hh:mm a")} <Event className={classes.icon}/>
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1} wrap="nowrap">
            <Grid item zeroMinWidth className={classes.name}>
              <Typography style={{fontSize: "1.2rem"}}>
                Duration
              </Typography>
              &nbsp;:
            </Grid>
            <Grid item zeroMinWidth className={classes.value}>
              <Typography className={classes.alignIconText}>
                {duration}&nbsp;hour{duration > 1 ? "s" : ""} <Timer className={classes.icon}/>
              </Typography>
            </Grid>
          </Grid>
        </>
      )}

      <Grid container spacing={1} wrap="nowrap">
        <Grid item zeroMinWidth className={classes.name}>
          <Typography style={{fontSize: "1.2rem"}}>
            Package Price
          </Typography>
          &nbsp;:
        </Grid>
        <Grid item zeroMinWidth className={classes.value}>
          <Typography >
            <b> ${formatMoney(curatedEvent.price)} </b>
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
};

export default PackageDescription;
