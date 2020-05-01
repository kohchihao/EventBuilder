import React from "react";
import Router from "next/router";
import { firebaseAuth } from "../firebase";

const withAuth = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { status: "LOADING" };
    }
    componentDidMount() {
      firebaseAuth.onAuthStateChanged(authUser => {
        if (authUser) {
          this.setState({ status: "SIGNED_IN" });
        } else {
          Router.push("/");
        }
      });
    }

    renderContent() {
      const { status } = this.state;
      if (status == "LOADING") {
        return <h1>Loading ......</h1>;
      } else if (status == "SIGNED_IN") {
        return <Component {...this.props} />;
      }
    }

    render() {
      return <React.Fragment>{this.renderContent()}</React.Fragment>;
    }
  };
};

export default withAuth;
