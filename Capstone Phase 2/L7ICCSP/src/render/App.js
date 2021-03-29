import React, { Component } from 'react';
import ShowUploads from './components/ShowUploads';
import ShowDownloads from './components/ShowDownloads';
import Sidebar from './components/Sidebar';
import UploadButton from './components/UploadButton';

class App extends Component {
  render() {
    return  (
    <div id='header'>
      <div>
        <Sidebar/>
      </div>
    </div>);
  }
}

export default App;