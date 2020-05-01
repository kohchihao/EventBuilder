import React from 'react';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  CustomInput
} from 'reactstrap';

import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ServiceTypeModal = ({
  isOpen,
  toggleModal,
  modalType,
  handleSubmission,
  serivceType
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {modalType === 'CREATE' ? (
          <>Create new service type</>
        ) : (
          <>Edit service type</>
        )}
      </ModalHeader>
      <Formik
        initialValues={serivceType}
        onSubmit={handleSubmission}
        // validationSchema={validationSchema}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <ModalBody>
              <FormGroup>
                <Label for="service_type">Service Type Name</Label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="btnn">
                  Allow user to select multiple services of this category?
                </Label>
                <CustomInput
                  type="switch"
                  id="exampleCustomRadio"
                  name="customRadio"
                  checked={'allow_multiple_selection'}
                  onChange={event =>
                    setFieldValue(
                      'allow_multiple_selection',
                      event.target.checked
                    )
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label for="btnn1">Active or Not Active?</Label>
                <CustomInput
                  type="switch"
                  id="exampleCustomRadi1o"
                  name="customRadio"
                  checked={'is_active'}
                  onChange={event =>
                    setFieldValue('is_active', event.target.checked)
                  }
                />
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

export default ServiceTypeModal;
