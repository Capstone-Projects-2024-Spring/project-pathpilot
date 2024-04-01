import axios from 'axios';
import { loginURL } from '../api/apiConfig.js';

export const FetchAccountInfo = async (username, password) => {
    console.log("in fetch account info function")
    console.log("login URL = ",loginURL)

    try {
        const response = await axios.post(`${loginURL}`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching account information:', error.message);
        throw error;
    }
};
