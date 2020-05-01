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
import EventCard from '../components/dashboard/EventCard';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';

const initialValues = {
  selectedStatus: 'PENDING'
};

const statusTypes = ['PENDING', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'CANCELLED'];

const Dashboard = props => {
  const token = useSelector(state => state.token);
  const [status, setStatus] = useState(initialValues);
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    axios
      .get(`/events/with_status/${status.selectedStatus}/`, {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        let data = result.data;
        console.log(data);
        setEvents(data);
      })
      .catch(err => {});
  };

  const handleSubmission = (values, actions) => {
    setStatus({ selectedStatus: values.selectedStatus});
  };

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [status])

  return (
    <div>
      <Navbar />
      <Container className="mt-5">
        <Row className="p-4">
          <Col xs={12} md={4}>
            <Formik initialValues={status} onSubmit={handleSubmission}>
              {({ values, isSubmitting, setFieldValue }) => (
                <Form>
                  <Row>
                    <Col xs={6}>
                      <Label for="filter_status">Filter Status</Label>
                      <Field
                        className="form-control"
                        component="select"
                        name="selectedStatus"
                        id="select"
                      >
                        {statusTypes.map((statusType, index) => (
                          <option value={statusType}>{statusType}</option>
                        ))}
                      </Field>
                    </Col>
                    <Col
                      xs={3}
                      className=" d-flex justify-content-center align-items-end"
                    >
                      <Button color="primary" className="ml-1 mr-1" type="submit">
                        Filter
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row>
          {events.map((event, index) => (
            <React.Fragment key={index}>
              <EventCard
                name={event.owner.email}
                eventDate={event.event_date}
                attendees={event.attendees}
                date={event.date}
                status={event.status}
                eventId={event.id}
                phoneNumber={event.owner.phoneNumber}
                type={event.type}
              />
            </React.Fragment>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default withRedux(withRouter(withAuth(Dashboard)));
