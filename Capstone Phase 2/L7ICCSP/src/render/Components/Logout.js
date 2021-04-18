import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function Logout(){
    const logoutApp = () => {
        window.api.loginApi.doLogout();
    }
    return(
        <button className="logout" onClick={logoutApp}><FontAwesomeIcon icon={faSignOutAlt}/>logout</button>
    )
}

export default Logout;