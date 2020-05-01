import React from "react";

class ImageRemover extends React.Component {
  componentDidMount() {
    this.props.onError();
  }

  render() {
    return <span></span>
  }
}


export default ImageRemover;
