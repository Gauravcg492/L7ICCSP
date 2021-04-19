import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileWord,
    faFilePdf,
    faFilePowerpoint,
    faFileExcel,
    faFileVideo,
    faFileAudio,
    faFileImage,
    faFileAlt
} from "@fortawesome/free-solid-svg-icons";

function FileIcon({filename}){
    var fileicon = faFileAlt
    var colour = "black"
    if(filename.endsWith(".doc")||filename.endsWith(".docx")){
        fileicon=faFileWord
        colour="blue"
    }else if(filename.endsWith(".xlsb")||filename.endsWith(".xlsx")){
        fileicon=faFileExcel
        colour="green"
    }else if(filename.endsWith(".jpeg")||filename.endsWith(".jpg")||filename.endsWith("png")){
        fileicon=faFileImage
        colour="red"
    }else if(filename.endsWith(".pdf")){
        fileicon=faFilePdf
        colour="red"
    }else if(filename.endsWith(".ppt")||filename.endsWith(".pptx")){
        fileicon=faFilePowerpoint
        colour="orange"
    }else if(filename.endsWith(".mp3")||filename.endsWith(".wav")){
        fileicon=faFileAudio
        colour="black"
    }else if(filename.endsWith(".mp4")||filename.endsWith(".avi")||filename.endsWith(".mkv")){
        fileicon=faFileVideo
        colour="yellow"
    }
    return(
        <div style={{padding:'5px'}}>
        <FontAwesomeIcon icon={fileicon} color={colour} size='2x'/>
        </div>
    )
}

export default FileIcon;