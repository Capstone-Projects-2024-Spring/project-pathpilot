import axios from 'axios';
import { loginURL } from '../api/apiConfig.js';

export const FetchAccountInfo = async (username, password) => {

    try {
        const response = await axios.post(`${loginURL}`, {
            username,
            password
        });
        console.log(response);
        localStorage.setItem("username",response.username);
        return response.data;
    } catch (error) {
        console.error('Error fetching account information:', error.message);
        throw error;
    }
};
