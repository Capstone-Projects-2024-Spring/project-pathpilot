import axios from 'axios';
import { createAccountURL } from '../api/apiConfig.js';

export const CreateUserAccount = async (username, password, email) => {

    try {
        const response = await axios.post(`${createAccountURL}`, {
            username,
            password,
            email
        });
        console.log(response);
        return response.data;

    } catch (error) {
        console.error('Error creating user account:', error.message);
        throw error;
    }
};
