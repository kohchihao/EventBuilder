import React from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Divider,
  Paper,
  InputAdornment,
  Container,
  Grid,
  MenuItem
} from "@material-ui/core";
import api from "../src/api";
import {useDispatch, useSelector} from "react-redux";
import { getEventType, getPax, getBudget, getDuration } from "../components/browse/selectors";
import { setEventType, setPax, setBudget, setDuration } from "../components/browse/action";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    width: "100%",
    display: "flex"
  },
  input: {
    display: "flex",
    alignItems: "center",
    width: "250px",
    margin: " 5px 20px",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  divider: {
    height: 50,
    margin: "20px 0",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  }
}));

const Search = props => {
  const classes = useStyles();
  const eventType = useSelector(getEventType)
  const pax = useSelector(getPax)
  const budget = useSelector(getBudget)
  const duration = useSelector(getDuration)
  const dispatch = useDispatch();

  const [eventTypeList, setEventTypeList] = React.useState([]);

  const MAX_PAX = 1000000;
  const MAX_BUDGET = 1000000000;

  const invalidPax = pax < 0 || pax > MAX_PAX;
  const invalidBudget = budget < 0 || budget > MAX_BUDGET;
  const invalidDuration = duration < 0 || duration > 24;

  React.useEffect(() => {
    api.event_types.list().then(response => setEventTypeList(response.data));
  }, []);

  return (
    <Container>
      <Paper className={classes.root}>
        <Grid container justify="center">
          <div className={classes.input}>
            <TextField
              id="type"
              select
              label="Event Type"
              className={classes.textField}
              value={eventType}
              onChange={event => dispatch(setEventType(event.target.value))}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
              variant="outlined"
            >
              {eventTypeList.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <Divider className={classes.divider} orientation="vertical" />
          <div className={classes.input}>
            <TextField
              id="pax"
              label="Pax"
              value={pax !== 0 ? pax.toLocaleString() : ""}
              onChange={() =>
                dispatch(setPax(Number(event.target.value.replace(/\D/g, "").substr(0, 6))))
              }
              type="tel"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              variant="outlined"
              placeholder={"Adults"}
              error={invalidPax && pax !== 0}
            />
          </div>
          <Divider className={classes.divider} orientation="vertical" />
          <div className={classes.input}>
            <TextField
              id="budget"
              label="Budget"
              value={budget !== 0 ? budget.toLocaleString() : ""}
              onChange={() =>
                dispatch(setBudget(Number(event.target.value.replace(/\D/g, "").substr(0, 9))))
              }
              type="tel"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              variant="outlined"
              placeholder="Total budget"
              error={invalidBudget && budget !== 0}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                )
              }}
            />
          </div>
          <Divider className={classes.divider} orientation="vertical" />
          <div className={classes.input}>
            <TextField
              id="duration"
              label="Duration"
              value={duration !== 0 ? duration : ""}
              onChange={() =>
                dispatch(setDuration(Number(event.target.value.replace(/\D/g, "").substr(0, 2))))
              }
              type="tel"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              variant="outlined"
              error={invalidDuration && duration !== 0}
              placeholder={"2 - 12 hours"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {duration === 1 ? "hour" : "hours"}
                  </InputAdornment>
                )
              }}
            />
          </div>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Search;
