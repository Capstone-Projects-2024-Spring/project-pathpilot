import React, {useState, useEffect} from 'react';
import { CreateUserAccount } from './CreateUserAccount.js';
import { Link } from 'react-router-dom'


const UserInput = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const submitButtonEnabled = username.length > 0 && password.length > 0 && email.length > 0 && password===confirmPassword;

    const sendAccountToBackend = async () => {
        try{
            const accountResponse = await CreateUserAccount(username, password, email);
            console.log(accountResponse);
        } catch {
            console.log("ERROR")
        }
    }

    return (
        <div>
            <div className='signup-input-field'>
                <div className='input-label'>Email</div>
                <input onChange = {e => setEmail(e.target.value)} placeholder='Email' className='login-input'></input>
            </div>
            <div className='signup-input-field'>
                <div className='input-label'>Username</div>
            <input onChange = {e => setUsername(e.target.value)} placeholder='Username' className='login-input'></input>
            </div><br></br>
            <div className='signup-input-field'>
                <div className='input-label'>Password</div>
            <input type="password" onChange = {e => setPassword(e.target.value)} placeholder='Password' className='login-input'></input>
            </div>
            <div className='signup-input-field'>
                <div className='input-label'>Confirm Password</div>
            <input type="password" onChange = {e => setConfirmPassword(e.target.value)} placeholder='Confirm Password' className='login-input'></input>
            </div>
            
            <div className='signup-submit-container'>
                <button disabled={!submitButtonEnabled} onClick={sendAccountToBackend} className='signup-submit'>Submit</button>
            </div>
            <div className='signup-redirect-text'>
                <Link className='guest-link' to='/planning'>Sign in as guest</Link>
                <br></br>
                <br></br>
                <Link className='guest-link' to='/login'>Already have an account, log in here</Link>
            </div>
            <div className='signup-explanation'>
                Create a Path Pilot account in order to be able to save your favorite routes
            </div>
        </div>
    );
};

export default UserInput;