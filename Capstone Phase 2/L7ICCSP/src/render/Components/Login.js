// import { Button, TextField } from "@material-ui/core";
// import React, { useState } from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUpload,
//   faExchangeAlt,
//   faCaretRight,
// } from "@fortawesome/free-solid-svg-icons";

// import { Icon, InlineIcon } from '@iconify/react';
// import googleDrive from '@iconify-icons/mdi/google-drive';

// function LoadLoginPage() {

//   const [accesstoken, setAccessToken] = useState();

//   const oauthPrompt = () => {
//     console.log("request backend for auth url");
//     window.api.loginApi.requestLoginUrl();
//   }

//   const storeAccessToken = (event) => {
//     if (accesstoken) {
//       console.log("access_token received ", accesstoken);
//       window.api.loginApi.sendAccessToken(accesstoken);
//     }
//   }

//   const updateAccessToken = (event) => {
//     setAccessToken(event.target.value);
//   }

//   return (
//     <div>
//       <div className="logoMega">
//         <p>
//           <FontAwesomeIcon icon={faExchangeAlt} />
//           <b> L7ICCSP</b>
//         </p>
//       </div>
//       <br />
//       <div className="loginDiv">
//         <button className="loginDiv_access" onClick={oauthPrompt}><Icon icon={googleDrive} /> Grant Access to Google Drive</button>
//         <br />
//         <p>Paste access token below</p>
//         <input className="inputBox" onChange={updateAccessToken} />
//         <button className="loginDiv_submit" onClick={storeAccessToken}> <FontAwesomeIcon icon={faCaretRight} /> </button>
//       </div>
//     </div>
//   );
// }

// export default LoadLoginPage;

function oauthPrompt(){
    console.log("request backend for auth url");
    window.api.loginApi.requestLoginUrl();
}

function storeAccessToken(){
  var accesstoken = document.getElementById("accesstokeninput").value;
      if (accesstoken) {
        console.log("access_token received ", accesstoken);
        window.api.loginApi.sendAccessToken(accesstoken);
      }
    }