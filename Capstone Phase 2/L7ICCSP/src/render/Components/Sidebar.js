import React from "react";
import { HashRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faPlus,
  faExchangeAlt,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { List, ListItem } from "@material-ui/core";
import UploadButton from "./UploadButton";
import ListFiles from "./ListFile";
import Logout from "./Logout";

const uploader = () => {
  return <UploadButton />;
  //   return <ListFile source="upload" title="Uploads" />;
};

const uploaderFiles = () => {
  //   return <ShowUploads />;
  return <ListFiles source="upload" title="Uploads" />;
};

const downloader = () => {
  return <ListFiles source="download" title="Downloads" />;
};


function Sidebar() {
  return (
    <HashRouter>
      <div className="sidenav">
        <div className="logo">
          <p>
            <FontAwesomeIcon icon={faExchangeAlt} />
            <b> L7ICCSP</b>
            {/* <span>       File Integrity Check Platform</span> */}
          </p>
        </div>
        <div className="navlist">
          <div className="navlistitem">
              <Link to="/upload">
                <FontAwesomeIcon icon={faPlus} /> Upload File
                </Link>
          </div>
          <div className="navlistitem">
              <Link to="/uploads">
                <FontAwesomeIcon icon={faUpload} /> Uploads
                </Link>
          </div>
          <div className="navlistitem">
            <Link to="/downloads">
              <FontAwesomeIcon icon={faDownload} /> Downloads
                </Link>
          </div>
        </div>
      </div>
      <div className="main">
        <Switch>
          <Route exact path="/">
            <Redirect to="/upload" />
          </Route>
          <Route exact path="/upload" children={uploader} />
          <Route exact path="/uploads" children={uploaderFiles} />
          <Route exact path="/downloads" children={downloader} />
        </Switch>
        <Logout />
      </div>
    </HashRouter>
  );
}

export default Sidebar;
