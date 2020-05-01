import React from "react";
import Link from "next/link";
import HorizontalScroll from "../components/lib/HorizontalScroll";
import { useTheme } from "@material-ui/styles";
import {
  Typography,
  useMediaQuery,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button
} from "@material-ui/core";
import ServiceCards from "./serviceCards";
import {useSelector} from "react-redux";
import { getPax, getDuration } from "../components/browse/selectors";

const PackageDetails = props => {
  const theme = useTheme();
  const { selectedPackage, open, handleClose } = props;
  const pax = useSelector(getPax)
  const duration = useSelector(getDuration)
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))

  if (selectedPackage) {
    return (
      <Dialog
        fullWidth
        fullScreen={mobile}
        maxWidth={"md"}
        open={open}
        onClose={() => {
          handleClose();
        }}
        scroll={"paper"}
      >
        <DialogTitle id="scroll-dialog-title">
          {selectedPackage.name}
        </DialogTitle>
        <DialogContent dividers>
          <HorizontalScroll urls={selectedPackage.images.map(e => e.url)} />
          <DialogContentText>
            <b>Description:</b> <br />
            {selectedPackage.description} <br /><br />
            Accomodates up to <b>{Number(selectedPackage.pax).toLocaleString()} person</b> <br /><br/>
            Duration: <b>{parseInt(selectedPackage.duration)} hours</b> <br />
            <br />
            <b>Included Services:</b>
          </DialogContentText>{" "}
          <hr />
          <ServiceCards
            serviceList={selectedPackage.curated_agreements.map(
              agreement => agreement.service
            )}
          />
        </DialogContent>
        <DialogActions>
          <Typography>Starting from ${Number(selectedPackage.price).toLocaleString()}</Typography>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <a
            href={`/build?package=${selectedPackage.id}&attendees=${pax}&duration=${duration}`}
          >
            <Button color="primary" size="large" variant="contained">
              Build This!
            </Button>
          </a>
        </DialogActions>
      </Dialog>
    );
  } else {
    return null;
  }
};
export default PackageDetails;
