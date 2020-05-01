import React from "react";
import {useSelector} from "react-redux";
import {Typography} from "@material-ui/core";
import {getQuantityOrdered, getUnitOfService} from "../../selectors";

const Quantity = (props) => {
  const {service} = props;
  const orderQuantity = useSelector((state) => getQuantityOrdered(state, service.id));
  const unit = useSelector((state) => getUnitOfService(state, service.id));

  return (
    <div>
      <Typography variant="body2" color="textSecondary">
        {orderQuantity} {unit} booked
      </Typography>
    </div>
  )
};

export default Quantity;
