import React from 'react';
import Router from 'next/router';
import { getCookie } from './cookie';
import { connect } from 'react-redux';
import { compose } from 'redux';
import axios from './axios';

const withAuth = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        status: 'LOADING'
      };
    }
    componentDidMount() {
      // I need to check if the redux store have the token or not.
      //If no token inside store, i make the silent login.
      if (this.props.token !== null) {
        this.setState({
          status: 'SIGNED_IN'
        });
      } else {
        // no token
        console.log('No Token');
        console.log("Path",Router.pathname);
        // do silent login.
        axios
          .get('/auth/')
          .then(result => {
            if (result.data.role !== "Admin") {  
              throw new Error("You are not an administrator.")
            }
            if (result.data.token) {
              this.setState({
                status: 'SIGNED_IN'
              });
              this.props.dispatch({
                type: 'SAVE_TOKEN',
                token: result.data.token
              });

              this.props.dispatch({
                type: 'SET_USER',
                user: result.data.user
              });
            }
          })
          .catch(err => {
            Router.replace('/');
          });
      }
    }
    renderContent() {
      const { status } = this.state;
      if (status === 'LOADING') {
        return (
          <div className="d-flex justify-content-center vh-100 align-items-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        );
      } else if (status === 'SIGNED_IN') {
        return <Component {...this.props} />;
      }
    }
    render() {
      return <React.Fragment>{this.renderContent()}</React.Fragment>;
    }
  };
};

const mapStateToProps = state => ({
  token: state.token
});

const composed = compose(
  connect(
    mapStateToProps,
    null
  ),
  withAuth
);

// export default Test;
export default composed;
