import React from 'react';
import {HashRouter,Link,Route,Switch} from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FileRowDownloads from './FileRowDownloads';
import ShowUploads from './ShowUploads';
import UploadButton from './UploadButton';
import ShowDownloads from './ShowDownloads';

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

const uploader = ()=>{
  return(
    <body>
      <h1>Upload Files</h1>
      <UploadButton/>
    </body>
  )
};

const uploaderFiles = ()=>{
  return(
    <body>
      <h1>Uploaded Files</h1>
      <ShowUploads/>
    </body>
  )
};

const downloader = ()=>{
  return(
    <body>
      <h1>Uploaded Files</h1>
      <ShowDownloads/>
    </body>
  )
}

function Sidebar() {
  return (
    <HashRouter>
      <div>
        <div className='sidenav'>
            <h1><p><i className="fa fa-exchange" aria-hidden="true"></i>   <b className='logo'>L7ICCSP</b></p></h1>
            <List disablePadding dense>
              <ListItem button>
                <Link to="/upload">Upload File</Link>
              </ListItem>
              <ListItem button>
                <Link to="/uploads">Uploads</Link>
              </ListItem>
              <ListItem button>
                <Link to="/downloads">Downloads</Link>
              </ListItem>
            </List>
            <Switch>
              <Route exact path="/upload" component={uploader}/>
              <Route exact path="/uploads" component={uploaderFiles}/>
              <Route exact path="/downloads" component={downloader}/>
            </Switch> 
        </div>
      </div>
    </HashRouter>
  );
}

export default Sidebar;