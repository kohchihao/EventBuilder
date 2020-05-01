import React, {useState} from "react";
import Slider from "react-slick";
import "./Lib.css"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import "../App.css"
import "./Lib.css"
import PlaceholderImage from "../../src/assets/images/image-placeholder.jpg";
import Img from "react-image";
import ImageRemover from "./ImageRemover";

const PrevArrow = props => {
  const {currentSlide, slideCount, className, ...arrowProps} = props;
  return <KeyboardArrowLeft {...arrowProps} className={`${className} slick-button-icon`} color="primary"/>;
};

const NextArrow = props => {
  const {currentSlide, slideCount, className, ...arrowProps} = props;
  return <KeyboardArrowRight {...arrowProps} className={`slick-button-icon ${className}`} color="primary"/>;
};

const HorizontalScroll = (props, state) => {
  let {urls} = props;
  const [images, setImages] = useState(urls.filter(url => url !== ""));

  if (!images || images.length === 0) {
    setImages([PlaceholderImage]);
  }

  let settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrow: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 320,
        settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 2, infinite: false }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: false }
      }
    ]
  };

  if (images.length === 1) {
    settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrow: true,
      nextArrow: <NextArrow/>,
      prevArrow: <PrevArrow/>
    }
  }

  const handleErrorImage = (key) => {
    const newImages = images.filter((image, idx) => idx !== key);
    setImages(newImages);
  };

  return (
    <div>
      <Slider {...settings}>
        {images.map((url, idx) => (
          <Img key={idx} className="picture" src={url} alt={url}
               unloader={<ImageRemover onError={() => handleErrorImage(idx)}/>} />
        ))}
      </Slider>
    </div>
  );
};

export default HorizontalScroll;
