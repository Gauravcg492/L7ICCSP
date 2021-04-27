import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSignOutAlt,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";

function Logout() {
    const logoutApp = () => {
        window.api.loginApi.doLogout();
    }

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");


    if (!username) {
        window.api.loginApi.requestUserInfo();
        window.api.loginApi.receiveUserInfo().then(
            (userinfo) => {
                console.log(userinfo['displayName'])
                console.log(userinfo['emailAddress'])
                setUsername(userinfo['displayName'])
                setEmail(userinfo['emailAddress'])
            }
        );
    }



    return (
        // <button className="logout" onClick={logoutApp}><FontAwesomeIcon icon={faSignOutAlt}/>logout</button>

        <div className="userinfocontainer">
            {/* <FontAwesomeIcon icon={faUserCircle} size='3x' /> */}
            <p className="filename" style={{margin:"3px"}}>{username}</p><span className="filedate">{email}</span><br/>
            <button className="logout" onClick={logoutApp}><FontAwesomeIcon icon={faSignOutAlt}/>logout</button>
        </div>

    )
}

export default Logout;