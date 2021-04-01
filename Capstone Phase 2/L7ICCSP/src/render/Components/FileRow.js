import React from "react";
import { Card, Button } from "@material-ui/core";
import {
  InsertDriveFile,
  Delete,
  CloudDownloadTwoTone,
} from "@material-ui/icons";

/**
 *
 * @param {name,id,date,url} props
 * @returns
 */
// TODO alignment of content in each card
const fileRow = (props) => {
  const onDownloadFileFromCloud = () => {
    console.log("requesting to download ", props.name, ", id: ", props.id);
    window.api.filesApi.downloadAFile(props.name, props.id);
    window.api.filesApi
      .isFileDownloaded()
      .then((isDownloadDone) => {
        if (isDownloadDone) {
          alert("verified, AUTHENTIC :)");
        } else {
          alert("download failed");
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteFileRow = () => {
    props.deleteHandler("drive", props.id);
  };

  return (
    <Card className="matCard">
      <InsertDriveFile
        fontSize="large"
        style={{ marginLeft: "1%", marginRight: "1%" }}
      />
      <p style={{ marginLeft: "1%", marginRight: "1%" }}>{props.name}</p>
      <p style={{ marginLeft: "1%", marginRight: "1%" }}>{props.date}</p>
      <Button
        variant="outlined"
        color="primary"
        href={props.url}
        target="_blank"
        style={{
          marginLeft: "auto",
          marginRight: "1%",
          textTransform: "none",
        }}
      >
        Open In Drive
      </Button>
      <Button
        variant="outlined"
        startIcon={<Delete />}
        style={{
          marginLeft: "1%",
          marginRight: "1%",
          textTransform: "none",
        }}
        onClick={deleteFileRow}
      >
        Delete
      </Button>
      <Button
        variant="outlined"
        startIcon={<CloudDownloadTwoTone />}
        style={{
          marginLeft: "1%",
          marginRight: "1%",
          textTransform: "none",
        }}
        onClick={onDownloadFileFromCloud}
      >
        Download
      </Button>
    </Card>
  );
};

export default fileRow;
