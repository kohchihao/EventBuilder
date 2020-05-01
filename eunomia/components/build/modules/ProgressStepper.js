import React from "react";
import {Stepper, StepConnector, withStyles, Step, StepLabel, makeStyles, Typography} from "@material-ui/core";
import {Settings, Close, ContactPhone, Receipt, DoneOutline} from "@material-ui/icons";
import clsx from 'clsx';
import {useSelector} from "react-redux";
import {getEvent} from "../selectors";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  completed: {
    '& $line': {
      backgroundColor: "#3f2b96",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundColor: "#3f2b96"
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <Settings />,
    2: <ContactPhone />,
    3: <Receipt />,
    4: <DoneOutline/>
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

function CancelIcon(props) {
  let classes = useColorlibStepIconStyles();

  return (
    <div className={clsx(classes.root, classes.completed)}>
      <Close/>
    </div>
  )
}

const ProgressStepper = () => {
  const event = useSelector(getEvent);

  if (!event) {
    return (
      <></>
    )
  }

  if (event.status === 'CANCELLED') {
    const cancelledStep = [{
      id: 5,
      name: 'Cancelled',
      description: "Your event is cancelled :("
    }];

    return (
      <div>
        {cancelledStep.map(step => (
          <>
            <Stepper alternativeLabel activeStep={5} connector={<ColorlibConnector />}>
                <Step key={step.id}>
                  <StepLabel StepIconComponent={CancelIcon}>{step.name}</StepLabel>
                </Step>
            </Stepper>
            <Typography variant="subtitle1" style={{margin: 'auto', paddingTop: 10, textAlign: 'center', maxWidth: '50%'}}>
              {step.description}
            </Typography>
          </>
        ))}
      </div>
    )
  }

  let steps = {
    PENDING: {
      id: 1,
      name: 'Processing',
      description: 'Your event is being processed and you will be contacted in 1 working day!'
    },
    CONTACTED: {
      id: 2,
      name: 'Contacted',
      description: 'The details of your event have been documented out by our event planner. ' +
        'We will send you the quotation when all relevant stakeholders have been confirmed.'
    },
    QUOTED: {
      id: 3,
      name: 'Quoted',
      description: 'All relevant stakeholders have agreed and confirmed their availability. ' +
        'Please proceed to sign and confirm the quotation.'
    },
    ACCEPTED: {
      id: 4,
      name: 'Accepted',
      description: 'Your event is good to go!'
    },
  };

  if (event.status === 'QUOTED' && event.signed_quotation_token) {
    steps = {
      ...steps,
      QUOTED: {
        ...steps.QUOTED,
        description: "We are in the process of verifying your signed quotation."
      }
    }
  }
  const activeState = steps[event.status];
  return (
    <div style={{marginTop: 5}}>
      <Stepper alternativeLabel activeStep={activeState.id} connector={<ColorlibConnector />}>
        {Object.values(steps).map(step => (
          <Step key={step.id}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{step.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant="subtitle1" style={{margin: 'auto', paddingTop: 10, textAlign: 'center', maxWidth: '50%'}}>
        {activeState.description}
      </Typography>
    </div>
  )
};

export default ProgressStepper;
