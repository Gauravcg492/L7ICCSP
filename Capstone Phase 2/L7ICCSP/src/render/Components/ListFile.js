import React, { useState } from "react";
import { Paper, Card, Avatar, IconButton } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import FileRow from "./FileRow";
import FileRowDownloads from "./FileRowDownloads";

/**
 *
 * @param {source, title} props
 * @returns DOM Element
 */
const listFiles = (props) => {
  const [fileState, setfileState] = useState([]);
  const [pathState, setPathState] = useState("");

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

  const deleteFile = (source, sourceId) => {
    console.log("Deleting File: ", name);
    window.api.filesApi.deleteFile(source, sourceId);
    window.api.filesApi.isFileDeleted().then((isDeleted) => {
        if(isDeleted) {
            onRequestForFilesList();
        }
    })
  }

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
                />
              </React.Fragment>
            );
          })}
        </>
      );
    }
  };

  if(pathState !== props.source) {
      onRequestForFilesList();
      setPathState(props.source);
  }

  return (
    <div className="showFiles">
      <Paper className="matPaper">
        <Card className="matCard">
          <Avatar style={{ marginLeft: "1%", marginRight: "1%" }}>
            {props.title[0]}
          </Avatar>
          <p className="paperHeading">{props.title}</p>
          <IconButton
            style={{ marginLeft: "auto" }}
            onClick={onRequestForFilesList}
          >
            <Refresh />
          </IconButton>
        </Card>
        {displayFiles()}
      </Paper>
    </div>
  );
};

export default listFiles;
