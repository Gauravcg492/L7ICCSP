import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCloudDownloadAlt, faCloudUploadAlt, faCoffee, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

function SideBar({ goToPage }) {
    console.log("sidebar function");
    return (
        <div className="sidenav">
            <div className="logo" style={{ padding: "20px" }}>
                <p><FontAwesomeIcon icon={faCheckCircle} /> L7ICCSP</p>
            </div>
            <div className="navlist" onClick={() => {goToPage("uploadFilesFromLocal")}}>
                <a><FontAwesomeIcon icon={faPlusSquare} /> Upload file</a>
            </div>
            <div className="navlist" onClick={() => {goToPage("uploads")}}>
                <a><FontAwesomeIcon icon={faCloudUploadAlt} /> Uploads</a>
            </div>
            <div className="navlist" onClick={() => {goToPage("downloads")}}>
                <a><FontAwesomeIcon icon={faCloudDownloadAlt} /> Downloads</a>
            </div>
        </div>
    );

}

export default SideBar;
