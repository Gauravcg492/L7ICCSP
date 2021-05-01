import React, { Component } from 'react';
import Sidebar from './components/Sidebar';
import { SnackbarProvider, useSnackbar } from "notistack";



class App extends Component {
  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <Sidebar />
      </SnackbarProvider>

    )
  }
}

export default App;