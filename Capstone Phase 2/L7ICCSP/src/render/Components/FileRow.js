import React, { useState } from "react";

import {
  Delete,
  Visibility
} from "@material-ui/icons";
import FileIcon from "./FileIcon";


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
    console.log("deleting file from cloud")
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
      {/* <button href={props.url}><Visibility/></button> */}
      <button className="viewFile" onClick={downloadFile}>Download</button>
      <button className="deleteButton"onClick={deleteFileRow}>Delete</button>
      </div>
    </div>
  );
};

export default fileRow;
