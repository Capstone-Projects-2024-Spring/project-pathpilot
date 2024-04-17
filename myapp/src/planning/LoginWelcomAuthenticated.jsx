import React, {useState, useEffect} from 'react';
import { FetchAccountInfo } from '../login/FetchAccountInfo.js';
import { Link } from 'react-router-dom';
import './PathPlanning.css';


const LoginWelcomeAuthenticated = () => {
    return (
        <div className='input-padding'>
            <div className='login-explanation'>
                Welcome back {localStorage.getItem("username")} to Path Pilot!
            </div>
       </div>
    );
};

export default LoginWelcomeAuthenticated;