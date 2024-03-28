import React, {useState, useEffect} from 'react';
import { FetchAccountInfo } from './FetchAccountInfo.js';


const UserInput = () => {
    const [username, setUsername] = useState([]);
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const submitButtonEnabled = username.length > 0 && email.length > 0 && password.length > 0;

    const sendAccountToBackend = async () => {
        console.log("username: "+ username);
        console.log("email: "+ email);
        console.log("password: "+ password);
        try{
            const accountResponse = await FetchAccountInfo(username, email, password);
            console.log(accountResponse);
        } catch {
            console.log("ERROR")
        }
    }


    return (
        <div>
            <label>
                Username
            <input onChange = {e => setUsername(e.target.value)}></input>
            </label><br></br>
            <label>
                Email
            <input onChange = {e => setEmail(e.target.value)}></input>
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