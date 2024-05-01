import axios from 'axios';
import { getAISuggestion } from '../../api/apiConfig';


const FetchAIResponse = async (userInput) => {
    try {
        console.log("user input");
        console.log(userInput);
        const response = await axios.get(`${getAISuggestion}?userInput=${userInput}`);
        console.log(response)

        return response.data;
    } catch (error) {
        console.error('Error fetching AI response:', error.message);
        throw error;
    }
};

export default FetchAIResponse;