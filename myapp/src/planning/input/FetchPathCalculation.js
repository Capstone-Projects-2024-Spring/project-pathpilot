import axios from 'axios';
import { fetchPathURL } from '../../api/apiConfig';

const FetchPathCalculation = async (locationTypes, attributes, cost, stars, neighborhood, locatedNear) => {
   try {
        console.log(attributes);
        const attributesToSend = attributes.map(attribute => attribute.value);
        const response = await axios.post(`${fetchPathURL}`, {
            locationTypes,
            attributesToSend
        });
        console.log(response.data);
        console.log(response.data.polyline);
        return response.data;
    } catch (error) {
        console.error('Error fetching path calculation:', error.message);
        throw error;
    }
}

export default FetchPathCalculation;