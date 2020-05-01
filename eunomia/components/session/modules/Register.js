import React, { useState } from 'react';
import {
  Typography,
  CssBaseline,
  Button,
  Avatar,
  Container,
  Link
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import useSnackbar from '../../snackbar/useSnackbar';
import api from '../../../src/api';
import { obsKeysToString } from '../../lib/utils';
import * as Yup from 'yup';
import { TextField } from 'formik-material-ui';

import { useSelector, useDispatch } from 'react-redux';
import {
  getBookOnSignIn,
  getCuratedEvent,
  getDuration,
  getEventDate,
  getNumberAttendees,
  getOrderedServices
} from '../../build/selectors';
import moment from 'moment';
import { useRouter } from 'next/router';
import { setRegisterDialog, setLoginDialog } from '../../nav/action';
import { setCurrentUser, setIsAuthenticating } from '../actions';
import GoogleButton from '../../../src/assets/images/google.svg';
import {setBookOnSignIn} from "../../build/action";

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.common.white,
    paddingBottom: '50px'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  error: {
    color: 'red',
    textAlign: 'center'
  },
  link: {
    cursor: "pointer"
  },
  googleButton: {
    background: 'white'
  },
  googleIcon: {
    height: 20,
    width: 20
  },
  or: {
    paddingTop: 20,
    color: "#9e9e9e"
  }
}));

const SignUp = () => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues = {
    email: '',
    password: '',
    displayName: '',
    phoneNumber: '+65'
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Required'),
    password: Yup.string()
      .required('Required')
      .min(8, 'Password is too short - should be 8 chars minimum.'),
    displayName: Yup.string().required('Required'),
    phoneNumber: Yup.string()
      .required('Required.')
      .matches(/^\+[1-9]\d{1,14}$/, 'Phone number is not valid')
  });

  const curatedEvent = useSelector(getCuratedEvent);
  const duration = useSelector(getDuration);
  const numberAttendees = useSelector(getNumberAttendees);
  const orders = useSelector(getOrderedServices);
  const eventDate = useSelector(getEventDate);
  const bookOnSignIn = useSelector(getBookOnSignIn);

  const openLoginDialog = () => {
    let toBookOnSignIn = false;
    if (bookOnSignIn) {
      toBookOnSignIn = true;
    }
    dispatch(setLoginDialog(true));
    dispatch(setRegisterDialog(false));
    if (toBookOnSignIn) {
      dispatch(setBookOnSignIn(true));
    }
  };

  const handleSignupSubmission = (values, { setSubmitting, resetForm }) => {
    const { displayName, email, password, phoneNumber } = values;
    if (orders) {
      let eventType = curatedEvent.type.id;
      const ordersFormatted = Object.values(orders).map(order => {
        return {
          id: order.service.id,
          amount: order.quantity
        };
      });
      const durationFormatted = `0${duration}:00:00`;

      api.auth
        .registerWithEvent(
          displayName,
          email,
          phoneNumber,
          password,
          eventType,
          numberAttendees,
          moment(eventDate).toISOString(),
          ordersFormatted,
          curatedEvent.id,
          durationFormatted,
          curatedEvent.name
        )
        .then(res => {
          dispatch(setRegisterDialog(false));
          resetForm(initialValues);
          snackbar.showMessage(
            `Sign up successful! An email have been sent to ${email}.`
          );
        })
        .catch(error => {
          if (error.response) {
            const errors = obsKeysToString(error.response.data);
            snackbar.showMessage(errors);
          } else {
            snackbar.showMessage(error.message);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      api.auth
        .register(displayName, email, password, phoneNumber)
        .then(res => {
          dispatch(setRegisterDialog(false));
          resetForm(initialValues);
          snackbar.showMessage(
            `Sign up successful! An email have been sent to ${email}.`
          );
        })
        .catch(error => {
          if (error.response) {
            const errors = obsKeysToString(error.response.data);
            snackbar.showMessage(errors);
          } else {
            snackbar.showMessage(error.message);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  const handleGoogleLogin = () => {
    dispatch(setIsAuthenticating(true));
    api.auth
      .loginWithGoogle()
      .then(result => {
        dispatch(setCurrentUser(result.data));
        dispatch(setRegisterDialog(false));
        snackbar.showMessage('Sign up successful!');
      })
      .catch(error => {
        snackbar.showMessage(error.message);
      })
      .finally(() => {
        dispatch(setIsAuthenticating(false));
      });
  }

  return (
    <Container className={classes.card} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
      <Button
          variant="contained"
          color="secondary"
          className={classes.googleButton}
          fullWidth
          onClick={() => handleGoogleLogin()}
          startIcon={
            <React.Fragment>
              <img className={classes.googleIcon} src={GoogleButton}></img>
            </React.Fragment>
          }
        >
          Sign up with Google
        </Button>

        <Typography className={classes.or} variant="h6" align="center">OR</Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSignupSubmission}
          validationSchema={validationSchema}
        >
          {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                component={TextField}
                type="text"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name"
                name="displayName"
                autoFocus
                onChange={event =>
                  setFieldValue('displayName', event.target.value)
                }
              />

              <Field
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={event => setFieldValue('email', event.target.value)}
                component={TextField}
              />

              <Field
                type="text"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Contact Number"
                name="phoneNumber"
                autoComplete="tel"
                onChange={event =>
                  setFieldValue('phoneNumber', event.target.value)
                }
                component={TextField}
              />

              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={event =>
                  setFieldValue('password', event.target.value)
                }
                component={TextField}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                className={classes.submit}
                disabled={isSubmitting}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>

        <Link className={classes.link} onClick={openLoginDialog}>Have an account? Log in now</Link>
      </div>
    </Container>
  );
};
export default SignUp;
