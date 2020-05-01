import React, {useEffect, useRef, useState} from "react";
import {Button, Card, CardActions, CardContent, makeStyles, Typography, Tooltip, Grid, useMediaQuery} from "@material-ui/core";
import Carousel from "../../../Carousel";
import ServiceDialog from "./ServiceDialog";
import QuantityToggle from "./QuantityToggle";
import Quantity from "./Quantity";
import {useDispatch, useSelector} from "react-redux";
import {
  getCuratedAgreement,
  getOrder,
  getService,
  isEventEditable,
  getIsServiceInPackage,
  getIsServiceFocused
} from "../../selectors";
import {addService, removeService} from "../../action";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-block",
    width: 250,
    margin: 10,
  },
  selectedCard: {
    backgroundColor: theme.palette.primary.main,
    textAlign: "center",
    marginBottom: -5,
    borderRadius: 5,
    fontSize: 15,
    color: "white",
    paddingBottom: 5
  },
  selectedInPackage: {
    backgroundColor: "#388e3c",
    textAlign: "center",
    marginBottom: -5,
    borderRadius: 5,
    fontSize: 15,
    color: "white",
    paddingBottom: 5
  },
  unselectedPackage: {
    backgroundColor: "grey",
    textAlign: "center",
    marginBottom: -5,
    borderRadius: 5,
    fontSize: 15,
    color: "white",
    paddingBottom: 5
  },
  halfInPackageAddOn: {
    width: 250,
    marginLeft: 1,
    backgroundColor: theme.palette.primary.main,
    textAlign: "center",
    marginBottom: -5,
    borderRadius: 5,
    fontSize: 15,
    color: "white",
    paddingBottom: 5,
    background: "linear-gradient(148deg, #3f2b96 0%, #3f2b96 50%, #388e3c 50%, #388e3c 100%)",
  },
  cardHeader: {
    marginBottom: 10,
  },
  rightActionButton: {
    marginLeft: 'auto'
  }
}));

const ServiceCard = (props) => {
  const {serviceId} = props;
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const service = useSelector(state => getService(state, serviceId));
  const order = useSelector(state => getOrder(state, serviceId));
  const isServiceInPackage = useSelector(state => getIsServiceInPackage(state, serviceId));
  const curatedAgreement = useSelector(state => getCuratedAgreement(state, serviceId));
  const isDesktop = useMediaQuery('(min-width:960px)');
  const isEditable = useSelector(isEventEditable);
  const isServiceFocused = useSelector(state => getIsServiceFocused(state, serviceId));
  let toggleFieldRef = useRef(null);

  const handleSelectService = () => {
    dispatch(addService(service.id));
  };

  useEffect(() => {
    if (service && service.isSelected && isEditable && isDesktop) {
      toggleFieldRef.current.focus();
    }
  }, [service]);

  useEffect(() => {
    if (service && isServiceFocused && isEditable && isDesktop) {
      toggleFieldRef.current.focus();
    }
  }, [isServiceFocused]);

  const handleRemoveService = () => {
    dispatch(removeService(service.id));
  };

  if (!service) {
    return <></>
  }

  return (
    <div className={classes.root}>
      {service.isSelected ? (
        <>
          {!order.isInPackage && isServiceInPackage ? (
            <Grid className={classes.halfInPackageAddOn} container spacing={1} wrap="nowrap">
              <Grid item xs={6}>
                <b> Package {curatedAgreement.quantity} </b>
              </Grid>
              <Grid item xs={6} style={{float: "right"}}>
                <b> + {order.quantity - curatedAgreement.quantity} {service.unit} </b>
              </Grid>
            </Grid>
          ) : order.isInPackage ? (
            <div className={classes.selectedCard}>
              <b> In Package </b>
            </div>
          ) : (
            <div className={classes.selectedInPackage}>
              <b> Add On </b>
            </div>
          )}
        </>
      ) : (
        <>
          {isServiceInPackage && (
            <div className={classes.unselectedPackage}>
              <b> In Package (Not Selected) </b>
            </div>
          )}
        </>
      )}
      <Card key={service.id}>
        <Carousel imageHeight={170} imageList={service.images}
                  handleClick={() => setIsMoreInfoOpen(true)}/>
        <CardContent>
          {service.name.length > 19 ? (
            <Tooltip title={service.name} placement="top">
              <Typography gutterBottom variant="h6" className={classes.cardHeader}>
                {`${service.name.substring(0, 19)}${service.name.length > 19 ? '...' : ''}`}
              </Typography>
            </Tooltip>
          ) : (
            <Typography gutterBottom variant="h6" className={classes.cardHeader}>
              {service.name}
            </Typography>
          )}
          {(service.isSelected && isEditable) ? (
            <QuantityToggle service={service} isServiceInPackage={isServiceInPackage} ref={toggleFieldRef}/>
          ) : (
            <Typography variant="body2" color="textSecondary" component="p">
              {`${service.description.substring(0, 80)}${service.description.length > 80 ? '...' : ''}`}
            </Typography>
          )}
        </CardContent>
        <CardActions disableSpacing>
          <Button size="small" color="primary" onClick={() => setIsMoreInfoOpen(true)}>
            More Info
          </Button>
          {isEditable && (
            <>
              {service.isSelected ? (
                <Button size="small" color="primary" className={classes.rightActionButton} onClick={handleRemoveService}>
                  Remove
                </Button>
              ) : (
                <Button size="small" color="primary" className={classes.rightActionButton} onClick={handleSelectService}>
                  Select
                </Button>
              )}
            </>
          )}
          {!isEditable && (
            <div className={classes.rightActionButton}>
              <Quantity service={service}/>
            </div>
          )}
        </CardActions>
        <ServiceDialog open={isMoreInfoOpen} onClose={() => setIsMoreInfoOpen(false)} service={service}/>
      </Card>
    </div>
  )
};

export default ServiceCard;
