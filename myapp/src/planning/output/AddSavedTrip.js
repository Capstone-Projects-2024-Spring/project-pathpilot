import axios from 'axios';
import { AddSavedRouteURL } from '../../api/apiConfig';

export const AddSavedTrip = async (locations, user_id) => {
    try {
        const response = await axios.post(`${AddSavedRouteURL}`, {
            locations,
            user_id
        });

        return response.data;

    } catch (error) {
        console.error('Error adding saved trip:', error.message);
        throw error;
    }
};

export default AddSavedTrip;