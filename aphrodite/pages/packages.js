import React, { useState, useEffect } from 'react';
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
import { compare } from '../helpers/utils';

import PackageModal from '../components/packages/PackageModal';

const initialState = {
  name: '',
  visibility: false,
  type: 0,
  country: '',
  pax: 0,
  price: 0,
  duration: 1,
  description: '',
  curated_agreements: {},
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

const Packages = props => {
  const token = useSelector(state => state.token);
  const [packages, setPackages] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);

  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [curatedEvent, setCuratedEvent] = useState(initialState);

  const fetchAllPackages = () => {
    axios
      .get('/curated_events/', {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(result => {
        let data = result.data;
        data.sort(compare);
        setPackages(data);
      })
      .catch(err => {
        alert(err);
      });
  };

  const fetchEventTypes = () => {
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

  const createNewCuratedEvent = values => {
    let curated_agreements = [];

    for (let property in values.curated_agreements) {
      let arr = values.curated_agreements[property];
      for (let i = 0; i < arr.length; i++) {
        curated_agreements.push(arr[i]);
      }
    }
    axios
      .post(
        '/curated_events/',
        {
          name: values.name,
          visibility: values.visibility,
          type: values.type,
          country: values.country,
          curated_agreements: curated_agreements,
          images: values.images,
          pax: values.pax,
          duration: values.duration + ':00:00',
          price: values.price,
          description: values.description,
          is_past_events: false
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      .then(result => {
        let data = result.data;
        let packagesClone = [...packages];
        packagesClone.push(data);
        setPackages(packagesClone);
        toggleCreateModal();
        alert('New package have been created.');
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
    setCreateIsOpen(!createIsOpen);
  };

  const handleCreateSubmission = (values, actions) => {
    createNewCuratedEvent(values);
  };

  useEffect(() => {
    if (token) {
      fetchAllPackages();
      fetchEventTypes();
      fetchAllCountries();
      // fetchAllServices();
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
              Add New Package
            </Button>
          </Col>
        </Row>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Country</th>
              <th>Name</th>
              <th>Event Type</th>
              <th>Description</th>
              <th>Public visibility</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pac, index) => (
              <React.Fragment key={pac.id}>
                <tr>
                  <th scope="row">
                    <a href={`/packages/${pac.id}`}>{pac.id}</a>
                  </th>
                  <td>{pac.country.name}</td>
                  <td>{pac.name}</td>
                  <td>{pac.type.name}</td>
                  <td>{pac.description}</td>
                  <td>{pac.visibility ? <>YES</> : <>NO</>}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>

        <PackageModal
          isOpen={createIsOpen}
          toggleModal={toggleCreateModal}
          curatedEvent={curatedEvent}
          countries={countries}
          eventTypes={eventTypes}
          // services={services}
          handleSubmission={handleCreateSubmission}
          uploadImage={uploadImage}
        />
      </Container>
    </div>
  );
};

export default withRedux(withAuth(Packages));
