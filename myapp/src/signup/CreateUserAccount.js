import axios from 'axios';
import { loginURL } from '../api/apiConfig.js';

export const CreateUserAccount = async (username, password, email) => {
    console.log("in CreateUserAccount function")
    console.log("login URL = ",loginURL)

    try {
        const response = await axios.post(`${loginURL}`, {
            username,
            password,
            email
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user account:', error.message);
        throw error;
    }
};
