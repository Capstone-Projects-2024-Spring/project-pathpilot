import React, { useEffect } from 'react';

const PlanListOutput = ({ locations }) => {
    const locationsList = [
        "place1","place2","place3"
    ];

    return (
        <div>
        {
            locations.map((place) => 
                <div>{place}</div>)
        }
        </div>
    )
};

export default PlanListOutput;