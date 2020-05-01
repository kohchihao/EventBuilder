import React from 'react';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import useSnackbar from '../../snackbar/useSnackbar';
import * as Yup from 'yup';
import {
  makeStyles,
  Grid,
  Typography,
  Paper,
  Avatar,
  Button
} from '@material-ui/core';
import api from '../../../src/api';
import {useDispatch} from "react-redux";
import {updateCurrentUser} from "../../session/actions";
import {obsKeysToString} from "../../lib/utils";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3, 2),
    minWidth: 600,
    marginLeft: 10
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: theme.palette.primary.main
  },
  headerText: {
    paddingBottom: 10
  }
}));

const EditProfilePanel = props => {
  const snackbar = useSnackbar();
  const classes = useStyles();
  let userDetails = props.userDetails;
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required'),
    email: Yup.string()
      .email()
      .required('Required'),
    phone_number: Yup.string()
      .required('Required.')
      .matches(/^\+[1-9]\d{1,14}$/, 'Phone number is not valid')
  });

  const handleEditSubmission = (values, { setSubmitting }) => {
    api.user.update_profile(userDetails.id, values.name,
      userDetails.email === values.email ? null : values.email,
      userDetails.phone_number === values.phone_number ? null : values.phone_number)
      .then((res) => {
        snackbar.showMessage('Profile has been updated.');
        dispatch(updateCurrentUser(res.data));
      })
      .catch(error => {
        if (error.response) {
          const errors = obsKeysToString(error.response.data);
          snackbar.showMessage(errors);
        } else {
          snackbar.showMessage(error.message);
        }
      }).finally(() => {
        setSubmitting(false);
    });
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h4" className={classes.headerText}>Edit Profile</Typography>
      <Grid container justify="flex-start" alignItems="center">
        <Avatar className={classes.purpleAvatar}>{userDetails.name[0]}</Avatar>
      </Grid>

      <Formik
        enableReinitialize
        initialValues={userDetails}
        validationSchema={validationSchema}
        onSubmit={handleEditSubmission}
      >
        {({ values, isSubmitting, setFieldValue, handleSubmit, dirty }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              type="text"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              component={TextField}
            />

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

            <Field
              type="text"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Contact Number"
              name="phone_number"
              autoComplete="tel"
              component={TextField}
            />

            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || !dirty}>
                Save Changes
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default EditProfilePanel;
