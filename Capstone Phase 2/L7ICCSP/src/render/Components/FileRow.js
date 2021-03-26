import React,{component} from 'react';

function FileRow({fileName, fileId, updateDownloads, icon}){
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

    // const downloadButtonStyle = {
    //   background: "linear-gradient(-135deg, #1de9b6 0%, #1dc4e9 100%)",
    //   padding: "5px",
    //   margin: "10px"
    // };

    const fileRowStyle = {
      width: "50px",
      background: "#faaaafa",
      border: "black"
    }
    return(
            <tr className="filerow" style={fileRowStyle} key = {fileId}>
            <td><img  style={{width: '40px'}} src={icon} alt="activity-user"/></td>
            <td>
                <h6 className="mb-1">{fileName}</h6>
                
            </td>
            <td>
                <h6 className="text-muted"><i className="fa fa-circle text-c-green f-10 m-r-15"/>HH:MM DD-MM-YYYY</h6>
            </td>
            <td><button className="label theme-bg2 text-white f-12">Delete</button><button onClick={onDownloadFileFromCloud} className="label theme-bg text-white f-12">Download</button></td>
        </tr>
            );
    }

export default FileRow;