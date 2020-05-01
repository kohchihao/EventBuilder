import React, {useRef} from "react";
import {IconButton, InputAdornment, makeStyles, TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {getDuration} from "../../selectors";
import {changeDuration} from "../../action";
import {isPositiveWholeNumber} from "../../utils";
import {Timer} from "@material-ui/icons";

const useStyle = makeStyles(() => ({
  input: {
    width: "100%"
  }
}));

const DurationInput = () => {
  const dispatch = useDispatch();
  const classes = useStyle();
  const duration = useSelector(getDuration);
  const isValid = isPositiveWholeNumber(duration) && duration > 0 && duration < 25;
  const inputRef = useRef();

  return (
    <div>
      <TextField
        error={!isValid}
        label="Duration of event"
        className={classes.input}
        value={duration}
        onChange={(e) => dispatch(changeDuration(e.target.value.replace(/\D/g, "")
          .substr(0, 2)))}
        placeholder={"2 - 12"}
        InputProps={{
          inputRef: inputRef,
          endAdornment: (
            <InputAdornment position="end">
              Hours
              <IconButton onClick={() => inputRef.current.focus()}>
                <Timer />
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

export default DurationInput;
