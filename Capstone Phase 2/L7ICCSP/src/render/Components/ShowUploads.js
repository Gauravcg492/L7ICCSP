import React, {Component} from 'react';
import FileRow from './FileRow';

class ShowUploads extends Component {
    constructor(props) {
        super(props);
        this.state = { uploadedFiles: null };
      }

    onRequestForUploadedFilesList = () => {
        console.log('fetching file-list from cloud');
        window.api.filesApi.fetchFiles('upload');
        window.api.filesApi.getFiles().then((fileObj) => {
        this.setState({
            uploadedFiles: fileObj
        })
        }).catch((err) => console.log(err));
    };

    //  appendAFileToUploadsList(fileName, fileId){
    //      console.log("request to append a file to uploads",fileName,fileId);
    //     if(this.state.uploadedFiles){
    //         this.setState(
    //         { uploadedFiles: this.state.uploadedFiles.unshift({id:fileId,name:fileName})});
    //     }else{
    //         this.state.uploadedFiles = [{id:fileId,name:fileName}];
    //     }
    // };

    displayFiles = () => {
        if(this.state.uploadedFiles){
            const fileTable = this.state.uploadedFiles.map(file => <FileRow fileName={file.name} fileId={file.id} updateDownloads = {this.props.updateDownloads} />)
            return  <div>{fileTable}</div>;
        }
    };

      render(){  return(
         
            <div>
            <button onClick={this.onRequestForUploadedFilesList}>Show Uploads</button>
            {this.displayFiles()}
            </div>
        
        );
    }
}

export default ShowUploads;