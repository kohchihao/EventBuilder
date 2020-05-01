import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  CssBaseline,
  Button,
  Avatar,
  Container,
  Link,
  Icon
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, Form, Field } from 'formik';
import { setCurrentUser, setIsAuthenticating } from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../src/api';
import useSnackbar from '../../snackbar/useSnackbar';
import { setRegisterDialog, setLoginDialog } from '../../nav/action';
import { useRouter, withRouter } from 'next/router';
import * as Yup from 'yup';
import { TextField } from 'formik-material-ui';
import { isLoggedIn, isAuthenticating } from '../selectors';
import GoogleButton from '../../../src/assets/images/google.svg';
import {getBookOnSignIn} from "../../build/selectors";
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
    cursor: 'pointer'
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

const Login = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const router = useRouter();
  const isAuthenticated = useSelector(isLoggedIn);
  const isLoggingIn = useSelector(isAuthenticating);
  const bookOnSignIn = useSelector(getBookOnSignIn);

  useEffect(() => {
    if (props.router.asPath === '/#login' && !isAuthenticated && !isLoggingIn) {
      dispatch(setLoginDialog(true));
    }
  }, [isLoggingIn]);

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Required'),
    password: Yup.string().required('Required')
  });

  const openRegister = () => {
    let toBookOnSignIn = false;
    if (bookOnSignIn) {
      toBookOnSignIn = true;
    }
    dispatch(setRegisterDialog(true));
    dispatch(setLoginDialog(false));
    if (toBookOnSignIn) {
      dispatch(setBookOnSignIn(true));
    }
  };

  const handleLoginSubmission = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    dispatch(setIsAuthenticating(true));
    api.auth
      .loginWithEmailPassword(values.email, values.password)
      .then(result => {
        dispatch(setCurrentUser(result.data));
        dispatch(setLoginDialog(false));
        resetForm(initialValues);
        snackbar.showMessage('Logged in successful.');
        if (result.data.event) {
          snackbar.showMessage('Your event has been booked!');
          router.push(`/build/${result.data.event}`);
        }
      })
      .catch(error => {
        snackbar.showMessage(error.message);
      })
      .finally(() => {
        setSubmitting(false);
        dispatch(setIsAuthenticating(false));
      });
  };

  const handleGoogleLogin = () => {
    dispatch(setIsAuthenticating(true));
    api.auth
      .loginWithGoogle()
      .then(result => {
        dispatch(setCurrentUser(result.data));
        dispatch(setLoginDialog(false));
        snackbar.showMessage('Logged in successful.');
        if (result.data.event) {
          snackbar.showMessage('Your event has been booked!');
          router.push(`/build/${result.data.event}`);
        }
      })
      .catch(error => {
        snackbar.showMessage(error.message);
      })
      .finally(() => {
        dispatch(setIsAuthenticating(false));
      });
  }

  const handleForgetPassword = () => {
    router.push('/forgot-password');
  };

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
          Login with Google
        </Button>

        <Typography className={classes.or} variant="h6" align="center">OR</Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLoginSubmission}
        >
          {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                component={TextField}
                onChange={event => setFieldValue('email', event.target.value)}
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
                component={TextField}
                onChange={event =>
                  setFieldValue('password', event.target.value)
                }
              />
              <Link className={classes.link} onClick={handleForgetPassword}>
                Forget password?
              </Link>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                className={classes.submit}
                disabled={isSubmitting}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
        <Link className={classes.link} onClick={openRegister}>
          Don't have an account? Sign up
        </Link>
      </div>
    </Container>
  );
};

export default withRouter(Login);
