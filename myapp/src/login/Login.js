import React from 'react';
import UserInput from './UserInput.jsx'
import LoginWelcome from './LoginWelcome.jsx';
import './Login.css';

const Login = () => {
    return(
        <div className='main-login'>
        <div className="login-parent-container">
            <div className='login-parent'>
                <LoginWelcome />
                <UserInput />
            </div>
        </div>
        </div>
    );
}

export default Login;