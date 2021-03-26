import React,{component} from 'react';

function FileRowDownloads({fileName, path, fileId}){
    return(
        <tr key = {fileId}>
            <td>{fileName}</td>
            <td>{" >>>> "}</td>
            <td><button className="fileRowDownloadButton" >Open</button></td>
        </tr>
    )
}

export default FileRowDownloads;