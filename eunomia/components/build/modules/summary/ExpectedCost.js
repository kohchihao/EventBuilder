import React from "react";
import {Grid, makeStyles, Typography} from "@material-ui/core";
import {useSelector} from "react-redux";
import {getTotalPrice} from "../../selectors";
import {formatMoney} from "../../../../src/helpers/utils";

const useStyle = makeStyles(() => ({
  name: {
    display: "flex",
    marginRight: "auto",
    alignItems: "center"
  },
  value: {
    display: "flex",
    marginLeft: "auto",
    alignItems: "center"
  }
}));


const ExpectedCost = () => {
  const classes = useStyle();
  const totalPrice = useSelector(getTotalPrice);

  return (
    <div>
      <Grid container spacing={1} wrap="nowrap">
        <Grid item zeroMinWidth className={classes.name}>
          <Typography style={{fontSize: "1.2rem"}}>
            Expected Cost
          </Typography>
          &nbsp;:
        </Grid>
        <Grid item zeroMinWidth className={classes.value}>
          <Typography style={{fontSize: "1.2rem"}}>
            <b> ${formatMoney(totalPrice)} </b>
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
};

export default ExpectedCost;
