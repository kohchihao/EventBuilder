import React, {useEffect, useState} from "react";
import {Paper, Typography, makeStyles, IconButton, Tooltip, Button} from "@material-ui/core";
import { Document, Page, pdfjs } from 'react-pdf';
import api from "../../../../src/api";
import {ChevronLeft, ChevronRight, CloudUpload, Cached} from "@material-ui/icons";
import {GetApp} from "@material-ui/icons";
import useSnackbar from "../../../snackbar/useSnackbar";
import {useDispatch, useSelector} from "react-redux";
import {setEvent} from "../../action";
import {getEvent} from "../../selectors";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const useStyles = makeStyles(() => ({
  header: {
    marginBottom: 5,
    display: "inline-block"
  },
  divider: {
    marginTop: 10,
    marginBottom: 10
  },
  paper: {
    padding: 15,
  },
  document: {
    textAlign: "center",
    width: "100%"
  },
  hidden: {
    display: "none",
  }
}));

const Quotation = (props) => {
  const event = useSelector(getEvent);
  const classes = useStyles();
  const isQuoteUploaded = !!(event && event.signed_quotation_token);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState(null);
  const [viewOriginal, setViewOriginal] = useState(!isQuoteUploaded);
  const snackbar = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    api.event.download_quotation(event.id, !viewOriginal)
      .then(response => {
        setFile(response.data);
      })
      .catch(error => {
        snackbar.showMessage(error.message);
      })
  }, [event.signed_quotation_token, event.quotation_token, viewOriginal]);

  if (!file) {
    return (
      <div></div>
    )
  }


  const onDocumentLoadSuccess = ({ numPages }) => {
    setPageNumber(1);
    setNumPages(numPages)
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file;
    link.setAttribute('download', `${event.name}_Quotation.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  const uploadFile = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const data = new FormData();
        data.append('file', file);
        api.event.upload_quotation(event.id, data)
          .then(res => {
            setViewOriginal(false);
            dispatch(setEvent(res.data));
            snackbar.showMessage("Your signed quotation has been uploaded. Give us around 1 working day to verify it!");
          })
          .catch(err => {
            snackbar.showMessage(err.message);
          })
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div style={{display: "flex", alignItems: "center", marginBottom: 10}}>
        <Typography variant="h4" className={classes.header}>{viewOriginal ? "Quotation" : "Signed Quotation"}</Typography>
        <Tooltip title={viewOriginal ? "Download Quotation" : "Download Signed Quotation"} placement="top">
          <IconButton onClick={handleDownload}>
            <GetApp/>
          </IconButton>
        </Tooltip>


        {(isQuoteUploaded && (
          <Tooltip title={viewOriginal ? "View Signed Quotation" : "View Original"} placement="top">
            <IconButton onClick={() => setViewOriginal(!viewOriginal)}>
              <Cached/>
            </IconButton>
          </Tooltip>
        ))}

        {(isQuoteUploaded && !viewOriginal) && (
          <>
            <Button
              style={{marginLeft: "auto"}}
              variant="contained"
              startIcon={<CloudUpload/>}
              component="label"
            >
              Update
              <input
                type="file"
                style={{ display: "none" }}
                accept="application/pdf"
                onChange={(e) => uploadFile(e.currentTarget.files)}
              />
            </Button>
          </>
        )}
        {!isQuoteUploaded && (
          <Button
            style={{marginLeft: "auto"}}
            variant="contained"
            color="primary"
            startIcon={<CloudUpload/>}
            component="label"
          >
            Upload Signed Quotation
            <input
              type="file"
              style={{ display: "none" }}
              accept="application/pdf"
              onChange={(e) => uploadFile(e.currentTarget.files)}
            />
          </Button>
        )}
      </div>

      <Paper className={classes.paper}>
        <Document
          className={classes.document}
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {
            Array.from(
              new Array(numPages),
              (el, index) => (
                <Page
                  className={pageNumber !== index + 1 ? `${classes.hidden}`: ''}
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                />
              ),
            )
          }
        </Document>

        <div style={{textAlign: "center"}}>
          <IconButton color="primary" disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)}>
            <ChevronLeft/>
          </IconButton>
          <p style={{display: "inline-block"}}>Page {pageNumber} of {numPages}</p>
          <IconButton color="primary" disabled={pageNumber === numPages} onClick={() => setPageNumber(pageNumber + 1)}>
            <ChevronRight/>
          </IconButton>
        </div>
      </Paper>
    </div>
  )
};

export default Quotation;
