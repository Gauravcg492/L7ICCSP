import React, {Component, component} from 'react';
import FileRowDownloads from './FileRowDownloads';
import ShowUploads from './ShowUploads';

class ShowDownloads extends Component {
    state = {
        downloadedFiles: null
    };

    onRequestForDownloadedFilesList = event => {
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

    displayFiles = () => {
        if(this.state.downloadedFiles){
            const fileTable = this.state.downloadedFiles.map(file => <FileRowDownloads fileName={file.name} fileId={file.id} path={""}/>)
            return  <div>{fileTable}</div>;
        }
    };

      render(){  return(
         
            <div>
            <ShowUploads updateDownloads = {this.onRequestForDownloadedFilesList}/>
            <br/><br/>
            <button onClick={this.onRequestForDownloadedFilesList}>Show Downloads</button>
            {this.displayFiles()}
            </div>
        
        );
    }
}

export default ShowDownloads;