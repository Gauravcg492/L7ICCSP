import React from "react";
import { HashRouter, Link, Route, Switch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudDownloadAlt,
  faCloudUploadAlt,
  faPlusSquare,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FileRowDownloads from "./FileRowDownloads";
import ShowUploads from "./ShowUploads";
import UploadButton from "./UploadButton";
import ShowDownloads from "./ShowDownloads";

let onRequestForDownloadedFilesList = (event) => {
  console.log("fetching file-list from downloads folder");
  window.api.filesApi.fetchFiles("download");
  window.api.filesApi
    .getFiles()
    .then((fileObj) => {
      this.setState({
        downloadedFiles: fileObj,
      });
    })
    .catch((err) => console.log(err));
};

// appendAFileToDownloadsList = (fileName, fileId) => {
//     if(this.state.uploadedFiles){
//         this.state.uploadedFiles.unshift({id:fileId,name:fileName});
//     }else{
//         this.state.uploadedFiles = [{id:fileId,name:fileName}];
//     }
// };

let displayFiles = () => {
  if (this.state.downloadedFiles) {
    const fileTable = this.state.downloadedFiles.map((file) => (
      <FileRowDownloads fileName={file.name} fileId={file.id} path={""} />
    ));
    return <div>{fileTable}</div>;
  }
};

const uploader = () => {
  return <UploadButton />;
};

const uploaderFiles = () => {
  return <ShowUploads />;
};

const downloader = () => {
  return <ShowDownloads />;
};

function Sidebar() {
  return (
    <HashRouter>
      <div>
        <div className="sidenav">
          <div className="logo" style={{ padding: "20px" }}>
            <p>
              <FontAwesomeIcon icon={faExchangeAlt} />
              <b> L7ICCSP</b>
            </p>
          </div>
          <List disablePadding dense>
            <div className="navlist">
              <ListItem button>
                <Link to="/upload">
                  <FontAwesomeIcon icon={faPlusSquare} /> Upload File
                </Link>
              </ListItem>
            </div>
            <div className="navlist">
              <ListItem button>
                <Link to="/uploads">
                  <FontAwesomeIcon icon={faCloudUploadAlt} /> Uploads
                </Link>
              </ListItem>
            </div>
            <div className="navlist">
              <ListItem button>
                <Link to="/downloads">
                  <FontAwesomeIcon icon={faCloudDownloadAlt} /> Downloads
                </Link>
              </ListItem>
            </div>
          </List>
        </div>
        <div className="main">
          <Switch>
            <Route exact path="/upload" children={uploader} />
            <Route exact path="/uploads" children={uploaderFiles} />
            <Route exact path="/downloads" children={downloader} />
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
}

export default Sidebar;
