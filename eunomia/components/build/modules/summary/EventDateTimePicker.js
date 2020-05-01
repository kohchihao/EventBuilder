import React from "react";
import { DateTimePicker} from "@material-ui/pickers";
import {IconButton, InputAdornment} from "@material-ui/core";
import {Event} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {getEventDate, hasBuiltEvent} from "../../selectors";
import {changeEventDate} from "../../action";
import moment from "moment";

const EventDateTimePicker = () => {
  const eventDate = useSelector(getEventDate);
  const dispatch = useDispatch();
  const isEventBuilt = useSelector(hasBuiltEvent);

  return (
    <DateTimePicker
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <Event />
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
      variant="inline"
      inputVariant="outlined"
      label="When is your event starting?"
      value={eventDate}
      onChange={date => dispatch(changeEventDate(date))}
      minDate={isEventBuilt ? eventDate : moment().startOf('hour').add(7, 'd')}
      format="DD/MM/YYYY - hh:mm a"
    />
  )
};

export default EventDateTimePicker;
