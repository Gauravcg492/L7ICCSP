import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FileRowDownloads from './FileRowDownloads';
import ShowUploads from './ShowUploads';

let onRequestForDownloadedFilesList = event => {
    console.log('fetching file-list from downloads folder');
    window.api.filesApi.fetchFiles('download');
    window.api.filesApi.getFiles().then((fileObj) => {
    this.setState({
        downloadedFiles: fileObj
    })
    }).catch((err) => console.log(err));
};

// appendAFileToDownloadsList = (fileName, fileId) => {
//     if(this.state.uploadedFiles){
//         this.state.uploadedFiles.unshift({id:fileId,name:fileName});
//     }else{
//         this.state.uploadedFiles = [{id:fileId,name:fileName}];
//     }
// };

let displayFiles = () => {
    if(this.state.downloadedFiles){
        const fileTable = this.state.downloadedFiles.map(file => <FileRowDownloads fileName={file.name} fileId={file.id} path={""}/>)
        return  <div>{fileTable}</div>;
    }
};

function Sidebar() {
  return (
    <div className='sidenav'>
        <h1><p><i class="fa fa-exchange" aria-hidden="true"></i>   <b className='logo'>L7ICCSP</b></p></h1>
        <List disablePadding dense>
          <ListItem button>
            <ListItemText>Upload File</ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemText>Uploads</ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemText>Downloads</ListItemText>
          </ListItem>
        </List>
    </div>
  );
}

export default Sidebar;