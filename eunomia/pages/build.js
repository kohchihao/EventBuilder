import React from "react";
import { withRouter } from "next/router";
import BuildPage from "../components/build/pages/BuildPage"
import NavBar from '../components/Navbar';
import {withRedux} from "../src/helpers/redux";
import {Link as MuiLink, Typography} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import background from "../src/assets/images/background.png"

const useStyles = makeStyles(theme => ({
  page: {
    backgroundImage: `url(${background})`,
    minHeight: '100vh'
  }
}));

const Build = (props, state) => {
  const curatedEventId = props.router.query.package;
  const classes = useStyles();

  if (!curatedEventId) {
    return (
      <>
        <NavBar />
        <Typography variant="h4" style={{textAlign: "center", marginTop: 40}}>
          Please&nbsp;
          <a href="/browse">
            <MuiLink style={{cursor: "pointer"}}>
              choose
            </MuiLink>
          </a>&nbsp;a package first.
        </Typography>
      </>
    )
  }

  return (
    <div className={classes.page}>
      <NavBar />
      <BuildPage curatedEventId={curatedEventId}/>
    </div>
  )
};

export default withRedux(withRouter(Build))
