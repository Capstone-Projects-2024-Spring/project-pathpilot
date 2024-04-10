import React, {useState, useEffect} from 'react';
import { FetchAccountInfo } from './FetchAccountInfo.js';
import { Link } from 'react-router-dom';


const UserInput = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const submitButtonEnabled = username.length > 0 && password.length > 0;

    const sendAccountToBackend = async () => {
        console.log("username: "+ username);
        console.log("password: "+ password);
        try{
            const accountResponse = await FetchAccountInfo(username, password);
            console.log(accountResponse);
        } catch {
            console.log("ERROR")
        }
    }


    return (
        <div>
            <div className='input-field'>
                <div className='input-label'>Username</div>
                <input onChange = {e => setUsername(e.target.value)} placeholder='Username' className='login-input'></input>
            </div>
            <div className='input-field'>
                <div className='input-label'>Password</div>
                <input onChange = {e => setPassword(e.target.value)} placeholder='Password' className='login-input'></input>
            </div>
            <div className='login-submit-container'>
                <button disabled={!submitButtonEnabled} onClick={sendAccountToBackend} className='login-submit'>Submit</button>
            </div>
            <div className='login-redirect-text'>
                <Link className='guest-link' to='/planning'>Sign in as guest</Link>
                <br></br>
                <br></br>
                <Link className='guest-link' to='/signup'>Don't have an account, sign up here</Link>
            </div>
            <div className='login-explanation'>
                Log into Path Pilot to start saving and viewing your favorite routes
            </div>
       </div>
    );
};

export default UserInput;