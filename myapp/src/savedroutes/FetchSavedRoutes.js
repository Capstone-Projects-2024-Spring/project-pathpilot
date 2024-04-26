import axios from 'axios';
import { getSavedRoutesURL } from '../api/apiConfig.js';


export const FetchSavedRoutes = async (id) => {

    try {

        const id = localStorage.getItem("id");

        // Make the GET request with id as a query parameter
        const response = await axios.get(`${getSavedRoutesURL}?id=${id}`);
        console.log(Array.isArray(response.data));
        return response.data;

        
    } catch (error) {
        console.error('Error fetching account information:', error.message);
        throw error;
    }
};

export default FetchSavedRoutes;
