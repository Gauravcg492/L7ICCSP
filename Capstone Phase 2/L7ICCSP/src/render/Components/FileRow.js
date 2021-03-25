import React,{component} from 'react';

function FileRow({fileName, fileId, updateDownloads}){
    const onDownloadFileFromCloud = () => {
        console.log("requesting to download ",fileName, ", id: ",fileId);
        window.api.filesApi.downloadAFile(fileName,fileId);
        window.api.filesApi.isFileDownloaded().then((isDownloadDone) => {
          if(isDownloadDone){
            alert("verified, AUTHENTIC :)");
            updateDownloads();
          }else{
            alert("download failed");
          }
        })
        .catch((err) => console.log(err));
    };
    console.log("in file rows",fileName, fileId)
    return(
        <tr key = {fileId}>
            <td>{fileName}</td>
            <td>{" >>>> "}</td>
            <td><button onClick={onDownloadFileFromCloud} className="fileRowDownloadButton" key={fileId} >Download</button></td>
        </tr>
    )
}

export default FileRow;