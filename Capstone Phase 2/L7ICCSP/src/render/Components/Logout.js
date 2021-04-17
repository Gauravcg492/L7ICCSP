import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function Logout(){
    return(
        <button className="logout"><FontAwesomeIcon icon={faSignOutAlt}/>logout</button>
    )
}

export default Logout;