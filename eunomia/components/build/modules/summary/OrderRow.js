import React from "react";
import {makeStyles, Typography, Grid, Link} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {getServiceTypeIdOfService, getUnitOfService} from "../../selectors";
import {FiberManualRecord} from '@material-ui/icons';
import {isOrderValid} from "../../utils";
import {formatMoney} from "../../../../src/helpers/utils";
import {setExpandedServiceTypeId, setFocusedService, sortServices} from "../../action";

const useStyle = makeStyles(() => ({
  quantity: {
    display: "flex",
    alignItems: "center",
  },
  name: {
    display: "flex",
    marginRight: "auto",
  },
  price: {
    float: "right"
  },
  link: {
    cursor: "pointer",
    marginLeft: 2
  }
}));

const OrderRow = (props) => {
  const {order} = props;
  const unit = useSelector((state) => getUnitOfService(state, order.service.id));
  const serviceTypeId = useSelector(state => getServiceTypeIdOfService(state, order.service));
  const classes = useStyle();
  const dispatch = useDispatch();

  const handleExpandServiceType = () => {
    dispatch(setExpandedServiceTypeId(serviceTypeId));
    dispatch(sortServices(serviceTypeId));
    dispatch(setFocusedService(order.service.id))
  };

  if (!('isInPackage' in order)) {
    return <></>
  }
  return (
    <Grid container spacing={1} wrap="nowrap" alignItems="center">
      <Grid item xs={6} zeroMinWidth className={classes.name}>
        <div style={{display: "flex", alignItems: "center"}}>
          <FiberManualRecord style={{fontSize: 10}}/>
          <Typography variant="body2" style={{marginLeft: 5}}>
            <Link className={classes.link} style={{color: `${!order.isInPackage ? "#388e3c" : "#3f2b96"}`}} onClick={handleExpandServiceType}>
              {order.service.name}
            </Link>
          </Typography>
        </div>
      </Grid>

      <Grid item xs={6} style={{textAlign: "right"}}>
        {isOrderValid(order) ? (
          <>
            {order.isInPackage ? (
              <Typography variant="body2">
                {order.quantity} {unit}&nbsp;<b>(In Package)</b>
              </Typography>
            ) : (
              <Typography variant="body2">
                {order.quantity} {unit}&nbsp;<b>@ ${formatMoney(order.price)}</b>
              </Typography>
            )}
          </>
        ) : (
          <Typography color="error" variant="body2">
            INVALID
          </Typography>
        )}
      </Grid>
    </Grid>
  )
};

export default OrderRow;
