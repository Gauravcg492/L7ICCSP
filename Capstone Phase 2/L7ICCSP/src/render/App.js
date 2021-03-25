import React, { Component } from 'react';
import ShowUploads from './Components/ShowUploads';
import ShowDownloads from './Components/ShowDownloads';

class App extends Component {
  render() {
    return  <div>
      <ShowDownloads/>

    </div>;
  }
}

export default App;