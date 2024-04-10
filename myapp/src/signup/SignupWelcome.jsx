import React from 'react';
import './Signup.css'
import PathPilotLogo from './PathPilotLogo.PNG';

const SignupWelcome = () => {
    return (
        <div className='signup-welcome'>
            <img src={PathPilotLogo} alt="Path Pilot Logo" className='signup-logo'></img>
        </div>
    );
};

export default SignupWelcome;