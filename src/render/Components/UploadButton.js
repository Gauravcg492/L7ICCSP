import { Paper, Card, Button } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { CloudUploadTwoTone, InsertDriveFile } from "@material-ui/icons";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faFileImport
} from "@fortawesome/free-solid-svg-icons";
import { SnackbarProvider, useSnackbar } from "notistack";
import FileIcon from "./FileIcon";

function Alert(props) {
  return <MuiAlert elevation={6} {...props} />;
}

function UploadButton() {

  const [loaderState, setLoaderState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: "Uploading..."
  });
  const [selectedFile, setSelectedFile] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = (props) => {
    setSelectedFile(false);
    console.log("uploading", selectedFile.path);
    setLoaderState({...loaderState,open: true})
    window.api.filesApi.uploadAFile(selectedFile.path);
    window.api.filesApi
      .isFileUploaded()
      .then((fileId) => {
        setLoaderState({...loaderState,open: false })
        if (fileId) {
          enqueueSnackbar("Upload success", { variant: "success" });
          props.updateUploads();
        } else {
          enqueueSnackbar("Upload failed", { variant: "error" });
        }
      })
      .catch((err) => console.log(err));
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (selectedFile) {
      console.log(selectedFile);
      return (
        <div className="filerowDownload">
          <FileIcon filename={selectedFile.name} />
          <div className="fileinfo">
            <p className="filename">{selectedFile.name}<br />
              <span className="filedate">{selectedFile.path}</span></p>
          </div>
          <div>
            <button className="viewFile" onClick={onFileUpload}>Upload</button>
          </div>
        </div>
      );
    }
  };

  // Drop events
  const dragOver = (e) => {
    e.preventDefault();
  }

  const dragEnter = (e) => {
    e.preventDefault();
  }

  const dragLeave = (e) => {
    e.preventDefault();
  }

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setSelectedFile(files[0])

  }

  return (
    <div>
      <div className="matCard">
        <p className="paperHeading"><FontAwesomeIcon icon={faPlus} /> Upload File</p>

      </div>
      <div className="howFiles">
        <div className="atPaper">
          <div>
            <input
              id="contained-button-file"
              type="file"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="default" component="span" style={{ textTransform: "none" }}>
                Browse File
                </Button>
            </label>
          </div>
          <div className="dndcontainer"
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
          >
            <div className="dnddrop-container">
              <div className="dnddrop-message"><FontAwesomeIcon icon={faFileImport} size='2x' /> Drag and Drop files here</div>
            </div>
          </div>
          {fileData()}
        </div>
      </div>
      <div>
        <Snackbar
          anchorOrigin={{vertical: "top", horizontal: "center" }}
          open={loaderState.open}
          key={loaderState.vertical + loaderState.horizontal}
        >
        <Alert severity="info">
          {loaderState.message}
        </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default UploadButton;
