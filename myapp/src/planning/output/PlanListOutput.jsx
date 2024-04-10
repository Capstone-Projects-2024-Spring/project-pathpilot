import React, { useEffect, useState } from 'react';
import { Rating } from '@mui/material';

const PlanListOutput = ({ locations, updateLocations, updateAdvancedOptions }) => {
    const locationsList = [
        "place1","place2","place3"
    ];
    var count = 1;


    const ReturnToInput = () => {
        updateLocations(null);
        updateAdvancedOptions(false);
    }

    return (
        <div>
            <div className='start-again-button-container'>
                <button className='submit-button' onClick={ReturnToInput}>Start Over</button>
            </div>
        {
            locations ? 
            locations.map((place) =>
                <>
                    <div className="list-places">
                        <div className="place-count-container">
                            <div className="place-count">{count++}</div>
                        </div>
                        <div className="place-name">{place.name}</div>
                        <div className="place-address">{place.address}</div>
                        <br></br>
                        <div className="place-cost">Cost: {place.cost}</div>
                        <div className="rating">
                            <Rating name="read-only" value={place.rating} precision={0.1} readOnly />
                            <div>({place.rating})</div>
                        </div>
                            <div className='attribute-holder'>
                                {
                                    place.attributes.map((attribute) => 
                                        <div className="individual-attribute-holder">
                                        <div className="individual-attribute">{attribute}</div>
                                        </div>
                                    )
                                }
                        </div>
                        <hr></hr>
                    </div>
                </>) : <></>
        }
        </div>
    )
};

export default PlanListOutput;