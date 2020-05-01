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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Card,
  CardTitle,
  CardText,
  CardFooter,
  CardBody,
  CardHeader
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
library.add(fas);
import { compare } from '../helpers/utils';
import ProviderModal from '../components/provider/ProviderModal';

const initialState = {
  name: '',
  email: ''
};

const Providers = props => {
  const token = useSelector(state => state.token);
  const [providers, setProviders] = useState([]);

  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [editProviderId, setEditProviderId] = useState(0);

  const [newProvider, setNewProvider] = useState(initialState);

  const fetchProviders = () => {
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

  const createNewProvider = values => {
    axios
      .post(
        '/providers/',
        {
          name: values.name,
          email: values.email
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let data = result.data;
        let providerClone = [...providers];
        providerClone.push(data);
        setProviders(providerClone);
        toggleCreateModal();
        alert('Provider have been created.');
      })
      .catch(err => {});
  };

  const editProvider = (values,providerId) => {
    axios
      .put(
        `/providers/${providerId}/`,
        {
          name: values.name,
          email: values.email
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let data = result.data;
        let providerClone = [...providers];
        providerClone[editIndex] = data;
        setProviders(providerClone);
        toggleEditModal();
        alert('Provider have been updated');
      })
      .catch(err => {
        alert(err);
      });
  };

  const toggleCreateModal = () => {
    if (createIsOpen) {
      setNewProvider(initialState);
    }
    setCreateIsOpen(!createIsOpen);
  };

  const toggleEditModal = () => {
    if (editIsOpen) {
      setNewProvider(initialState);
    }
    setEditIsOpen(!editIsOpen);
  };

  const onEditClick = (index, providerId) => {
    //set all the variables in.
    let data = providers[index];
    setNewProvider(data);
    setEditProviderId(providerId);
    setEditIndex(index);
    toggleEditModal();
  };

  const handleCreateSubmission = (values, actions) => {
    createNewProvider(values);
  };

  const handleEditSubmission = (values, actions) => {
    editProvider(values, editProviderId);
  };

  useEffect(() => {
    if (token) {
      fetchProviders();
    }
  }, [token]);

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
              Add New Provider
            </Button>
          </Col>
        </Row>

        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name of Provider</th>
              <th>Email</th>
              <th>Services</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider, index) => (
              <React.Fragment>
                <tr key={provider.id}>
                  <th scope="row">{provider.id}</th>
                  <td>{provider.name}</td>
                  <td>{provider.email}</td>
                  <td>{provider.services.length} services</td>
                  <td>
                    <div className="d-flex flex-row">
                      <Button
                        color="secondary"
                        className="ml-1 mr-1"
                        onClick={() => onEditClick(index, provider.id)}
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

        <ProviderModal
          isOpen={createIsOpen}
          toggleModal={toggleCreateModal}
          handleSubmission={handleCreateSubmission}
          modalType={'CREATE'}
          providers={newProvider}
        />

        <ProviderModal
          isOpen={editIsOpen}
          toggleModal={toggleEditModal}
          handleSubmission={handleEditSubmission}
          modalType={'EDIT'}
          providers={newProvider}
        />
      </Container>
    </div>
  );
};

export default withRedux(withRouter(withAuth(Providers)));
