import React, { useState, useEffect } from 'react';
import useSnackbar from '../../snackbar/useSnackbar';
import {
  makeStyles,
  Grid,
  Typography,
  Container,
  Paper,
  Avatar,
  Tabs,
  Tab,
  Box,
  Button
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../selectors';

import EditProfilePanel from './EditProfilePanel';
import ChangePasswordPanel from './ChangePasswordPanel';


const useStyles = makeStyles(theme => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  root: {
    flexGrow: 1,
    display: 'flex',
    height: 224
  }
}));

const ProfilePage = () => {
  const snackbar = useSnackbar();
  const classes = useStyles();
  const userDetails = useSelector(getUserDetails);
  const [isLoading, setIsLoading] = useState(true);

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabIndexChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    if (userDetails) {
      setIsLoading(false);
    }
  }, [userDetails]);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabIndex}
        onChange={handleTabIndexChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Edit Profile" />
        <Tab label="Change Password" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <EditProfilePanel userDetails={userDetails}/>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ChangePasswordPanel />
      </TabPanel>
    </div>
  );
};

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {children}
    </Box>
  );
};

export default ProfilePage;
