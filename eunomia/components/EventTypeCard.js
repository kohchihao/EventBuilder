import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Wizard from "./wizard";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  Grow,
  CardActionArea,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  CircularProgress,
  useMediaQuery
} from "@material-ui/core";
import api from "../src/api";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    minHeight: 210,
    [theme.breakpoints.up("md")]: {
      maxWidth: 250
    }
  },
  media: {
    height: 0,
    paddingTop: "80%" // 16:9
  },
  text: {
    color: "white",
    paddingBottom: "50px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem"
    }
  },
  root: {
    paddingTop: "70px",
    paddingBottom: "70px",
    backgroundSize: "cover",
    background:
      "-webkit-linear-gradient(330deg, #a8c0ff, #3f2b96)",
    background:
      "-o-linear-gradient(330deg, #a8c0ff, #3f2b96)",
    background:
      "-ms-linear-gradient(330deg, #a8c0ff, #3f2b96)",
    background:
      "-moz-linear-gradient(330deg, #a8c0ff, #3f2b96)",
    background:
      "linear-gradient(330deg, #a8c0ff, #3f2b96)"
  },
  cardTitle: {
    fontSize: "1rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem"
    }
  },
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  dialog: {
    padding: "20px"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function EventTypeCard(props) {
  const classes = useStyles();
  const [eventTypeList, setEventTypeList] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    api.event_types
      .list()
      .then(response => {
        setEventTypeList(response.data);
        setLoaded(true);
      })
      .catch(err => {});
  }, []);

  const renderEventTypeList = (eventType, index) => {
    return (
      <Grow
        key={index}
        in={Boolean(eventType)}
        style={{ transformOrigin: "0 0 0 0" }}
        {...(eventType ? { timeout: 1000 + index * 500 } : {})}
      >
        <Grid item xs={12} sm={3} md={2}>
          <Card className={classes.card}>
            <CardActionArea
              onClick={() => {
                setSelectedEventType(eventType);
                setOpen(true);
              }}
            >
              <CardMedia
                className={classes.media}
                image={eventType.image_url}
                title={eventType.name}
              />
              <CardContent>
                <Typography
                  variant="subtitle1"
                  align="center"
                  className={classes.cardTitle}
                >
                  {eventType.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grow>
    );
  };

  return (
    <div className={classes.root}>
      <Container>
        <Typography
          align="left"
          className={classes.text}
          paragraph
          variant="h4"
        >
          What would you like to plan today?
        </Typography>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          {loaded ? (
            eventTypeList.map(renderEventTypeList)
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </Container>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Tell us more about your{" "}
              {selectedEventType
                ? selectedEventType.name.toLowerCase().includes("event")
                  ? selectedEventType.name.toLowerCase()
                  : selectedEventType.name.toLowerCase() + " event"
                : ""}
              !
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container className={classes.dialog}>
          <Wizard eventType={selectedEventType} />
        </Container>
      </Dialog>
    </div>
  );
}
