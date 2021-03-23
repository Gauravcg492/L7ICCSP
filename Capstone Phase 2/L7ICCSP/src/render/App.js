
import React, { Component } from 'react';
// import FileView from './FileView';
import FileInfoComponent from './listOfFiles';


class App extends Component {
  constructor(props) {
    super(props);
    this.showDownloads = this.showDownloads.bind(this);
    this.showUploads = this.showUploads.bind(this);
  }
  showDownloads() {
    console.log('Click happened');
  }
  showUploads() {
    console.log('Click happened');
    window.api.filesApi.fetchFiles('upload');
    window.api.filesApi.getFiles().then((fileObj) => {
      console.log(fileObj);
    }).catch((err) => console.log(err));
  }
  render() {
    return  <div>
    <button onClick={this.showUploads}>Show Uploads</button>
    <br/><br/>
    <button onClick={this.showDownloads}>Show Downloads</button>
    <br/><br/>
    <FileInfoComponent/>
    </div>;
  }
}

export default App;