import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getEvent, getEventTitle, getShowSummary} from "../selectors";
import {IconButton, makeStyles, Typography, Input, Button, Tooltip} from "@material-ui/core";
import {Edit, Visibility, Receipt} from "@material-ui/icons";
import {changeEventTitle, setShowSummary} from "../action";
import useSnackbar from "../../snackbar/useSnackbar";
import api from "../../../src/api";

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5
  },
  input: {
    fontSize: "2.125rem",
    fontWeight: 400,
    lineHeight: 1.17,
    letterSpacing: "0.00735em"
  },
  textField: {
    maxWidth: 500
  }
}));

const EventTitle = (props) => {
  const classes = useStyles();
  const eventTitle = useSelector(getEventTitle);
  const event = useSelector(getEvent);
  const [eventName, setEventName] = useState(eventTitle ? eventTitle : '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSummary = useSelector(getShowSummary);

  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  if (!eventTitle) {
    return (
      <div></div>
    )
  }

  const handleSaveTitle = () => {
    setIsSubmitting(true);
    return api.event.update_basic_info(event.id, eventName).then(res => {
      dispatch(changeEventTitle(res.data.name));
    }).catch((error) => {
      setEventName(eventTitle);
      snackbar.showMessage(error.message);
    }).finally(() => {
      setIsSubmitting(false);
      setIsEditing(false)
    })
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    }
  };

    if (event.status === 'ACCEPTED') {
      return (
        <div className={classes.header}>
          <Typography variant="h4" style={{display: "inline-block"}}>{eventTitle}</Typography>
        </div>
      )
    }

    return (
    <div className={classes.header}>
      {event.status === 'QUOTED' ? (
        <>
          <Typography variant="h4" style={{display: "inline-block"}}>{eventTitle}</Typography>
          {showSummary ? (
            <Tooltip title="View Quotation" placement="top">
              <IconButton onClick={() => dispatch(setShowSummary(false))}>
                <Receipt/>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="View summary" placement="top">
              <IconButton onClick={() => dispatch(setShowSummary(true))}>
                <Visibility/>
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : !isEditing ? (
        <>
          <Typography variant="h4" style={{display: "inline-block"}}>{eventTitle}</Typography>
          <IconButton onClick={() => setIsEditing(true)}>
            <Edit/>
          </IconButton>
        </>
      ) : (
        <>
          <Input
            autoFocus
            className={classes.textField}
            classes={{
              input: classes.input
            }}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            onKeyDown={handleEnter}
          />
          <Button disabled={isSubmitting} onClick={handleSaveTitle} color="primary" size="small">
            Save
          </Button>
        </>
      )}
    </div>
  )
};

export default EventTitle
