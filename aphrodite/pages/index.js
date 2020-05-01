import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, firebase } from '../firebase';
import { useRouter, withRouter } from 'next/router';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  FormText,
  Input
} from 'reactstrap';
import axios from '../helpers/axios';
import { withRedux } from '../helpers/redux';
import { useDispatch, useSelector } from 'react-redux';

const backgroundStyle = {
  background:
    '-webkit-linear-gradient(301deg, rgba(68, 115, 196, 0.85) 0%, rgba(97, 70, 171, 0.85) 100%)',
  background:
    '-o-linear-gradient(301deg, rgba(68, 115, 196, 0.85) 0%, rgba(97, 70, 171, 0.85) 100%)',
  background:
    '-ms-linear-gradient(301deg, rgba(68, 115, 196, 0.85) 0%, rgba(97, 70, 171, 0.85) 100%)',
  background:
    '-moz-linear-gradient(301deg, rgba(68, 115, 196, 0.85) 0%, rgba(97, 70, 171, 0.85) 100%)',
  background:
    'linear-gradient(149deg, rgba(68, 115, 196, 0.85) 0%, rgba(97, 70, 171, 0.85) 100%)'
};
const Home = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);

  useEffect(() => {
    axios
      .get('/auth/')
      .then(result => {
        if (result.data.role !== "Admin") {
          throw new Error("You are not an administrator.")
        }
        if (result.data.token) {
          dispatch({
            type: 'SAVE_TOKEN',
            token: result.data.token
          });
          dispatch({
            type: 'SET_USER',
            user: result.data.user
          });
          router.replace('/dashboard');
          
        }
      })
      .catch(err => {
        setIsUserLoggedIn(false);
      });
  }, []);

  const handleSignIn = event => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(idToken => {
            axios
              .post('/auth/', { token: idToken })
              .then(result => {
                let user = result.data.user;
                let role = result.data.role;
                let country = result.data.country;
                let token = result.data.token;
                if (role !== "Admin") {
                  throw new Error("You are not an administrator.");
                }
                dispatch({
                  type: 'SAVE_TOKEN',
                  token: token
                });
                dispatch({
                  type: 'SET_USER',
                  user: user
                });
                setIsUserLoggedIn(true);
                router.replace({
                  pathname: '/dashboard'
                });
              })
              .catch(err => {
                alert(err);
              });
          })
          .catch(error => {
            alert(error);
          });
      })
      .catch(err => {
        setError(err.message);
      });
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  return (
    <div style={backgroundStyle}>
      {isUserLoggedIn ? (
        <>
          <div className="d-flex justify-content-center vh-100 align-items-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <Container>
            <div className="vh-100 d-flex flex-column align-items-center justify-content-center">
              <div className="w-100">
                <Row>
                  <Col md={{ size: 4, offset: 4 }} sm="12">
                    <h4 className="text-center text-white">
                      GetOut Admin Portal
                    </h4>
                    <Form onSubmit={handleSignIn}>
                      <FormGroup>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Email"
                          value={email}
                          onChange={handleEmailChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                      </FormGroup>
                      <Button className="w-100" color="warning">
                        Login
                      </Button>
                    </Form>
                    <FormText color="danger">{error}</FormText>
                  </Col>
                </Row>
              </div>
            </div>
          </Container>
        </>
      )}
    </div>
  );
};

export default withRedux(withRouter(Home));
