import React, { useState } from 'react';
import { HashRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";

import { Icon, InlineIcon } from '@iconify/react';
import googleDrive from '@iconify-icons/mdi/google-drive';

function HomeScreen() {
    return (
        <div>
            <div className="logoMega">
                <p>
                    <FontAwesomeIcon icon={faExchangeAlt} />
                    <b> L7ICCSP</b>
                </p>
            </div>
            <br />
            <div>
                <button><Icon icon={googleDrive} /> Google Drive</button>
            </div>
        </div>
    )
}

export default HomeScreen;