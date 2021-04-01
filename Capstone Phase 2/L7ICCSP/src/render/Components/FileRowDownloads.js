import React from "react";
import { Card, Button } from "@material-ui/core";
import { InsertDriveFile, Delete, Launch } from "@material-ui/icons";

/**
 *
 * @param {name,id,date,deleteHandler} props
 * @returns
 */
function FileRowDownloads(props) {
  console.log("in file rows", props.name, props.id);
  const deleteFileRow = () => {
    props.deleteHandler("local", props.name);
  };

  const openFile = () => {
    window.api.filesApi.openFile(props.name);
    window.api.filesApi.isFileOpened().then((isOpened) => {
      if (!isOpened) {
        alert("Unable to open file");
      }
    });
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
        startIcon={<Delete />}
        style={{
          marginLeft: "auto",
          marginRight: "1%",
          textTransform: "none",
        }}
        onClick={deleteFileRow}
      >
        Delete
      </Button>
      <Button
        variant="outlined"
        startIcon={<Launch />}
        style={{
          marginLeft: "1%",
          marginRight: "1%",
          textTransform: "none",
        }}
        onClick={openFile}
      >
        Open
      </Button>
    </Card>
  );
}

export default FileRowDownloads;
