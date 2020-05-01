import React, { useState } from 'react';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
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

import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../../helpers/axios';
import { compare } from '../../../helpers/utils';
import { useSelector } from 'react-redux';

const PackageModal = ({
  isOpen,
  toggleModal,
  handleSubmission,
  curatedEvent,
  countries,
  eventTypes,
  formikRef,
  uploadImage
}) => {
  const token = useSelector(state => state.token);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [services, setServices] = useState({});

  const getServiceTypesFromEventType = eventTypeId => {
    axios
      .get(`/event_types/${eventTypeId}/service_types/`, {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        setServiceTypes([]);
        setServices({});
        let data = result.data;
        data.sort(compare);
        setServiceTypes(data);
        let all = [];
        for (let i = 0; i < data.length; i++) {
          all.push(getAllServicesFromServiceType(data[i].id));
        }
        Promise.all(all).then(values => {
          processData(values, data);
        });
      })
      .catch(err => {
        alert(err);
      });
  };

  const getAllServicesFromServiceType = serviceId => {
    return axios.get(`/service_types/${serviceId}/services/`, {
      headers: {
        Authorization: 'Token ' + token
      }
    });
  };

  const processData = (values, data) => {
    let obj = {};
    data.forEach((serviceTypeObj, index) => {
      obj[serviceTypeObj.name.toLowerCase()] = values[index].data;
      curatedEvent.curated_agreements[serviceTypeObj.name.toLowerCase()] = [
        {
          service: 0,
          quantity: 0
        }
      ];
    });
    setServices(obj);
  };
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Add New Package</ModalHeader>
      <Formik
        enableReinitialize={true}
        initialValues={curatedEvent}
        onSubmit={handleSubmission}
        ref={formikRef}
        // validationSchema={validationSchema}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="name">Name</Label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  required
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
                  onChange={event => {
                    setFieldValue('type', event.target.value);
                    getServiceTypesFromEventType(
                      event.target.value,
                      event.target.name
                    );
                  }}
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
                <Label for="duration">Total Duration of Events (1-24hrs)</Label>
                <InputGroup>
                  <Field
                    type="number"
                    name="duration"
                    id="duration"
                    className="form-control"
                    min="1"
                    max="24"
                    required
                  />

                  <InputGroupAddon addonType="append">
                    <InputGroupText>hr</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label for="description">Short description of the event</Label>
                <Field
                  component="textarea"
                  name="description"
                  id="description"
                  className="form-control"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="btnn">Visible to public?</Label>
                <CustomInput
                  type="switch"
                  id="exampleCustomRadio"
                  name="customRadio"
                  onChange={event =>
                    setFieldValue('visibility', event.target.checked)
                  }
                />
              </FormGroup>

              {Object.keys(services).length !== 0
                ? serviceTypes.map((serviceTypeObj, i) => (
                    <React.Fragment>
                      <h5>{serviceTypeObj.name}</h5>

                      <FieldArray
                        name={`curated_agreements.${serviceTypeObj.name.toLowerCase()}`}
                      >
                        {({ push, remove }) => (
                          <React.Fragment>
                            {values.curated_agreements &&
                              values.curated_agreements[
                                serviceTypeObj.name.toLowerCase()
                              ].map((curated_agreement, index) => (
                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <Label for="select">
                                        Select Service Type
                                      </Label>
                                      <Field
                                        component="select"
                                        className="form-control"
                                        name={`curated_agreements.${serviceTypeObj.name.toLowerCase()}[${index}].service`}
                                        id="select"
                                      >
                                        <option defaultValue>
                                          Choose here
                                        </option>

                                        {services
                                          ? services[
                                              serviceTypeObj.name.toLowerCase()
                                            ].map((service, index) => (
                                              <option value={service.id}>
                                                {service.name}
                                              </option>
                                            ))
                                          : null}
                                      </Field>
                                    </FormGroup>
                                  </Col>

                                  <Col>
                                    <FormGroup>
                                      <Label for="amount">Quantity</Label>
                                      <Field
                                        className="form-control"
                                        type="number"
                                        name={`curated_agreements.${serviceTypeObj.name.toLowerCase()}[${index}].quantity`}
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
                              ))}
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
                    </React.Fragment>
                  ))
                : null}
              {/* <FieldArray name="curated_agreements">
                {({ push, remove }) => (
                  <React.Fragment>
                    {values.curated_agreements &&
                      values.curated_agreements.length > 0 &&
                      values.curated_agreements.map(
                        (curated_agreement, index) => (
                          <Row>
                            <Col>
                              <FormGroup>
                                <Label for="select">Select Service Type</Label>
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
                                <FontAwesomeIcon icon={['fas', 'trash-alt']} />
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
              </FieldArray> */}

              <FormGroup>
                <Label for="select">Upload at least 1 photo</Label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={event => {
                    uploadImage(event.currentTarget.files, setFieldValue, 0);
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
                    uploadImage(event.currentTarget.files, setFieldValue, 1);
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
                    uploadImage(event.currentTarget.files, setFieldValue, 2);
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
                    uploadImage(event.currentTarget.files, setFieldValue, 3);
                  }}
                  className="form-control"
                />
              </FormGroup>

              <Row>
                <Col xs={6}>
                  <img
                    src={values.images.length > 0 ? values.images[0].url : ''}
                    className="img-thumbnail mt-2"
                    height={200}
                    width={200}
                  />
                </Col>
                <Col xs={6}>
                  <img
                    src={values.images.length > 1 ? values.images[1].url : ''}
                    className="img-thumbnail mt-2"
                    height={200}
                    width={200}
                  />
                </Col>
                <Col xs={6}>
                  <img
                    src={values.images.length > 2 ? values.images[2].url : ''}
                    className="img-thumbnail mt-2"
                    height={200}
                    width={200}
                  />
                </Col>
                <Col xs={6}>
                  <img
                    src={values.images.length > 3 ? values.images[3].url : ''}
                    className="img-thumbnail mt-2"
                    height={200}
                    width={200}
                  />
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Save
              </Button>
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default PackageModal;
