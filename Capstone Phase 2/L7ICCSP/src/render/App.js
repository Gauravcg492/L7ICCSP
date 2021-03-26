import React, {useState} from 'react';
import ShowDownloads from './Components/ShowDownloads';
import SideBar from './Components/Sidebar';
import UploadFile from './Components/UploadFile';

function App(){
  const [pageComponent, setPageComponent] = useState(<UploadFile/>);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [dowloadedFiles, setDownloadedFiles] = useState([]);

  const loadUploadsPage = () => {
    console.log('fetching file-list from cloud');
        window.api.filesApi.fetchFiles('upload');
        window.api.filesApi.getFiles().then((fileObj) => {
        setUploadedFiles(fileObj);
        }).catch((err) => console.log(err));
  }

  const loadDownloadsPage = () => {
    console.log('fetching file-list from downloads folder');
    window.api.filesApi.fetchFiles('download');
    window.api.filesApi.getFiles().then((fileObj) => {
        setDownloadedFiles(fileObj)
    }).catch((err) => console.log(err));
  }

  const pageSetterWrapper = (toLoad) =>{
    console.log("request to load",toLoad)
    switch(toLoad){
      case "uploads":
        console.log("page set to uploads");
        break;
      
      case "downloads":
        console.log("page set to downloads");
        setPageComponent(<ShowDownloads/>);
        break;

      case "uploadFilesFromLocal":
        console.log("page set to uploadFilesFromLocal");
        setPageComponent(<UploadFile/>);
        break;
    }
  }

  return(
    <div>
    <SideBar goToPage={pageSetterWrapper}/>
    <div className="main">{pageComponent}</div>
    </div>
  );

}

export default App;