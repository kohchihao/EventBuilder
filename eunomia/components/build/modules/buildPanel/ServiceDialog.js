import React from "react";
import {Dialog, DialogTitle, DialogContent, DialogContentText, makeStyles} from "@material-ui/core";
import HorizontalScroll from "../../../lib/HorizontalScroll";
import {formatMoney} from "../../../../src/helpers/utils";
import {useSelector} from "react-redux";
import {getCuratedAgreement} from "../../selectors";

const useStyles = makeStyles(() => ({
  paper: {
    minHeight: 435,
    minWidth: 600,
  }
}));

const ServiceDialog = (props) => {
  const {service, onClose, open} = props;
  const curatedAgreement = useSelector((state) => getCuratedAgreement(state, service.id));
  const classes = useStyles();

  let price = service.cost;
  price *= 1 + (service.markup / 100);
  price *= 1 + (service.tax / 100);

  return (
    <Dialog open={open} onClose={onClose} classes={{paper: classes.paper}}>
      <DialogTitle>{service.name}</DialogTitle>
      <div style={{padding: 30}}>
        <HorizontalScroll urls={service.images.map(e => e.url)}/>
      </div>
      <DialogContent>
        <DialogContentText>
          {service.description.trim() === "" ? "No Description" : service.description}

          <br/>
          <span style={{marginTop: 5}}>
            Cost:&nbsp;<b>${formatMoney(price)} per {service.unit} </b>
          </span>
          {curatedAgreement && (
            <span style={{marginTop: 5}}>
              <br/>
              Amount included in package:&nbsp;<b>{curatedAgreement.quantity} {service.unit}</b>
            </span>
          )}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
};

export default ServiceDialog;
