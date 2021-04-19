import React, { useState } from "react";
import { Card, Button, CircularProgress } from "@material-ui/core";
import {
  InsertDriveFile,
  Delete,
  CloudDownloadTwoTone,
} from "@material-ui/icons";
import FileIcon from "./FileIcon"

/**
 *
 * @param {name,id,date,url,deleteHandler,downloadHandler} props
 * @returns
 */
// TODO alignment of content in each card
const fileRow = (props) => {
  const [loading, setLoading] = useState(false);

  const downloadFile = () => {
      props.downloadHandler(props.id, props.name, setLoading);
  }

  const deleteFileRow = () => {
    props.deleteHandler("drive", props.id, setLoading);
  };

  return (
    // <Card className="matCard">
    //   <InsertDriveFile
    //     fontSize="large"
    //     style={{ marginLeft: "1%", marginRight: "1%" }}
    //   />
    //   <p style={{ marginLeft: "1%", marginRight: "1%" }}>{props.name}</p>
    //   <p style={{ marginLeft: "1%", marginRight: "1%" }}>{props.date}</p>
    //   <Button
    //     variant="outlined"
    //     color="primary"
    //     href={props.url}
    //     target="_blank"
    //     style={{
    //       marginLeft: "auto",
    //       marginRight: "1%",
    //       textTransform: "none",
    //     }}
    //   >
    //     Open In Drive
    //   </Button>
    //   <Button
    //     variant="outlined"
    //     startIcon={<Delete />}
    //     style={{
    //       marginLeft: "1%",
    //       marginRight: "1%",
    //       textTransform: "none",
    //     }}
    //     onClick={deleteFileRow}
    //   >
    //     Delete
    //   </Button>
    //   <Button
    //     variant="outlined"
    //     startIcon={<CloudDownloadTwoTone />}
    //     style={{
    //       marginLeft: "1%",
    //       marginRight: "1%",
    //       textTransform: "none",
    //     }}
    //     disabled={loading}
    //     onClick={downloadFile}
    //   >
    //     Download
    //   </Button>
    //   {loading && <CircularProgress size={24} style={{marginLeft:'1%', marginRight:'1%'}} />}
    // </Card>
    <div className="filerowDownload">
      <FileIcon filename={props.name}/>
      <div className="fileinfo">
        <p className="filename">{props.name}<br/>
        <span className="filedate">{props.date}</span></p>
      </div>
      <div>
      <button onClick={downloadFile}><Launch/></button>
      <button onClick={deleteFileRow}><Delete/></button>
      <button href={props.url}><CloudDownloadTwoTone /></button>
      </div>
    </div>
  );
};

export default fileRow;
