import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label
} from 'reactstrap';

import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EventTypeModal = ({
  isOpen,
  toggleModal,
  handleSubmission,
  modalType,
  countries,
  serviceTypes,
  newEventType,
  formikRef,
  uploadImage
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {modalType === 'CREATE' ? (
          <>Add new event type</>
        ) : (
          <>Edit event type</>
        )}
      </ModalHeader>

      <Formik
        initialValues={newEventType}
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
                  className="form-control"
                  component="select"
                  name="countries"
                  id="select"
                  multiple={true}
                  onChange={evt =>
                    setFieldValue(
                      'countries',
                      [].slice
                        .call(evt.target.selectedOptions)
                        .map(option => option.value)
                    )
                  }
                >
                  {countries.map((country, index) => (
                    <option value={country.code}>{country.name}</option>
                  ))}
                </Field>
              </FormGroup>

              <FormGroup>
                <Label for="select">Select Service Type</Label>
                <Field
                  className="form-control"
                  component="select"
                  name="service_types"
                  id="select"
                  multiple={true}
                  onChange={evt =>
                    setFieldValue(
                      'service_types',
                      [].slice
                        .call(evt.target.selectedOptions)
                        .map(option => option.value)
                    )
                  }
                >
                  {serviceTypes.map((serviceType, index) => (
                    <option value={serviceType.id}>{serviceType.name}</option>
                  ))}
                </Field>
              </FormGroup>

              <FormGroup>
                <Label for="select">Choose a single cover photo</Label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={event => {
                    uploadImage(event.currentTarget.files, setFieldValue);
                  }}
                  className="form-control"
                />
              </FormGroup>

              <img
                src={values.image_url}
                className="img-thumbnail mt-2"
                height={200}
                width={200}
              />
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


export default EventTypeModal;
