import React, { Component } from 'react';
import ShowUploads from './components/ShowUploads';
import ShowDownloads from './components/ShowDownloads';
import Sidebar from './components/Sidebar';

class App extends Component {
  render() {
    return  <div>
      {/* <ShowDownloads/> */}
      <Sidebar/>
    </div>;
  }
}

export default App;