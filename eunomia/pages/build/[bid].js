import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";
import {withRedux} from "../../src/helpers/redux";
import NavBar from '../../components/Navbar';
import api from "../../src/api";
import LoadingIcon from "../../components/icons/LoadingIcon";
import {useDispatch, useSelector} from "react-redux";
import {isLoggedIn, isAuthenticating} from "../../components/session/selectors";
import {Typography} from "@material-ui/core";
import BuiltPage from "../../components/build/pages/BuiltPage";
import background from "../../src/assets/images/background.png";
import { makeStyles } from '@material-ui/core/styles';
import useSnackbar from "../../components/snackbar/useSnackbar";
import {setEvent, setInitialState} from "../../components/build/action";

const useStyles = makeStyles(theme => ({
  page: {
    backgroundImage: `url(${background})`,
    minHeight: '100vh'
  }
}));

const SpecificBuild = (props, state) => {
  const { bid } = props.router.query;
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(isLoggedIn);
  const isLoggingIn = useSelector(isAuthenticating);
  const [isForbiddenContent, setIsForbiddenContent] = useState(false);
  const snackbar = useSnackbar();
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    api.event.retrieve(bid).then((res) => {
      dispatch(setInitialState());
      dispatch(setEvent(res.data));
      setIsForbiddenContent(false);
    }).catch(error => {
      if (error.response && (error.response.status === 404 || error.response.status === 401)) {
        !isLoggingIn && setIsForbiddenContent(true)
      } else {
        snackbar.showMessage(error.message);
      }
    }).finally(() => {
      setIsLoading(false);
    });
    return () => {
      dispatch(setInitialState());
    }
  }, [isLoggingIn]);

  if (isLoading || isLoggingIn) {
    return (
      <>
        <NavBar/>
        <LoadingIcon/>
      </>
    )
  }

  if (!isAuthenticated || isForbiddenContent) {
    return (
      <>
        <NavBar />
        <Typography variant="h5" style={{textAlign: "center", marginTop: 50}}>
          You do not have the permission to view this. <br/>
          Please log in if you have not.
        </Typography>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className={classes.page}>
        <BuiltPage/>
      </div>
    </>
  )
};

export default withRedux(withRouter(SpecificBuild))
