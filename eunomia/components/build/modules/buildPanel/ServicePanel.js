import React, {useEffect, useState} from "react";
import {makeStyles, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";
import api from "../../../../src/api";
import ServiceCards from "./ServiceCards";
import {useDispatch, useSelector} from "react-redux";
import {getCuratedEvent, getExpandedServiceTypeId, getServiceTypes} from "../../selectors";
import {setExpandedServiceTypeId, setServiceTypes, sortServices} from "../../action";
import ServiceTypeSummary from "./ServiceTypeSummary";

const useStyles = makeStyles(theme => ({
  root: {
    padding: 15,
    border: 'black',
    width: '100%',
  },
  header: {
    marginBottom: 15,
  }
}));

const ServicePanel = (props, state) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const curatedEvent = useSelector(getCuratedEvent);
  const serviceTypes = useSelector(getServiceTypes);
  const expandedServiceTypeId = useSelector(getExpandedServiceTypeId);
  const dispatch = useDispatch();

  const handleExpandedChange = (isExpanded, id) => {
    dispatch(setExpandedServiceTypeId(isExpanded ? id : null));
    if (isExpanded) {
      dispatch(sortServices(id));
    }
  };

  useEffect(() => {
    api.event_types.listServiceTypes(curatedEvent.type.id)
      .then(res => {
        dispatch(setServiceTypes(res.data));
        setIsLoading(false);
      })
  }, []);

  if (isLoading && !serviceTypes) {
    return <div></div>
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.header}>Customize your services</Typography>
      {Object.values(serviceTypes).map(serviceType => (
        <ExpansionPanel key={serviceType.id} expanded={expandedServiceTypeId === serviceType.id}
                        onChange={(e, isExpanded) => handleExpandedChange(isExpanded, serviceType.id)}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <ServiceTypeSummary serviceType={serviceType}/>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ServiceCards serviceType={serviceType}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  )
};

export default ServicePanel
