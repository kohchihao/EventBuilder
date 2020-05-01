import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter, withRouter } from 'next/router';
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

import EventTypeModal from '../components/event-types/EventTypeModal';
import { compare } from '../helpers/utils';

const initialState = {
  name: '',
  countries: [],
  service_types: [],
  image_url: ''
};
const EventTypes = props => {
  const token = useSelector(state => state.token);
  const [eventTypes, setEventTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [countries, setCountries] = useState([]);

  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);

  const [newEventType, setNewEventType] = useState(initialState);
  const [editEventTypeId, setEditEventTypeId] = useState(0);
  const [editIndex, setEditIndex] = useState(0);
  const formikRef = useRef(null);

  const fetchAllEventTypes = () => {
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

  const createNewEventType = values => {
    axios
      .post(
        '/event_types/',
        {
          name: values.name,
          countries: values.countries,
          service_types: values.service_types,
          image_url: values.image_url
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        console.log('eventTypecreated', result);
        let data = result.data;
        let eventTypesClone = [...eventTypes];
        eventTypesClone.push(data);
        setEventTypes(eventTypesClone);
        toggleCreateModal();
        alert('New Event type have been created');
      })
      .catch(err => {
        alert(err);
      });
  };

  const editEventType = (values, eventTypeId) => {
    axios
      .put(
        `/event_types/${eventTypeId}/`,
        {
          name: values.name,
          countries: values.countries,
          service_types: values.service_types,
          image_url: values.image_url
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let data = result.data;
        let eventTypesClone = [...eventTypes];
        eventTypesClone[editIndex] = data;
        setEventTypes(eventTypesClone);
        toggleEditModal();
        alert('Event Type have been updated');
      })
      .catch(err => {
        alert(err);
      });
  };

  const onEditClick = (eventTypeId, index) => {
    let data = eventTypes[index];
    let pushed = {
      name: data.name,
      countries: data.countries.map(country => country.code),
      service_types: data.service_types.map(serviceType => serviceType.id),
      image_url: data.image_url
    };
    setEditIndex(index);
    setNewEventType(pushed);
    setEditEventTypeId(eventTypeId);
    toggleEditModal();
  };

  const uploadImage = (files, setFieldValue) => {
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
            setFieldValue('image_url', res.data.url);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCreateModal = () => {
    if (createIsOpen) {
      setNewEventType(initialState);
    }
    setCreateIsOpen(!createIsOpen);
  };

  const toggleEditModal = () => {
    if (editIsOpen) {
      setNewEventType(initialState);
    }
    setEditIsOpen(!editIsOpen);
  };

  const handleNewEventTypeSubmission = (values, actions) => {
    createNewEventType(values);
  };

  const handleEditEventTypeSubmission = (values, actions) => {
    editEventType(values, editEventTypeId);
  };

  useEffect(() => {
    if (token) {
      fetchAllEventTypes();
      fetchAllServiceTypes();
      fetchAllCountries();
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
              <th>Name of Event Type</th>
              <th>Service Types</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventTypes.map((eventType, index) => (
              <React.Fragment key={eventType.id}>
                <tr>
                  <th scope="row">{eventType.id}</th>
                  <td>{eventType.name}</td>
                  <td>{eventType.service_types.length}</td>
                  <td>
                    <img
                      src={eventType.image_url}
                      className="img-thumbnail mt-2"
                      height={200}
                      width={200}
                    />
                  </td>
                  <td>
                    <div className="d-flex flex-row">
                      <Button
                        color="secondary"
                        className="ml-1 mr-1"
                        onClick={() => onEditClick(eventType.id, index)}
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

        <EventTypeModal
          isOpen={createIsOpen}
          toggleModal={toggleCreateModal}
          modalType={'CREATE'}
          countries={countries}
          serviceTypes={serviceTypes}
          newEventType={newEventType}
          handleSubmission={handleNewEventTypeSubmission}
          uploadImage={uploadImage}
        />

        <EventTypeModal
          isOpen={editIsOpen}
          toggleModal={toggleEditModal}
          modalType={'EDIT'}
          countries={countries}
          serviceTypes={serviceTypes}
          newEventType={newEventType}
          handleSubmission={handleEditEventTypeSubmission}
          uploadImage={uploadImage}
        />
      </Container>
    </div>
  );
};

export default withRedux(withAuth(EventTypes));
