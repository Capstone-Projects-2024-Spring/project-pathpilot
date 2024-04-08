import axios from 'axios';


const FetchPathCalculation = async (locationsTypes, attributes, cost, stars, neighborhood, locatedNear) => {
   /* try {
        const response = await axios.post('https://example.com/api/path-calculation', {
            locationsNum,
            criteria
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching path calculation:', error.message);
        throw error;
    }*/
    console.log("In function locations: " + locationsTypes);
    console.log("In function attributes: " + attributes);
    console.log("In function cost: " + cost);
    console.log("In function stars: " + stars);
    console.log("In function neighborhood: " + neighborhood);
    console.log("In function locatedNear: " + locatedNear);

    const respones = {locations: ["Place1","Place2","Place3"], path: "pathcode"};
    return respones;

}


export default FetchPathCalculation;