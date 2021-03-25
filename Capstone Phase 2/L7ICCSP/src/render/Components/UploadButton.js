import React,{ Component } from "react";

class UploadButton extends Component {
        state = {
          selectedFile: null
        };
        
        onFileChange = event => {
          this.setState({ selectedFile: event.target.files[0] });
        };

        // On file upload (click the upload button)
        onFileUpload = () => {
        console.log("uploading",this.state.selectedFile.path);
        window.api.filesApi.uploadAFile(this.state.selectedFile.path);
        window.api.filesApi.isFileUploaded().then((fileId) => {
          if(fileId){
            alert("upload success");
            this.props.updateUploads();
          
          }else{
            alert("upload failed");
          }
          this.setState({selectedFile: null});
        })
        .catch((err) => console.log(err));
    
        };
        
        // File content to be displayed after
        // file upload is complete
        fileData = () => {
        
          if (this.state.selectedFile) {
            console.log(this.state.selectedFile);
            return (
                <div>
              <div>
                <h2>File Details:</h2>
                 
                <p>File Name: {this.state.selectedFile.name}</p>
                <p>File Type: {this.state.selectedFile.type}</p>
                <p>File Path: {this.state.selectedFile.path}</p>
                <p>
                  Last Modified:{" "}
                  {this.state.selectedFile.lastModifiedDate.toDateString()}
                </p>
      
              </div>
              <div>
              <button onClick={this.onFileUpload}>
                Upload!
              </button>
          </div>
          </div>
            );
          } 
        };
        
        render() {
        
          return (
            <div>
              <input type="file" onChange={this.onFileChange} />
              {this.fileData()}
            </div>
          );
        }
      }

export default UploadButton;