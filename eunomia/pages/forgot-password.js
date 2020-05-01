import React, { useState } from 'react';
import SnackbarProvider from '../components/snackbar/SnackbarProvider';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import useSnackbar from '../components/snackbar/useSnackbar';
import * as Yup from 'yup';
import { makeStyles, Grid, Typography, Paper, Button } from '@material-ui/core';

import logo from '../src/assets/images/build-events-logo.png';
import { firebaseAuth }  from '../src/firebase';

const initialValues = {
  email: ''
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    width: 400,
    marginTop: 50
  },
  mainLogo: {
    height: '40px',
    marginTop: '10px',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
}));

const ForgotPassword = () => {
  const snackbar = useSnackbar();
  const classes = useStyles();

  const handlePasswordReset = (values, { setSubmitting }) => {
    let auth = firebaseAuth;
    auth
      .sendPasswordResetEmail(values.email)
      .then(() => {
        snackbar.showMessage(`An email have been sent to ${values.email}`);
      })
      .catch(error => {
        snackbar.showMessage(error.message);
      }).finally(() => {
        setSubmitting(false);
      })
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Required')
  });

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <SnackbarProvider>
        <Paper className={classes.root}>
          <img className={classes.mainLogo} src={logo} />
          <Typography variant="h6">
            Please enter the email address of your account.
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handlePasswordReset}
          >
            {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  type="email"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  component={TextField}
                />

                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth={true}
                    type="submit"
                  >
                    Send me a password reset link
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </SnackbarProvider>
    </Grid>
  );
};

export default ForgotPassword;
