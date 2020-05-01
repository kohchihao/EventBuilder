import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActionArea
} from "@material-ui/core";
import Carousel from "../components/Carousel";
import PackageDetails from "../components/packageDetails";

const CuratedEventCard = props => {
  const [open, setOpen] = React.useState(false);
  const curatedEvent = props.curatedEvent;
  return (
    <Grid key={curatedEvent.id} item xs={12} sm={6} md={4}>
      <Card>
        <Carousel
          handleClick={() => {
            setOpen(true);
          }}
          imageHeight={300}
          imageList={curatedEvent.images}
        />
        <CardActionArea
          onClick={() => {
            setOpen(true);
          }}
        >
          {" "}
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {curatedEvent.name}
              </Typography>
            }
          />
          <CardContent>
            <Typography>
              Starting from ${Number(curatedEvent.price).toLocaleString()}
              <br />
              Approximately {parseInt(curatedEvent.duration)} hour{parseInt(curatedEvent.duration) > 1 ? "s" : ""}
              <br />
              Accommodates up to {Number(curatedEvent.pax).toLocaleString()} person
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <PackageDetails
        selectedPackage={curatedEvent}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </Grid>
  );
};

export default CuratedEventCard;
