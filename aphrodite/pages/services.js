import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import axios from '../helpers/axios';
import withAuth from '../helpers/withAuth';
import { withRedux } from '../helpers/redux';
import { useSelector } from 'react-redux';

import { Container, Row, Col, Table, Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
library.add(fas);

import ServiceModal from '../components/services/ServiceModal';
import { compare } from '../helpers/utils';

const initialStateService = {
  name: '',
  description: '',
  unit: '',
  markup: 0,
  tax: 0,
  country: {
    code: ''
  },
  type: {
    id: 0
  },
  provider: {
    id: 0
  },
  cost: 0,
  min_quantity: '',
  max_quantity: null,
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
};

const Services = props => {
  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [providers, setProviders] = useState([]);
  const token = useSelector(state => state.token);

  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [editServiceId, setEditServiceId] = useState(0);
  const [editIndex, setEditIndex] = useState(0);

  const [newServiceObject, setNewServiceObject] = useState(initialStateService);

  const formikRef = useRef(null);

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

  const fetchAllProviders = () => {
    axios
      .get('/providers/', {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        let data = result.data;
        data.sort(compare);
        setProviders(data);
      })
      .catch(err => {
        alert(err);
      });
  };

  const createNewService = values => {
    axios
      .post(
        '/services/',
        {
          type: values.type.id,
          country_code: values.country.code,
          name: values.name,
          description: values.description,
          unit: values.unit,
          markup: values.markup,
          tax: values.tax,
          provider: values.provider.id,
          images: values.images,
          cost: values.cost,
          min_quantity: values.min_quantity,
          max_quantity: values.max_quantity
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let data = result.data;
        let servicesClone = [...services];
        servicesClone.push(data);
        setServices(servicesClone);
        toggleCreateModal();
        alert('Service have been created.');
      })
      .catch(err => {
        alert(err);
      });
  };

  const editService = (values, serviceId) => {
    axios
      .put(
        `/services/${serviceId}/`,
        {
          type: values.type.id,
          country_code: values.country.code,
          name: values.name,
          description: values.description,
          unit: values.unit,
          markup: values.markup,
          tax: values.tax,
          provider: values.provider.id,
          images: values.images,
          cost: values.cost,
          min_quantity: values.min_quantity,
          max_quantity: values.max_quantity
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let data = result.data;
        let servicesClone = [...services];
        servicesClone[editIndex] = data;
        setServices(servicesClone);
        toggleEditModal();
        alert('Service have been updated.');
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

  const toggleCreateModal = () => {
    if (createIsOpen) {
      setNewServiceObject(initialStateService);
    }
    setCreateIsOpen(!createIsOpen);
  };

  const toggleEditModal = () => {
    if (editIsOpen) {
      setNewServiceObject(initialStateService);
    }
    setEditIsOpen(!editIsOpen);
  };

  const onEditClick = (index, serviceId) => {
    //set all the variables in.
    let data = services[index];
    setNewServiceObject(data);
    setEditServiceId(serviceId);
    setEditIndex(index);
    toggleEditModal();
  };

  const handleSubmissionService = (values, actions) => {
    console.log('handle submission');
    createNewService(values);
  };

  const handleSubmissionEditService = (values, actions) => {
    editService(values, editServiceId);
  };

  useEffect(() => {
    if (token) {
      fetchAllServices();
      fetchAllServiceTypes();
      fetchAllCountries();
      fetchAllProviders();
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
              Add new service
            </Button>
          </Col>
        </Row>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Type</th>
              <th>Country</th>
              <th>Provider</th>
              <th>Name</th>
              <th>Description</th>
              <th>Cost</th>
              <th>Unit</th>
              <th>Min quantity</th>
              <th>Max quantity</th>
              <th>Markup</th>
              <th>Tax</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service, index) => (
              <React.Fragment key={service.id}>
                <tr>
                  <th scope="row">{service.id}</th>
                  <td>{service.type.name}</td>
                  <td>{service.country.name}</td>
                  <td>{service.provider.name}</td>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>{service.cost}</td>
                  <td>{service.unit}</td>
                  <td>{service.min_quantity}</td>
                  <td>{service.max_quantity}</td>
                  <td>{service.markup}</td>
                  <td>{service.tax}</td>

                  <td>
                    <div className="d-flex flex-row">
                      <Button
                        color="secondary"
                        className="ml-1 mr-1"
                        onClick={() => onEditClick(index, service.id)}
                      >
                        <FontAwesomeIcon icon={['fas', 'edit']} />
                      </Button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>

        <ServiceModal
          isOpen={createIsOpen}
          toggleModal={toggleCreateModal}
          handleSubmission={handleSubmissionService}
          serviceObject={newServiceObject}
          countries={countries}
          serviceTypes={serviceTypes}
          modelType={'CREATE'}
          formikRef={formikRef}
          providers={providers}
          uploadImage={uploadImage}
        />

        <ServiceModal
          isOpen={editIsOpen}
          toggleModal={toggleEditModal}
          handleSubmission={handleSubmissionEditService}
          serviceObject={newServiceObject}
          countries={countries}
          serviceTypes={serviceTypes}
          modelType={'EDIT'}
          formikRef={formikRef}
          providers={providers}
          uploadImage={uploadImage}
        />
      </Container>
    </div>
  );
};

export default withRedux(withAuth(Services));
