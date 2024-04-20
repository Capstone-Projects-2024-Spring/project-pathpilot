import axios from 'axios';
import { getSavedRoutesURL } from '../api/apiConfig.js';

export const FetchSavedRoutes = async (username, session) => {

    try {
        const response = await axios.get(`${getSavedRoutesURL}`, {
            username,
            session
        });
        console.log("user: ", localStorage.getItem("username"))
        console.log("id: ", localStorage.getItem("id"))

        return response.data;
    } catch (error) {
        console.error('Error fetching account information:', error.message);
        throw error;
    }
};
