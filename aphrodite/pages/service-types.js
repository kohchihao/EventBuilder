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
  Button
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
library.add(fas);
import { compare } from '../helpers/utils';

import ServiceTypeModal from '../components/service-types/ServiceTypeModal';

const initialState = {
  name: '',
  allow_multiple_selection: false,
  is_active: false
};

const ServiceTypes = props => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [createIsOpen, setCreateIsOpen] = useState(false);

  const [editIsOpen, setEditIsOpen] = useState(false);
 
  const [editServiceTypeId, setEditServiceTypeId] = useState(0);
  const [editIndex, setEditIndex] = useState(0);
  const [serviceType, setServiceType] = useState(initialState);

  const token = useSelector(state => state.token);

  const fetchAllServiceTypes = () => {
    axios
      .get('/service_types/', {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        let data = result.data;
        data.sort(compare);
        setServiceTypes(data);
      })
      .catch(err => {
        alert(err);
      });
  };

  const toggleActive = (serviceId, serviceIsActive, index) => {
    axios
      .patch(
        `/service_types/${serviceId}/`,
        {
          is_active: !serviceIsActive
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let cloneArray = [...serviceTypes];
        let updatedObject = cloneArray[serviceId - 1];
        updatedObject.is_active = !updatedObject.is_active;
        setServiceTypes(cloneArray);
      })
      .catch(err => {
        alert(err);
      });
  };

  const createNewServiceType = values => {
    axios
      .post(
        '/service_types/',
        {
          name: values.name,
          allow_multiple_selection: values.allow_multiple_selection,
          is_active: values.is_active
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let data = result.data;
        let serviceTypeClone = [...serviceTypes];
        serviceTypeClone.push(data);
        setServiceTypes(serviceTypeClone);
        toggleCreateModal();
        alert(data.name + ' have been created.');
      })
      .catch(err => {
        alert(err);
      });
  };

  const editServiceType = values => {
    axios
      .patch(
        `/service_types/${editServiceTypeId}/`,
        {
          name: values.name,
          allow_multiple_selection: values.allow_multiple_selection,
          is_active: values.is_active
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let data = result.data;
        let cloneArray = [...serviceTypes];
        cloneArray[editIndex] = data;
        setServiceTypes(cloneArray);
        toggleEditModal();
        alert(data.name + ' have been updated.');
      })
      .catch(err => {
        alert(err);
      });
  };

  const toggleCreateModal = () => {
    if (createIsOpen) {
      setServiceType(initialState);
    }
    setCreateIsOpen(!createIsOpen);
  };

  const toggleEditModal = () => {
    if (editIsOpen) {
      setServiceType(initialState);
    }
    setEditIsOpen(!editIsOpen);
  };

  const onEditClick = (serviceId, index) => {
    setEditServiceTypeId(serviceId);
    let data = serviceTypes[index];
    setServiceType(data);
    setEditIndex(index);
    toggleEditModal();
  };

  const handleNewServiceType = (values, actions) => {
    createNewServiceType(values);
  };

  const handleEditServiceType = (values, actions) => {
    editServiceType(values);
  };

  useEffect(() => {
    if (token) {
      fetchAllServiceTypes();
    }
  }, [token]); //this will get fired off when either token get changed.

  return (
    <div>
      <Navbar />
      <Container className="mt-5">
        <Row className="p-4">
          <Col>
            <Button
              color="primary"
              className="float-right"
              onClick={toggleCreateModal}
            >
              Add new type
            </Button>
          </Col>
        </Row>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name of Service Type</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceTypes.map((service, index) => (
              <React.Fragment key={service.id}>
                <tr>
                  <th scope="row">{service.id}</th>
                  <td>{service.name}</td>
                  <td>
                    <div>
                      {service.is_active ? <span>YES</span> : <span>NO</span>}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-row">
                      <Button
                        color="secondary"
                        className="ml-1 mr-1"
                        onClick={() => onEditClick(service.id, index)}
                      >
                        <FontAwesomeIcon icon={['fas', 'edit']} />
                      </Button>

                      <Button
                        color="secondary"
                        className="ml-1"
                        onClick={() =>
                          toggleActive(service.id, service.is_active, index)
                        }
                      >
                        {service.is_active ? (
                          <FontAwesomeIcon icon={['fas', 'eye-slash']} />
                        ) : (
                          <FontAwesomeIcon icon={['fas', 'eye']} />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>

        <ServiceTypeModal
          isOpen={createIsOpen}
          toggleModal={toggleCreateModal}
          modalType={'CREATE'}
          handleSubmission={handleNewServiceType}
          serivceType={serviceType}
        />

        <ServiceTypeModal
          isOpen={editIsOpen}
          toggleModal={toggleEditModal}
          modalType={'EDIT'}
          handleSubmission={handleEditServiceType}
          serivceType={serviceType}
        />
      </Container>
    </div>
  );
};

export default withRedux(withAuth(ServiceTypes));
