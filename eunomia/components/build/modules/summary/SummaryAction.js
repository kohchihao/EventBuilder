import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import {useSelector, useDispatch} from "react-redux";
import {
  getBookOnSignIn,
  getCuratedEvent,
  getDuration, getEvent,
  getEventDate, getEventParent, getEventTitle, getNotes,
  getNumberAttendees,
  getOrderedServices, hasBuiltEvent,
} from "../../selectors";
import {isOrdersValid, isPositiveWholeNumber} from "../../utils";
import api from "../../../../src/api";
import moment from "moment";
import useSnackbar from "../../../snackbar/useSnackbar";
import Router from "next/router";
import {getCurrentUser, isLoggedIn} from "../../../session/selectors"
import { setRegisterDialog } from '../../../nav/action';
import {setBookOnSignIn} from "../../action";
 
const SummaryAction = (props) => {
  const isOnBuiltPage = useSelector(hasBuiltEvent);
  const curatedEvent = useSelector(getCuratedEvent);
  const event = useSelector(getEvent);
  const duration = useSelector(getDuration);
  const numberAttendees = useSelector(getNumberAttendees);
  const orders = useSelector(getOrderedServices);
  const eventDate = useSelector(getEventDate);
  const eventParent = useSelector(getEventParent);
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const user = useSelector(getCurrentUser);
  const notes = useSelector(getNotes);
  const eventTitle = useSelector(getEventTitle);
  const isAuthenticated = useSelector(isLoggedIn);
  const bookOnSignIn = useSelector(getBookOnSignIn);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bookOnSignIn && isAuthenticated && orders) {
      dispatch(setBookOnSignIn(false));
      handleBookEvent();
    }
  }, [isAuthenticated]);

  const handleBookEvent = () => {
    setIsSubmitting(true);
    let eventType = curatedEvent.type.id;

    // Validate inputs
    const errors = [];
    if (orders && !isOrdersValid(Object.values(orders))) {
      errors.push('Please remove or rectify your invalid orders.')
    }
    if (!isPositiveWholeNumber(numberAttendees)) {
      errors.push('Invalid number of attendees.')
    }
    if (!isPositiveWholeNumber(duration) || duration < 1 || duration > 24) {
      errors.push('Invalid duration.');
    }
    if (errors.length !== 0) {
      snackbar.showMessage(errors.join(', '));
      setIsSubmitting(false);
      return;
    }

    const ordersFormatted = Object.values(orders).map((order) => {
      return {
        id: order.service.id,
        amount: order.quantity,
      }
    });
    const durationFormatted = `0${duration}:00:00`;
    const apiCall = isOnBuiltPage ?
      api.event.update(eventType, numberAttendees, moment(eventDate).toISOString(), notes, ordersFormatted,
        curatedEvent.id, durationFormatted, eventTitle, event.id) :
      api.event.create(eventType, numberAttendees, moment(eventDate).toISOString(), notes, ordersFormatted,
        curatedEvent.id, durationFormatted, curatedEvent.name, eventParent);

    if (user) {
      apiCall
        .then(res => {
          Router.push(`/build/${res.data.id}`);
        })
        .catch(error => {
          setIsSubmitting(false);
          snackbar.showMessage(error.message)
      });
    } else {
      setIsSubmitting(false);
      dispatch(setBookOnSignIn(true));
      dispatch(setRegisterDialog(true));
      snackbar.showMessage("Seems like you are not logged in or registered. Please register/login");
    }
    
  };

  return (
    <div>
      <Button disabled={isSubmitting} color="primary" variant="contained" style={{width: "100%"}} onClick={handleBookEvent}>
        {isOnBuiltPage ? "Propose Changes" : "Book Now"}
      </Button>
    </div>
  )
};

export default SummaryAction;
