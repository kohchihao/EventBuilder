import React from 'react';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormFeedback,
  Label
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
library.add(fas);

import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  unit: Yup.string().required('Required'),
  markup: Yup.number().required('Required'),
  tax: Yup.number().required('Required'),
  country: Yup.object({ code: Yup.string().required('required') }),
  type: Yup.object({ id: Yup.number().required('Required') }),
  price_structures: Yup.array().of(
    Yup.object({
      price: Yup.number().required('Required'),
      amount: Yup.number().required('Required')
    })
  )
});

const ServiceModal = ({
  isOpen,
  toggleModal,
  handleSubmission,
  serviceObject,
  countries,
  serviceTypes,
  modelType,
  formikRef,
  providers,
  uploadImage
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {modelType === 'CREATE' ? <>Add new service</> : <>Edit service</>}
      </ModalHeader>
      <Formik
        initialValues={serviceObject}
        onSubmit={handleSubmission}
        ref={formikRef}
        validationSchema={validationSchema}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="selectType">Select Service Type</Label>
                <Field
                  name={'type.id'}
                  component="select"
                  className="form-control"
                  required
                >
                  <option defaultValue>Choose here</option>
                  {serviceTypes.map((serviceType, index) => (
                    <option value={serviceType.id}>{serviceType.name}</option>
                  ))}
                </Field>
              </FormGroup>

              <FormGroup>
                <Label for="selectCountry">Select Country</Label>
                <Field
                  name={'country.code'}
                  component="select"
                  className="form-control"
                  required
                >
                  <option defaultValue>Choose here</option>
                  {countries.map((country, index) => (
                    <option value={country.code}>{country.name}</option>
                  ))}
                </Field>
              </FormGroup>

              {modelType === 'CREATE' ? (
                <FormGroup>
                  <Label for="selectProvider">Select Provider</Label>
                  <Field
                    name={'provider.id'}
                    component="select"
                    className="form-control"
                    required
                  >
                    <option defaultValue>Choose here</option>
                    {providers.map((provider, index) => (
                      <option value={provider.id}>{provider.name}</option>
                    ))}
                  </Field>
                </FormGroup>
              ) : null}

              <FormGroup>
                <Label for="name">Name</Label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="description">Description</Label>
                <Field
                  component="textarea"
                  name="description"
                  id="description"
                  className="form-control"
                  placeholder="Description"
                  required
                />
              </FormGroup>

              <Row>
                <Col>
                  <FormGroup>
                    <Label for="unit">Cost</Label>
                    <Field
                      className="form-control"
                      type="number"
                      name="cost"
                      id="unit"
                      placeholder="Cost of service"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Label for="unit">Unit</Label>
                    <Field
                      className="form-control"
                      type="text"
                      name="unit"
                      id="unit"
                      placeholder="per hour, per minute, per day"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label for="markup">Min Quantity (Required)</Label>
                    <Field
                      className="form-control"
                      type="text"
                      name="min_quantity"
                      id="markup"
                      placeholder="Minimum quantity"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Label for="markup">Max Quantity (Optional)</Label>
                    <Field
                      className="form-control"
                      type="text"
                      name="max_quantity"
                      id="markup"
                      placeholder="Maximum quantity"
                      
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label for="markup">Markup</Label>
                    <Field
                      className="form-control"
                      type="number"
                      name="markup"
                      id="markup"
                      placeholder="Markup percentage"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Label for="tax">Tax</Label>
                    <Field
                      className="form-control"
                      type="number"
                      name="tax"
                      id="tax"
                      placeholder="tax percentage"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

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

export default ServiceModal;
