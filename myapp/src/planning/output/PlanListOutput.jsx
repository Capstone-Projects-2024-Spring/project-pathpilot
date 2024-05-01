import React, { useEffect, useState } from 'react';
import { Rating } from '@mui/material';
import { LocationTypes } from '../input/LocationTypes.js';
import { AddSavedTrip } from './AddSavedTrip.js';

const user_id = localStorage.getItem("id");
const PlanListOutput = ({ locations, updateLocations, updateAdvancedOptions, attributeList, updateAttributeList }) => {
    const locationsList = [
        "place1","place2","place3"
    ];
    var count = 1;
    const user_id = localStorage.getItem("id");

    const ReturnToInput = () => {
        updateLocations(null);
        updateAdvancedOptions(false);
        updateAttributeList([]);
    }

const SaveRouteToAccount = async () => {
    try {
        AddSavedTrip(locations, user_id)

    } catch {
        console.log("ERROR")
    }
}
    
    return (
        <div>
            <div className='start-again-and-save-route-button-container'>
                <div className='start-again-button-container'>
                    <button className='submit-button' onClick={ReturnToInput}>Start Over</button>
                </div>
                {user_id ? 
                <div className='start-again-button-container'>
                    <button className='submit-button' onClick={SaveRouteToAccount}>Save Route</button>
                </div> : <div></div>}
            </div>

            {
            locations ? 
            locations.map((place) =>
                <>
                    <div className="list-places">
                        <div className='place-intro-container'>
                            <div className="place-count-container">
                                <div className="place-count">{count++}</div>
                            </div>
                            <div>
                                {
                                    LocationTypes.map((type) => place[8].toString() === type.value ? <div className='type-label'>{type.label}</div> : <div></div>)
                                    
                                }
                            </div>
                        </div>
                        <div className="place-name">{place[1]}</div>
                        <div className="place-address">{place[5] !== "-1" ? <div className='we-want-bold'>Cost: {place[5]}</div> : <div></div>}</div>
                        <br></br>
                        <div className="place-cost">{place[10] !== "-1" ? <div className='we-want-bold'>Cost: {place[10]}</div> : <div></div>}</div>
                        <div className="rating">
                            {place[7] !== -1 ?
                            <div className='we-want-bold'>
                            <Rating name="read-only" value={place[7]} precision={0.1} readOnly /> ({place[7]})</div>
                            : <div></div>
                            }
                        </div>
                            <div className='attribute-holder'>
                                {
                                    (JSON.parse(place[9])).map((attribute) => 
                                        <div>
                                        {attribute === -1 ? <div></div> :
                                        <div className="individual-attribute-holder">
                                            {
                                                attributeList.includes(attribute) ? 
                                                <div className="individual-attribute-selected">{attribute}</div> : 
                                                <div className="individual-attribute">{attribute}</div>
                                            }
                                        </div>
                                        }
                                        </div>
                                    )
                                }
                        </div>
                        <hr></hr>
                    </div>
                </>) : <></>
            }
        </div>
    );
};

export default PlanListOutput;