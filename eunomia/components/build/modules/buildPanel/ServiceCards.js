import React, {useEffect, useState} from "react";
import {CircularProgress} from "@material-ui/core";
import api from "../../../../src/api";
import ServiceCard from "./ServiceCard";
import {useDispatch} from "react-redux";
import {setServices as setStoreServices} from "../../action";

const ServiceCards = (props) => {
  const {serviceType} = props;
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    api.services.listbyServiceTypeAndCountry('sg', serviceType.id).then((res) => {
      dispatch(setStoreServices(serviceType, res.data));
      setIsLoading(false);
    })
  }, []);

  if (isLoading) {
    return (
      <div style={{width: "100%", textAlign: "center"}}>
        <CircularProgress/>
      </div>
    )
  }

  return (
    <div>
      {serviceType.services.map(service => (
        <ServiceCard key={service} serviceId={service}/>
      ))}
    </div>
  )
};

export default ServiceCards;
