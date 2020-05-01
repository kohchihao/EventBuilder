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

const ProviderModal = ({
  isOpen,
  toggleModal,
  handleSubmission,
  modalType,
  providers,
  formikRef
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
          initialValues={providers}
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
                    placeHolder="John Doe Pte Ltd"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="email">Email</Label>
                  <Field
                    className="form-control"
                    type="email"
                    name="email"
                    id="email"
                    placeHolder="john@doe.com"
                    required
                    >
                  </Field>
                </FormGroup>

                
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

export default ProviderModal;
