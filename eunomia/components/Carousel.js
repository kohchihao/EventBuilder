import React from "react";
import { Button, MobileStepper, CardActionArea } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import api from "../src/api";
import PlaceholderImage from "../src/assets/images/image-placeholder.jpg";

const Carousel = props => {
  const useStyles = makeStyles(() => ({
    box: {
      position: "relative",
      height: props.imageHeight || "100%",
      overflow: "hidden",
      justifyContent: "center",
      display: "flex",
    },
    img: {
      objectFit: "contain",
      height: "100%"
    },
    stepper: {
      position: "absolute",
      bottom: "0",
      backgroundColor: "#FFFFFF40",
      width: "100%"
    }
  }));

  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [imageList, setImageList] = React.useState([
    {
      url: PlaceholderImage,
      id: 1
    }
  ]);
  const maxSteps = imageList.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      setActiveStep(0);
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      setActiveStep(maxSteps - 1);
    } else {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }
  };

  React.useEffect(() => {
    let { curatedEventId, serviceId, imageList: images } = props;
    if (images) {
      images = images.filter(image => image.url.trim() !== "");
    }

    if (images) {
      if (images.length > 0) {
        setImageList(images);
      }
    } else if (curatedEventId) {
      api.curated_event.retrieve(curatedEventId).then(response => {
        if (response.data.images.filter(image => image.url !== "").length > 0) {
          setImageList(response.data.images.filter(image => image.url !== ""));
        }
      });
    } else if (serviceId) {
      api.services.retrieve(serviceId).then(response => {
        if (response.data.images.filter(image => image.url !== "").length > 0) {
          setImageList(response.data.images.filter(image => image.url !== ""));
        }
      });
    }
  }, []);

  return (
    <div className={classes.box}>
      {props.handleClick ? (
        <CardActionArea
          className={classes.box}
          onClick={() => props.handleClick()}
        >
          <img
            className={classes.img}
            src={imageList[activeStep].url}
            alt={imageList[activeStep].id}
          />
        </CardActionArea>
      ) : (
        <img
          className={classes.img}
          src={imageList[activeStep].url}
          alt={imageList[activeStep].id}
        />
      )}
      <MobileStepper
        className={classes.stepper}
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        nextButton={
          <Button size="large" onClick={handleNext}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="large" onClick={handleBack}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
    </div>
  );
};

export default Carousel;
