import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter, withRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import axios from '../../helpers/axios';
import withAuth from '../../helpers/withAuth';
import { withRedux } from '../../helpers/redux';
import { useSelector } from 'react-redux';

import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  CardTitle,
  CardText,
  CardFooter,
  CardBody,
  CardHeader,
  DropdownItem
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
library.add(fas);

import StatusBar from '../../components/dashboard/StatusBar';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';

const initialValues = {
  selectedStatus: 'CONTACTED'
};

const statusTypes = ['CONTACTED', 'QUOTED', 'ACCEPTED', 'CANCELLED'];

const statusForApi = {
  CONTACTED: 'contact',
  QUOTED: 'quote',
  ACCEPTED: 'accept',
  CANCELLED: 'cancel'
};

const Event = props => {
  const token = useSelector(state => state.token);
  const router = useRouter();
  const { eid } = router.query;

  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(initialValues);
  const [createPastEvents, setCreatePastEvents] = useState('');

  const fetchEvent = () => {
    axios
      .get(`/events/${eid}/`, {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        console.log(result.data);
        setEvent(result.data);
        setStatus({ selectedStatus: result.data.status });
        setIsLoading(false);
        createPastEventsUrl(result.data);
      })
      .catch(err => {
        alert(err);
      });
  };

  const createPastEventsUrl = data => {
    let agreements = data.agreements;
    let curated_agreements = [];
    agreements.forEach(agreement => {
      let curated_agreement = {
        service: agreement.service.id,
        quantity: agreement.amount
      };
      curated_agreements.push(curated_agreement);
    });

    let pax = data.attendees;
    let duration = data.duration;
    let price = data.price;
    let type = data.type.id;

    let urlString = 'curated_agreements=';
    urlString += JSON.stringify(curated_agreements);
    urlString += '&';
    urlString += 'pax=';
    urlString += pax;
    urlString += '&';
    urlString += 'duration=';
    urlString += duration.split(':')[0];
    urlString += '&';
    urlString += 'price=';
    urlString += price;
    urlString += '&';
    urlString += 'type=';
    urlString += type;
    setCreatePastEvents(urlString);
  };

  const handleStatusChange = (values, actions) => {
    if (typeof statusForApi[values.selectedStatus] !== 'undefined') {
      axios
        .post(
          `/events/${statusForApi[values.selectedStatus]}/${eid}/`,
          {},
          {
            headers: {
              Authorization: 'Token ' + token
            }
          }
        )
        .then(result => {
          setStatus({ selectedStatus: values.selectedStatus });
        })
        .catch(err => {
          alert(
            `Changing status from ${status.selectedStatus} to ${values.selectedStatus} is not allowed.`
          );
        });
    }
  };

  const uploadQuotationFile = files => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const data = new FormData();
        data.append('file', file);
        axios
          .post(`/events/${eid}/upload_quotation/?signed=0`, data, {
            headers: {
              Authorization: 'Token ' + token,
              'content-type': 'multipart/form-data'
            }
          })
          .then(result => {
            setEvent(result.data);
          })
          .catch(err => {
            alert(err);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDownload = () => {
    axios
      .get(`/events/${eid}/download_quotation/?signed=1`, {
        headers: {
          Authorization: 'Token ' + token
        },
        responseType: 'blob',
        transformResponse: [function (data) {
          let blob = new window.Blob([data], { type: 'application/pdf' });
          return window.URL.createObjectURL(blob)
        }]
      })
      .then(result => {
        const link = document.createElement('a');
        link.href = result.data;
        link.setAttribute('download', `${event.name}_Quotation.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        alert(err);
      });
  };

  useEffect(() => {
    if (token) {
      fetchEvent();
    }
  }, [token]);

  return (
    <div>
      <Navbar />
      {isLoading ? null : (
        <Container className="mt-5">
          <Row className="mb-4">
            <Col md={4}>
              <Card outline className="h-100">
                <CardHeader>Status of event</CardHeader>
                <CardBody>
                  <StatusBar status={status.selectedStatus} />
                  <DropdownItem divider />
                  <CardText>Update event status:</CardText>
                  <Formik initialValues={status} onSubmit={handleStatusChange}>
                    {({ values, isSubmitting, setFieldValue }) => (
                      <Form>
                        <Field
                          className="form-control"
                          component="select"
                          name="selectedStatus"
                          id="select"
                        >
                          <option defaultValue>Choose here</option>
                          {statusTypes.map((statusType, index) => (
                            <option value={statusType}>{statusType}</option>
                          ))}
                        </Field>

                        <Button
                          color="primary"
                          className="mt-1"
                          type="submit"
                          block
                        >
                          Update
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card outline className="h-100">
                <CardHeader>Clone this</CardHeader>
                <CardBody>
                  <CardText>
                    You can make this event available to other users as well by
                    making it a past event!
                  </CardText>
                  <Button href={`/create-past-events?${createPastEvents}`}>
                    Make this a past event
                  </Button>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card outline className="h-100">
                <CardHeader>Quotation</CardHeader>
                <CardBody>
                  <CardText><b>Upload Quotation for client</b>: {event.quotation_token? <span>✅</span> : null}</CardText>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => uploadQuotationFile(e.currentTarget.files)}
                  />

                  <DropdownItem divider />

                  <CardText><b>Download signed quotation</b></CardText>
                  {event.signed_quotation_token ? (
                    <Button
                      color="primary"
                      block
                      onClick={() => handleFileDownload()}
                    >
                      Download Now
                    </Button>
                  ) : (
                    <CardText>
                      User have not uploaded the signed quotation yet.
                    </CardText>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4"></Row>
          <Row>
            <Col md={4}>
              <Card outline className="h-100">
                <CardHeader>Applied by:</CardHeader>
                <CardBody>
                  <CardText>
                    <b>Email</b>: {event.owner.email}
                  </CardText>
                  <DropdownItem divider />
                  <CardText>
                    <b>Phone Number</b>: {event.owner.phone_number}
                  </CardText>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card outline className="h-100">
                <CardHeader>Based on package:</CardHeader>
                <CardBody>
                  <CardText>
                    <b>Package</b>: {event.curated_event.name}
                  </CardText>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card outline className="h-100">
                <CardHeader>More Details</CardHeader>
                <CardBody>
                  <CardText>
                    Total Pax:{' '}
                    <h3>
                      <b>{event.attendees} pax</b>
                    </h3>
                  </CardText>
                  <CardText>
                    Requested Duration:
                    <h3>
                      <b>{event.duration.split(':')[0]} hours</b>
                    </h3>
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <h2>Services applied:</h2>
          </Row>

          <Row>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Amount Required</th>
                  <th>Price</th>
                  <th>Note to admin</th>
                </tr>
              </thead>
              <tbody>
                {event.agreements.map((agreement, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <th scope="row">{index}</th>
                      <td>{agreement.service.name}</td>
                      <td>{agreement.amount}</td>
                      <td>{agreement.price}</td>
                      <td>{agreement.note}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default withRedux(withRouter(withAuth(Event)));
