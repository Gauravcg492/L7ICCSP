import { Button, TextField } from "@material-ui/core";
import React, {useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faExchangeAlt,
  } from "@fortawesome/free-solid-svg-icons";

function LoadLoginPage(){

    const [accesstoken, setAccessToken] = useState();

    const oauthPrompt = () => {
    console.log("request backend for auth url");
    window.api.loginApi.requestLoginUrl();
    }

    const storeAccessToken = (event) => {
        if(accesstoken){
        console.log("access_token received ",accesstoken);
        window.api.loginApi.sendAccessToken(accesstoken);
        }
    }

    const updateAccessToken = (event) => {
        setAccessToken(event.target.value);
    }

    return(
        <div>
            <div className="logo" style={{ padding: "20px" }}>
            <p>
              <FontAwesomeIcon icon={faExchangeAlt} />
              <b> L7ICCSP</b>
            </p>
          </div>
          <br/>
          <p>Follow the link to provide access</p>
            <Button onClick={oauthPrompt}><FontAwesomeIcon icon={faUpload} />Grant Access</Button>
            <br/>
            <p>Paste the access token here</p>
            <TextField id="outlined-basic" label="Access Token" variant="outlined" onChange={updateAccessToken} />
            <Button onClick={storeAccessToken}>Submit</Button>
        </div>
    );
}

export default LoadLoginPage;