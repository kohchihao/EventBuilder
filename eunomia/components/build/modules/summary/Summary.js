import React from "react";
import {makeStyles, Typography, Paper, Divider} from "@material-ui/core";
import ServiceTypeOrders from "./ServiceTypeOrders";
import {useDispatch, useSelector} from "react-redux";
import {hasBuiltEvent, getServiceTypes, isEventEditable} from "../../selectors";
import PackageDescription from "./PackageDescription";
import ExpectedCost from "./ExpectedCost";
import Note from "./Note";
import EventDateTimePicker from "./EventDateTimePicker";
import NumberAttendeesInput from "./NumberAttendeesInput";
import DurationInput from "./DurationInput";
import SummaryAction from "./SummaryAction";
import {withRouter} from "next/router";
import {changeDuration, changeNumberOfAttendees} from "../../action";
import {isPositiveWholeNumber} from "../../utils";

const useStyles = makeStyles(theme => ({
  divider: {
    marginTop: 10,
    marginBottom: 10
  },
  paper: {
    padding: 15,
  },
  header: {
    marginBottom: 10,
  }
}));

const Summary = (props, state) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const serviceTypes = useSelector(getServiceTypes);
  const isOnBuiltPage = useSelector(hasBuiltEvent);
  const isEditable = useSelector(isEventEditable);
  let {duration, attendees} = props.router.query;

  if (duration && !isOnBuiltPage) {
    duration = +duration;
    if (isPositiveWholeNumber(duration)) {
      dispatch(changeDuration(duration));
    }
  }
  if (attendees && !isOnBuiltPage) {
    attendees = +attendees;
    if (isPositiveWholeNumber(attendees)) {
      dispatch(changeNumberOfAttendees(attendees));
    }
  }

  if (!serviceTypes) {
    return <div></div>
  }

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.header}>Summary</Typography>
        <PackageDescription/>

        <Divider className={classes.divider}/>
        {Object.values(serviceTypes).map(serviceType =>
          <ServiceTypeOrders key={serviceType.id} serviceType={serviceType}/>)}

        <Divider className={classes.divider}/>
        <ExpectedCost/>

        {isEditable && (
          <>
            <Divider className={classes.divider}/>
            <Note/>

            <Divider className={classes.divider}/>
            <NumberAttendeesInput/>

            <Divider className={classes.divider}/>
            <EventDateTimePicker/>

            <Divider className={classes.divider}/>
            <DurationInput/>

            <Divider className={classes.divider}/>
            <SummaryAction/>
          </>
        )}
      </Paper>
    </div>
  )

};

export default withRouter(Summary);
