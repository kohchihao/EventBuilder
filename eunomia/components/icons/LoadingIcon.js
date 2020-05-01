import React from 'react';
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";


const useStyle = makeStyles(() => ({
  root: {
    paddingTop: "calc(40vh)",
    textAlign: "center",
  }
}));

const LoadingIcon = () => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};

export default LoadingIcon;
