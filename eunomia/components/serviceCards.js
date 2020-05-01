import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Grow
} from "@material-ui/core";
import Carousel from "./Carousel";

const ServiceCards = props => {
  const serviceList = props.serviceList;

  const renderServiceList = (service, index) => {
    return (
      <Grow
        key={index}
        in={Boolean(service)}
        style={{ transformOrigin: "0 0 0 0" }}
        {...(service ? { timeout: 1000 + index * 500 } : {})}
      >
        <Grid item xs={12} sm={3}>
          <Card>
            <Carousel imageHeight={200} serviceId={service.id} />
            <CardContent>
              <Typography variant="subtitle1" component="h2">
                {service.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grow>
    );
  };

  return serviceList.length > 0 ? (
    <Grid container spacing={1}>
      {serviceList.map(renderServiceList)}
    </Grid>
  ) : (
    <Typography> No services found </Typography>
  );
};

export default ServiceCards;
