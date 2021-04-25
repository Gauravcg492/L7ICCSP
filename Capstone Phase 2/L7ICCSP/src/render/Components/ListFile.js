import React, { useState, useContext } from "react";
import { Paper, Card, Avatar, IconButton } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import { useSnackbar, SnackbarProvider } from 'notistack';
import FileRow from "./FileRow";
import FileRowDownloads from "./FileRowDownloads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

/**
 *
 * @param {source, title} props
 * @returns DOM Element
 */

 function Alert(props) {
  return <MuiAlert elevation={6} {...props} />;
}

const listFiles = (props) => {
  const [fileState, setfileState] = useState([]);
  const [pathState, setPathState] = useState("");

  const [loaderState, setLoaderState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: "Downloading..."
  });

  const { enqueueSnackbar } = useSnackbar();

  var pageicon = <FontAwesomeIcon icon={faUpload} />
  if (props.title == "Downloads") {
    pageicon = <FontAwesomeIcon icon={faDownload} />
  }

  const onRequestForFilesList = () => {
    console.log("fetching file-list from " + props.source);
    window.api.filesApi.fetchFiles(props.source);
    window.api.filesApi
      .getFiles()
      .then((fileObj) => {
        setfileState(fileObj);
      })
      .catch((err) => console.log(err));
  };

  const onDownloadFileFromCloud = (id, name, setLoading) => {
    setLoading(true);
    setLoaderState({...loaderState,open: true})
    console.log("requesting to download ", name, ", id: ", id);
    window.api.filesApi.downloadAFile(name, id);
    window.api.filesApi.isFileDownloaded().then((isDownloadDone) => {
      setLoaderState({...loaderState,open: false })
      if (isDownloadDone) {
      enqueueSnackbar('Verified, AUTHENTIC',{variant: 'success'});
      } else {
        enqueueSnackbar('File tampered', {variant: 'error'});
      }
      setLoading(false);
    });
  };

  const onOpenFileLocal = (name) => {
    window.api.filesApi.openFile(name);
    window.api.filesApi.isFileOpened().then((isOpened) => {
      if (!isOpened) {
        enqueueSnackbar('Open failed',{variant: 'warning'});
      }
    });
  };

  const deleteFile = (source, sourceId, setLoading) => {
    setLoading(true);
    console.log("Deleting File: ", sourceId);
    window.api.filesApi.deleteFile(source, sourceId);
    window.api.filesApi.isFileDeleted().then((isDeleted) => {
      if (isDeleted) {
        enqueueSnackbar('File deleted',{variant: 'info'});
        onRequestForFilesList();
      } else {
        enqueueSnackbar('Delete failed',{variant: 'error'});
      }
      setLoading(false);
    });
  };

  const displayFiles = () => {
    if (props.source === "upload") {
      return (
        <>
          {fileState.map((item) => {
            return (
              <React.Fragment key={item.name}>
                <FileRow
                  name={item.name}
                  id={item.id}
                  date={item.date}
                  url={item.url}
                  deleteHandler={deleteFile}
                  downloadHandler={onDownloadFileFromCloud}
                />
              </React.Fragment>
            );
          })}
        </>
      );
    } else if (props.source === "download") {
      return (
        <>
          {fileState.map((item) => {
            return (
              <React.Fragment key={item.name}>
                <FileRowDownloads
                  name={item.name}
                  id={item.id}
                  date={item.date}
                  deleteHandler={deleteFile}
                  openHandler={onOpenFileLocal}
                />
              </React.Fragment>
            );
          })}
        </>
      );
    }
  };

  if (pathState !== props.source) {
    onRequestForFilesList();
    setPathState(props.source);
  }

  return (
    <div>
      <div className="matCard">
        <p className="paperHeading">{pageicon} {props.title}</p>
        <IconButton
          style={{ marginLeft: "auto" }}
          onClick={onRequestForFilesList}
        >
          <Refresh />
        </IconButton>
      </div>
      <div className="showFiles">
        <div className="matPaper">
          {displayFiles()}
        </div>
      </div>
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
  );
};

export default listFiles;
