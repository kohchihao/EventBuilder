import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";
import ExploreIcon from "@material-ui/icons/Explore";
import InfoIcon from "@material-ui/icons/Info";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EventIcon from '@material-ui/icons/Event';
import { withRedux } from "../src/helpers/redux";

import {
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Button,
  IconButton,
  Toolbar,
  AppBar,
  Slide,
  Dialog,
  Grid,
  Menu,
  MenuItem,
  Avatar
} from "@material-ui/core";

import Login from "./session/modules/Login";
import Signup from "./session/modules/Register";

import { useDispatch, useSelector } from "react-redux";
import * as session from "./session";
import { setCurrentUser, setIsAuthenticating } from "./session/actions";
import useSnackbar from "./snackbar/useSnackbar";
import api from "../src/api";
import { logout } from "./session/actions";
import { useRouter } from "next/router";

import { setLoginDialog, setRegisterDialog } from "./nav/action";
import { getRegisterDialog, getLoginDialog } from "./nav/selectors";

import logo from "../src/assets/images/build-events-logo-nav.png";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  list: {
    width: 250
  },
  drawerHeader: {
    background: theme.palette.primary.main,
    color: "white"
  },
  whiteAvatar: {
    color: "#000",
    backgroundColor: "#ffffff"
  },
  mainLogo: {
    height: "40px",
    marginTop: "10px",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  mobileLogo: {
    height: "40px",
    marginLeft: "15px"
  }
}));

const NavBar = props => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(session.selectors.isLoggedIn);
  const user = useSelector(session.selectors.getCurrentUser);
  const snackbar = useSnackbar();
  const router = useRouter();

  const registerDialogOpen = useSelector(getRegisterDialog);
  const loginDialogOpen = useSelector(getLoginDialog);
  const isLoggingIn = useSelector(session.selectors.isAuthenticating);

  // Logged in menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleAccountClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    api.auth
      .logout()
      .then(res => {
        dispatch(logout());
      })
      .catch(error => {
        snackbar.showMessage(error.message);
      });
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List className={classes.drawerHeader}>
        <a href="/">
          <img className={classes.mobileLogo} src={logo} />
        </a>
        <ListItem key={"title"}>
          <span>Hi{user && ` ${user.name}`}, welcome to BuildEvents!</span>
        </ListItem>

        <ListItem key={"sub-title"}>
          <span>Start building events today!</span>
        </ListItem>

        <ListItem key={"buttons"}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            {!isLoggedIn ? (
              <Button color="inherit" onClick={() => setLoginDialog(true)}>
                Login
              </Button>
            ) : null}
            {!isLoggedIn ? (
              <Button color="inherit" onClick={() => dispatch(setRegisterDialog(true))}>
                Sign up
              </Button>
            ) : null}
          </Grid>
        </ListItem>
      </List>
      <List>
        <MuiLink color="inherit" href="/browse">
          <ListItem button key={"Browse"}>
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary={"Browse"} />
          </ListItem>
        </MuiLink>
        <Divider />
        {!isLoggedIn ? (
          <>
          <a style={{color: "inherit", textDecoration: "none"}} href="https://landing.buildevents.today">
          <ListItem button key={"About Us"}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={"About Us"} />
          </ListItem>
        </a>
        <Divider />
        </>
        ) : null}
        {isLoggedIn ? (
          <>
          <MuiLink color="inherit" href="/profile">
          <ListItem button key={"Profile"}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Profile"} />
          </ListItem>
          </MuiLink>
          <Divider />
          </>
        ) : null}
        {isLoggedIn ? (
          <>
          <MuiLink color="inherit" href="/events">
          <ListItem button key={"Events"}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary={"My Events"} />
          </ListItem>
          </MuiLink>
          <Divider />
          </>
        ) : null}
        {isLoggedIn ? (
          <>
          <ListItem onClick={handleLogout} button key={"Logout"}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItem>
          <Divider />
          </>
        ) : null}
      </List>
    </div>
  );

  useEffect(() => {
    dispatch(setIsAuthenticating(true));
    api.auth
      .silentLogin()
      .then(res => {
        dispatch(setCurrentUser(res.data));
      })
      .finally(() => {
        dispatch(setIsAuthenticating(false));
      });
  }, []);

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.sectionMobile}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <a href="/">
            <img className={classes.mainLogo} src={logo} />
          </a>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {!isLoggingIn && <Button href="/browse" color="inherit">Browse</Button>}
            {isLoggedIn && (
              <Button href="/events" color="inherit">My Events</Button>
            )}
            {!isLoggingIn && !isLoggedIn && (
              <a style={{color: "inherit"}} href="https://landing.buildevents.today">
                <Button color="inherit">About Us</Button>
              </a>
            )}
            {!isLoggingIn && !isLoggedIn && (
              <React.Fragment>
                <Button onClick={() => dispatch(setRegisterDialog(true))} color="inherit">
                  New User? Register
                </Button>
              </React.Fragment>
            )}
          </div>

          {!isLoggingIn && (
            <>
              {isLoggedIn ? (
                <div>
                  <div className={classes.sectionDesktop}>
                    <IconButton
                      aria-label="show new notifications"
                      color="inherit"
                      onClick={handleAccountClick}
                    >
                      <Avatar className={classes.whiteAvatar}>
                        {user.name[0]}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleAccountClose}
                    >
                      <MenuItem onClick={handleProfile}>Profile</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                </div>
              ) : (
                <div>
                  <Button onClick={() => dispatch(setLoginDialog(true))} color="inherit">
                    Login
                  </Button>
                </div>
              )}
            </>
          )}

          <Dialog
            open={registerDialogOpen}
            TransitionComponent={Slide}
            keepMounted
            onClose={() => dispatch(setRegisterDialog(false))}
          >
            <Signup />
          </Dialog>
          <Dialog
            open={loginDialogOpen}
            TransitionComponent={Slide}
            keepMounted
            onClose={() => dispatch(setLoginDialog(false))}
          >
            <Login />
          </Dialog>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={toggleDrawer}>
        {drawerList()}
      </Drawer>
    </div>
  );
};

export default withRedux(NavBar);
