import React from "react";
import { HashRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudDownloadAlt,
  faCloudUploadAlt,
  faPlusSquare,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { List, ListItem } from "@material-ui/core";
import UploadButton from "./UploadButton";
import ListFiles from "./ListFile";

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

const loginPage = () => {
  return <LoadLoginPage/>;
}

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
            <Route exact path="/">
              <Redirect to="/upload" />
            </Route>
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
