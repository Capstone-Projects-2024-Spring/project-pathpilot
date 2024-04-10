import React from 'react';
import './Login.css';
import PathPilotLogo from './PathPilotLogo.PNG';

const LoginWelcome = () => {
    return (
        <div className='login-welcome'>
            <img src={PathPilotLogo} alt="Path Pilot Logo" className='login-logo'></img>
        </div>
    );
};

export default LoginWelcome;