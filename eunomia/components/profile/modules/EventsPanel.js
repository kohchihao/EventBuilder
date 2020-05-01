import React, { useState, useEffect } from 'react';
import useSnackbar from '../../snackbar/useSnackbar';
import {
  makeStyles,
  Grid,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../selectors';
import api from '../../../src/api';
import moment from 'moment';
import { sortEventsByDateTime } from '../utils';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: theme.palette.primary.main
  }
}));

const EventsPanel = () => {
  const snackbar = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const userDetails = useSelector(getUserDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    if (userDetails) {
      api.event
        .retrieveAll()
        .then(res => {
          res.data.sort(sortEventsByDateTime);
          setUserEvents(res.data);
          setIsLoading(false);
        })
        .catch(error => {
          snackbar.showMessage(error.message);
        });
    }
  }, [userDetails]);

  const handleListItemClick = eventId => {
    router.push(`/build/${eventId}`);
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Paper className={classes.root}>
      <Grid container justify="flex-start" alignItems="center">
        <Typography variant="h5" component="h5" gutterBottom>
          My Events
        </Typography>
      </Grid>

      <List>
        {userEvents.map((event, index) => (
          <React.Fragment key={event.id}>
            <ListItem button onClick={() => handleListItemClick(event.id)}>
              <ListItemText
                primary={event.name}
                secondary={`${event.attendees} pax • ${moment(
                  event.date
                ).format('DD/MM/YYYY hh:mm a')}`}
              />
              <Chip label={event.status} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default EventsPanel;
