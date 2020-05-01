import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter, withRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import axios from '../../helpers/axios';
import withAuth from '../../helpers/withAuth';
import { withRedux } from '../../helpers/redux';
import { useSelector } from 'react-redux';

import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Label,
  Breadcrumb,
  BreadcrumbItem,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
library.add(fas);

import { compare } from '../../helpers/utils';

import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';

const Package = props => {
  const router = useRouter();
  const { pid } = router.query;

  const [packageObject, setPackageObject] = useState({});

  const [eventTypes, setEventTypes] = useState([]);
  const [services, setServices] = useState([]);

  const token = useSelector(state => state.token);

  const [disabled, setDisabled] = useState(true);
  const [mode, setMode] = useState('READING');

  const [loaded, setLoaded] = useState(false);
  const formikRef = useRef(null);

  const fetchPackage = () => {
    axios
      .get(`/curated_events/${pid}/`, {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        let data = result.data;
        data.type = data.type.id;
        data.country = data.country.code;
        let curated_agreements = [];
        //pre process curated-agreements
        data.curated_agreements.forEach(agreement => {
          let newAgreement = {
            service: agreement.service.id,
            quantity: agreement.quantity
          };
          curated_agreements.push(newAgreement);
        });
        data.curated_agreements = curated_agreements;
        data.duration = data.duration.split(':')[0];
        setPackageObject(data);
        setLoaded(true);
      })
      .catch(err => {
        alert(err);
      });
  };

  const fetchEventTypes = () => {
    axios
      .get('/event_types/', {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        let data = result.data;
        data.sort(compare);
        setEventTypes(data);
      })
      .catch(err => {
        alert(err);
      });
  };

  const fetchAllServices = () => {
    axios
      .get('/services/', {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        let data = result.data;
        data.sort(compare);
        setServices(data);
      })
      .catch(err => {
        alert(err);
      });
  };

  const editCuratedEvent = values => {
    axios
      .put(
        `/curated_events/${pid}/`,
        {
          name: values.name,
          visibility: values.visibility,
          type: values.type,
          country: values.country,
          curated_agreements: values.curated_agreements,
          images: values.images,
          pax: values.pax,
          duration: values.duration + ':00:00',
          price: values.price,
          description: values.description,
          is_past_events: packageObject.is_past_events
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        alert('Curated event have been updated.');
        setDisabled(true);
        //router.replace(`/packages/${pid}`);
      })
      .catch(err => {
        alert(err);
      });
  };

  const toggleEditMode = () => {
    if (disabled) {
      setMode('EDITING');
    } else {
      setMode('READING');
      formikRef.current.resetForm();
    }
    setDisabled(!disabled);
  };

  const handleSubmission = (values, actions) => {
    editCuratedEvent(values);
  };

  const uploadImage = (files, setFieldValue, index) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      const filename = file.name;

      reader.onload = () => {
        const data = new FormData();
        data.append('file', file);
        axios
          .post('/upload/', data, {
            headers: {
              'content-type': 'multipart/form-data',
              Authorization: 'Token ' + token
            }
          })
          .then(res => {
            console.log(res);
            setFieldValue(`images[${index}].url`, res.data.url);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPackage();
      fetchEventTypes();
      fetchAllServices();
    }
  }, [token]); //this will get fired off when either token get changed.

  return (
    <div>
      <Navbar />
      <Breadcrumb tag="nav" listTag="div">
        <BreadcrumbItem tag="a" href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem tag="a" href="/packages">
          Packages
        </BreadcrumbItem>
        <BreadcrumbItem active tag="a">
          Data
        </BreadcrumbItem>
      </Breadcrumb>

      <Container>
        <Row className="pt-4 pb-4">
          <Col>
            <span>Mode: {mode}</span>
          </Col>
          <Col>
            <Button
              color="secondary"
              className="float-right"
              onClick={toggleEditMode}
            >
              Edit
            </Button>
          </Col>
        </Row>

        {loaded ? (
          <Row className="justify-content-center">
            <Col xs={12} md={8}>
              <Formik
                initialValues={packageObject}
                onSubmit={handleSubmission}
                ref={formikRef}
                // validationSchema={validationSchema}
              >
                {({ values, isSubmitting, setFieldValue }) => (
                  <Form disabled={disabled}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Field
                        disabled={disabled}
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                      />
                    </FormGroup>

                    <FormGroup disabled>
                      <Label for="country">Country</Label>
                      <Field
                        disabled
                        type="text"
                        name="country"
                        id="country"
                        className="form-control"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="select">Select Event Type</Label>
                      <Field
                        disabled={disabled}
                        component="select"
                        name="type"
                        id="select"
                        className="form-control"
                      >
                        <option defaultValue>Choose here</option>
                        {eventTypes.map((eventType, index) => (
                          <option value={eventType.id}>{eventType.name}</option>
                        ))}
                      </Field>
                    </FormGroup>

                    <FormGroup>
                      <Label for="pax">Total Pax</Label>
                      <Field
                        disabled={disabled}
                        type="number"
                        name="pax"
                        id="pax"
                        className="form-control"
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="name">Price of Package</Label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Field
                          disabled={disabled}
                          type="number"
                          name="price"
                          id="price"
                          className="form-control"
                          required
                        />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label for="duration">
                        Total Duration of Events (1-24hrs)
                      </Label>
                      <InputGroup>
                        <Field
                          disabled={disabled}
                          type="number"
                          name="duration"
                          id="duration"
                          className="form-control"
                          required
                          min="1"
                          max="24"
                        />

                        <InputGroupAddon addonType="append">
                          <InputGroupText>hr</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label for="description">
                        Short description of the event
                      </Label>
                      <Field
                        disabled={disabled}
                        component="textarea"
                        name="description"
                        id="description"
                        className="form-control"
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="switch">Visible to public?</Label>
                      <CustomInput
                        disabled={disabled}
                        type="switch"
                        id="exampleCustomRadio"
                        name="visibility"
                        checked={'visibility'}
                        onChange={event =>
                          setFieldValue('visibility', event.target.checked)
                        }
                      />
                    </FormGroup>

                    <FieldArray name="curated_agreements">
                      {({ push, remove }) => (
                        <React.Fragment>
                          {values.curated_agreements &&
                            values.curated_agreements.length > 0 &&
                            values.curated_agreements.map(
                              (curated_agreement, index) => (
                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <Label for="select">
                                        Select Service Type
                                      </Label>
                                      <Field
                                        disabled={disabled}
                                        component="select"
                                        className="form-control"
                                        name={`curated_agreements[${index}].service`}
                                        id="select"
                                      >
                                        <option defaultValue>
                                          Choose here
                                        </option>
                                        {services.map((service, index) => (
                                          <option value={service.id}>
                                            {service.name}
                                          </option>
                                        ))}
                                      </Field>
                                    </FormGroup>
                                  </Col>

                                  <Col>
                                    <FormGroup>
                                      <Label for="amount">Quantity</Label>
                                      <Field
                                        disabled={disabled}
                                        className="form-control"
                                        type="number"
                                        name={`curated_agreements[${index}].quantity`}
                                        id="amount"
                                        required
                                      />
                                    </FormGroup>
                                  </Col>

                                  <Col
                                    xs={2}
                                    className="mb-3 d-flex justify-content-center align-items-end"
                                  >
                                    <Button
                                      disabled={disabled}
                                      color="danger"
                                      className="ml-1 mr-1"
                                      onClick={() => remove(index)}
                                    >
                                      <FontAwesomeIcon
                                        icon={['fas', 'trash-alt']}
                                      />
                                    </Button>
                                  </Col>
                                </Row>
                              )
                            )}
                          <Button
                            disabled={disabled}
                            className="mb-4"
                            color="primary"
                            onClick={() => push({ service: 0, quantity: 0 })}
                          >
                            Add another service
                          </Button>
                        </React.Fragment>
                      )}
                    </FieldArray>

                    <FormGroup>
                      <Label for="select">Upload at least 1 photo</Label>
                      <input
                        disabled={disabled}
                        id="file"
                        name="file"
                        type="file"
                        accept="image/x-png,image/gif,image/jpeg"
                        onChange={event => {
                          uploadImage(
                            event.currentTarget.files,
                            setFieldValue,
                            0
                          );
                        }}
                        className="form-control"
                      />
                    </FormGroup>

                    <FormGroup>
                      <input
                        disabled={disabled}
                        id="file"
                        name="file"
                        type="file"
                        accept="image/x-png,image/gif,image/jpeg"
                        onChange={event => {
                          uploadImage(
                            event.currentTarget.files,
                            setFieldValue,
                            1
                          );
                        }}
                        className="form-control"
                      />
                    </FormGroup>

                    <FormGroup>
                      <input
                        disabled={disabled}
                        id="file"
                        name="file"
                        type="file"
                        accept="image/x-png,image/gif,image/jpeg"
                        onChange={event => {
                          uploadImage(
                            event.currentTarget.files,
                            setFieldValue,
                            2
                          );
                        }}
                        className="form-control"
                      />
                    </FormGroup>

                    <FormGroup>
                      <input
                        disabled={disabled}
                        id="file"
                        name="file"
                        type="file"
                        accept="image/x-png,image/gif,image/jpeg"
                        onChange={event => {
                          uploadImage(
                            event.currentTarget.files,
                            setFieldValue,
                            3
                          );
                        }}
                        className="form-control"
                      />
                    </FormGroup>

                    <Row>
                      <Col xs={6}>
                        <img
                          src={
                            values.images.length > 0 ? values.images[0].url : ''
                          }
                          className="img-thumbnail mt-2"
                          height={200}
                          width={200}
                        />
                      </Col>
                      <Col xs={6}>
                        <img
                          src={
                            values.images.length > 1 ? values.images[1].url : ''
                          }
                          className="img-thumbnail mt-2"
                          height={200}
                          width={200}
                        />
                      </Col>
                      <Col xs={6}>
                        <img
                          src={
                            values.images.length > 2 ? values.images[2].url : ''
                          }
                          className="img-thumbnail mt-2"
                          height={200}
                          width={200}
                        />
                      </Col>
                      <Col xs={6}>
                        <img
                          src={
                            values.images.length > 3 ? values.images[3].url : ''
                          }
                          className="img-thumbnail mt-2"
                          height={200}
                          width={200}
                        />
                      </Col>
                    </Row>

                    <FormGroup className="mt-2">
                      {disabled ? null : (
                        <Button
                          color="primary"
                          type="submit"
                          className="form-control"
                        >
                          Save
                        </Button>
                      )}
                    </FormGroup>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        ) : null}
      </Container>
    </div>
  );
};

export default withRedux(withAuth(Package));
