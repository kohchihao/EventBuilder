import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Button,
  Typography,
  Divider,
  Stepper,
  Step,
  Paper,
  TextField,
  InputAdornment,
  Grid,
  StepButton,
  Tooltip
} from "@material-ui/core";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import { getPax, getBudget, getDuration, getEventType } from "../components/browse/selectors";
import { setEventType, setPax, setBudget, setDuration } from "../components/browse/action";
import { withRedux } from "../src/helpers/redux";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    width: "100%"
  },
  textField: {
    width: "100%",
    display: "flex"
  },
  input: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center"
  },
  inputBox: {
    padding: "50px 0 100px",
    width: "75%",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  buttonBox: {
    width: "75%",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  divider: {
    height: 50,
    margin: 0
  }
}));

const Wizard = props => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [completed, setCompleted] = React.useState({});
  const dispatch = useDispatch();
  const eventType = props.eventType
  const pax = useSelector(getPax)
  const budget = useSelector(getBudget)
  const duration = useSelector(getDuration)
  const steps = [
    "How many people are coming?",
    "What's your total budget?",
    "How long is the event?"
  ];
  if(eventType.id !== useSelector(getEventType)) {
    dispatch(setEventType(eventType.id))
  }

  const MAX_PAX = 1000000;
  const MAX_BUDGET = 1000000000;

  const invalidPax = pax <= 0 || pax > MAX_PAX;
  const invalidBudget = budget <= 0 || budget > MAX_BUDGET;
  const invalidDuration = duration <= 0 || duration > 24;

  const isStepSkipped = step => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      const newCompleted = completed;
      newCompleted[activeStep] = false;
      setCompleted(newCompleted);
      return newSkipped;
    });
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Paper className={classes.input}>
            <Button
              color="primary"
              disabled={pax <= 10}
              onClick={() => dispatch(setPax(pax - 10))}
              size="small"
            >
              -10
            </Button>
            <Divider className={classes.divider} orientation="vertical" />
            <Button
              color="primary"
              disabled={pax <= 0}
              onClick={() => dispatch(setPax(pax - 1))}
              size="small"
            >
              -1
            </Button>
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
            <Button
              color="primary"
              disabled={pax >= MAX_PAX}
              onClick={() => dispatch(setPax(pax + 1))}
              size="small"
            >
              +1
            </Button>
            <Divider className={classes.divider} orientation="vertical" />
            <Button
              color="primary"
              disabled={pax >= MAX_PAX}
              onClick={() => dispatch(setPax(pax + 10))}
              size="small"
            >
              +10
            </Button>
          </Paper>
        );
      case 1:
        return (
          <Paper className={classes.input}>
            <Button
              color="primary"
              disabled={budget <= 1000}
              onClick={() => dispatch(setBudget(budget - 1000))}
              size="small"
            >
              -1000
            </Button>
            <Divider className={classes.divider} orientation="vertical" />
            <Button
              color="primary"
              disabled={budget <= 100}
              onClick={() => dispatch(setBudget(budget - 100))}
              size="small"
            >
              -100
            </Button>
            <TextField
              id="budget"
              label="Budget"
              value={budget !== 0 ? budget.toLocaleString() : ""}
              onChange={() => {
                dispatch(setBudget(Number(event.target.value.replace(/\D/g, "").substr(0, 9))));
              }}
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
              helperText={
                pax
                  ? `For ${pax} pax, this would mean $${(
                      budget / pax
                    ).toLocaleString()} per pax`
                  : ""
              }
            />
            <Button
              color="primary"
              disabled={budget >= MAX_BUDGET}
              onClick={() => dispatch(setBudget(budget + 100))}
              size="small"
            >
              +100
            </Button>
            <Divider className={classes.divider} orientation="vertical" />
            <Button
              color="primary"
              disabled={budget >= MAX_BUDGET}
              onClick={() => dispatch(setBudget(budget + 1000))}
              size="small"
            >
              +1000
            </Button>
          </Paper>
        );
      case 2:
        return (
          <Paper className={classes.input}>
            <TextField
              id="duration"
              label="Duration"
              value={duration !== 0 ? duration : ""}
              onChange={() =>
                dispatch(setDuration(Number(event.target.value.replace(/\D/g, "").substr(0, 2))))
              }
              type="tel"
              className={classes.textField}
              style={{marginLeft: "10px"}}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              variant="outlined"
              error={invalidDuration && duration !== 0}
              placeholder={"2 - 12"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {duration === 1 ? "hour" : "hours"}
                  </InputAdornment>
                )
              }}
            />
            <Button color="primary" onClick={() => dispatch(setDuration(4))} size="small">
              Half Day
            </Button>
            <Divider className={classes.divider} orientation="vertical" />
            <Button color="primary" onClick={() => dispatch(setDuration(8))} size="small">
              Full Day
            </Button>
          </Paper>
        );
      default:
        return "Unknown step";
    }
  }

  return (
    <div>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepButton
                onClick={() => setActiveStep(index)}
                completed={completed[index]}
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <Container className={classes.box}>
        {activeStep === steps.length ? (
          <div>
            {!invalidPax && !invalidBudget && !invalidDuration ? (
              <Typography className={classes.instructions}>
                Is this the event you want? <br />
                <br />A <b>{duration}</b> hour <b>{eventType.name}</b> for
                <b> {pax.toLocaleString()}</b> pax at a total of
                <b> ${budget.toLocaleString()}</b>
              </Typography>
            ) : (
              <Typography className={classes.instructions}>
                You did not fill in all the information. Do you want to search
                using the following partial information? <br /> <br />
                Event Type: <b>{eventType.name}</b> <br />
                Pax:{" "}
                <b>{invalidPax ? "any" : pax.toLocaleString() + " adults"}</b>
                <br />
                Budget:{" "}
                <b>{invalidBudget ? "any" : "$" + budget.toLocaleString()} </b>
                <br />
                Duration: <b>{invalidDuration ? "any" : duration + "hours"}</b>
              </Typography>
            )}
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Tooltip
                title="Click on any steps above to amend your input"
                placement="top"
              >
                <span>
                  <Button
                    variant="contained"
                    disabled
                    className={classes.button}
                  >
                    No
                  </Button>
                </span>
              </Tooltip>
              <Link
                href={{
                  pathname: "/browse",
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.button}
                >
                  Yes
                </Button>
              </Link>
            </Grid>
          </div>
        ) : (
          <Container>
            <div className={classes.inputBox}>{getStepContent(activeStep)}</div>
            <Grid
              className={classes.buttonBox}
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSkip}
                className={classes.button}
                disabled={Boolean(
                  (activeStep === 0 && !invalidPax) ||
                    (activeStep === 1 && !invalidBudget) ||
                    (activeStep === 2 && !invalidDuration)
                )}
              >
                Skip
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={Boolean(
                  (activeStep === 0 && invalidPax) ||
                    (activeStep === 1 && invalidBudget) ||
                    (activeStep === 2 && invalidDuration)
                )}
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Grid>
          </Container>
        )}
      </Container>
    </div>
  );
}

export default withRedux(Wizard);
