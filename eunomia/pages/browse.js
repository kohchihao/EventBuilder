import React from "react";
import { withRouter } from "next/router";
import Search from "../components/search";
import {
  Grid,
  Container,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import api from "../src/api";
import CuratedEventCard from "../components/curatedEventCard";
import PageFooter from "../components/pageFooter";
import {withRedux} from "../src/helpers/redux";
import {useSelector} from "react-redux";
import { getEventType, getPax, getBudget, getDuration } from "../components/browse/selectors";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    minHeight: "100vh"
  },
  mainGrid: {
    padding: "50px 0"
  },
  searchBar: {
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
      "linear-gradient(330deg, #a8c0ff, #3f2b96)",
    paddingTop: "50px",
    paddingBottom: "50px"
  },
  loadingText: {
    margin: "0 300px",
    padding: "50px",
    textAlign: "center"
  }
}));

const Browse = props => {
  const classes = useStyles();
  const [eventList, setEventList] = React.useState([]);
  const [countryCode, setCountryCode] = React.useState("sg");
  const [listLoaded, setListLoaded] = React.useState(false);
  const eventType = useSelector(getEventType)
  const pax = useSelector(getPax)
  const budget = useSelector(getBudget)
  const duration = useSelector(getDuration)

  React.useEffect(() => {
    let delayedSearch = setTimeout(() => {
      api.curated_event
      .search(countryCode, eventType || "*", pax || "*", budget || "*", duration || "*")
      .then(response => {
        setEventList(response.data);
        setListLoaded(true);
      })
      .catch(error => {});
    }, 500)
   return () => {
     clearTimeout(delayedSearch)
   }
  }, [eventType, pax, budget, duration]);

  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.searchBar}>
        <Search/>
      </div>
      {eventList.length ? (
        <Container>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
            className={classes.mainGrid}
          >
            {eventList.map(event => (
              <CuratedEventCard key={event.id} curatedEvent={event} />
            ))}
          </Grid>
        </Container>
      ) : (
        <div className={classes.loadingText}>
          {listLoaded ? (
            <h3>No events found, please refine your search.</h3>
          ) : (
            <div>
            <h3>Loading your results, please wait...</h3>
            <CircularProgress/>
            </div>
          )}
        </div>
      )}
      <PageFooter/>
    </div>
  );
};
export default withRedux(withRouter(Browse));
