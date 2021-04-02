import { Paper, Card, Button } from "@material-ui/core";
import { CloudUploadTwoTone, InsertDriveFile } from "@material-ui/icons";
import React, { Component } from "react";

class UploadButton extends Component {
  state = {
    selectedFile: null,
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    console.log("uploading", this.state.selectedFile.path);
    window.api.filesApi.uploadAFile(this.state.selectedFile.path);
    window.api.filesApi
      .isFileUploaded()
      .then((fileId) => {
        if (fileId) {
          alert("upload success");
          this.props.updateUploads();
        } else {
          alert("upload failed");
        }
        this.setState({ selectedFile: null });
      })
      .catch((err) => console.log(err));
  };

  // File content to be displayed after
  // file upload is complete
  fileData = () => {
    if (this.state.selectedFile) {
      console.log(this.state.selectedFile);
      return (
        <Card className="matCard">
          <InsertDriveFile
            fontSize="large"
            style={{ marginLeft: "1%", marginRight: "1%" }}
          />
          <p style={{ marginLeft: "1%", marginRight: "1%" }}>
            {this.state.selectedFile.name}
          </p>
          <p style={{ marginLeft: "1%", marginRight: "1%" }}>
            {this.state.selectedFile.path}
          </p>
          <Button
            variant="outlined"
            startIcon={<CloudUploadTwoTone />}
            style={{
              marginLeft: "auto",
              marginRight: "1%",
              textTransform: "none",
            }}
            onClick={this.onFileUpload}
          >
            Upload
          </Button>
        </Card>
      );
    }
  };

  render() {
    return (
      <div className="showFiles">
        <Paper className="matPaper">
          <Card className="matCard">
            <p
              className="pageHeading"
              style={{ marginLeft: "1%", marginRight: "1%" }}
            >
              Upload a file
            </p>
            <div>
              <input
                id="contained-button-file"
                type="file"
                onChange={this.onFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="default" component="span" style={{textTransform:"none"}}>
                  Choose a File
                </Button>
              </label>
            </div>
          </Card>
          {this.fileData()}
        </Paper>
      </div>
    );
  }
}

export default UploadButton;
