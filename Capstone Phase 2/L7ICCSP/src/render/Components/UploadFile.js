import React, { useState } from 'react';

function UploadFile() {

    console.log("in upload a file page");
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };

    // On file upload (click the upload button)
    const onFileUpload = () => {
        console.log("uploading", selectedFile.path);
        window.api.filesApi.uploadAFile(selectedFile.path);
        window.api.filesApi.isFileUploaded().then((fileId) => {
            if (fileId) {
                alert("upload success");


            } else {
                alert("upload failed");
            }
            setSelectedFile(null);
        })
            .catch((err) => console.log(err));

    };

    // File content to be displayed after
    // file upload is complete
    const fileData = () => {

        if (selectedFile) {
            console.log(selectedFile);
            return (
                <div>
                    <p></p>
                        {/* <h2>File Details:</h2>

                        <p>File Name: {selectedFile.name}</p>
                        <p>File Type: {selectedFile.type}</p>
                        <p>File Path: {selectedFile.path}</p>
                        <p>
                            Last Modified:{" "}
                            {selectedFile.lastModifiedDate.toDateString()}
                        </p> */}

                        <table >
                            <tr>
                                <th>Filename</th>
                                <td>{selectedFile.name}</td>
                            </tr>
                            <tr>
                                <th>Path</th>
                                <td>{selectedFile.path}</td>
                            </tr>
                        </table>

                    <div>
                        <button onClick={onFileUpload}>
                            Upload!
            </button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="uploadFilePage">
            <p className="pageHeading">Upload a file</p>
            <input type="file" onChange={onFileChange} />
            {fileData()}
        </div>
    );
}




export default UploadFile;