import React from "react";
import {makeStyles, Typography, Chip} from "@material-ui/core";
import {useSelector} from "react-redux";
import {getExpandedServiceTypeId, getOrders} from "../../selectors";
import {AddCircle} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  name: {
    display: "inline-block",
    marginRight: 10,
  },
  chip: {
    marginLeft: 5,
    marginBottom: 2,
  },
  chipIcon: {
    marginLeft: "5px !important"
  },
  chipNotIncluded: {
    color: "#388e3c",
    border: "1px solid #388e3c",
  }
}));

const ServiceTypeSummary = (props) => {
  const {serviceType} = props;
  const classes = useStyles();
  const orders = useSelector(state => getOrders(state, serviceType.id));
  const expandedServiceType = useSelector(getExpandedServiceTypeId);
  orders.sort((x, y) => {
    return serviceType.services.indexOf(x.service.id) - serviceType.services.indexOf(y.service.id);
  });

  return (
    <div>
      <Typography className={classes.name} variant="h6">{serviceType.name}</Typography>
      {expandedServiceType !== serviceType.id ?
        orders.map((order, idx) => (
            <Chip
              key={idx}
              clickable={false}
              icon={order.isInPackage ? <></> : <AddCircle style={{color: "#388e3c"}}/>}
              classes={{
                icon: classes.chipIcon
              }}
              size="small"
              onClick={(e) => e.stopPropagation()}
              className={`${classes.chip} ${!order.isInPackage && classes.chipNotIncluded} expansion-panel-chip-appear`}
              label={order.service.name}
              color={order.isInPackage ? "primary" : "default"}
              variant="outlined"
            />
          )
      ) : (
        <Typography variant="subtitle1" style={{display: "inline-block"}}>
          {!serviceType.allow_multiple_selection ? "(Select one)" : ""}
        </Typography>
      )}
    </div>
  )
};

export default ServiceTypeSummary;
