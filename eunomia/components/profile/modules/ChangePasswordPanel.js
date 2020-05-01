import React, { useState, useEffect } from 'react';
import useSnackbar from '../../snackbar/useSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { firebaseAuth } from '../../../src/firebase';

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

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3, 2),
    minWidth: 600,
    marginLeft: 10
  }
}));

const initialState = {
  password: ''
};
const ChangePasswordPanel = () => {
  const snackbar = useSnackbar();
  const classes = useStyles();
  const [password, setPassword] = useState(initialState);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required')
      .min(8, 'Password is too short - should be 8 characters minimum.')
  });

  const handlePasswordSubmission = (values, { setSubmitting, resetForm }) => {
    let user = firebaseAuth.currentUser;
    user
      .updatePassword(values.password)
      .then(() => {
        snackbar.showMessage('Password have been updated.');
      })
      .catch(error => {
        snackbar.showMessage(error.message);
      })
      .finally(() => {
        setSubmitting(false);
        resetForm();
      });
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h4">Change password</Typography>
      <Formik
        initialValues={password}
        validationSchema={validationSchema}
        onSubmit={handlePasswordSubmission}
      >
        {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="New Password"
              name="password"
              component={TextField}
            />

            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Button variant="contained" color="primary" type="submit">
                Save Changes
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ChangePasswordPanel;
