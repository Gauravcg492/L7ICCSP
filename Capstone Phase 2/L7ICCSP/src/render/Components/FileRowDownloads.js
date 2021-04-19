import React from "react";
import { Card, Button } from "@material-ui/core";
import { InsertDriveFile, Delete, Launch } from "@material-ui/icons";

import FileIcon from "./FileIcon"
/**
 *
 * @param {name,id,date,deleteHandler,openHandler} props
 * @returns
 */
function FileRowDownloads(props) {
  console.log("in file rows", props.name, props.id);
  const deleteFileRow = () => {
    props.deleteHandler("local", props.name, (_)=>{});
  };

  const openFile = () => {
    props.openHandler(props.name);
  };
  return (
    <div className="filerowDownload">
      <FileIcon filename={props.name}/>
      <div className="fileinfo">
        <p className="filename">{props.name}<br/> 
        <span className="filedate">{props.date}</span></p>
      </div>
      <div>
      <button onClick={deleteFileRow}><Delete/></button>
      <button onClick={openFile}><Launch/></button>
      </div>
    </div>
  );
}

export default FileRowDownloads;
