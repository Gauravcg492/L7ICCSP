import React, { Component } from 'react';
import ShowUploads from './components/ShowUploads';
import ShowDownloads from './components/ShowDownloads';
import Sidebar from './components/Sidebar';
import UploadButton from './components/UploadButton';
import LoadLoginPage from './Components/Login';

class App extends Component {
  render() {
    return  (
    <div>
        <LoadLoginPage/>
    </div>);
  }
}

export default App;