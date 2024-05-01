import axios from 'axios';
import { fetchPathURL } from '../../api/apiConfig';

const FetchPathCalculation = async (locationTypes, attributes, cost, stars, neighborhood, locatedNear) => {
   try {
        console.log(attributes);
        const attributesToSend = attributes.map(attribute => attribute.value)
        const response = await axios.post(`${fetchPathURL}`, {
            locationTypes,
            attributesToSend,
            neighborhood,
            cost,
            stars
        });
        console.log(response.data);
        console.log(response.data.polyline);
        return response.data;
    } catch (error) {
        console.error('Error fetching path calculation:', error.message);
        throw error;
    }

    /*
    console.log("In function locations: " + locationsTypes);
    console.log("In function attributes: " + attributes);
    console.log("In function cost: " + cost);
    console.log("In function stars: " + stars);
    console.log("In function neighborhood: " + neighborhood);
    console.log("In function locatedNear: " + locatedNear);

    const respones = {locations: [{name: "Temple University", address: "1801 N Broad St", lat: 39.9812, lng: -75.1554, cost: "$$", rating: 4.3, attributes:["kid-friendly","accesible"]},{name: "Drexel University", address: "3141 Chestnut St", lat: 39.9566, lng: -75.1899, cost: "$$$", rating: 3.9,attributes: ["dragon"]}, {name: "Philadelphia Academy of Fine Arts", address: "118 N Broad St", lat: 39.9556, lng: -75.1631, cost: "$", attributes: [], rating: 4.7 }], path: "pathcode"};
    return respones;
    */
}

export default FetchPathCalculation;