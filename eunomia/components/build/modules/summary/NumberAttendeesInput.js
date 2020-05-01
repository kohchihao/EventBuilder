import React, {useRef} from "react";
import {IconButton, InputAdornment, makeStyles, TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {getNumberAttendees} from "../../selectors";
import {changeNumberOfAttendees} from "../../action";
import {isPositiveWholeNumber} from "../../utils";
import {People} from "@material-ui/icons";

const useStyle = makeStyles(() => ({
  input: {
    width: "100%"
  }
}));

const NumberAttendeesInput = () => {
  const numAttendees = useSelector(getNumberAttendees);
  const dispatch = useDispatch();
  const classes = useStyle();
  const isValid = isPositiveWholeNumber(numAttendees);
  const inputRef = useRef();

  return (
    <div>
      <TextField
        error={!isValid}
        label="Number of Attendees"
        className={classes.input}
        value={numAttendees}
        onChange={(e) => dispatch(changeNumberOfAttendees(e.target.value.replace(/\D/g, "")
          .substr(0, 9)))}
        InputProps={{
          inputRef: inputRef,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => inputRef.current.focus()}>
                <People />
              </IconButton>
            </InputAdornment>
          ),
        }}
        type="tel"
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        variant="outlined"
      />
    </div>
  )
};

export default NumberAttendeesInput;
