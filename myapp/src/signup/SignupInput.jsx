import React, {useState, useEffect} from 'react';
import { CreateUserAccount } from './CreateUserAccount.js';


const UserInput = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const submitButtonEnabled = username.length > 0 && password.length > 0;

    const sendAccountToBackend = async () => {
        console.log("username: "+ username);
        console.log("password: "+ password);
        try{
            const accountResponse = await CreateUserAccount(username, password, email);
            console.log(accountResponse);
        } catch {
            console.log("ERROR")
        }
    }


    return (
        <div>
            <label>
                Email
            <input onChange = {e => setEmail(e.target.value)}></input>
            </label>
            <label>
                Username
            <input onChange = {e => setUsername(e.target.value)}></input>
            </label><br></br>
            <label>
                Password
            <input onChange = {e => setPassword(e.target.value)}></input>
            </label>
            
            <button disabled={!submitButtonEnabled} onClick={sendAccountToBackend}>Submit</button>
        </div>
    );
};

export default UserInput;