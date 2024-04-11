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
                        {console.log(place)}
                        <div className="place-count-container">
                            <div className="place-count">{count++}</div>
                        </div>
                        <div className="place-name">{place[1]}</div>
                        <div className="place-address">{place[5]}</div>
                        <br></br>
                        <div className="place-cost">{place[10] !== "-1" ? <div>Cost:{place[10]}</div> : <div></div>}</div>
                        <div className="rating">
                            {place[7] !== -1 ?
                            <div>
                            <Rating name="read-only" value={place[7]} precision={0.1} readOnly />
                            <div>({place[7]})</div></div>
                            : <div></div>
                            }
                        </div>
                            <div className='attribute-holder'>
                                {
                                    (JSON.parse(place[9])).map((attribute) => 
                                        <div>
                                        {attribute === -1 ? <div></div> :
                                        <div className="individual-attribute-holder">
                                            <div className="individual-attribute">{attribute}</div>
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