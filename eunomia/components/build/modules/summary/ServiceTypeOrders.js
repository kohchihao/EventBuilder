import React from "react";
import {useSelector} from "react-redux";
import {getCuratedEvent, getOrders} from "../../selectors";
import {makeStyles, Typography} from "@material-ui/core";
import OrderRow from "./OrderRow";

const useStyle = makeStyles(() => ({
  root: {
    marginBottom: 10,
  }
}));


const ServiceTypeOrders = props => {
  const curatedEvent = useSelector(getCuratedEvent);
  const {serviceType} = props;
  const classes = useStyle();

  if (!curatedEvent || !serviceType) {
    return <div></div>
  }

  const orders = useSelector((state) => getOrders(state, serviceType.id));
  if (orders.length === 0) {
    return <div></div>
  }

  return (
    <div className={classes.root}>
      <Typography style={{fontSize: "1.2rem", marginBottom: 5}}>
        <b>{serviceType.name}</b>
      </Typography>
      {orders.map((order, idx) => <OrderRow key={idx} order={order}/>)}
    </div>
  )
};

export default ServiceTypeOrders;
