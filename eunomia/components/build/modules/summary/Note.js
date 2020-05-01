import React from "react";
import {makeStyles, TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {getNotes} from "../../selectors";
import {changeNotes} from "../../action";

const useStyle = makeStyles(() => ({
  textfield: {
    width: "100%"
  }
}));

const Note = (props) => {
  const classes = useStyle();
  const notes = useSelector(getNotes);
  const dispatch = useDispatch();

  return (
    <div>
      <TextField
        className={classes.textfield}
        label="Notes to us"
        multiline
        rows="4"
        margin="normal"
        variant="outlined"
        onChange={(e) => dispatch(changeNotes(e.target.value))}
        value={notes}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  )
};

export default Note;
