import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter, withRouter } from 'next/router';
import Navbar from '../components/Navbar';
import axios from '../helpers/axios';
import withAuth from '../helpers/withAuth';
import { withRedux } from '../helpers/redux';
import { useSelector } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  FormGroup,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
library.add(fas);
import { compare } from '../helpers/utils';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';

const CreatePastEvents = props => {
  const token = useSelector(state => state.token);
  const router = useRouter();
  const { curated_agreements, pax, duration, price, type } = router.query;

  const [eventTypes, setEventTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);
  const [pastEvent, setPastEvents] = useState({
    name: '',
    visibility: false,
    type: type,
    country: '',
    pax: pax,
    price: price,
    duration: duration,
    description: '',
    curated_agreements: JSON.parse(curated_agreements),
    images: [
      {
        url: ''
      },
      {
        url: ''
      },
      {
        url: ''
      },
      {
        url: ''
      }
    ]
  });

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

  const fetchAllCountries = () => {
    axios
      .get('/countries/')
      .then(result => {
        let data = result.data;
        setCountries(data);
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

  const handleSubmission = (values, actions) => {
    createPastEvents(values);
  };

  const createPastEvents = values => {
    axios
      .post(
        `/curated_events/`,
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
          is_past_event: true
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        alert('New past events have been created!');
      })
      .catch(err => {
        alert(err);
      });
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
      fetchEventTypes();
      fetchAllCountries();
      fetchAllServices();
    }
  }, [token]);

  return (
    <div>
      <Navbar />
      <Container className="pt-4 pb-4">
        <Row className="justify-content-center">
          <h2>Create a past event</h2>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <Formik
              initialValues={pastEvent}
              onSubmit={handleSubmission}
            >
              {({ values, isSubmitting, setFieldValue }) => (
                <Form>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="form-control"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="select">Select Country</Label>
                    <Field
                      component="select"
                      name="country"
                      id="select"
                      className="form-control"
                    >
                      <option defaultValue>Choose here</option>
                      {countries.map((country, index) => (
                        <option value={country.code}>{country.name}</option>
                      ))}
                    </Field>
                  </FormGroup>

                  <FormGroup>
                    <Label for="select">Select Event Type</Label>
                    <Field
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
                      type="switch"
                      id="exampleCustomRadio"
                      name="visibility"
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
                                      component="select"
                                      className="form-control"
                                      name={`curated_agreements[${index}].service`}
                                      id="select"
                                    >
                                      <option defaultValue>Choose here</option>
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
                    <Button
                      color="primary"
                      type="submit"
                      className="form-control"
                    >
                      Save
                    </Button>
                  </FormGroup>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRedux(withRouter(withAuth(CreatePastEvents)));
